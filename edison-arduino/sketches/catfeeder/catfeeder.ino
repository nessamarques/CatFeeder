#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <unistd.h>
#include <string.h>
#include <limits.h>
#include <Servo.h>
#include <TH02_dev.h>
#include <TimerOne.h>
#include "rgb_lcd.h"
#include "jsmn.h"
#include "mbedtls-wrapper.h"
#include "aws_iot_config.h"
#include "aws_iot_log.h"
#include "aws_iot_version.h"
#include "aws_iot_mqtt_client_interface.h"
#include "aws_iot_shadow_interface.h"

//AWS Configuration
#define MAX_MESSAGE_LENGTH 300
#define MAX_LENGTH_OF_UPDATE_JSON_BUFFER 400
static char certDirectory[] = "certs";
static char HostAddress[255] = AWS_IOT_MQTT_HOST;
static uint32_t port = AWS_IOT_MQTT_PORT;

jsonStruct_t remote_button_count_json;
jsonStruct_t feed_count_json;
jsonStruct_t operation_mode_json;
jsonStruct_t minutes_between_feeding_json;
jsonStruct_t cat_count_json;

IoT_Error_t rc = FAILURE;
AWS_IoT_Client mqttClient;
unsigned long lastUpdate = 0; //Used for aws update
char JsonDocumentBuffer[MAX_LENGTH_OF_UPDATE_JSON_BUFFER];
size_t sizeOfJsonDocumentBuffer = sizeof(JsonDocumentBuffer) / sizeof(JsonDocumentBuffer[0]);
char s[MAX_MESSAGE_LENGTH];

//Defining used pins
#define BUTTON 0
#define SERVO 6
#define PIR_MOTION_SENSOR 8

#define DEBOUNCE_DELAY 300
#define MOTION_DELAY 7000 
#define CAT_FEEDING_PERIOD 20000
#define FEEDING_DURATION 550
#define FEEDING_DURATION_WITH_SERVO 1200
#define AWS_UPDATE_PERIOD 5000 //Used for aws update period

//Servo angles for feeder
#define CLOSED_ANGLE 0
#define OPENED_ANGLE 180

//Defining system states
#define F_IDLE 0
#define F_START_FEEDING 1
#define F_FEEDING 2
//Defining operation modes
#define MOTION_ACTIVATED 0
#define PERIODIC 1
#define BOTH 2
//Defining cat states
#define C_AWAY 0
#define C_DETECTED 1
#define C_PRESENT 2

Servo myservo;
rgb_lcd lcd;
unsigned long button_debounce = 0; //Used for button debounce
unsigned long cat_last_motion_timestamp = 0; //Used to count if the cat is still present
unsigned long cat_presence_timestamp = 0; //Used to count the duration the cat stayed in front of feeder
unsigned long feeding_timestamp = 0; //Used for opening the feeder for the correct duration
uint8_t feeder_state = F_IDLE;
uint8_t cat_state = C_AWAY;
uint8_t operation_mode = MOTION_ACTIVATED;
boolean firstButtonDelta = true;
uint32_t remote_button_count = 0;
uint32_t feed_count = 0;
uint32_t cat_count_on_last_feeding = 1;
uint32_t cat_count = 0;
uint16_t minutes_between_feeding = 1;
uint32_t last_feeding_seconds = 0;


void ShadowUpdateStatusCallback(const char *pThingName, ShadowActions_t action, Shadow_Ack_Status_t status,
                const char *pReceivedJsonDocument, void *pContextData) {
  IOT_UNUSED(pThingName);
  IOT_UNUSED(action);
  IOT_UNUSED(pReceivedJsonDocument);
  IOT_UNUSED(pContextData);

  if(SHADOW_ACK_TIMEOUT == status) {
    Serial.println("Update Timeout--");
  } else if(SHADOW_ACK_REJECTED == status) {
    Serial.println("Update RejectedXX");
  } else if(SHADOW_ACK_ACCEPTED == status) {
    Serial.println("Update Accepted !!");
  }
}

void remote_button_count_Callback(const char *pJsonString, uint32_t JsonStringDataLen, jsonStruct_t *pContext) {
  IOT_UNUSED(pJsonString);
  IOT_UNUSED(JsonStringDataLen);

  if(pContext != NULL) {
    if(!firstButtonDelta) {
      feeder_state = F_START_FEEDING;
    } else {
      firstButtonDelta = false;
    }
    sprintf(s, "Delta - Feed count changed to %d", *(uint32_t *) (pContext->pData));
    Serial.println(s);
  }
}

void operation_mode_Callback(const char *pJsonString, uint32_t JsonStringDataLen, jsonStruct_t *pContext) {
  IOT_UNUSED(pJsonString);
  IOT_UNUSED(JsonStringDataLen);

  if(pContext != NULL) {
    sprintf(s, "Delta - Operation mode changed to %d", *(uint8_t *) (pContext->pData));
    Serial.println(s);
  }
}

void minutes_between_feeding_Callback(const char *pJsonString, uint32_t JsonStringDataLen, jsonStruct_t *pContext) {
  IOT_UNUSED(pJsonString);
  IOT_UNUSED(JsonStringDataLen);

  if(pContext != NULL) {
    sprintf(s, "Delta - Minutes between feeding changed to %d", *(uint16_t *) (pContext->pData));
    Serial.println(s);
  }
}

void setup() {
  pinMode(BUTTON, INPUT);
  attachInterrupt(BUTTON, buttonInterrupt, RISING);
  pinMode(PIR_MOTION_SENSOR, INPUT);
  attachInterrupt(PIR_MOTION_SENSOR, motionSensorInterrupt, CHANGE);
  Timer1.initialize(1000000);
  Timer1.attachInterrupt(timerInterrupt);
  myservo.attach(SERVO);
  myservo.write(CLOSED_ANGLE);
  lcd.begin(16, 2);
  Serial.begin(9600);
  
  remote_button_count_json.cb = remote_button_count_Callback;
  remote_button_count_json.pData = &remote_button_count;
  remote_button_count_json.pKey = "remote_button_count";
  remote_button_count_json.type = SHADOW_JSON_UINT32;
  
  feed_count_json.cb = NULL;
  feed_count_json.pData = &feed_count;
  feed_count_json.pKey = "feed_count";
  feed_count_json.type = SHADOW_JSON_UINT32;

  operation_mode_json.cb = operation_mode_Callback;
  operation_mode_json.pKey = "operation_mode";
  operation_mode_json.pData = &operation_mode;
  operation_mode_json.type = SHADOW_JSON_UINT32;

  minutes_between_feeding_json.cb = minutes_between_feeding_Callback;
  minutes_between_feeding_json.pKey = "minutes_between_feeding";
  minutes_between_feeding_json.pData = &minutes_between_feeding;
  minutes_between_feeding_json.type = SHADOW_JSON_UINT16;

  cat_count_json.cb = NULL;
  cat_count_json.pKey = "cat_count";
  cat_count_json.pData = &cat_count;
  cat_count_json.type = SHADOW_JSON_UINT8;

  char rootCA[PATH_MAX + 1];
  char clientCRT[PATH_MAX + 1];
  char clientKey[PATH_MAX + 1];
  char CurrentWD[PATH_MAX + 1];
  sprintf(s, "\nAWS IoT SDK Version %d.%d.%d-%s\n", VERSION_MAJOR, VERSION_MINOR, VERSION_PATCH, VERSION_TAG);
  Serial.println(s);

  snprintf(rootCA, PATH_MAX + 1, "/home/root/%s/%s", certDirectory, AWS_IOT_ROOT_CA_FILENAME);
  snprintf(clientCRT, PATH_MAX + 1, "/home/root/%s/%s", certDirectory, AWS_IOT_CERTIFICATE_FILENAME);
  snprintf(clientKey, PATH_MAX + 1, "/home/root/%s/%s", certDirectory, AWS_IOT_PRIVATE_KEY_FILENAME);

  sprintf(s,"rootCA %s", rootCA);
  Serial.println(s);
  sprintf(s,"clientCRT %s", clientCRT);
  Serial.println(s);
  sprintf(s,"clientKey %s", clientKey);
  Serial.println(s);

  ShadowInitParameters_t sp = ShadowInitParametersDefault;
  sp.pHost = AWS_IOT_MQTT_HOST;
  sp.port = AWS_IOT_MQTT_PORT;
  sp.pClientCRT = clientCRT;
  sp.pClientKey = clientKey;
  sp.pRootCA = rootCA;
  sp.enableAutoReconnect = false;
  sp.disconnectHandler = NULL;
  Serial.println("Shadow Init");
  rc = aws_iot_shadow_init(&mqttClient, &sp);
  if(SUCCESS != rc) {
    Serial.println("Shadow Connection Error");
  }
  ShadowConnectParameters_t scp = ShadowConnectParametersDefault;
  scp.pMyThingName = AWS_IOT_MY_THING_NAME;
  scp.pMqttClientId = AWS_IOT_MQTT_CLIENT_ID;
  scp.mqttClientIdLen = (uint16_t) strlen(AWS_IOT_MQTT_CLIENT_ID);

  Serial.println("Shadow Connect");
  rc = aws_iot_shadow_connect(&mqttClient, &scp);
  if(SUCCESS != rc) {
    Serial.println("Shadow Connection Error");
  }
  rc = aws_iot_shadow_set_autoreconnect_status(&mqttClient, true);
  if(SUCCESS != rc) {
    Serial.println("Unable to set Auto Reconnect to true");
  }

  rc = aws_iot_shadow_register_delta(&mqttClient, &remote_button_count_json);
  if(SUCCESS != rc) {
    Serial.println("Shadow Register Remote Button Count Delta Error");
  }
  rc = aws_iot_shadow_register_delta(&mqttClient, &operation_mode_json);
  if(SUCCESS != rc) {
    Serial.println("Shadow Register Operation Mode Error");
  }
  rc = aws_iot_shadow_register_delta(&mqttClient, &minutes_between_feeding_json);
  if(SUCCESS != rc) {
    Serial.println("Shadow Register Minutes Between Feeding Delta Error");
  }
}

void loop() {
    printLCD();
    calculateState();
   if(millis() - lastUpdate > AWS_UPDATE_PERIOD && (NETWORK_ATTEMPTING_RECONNECT == rc || NETWORK_RECONNECTED == rc || SUCCESS == rc)) {
    rc = aws_iot_shadow_yield(&mqttClient, 200);
    if(NETWORK_ATTEMPTING_RECONNECT != rc) {
      rc = aws_iot_shadow_init_json_document(JsonDocumentBuffer, sizeOfJsonDocumentBuffer);
      if(SUCCESS == rc) {
        rc = aws_iot_shadow_add_reported(JsonDocumentBuffer, sizeOfJsonDocumentBuffer, 5, &feed_count_json, &remote_button_count_json,
                           &operation_mode_json, &minutes_between_feeding_json, &cat_count_json);
        if(SUCCESS == rc) {
          rc = aws_iot_finalize_json_document(JsonDocumentBuffer, sizeOfJsonDocumentBuffer);
          if(SUCCESS == rc) {
            sprintf(s, "Update Shadow: %s", JsonDocumentBuffer);
            Serial.println(s);
            rc = aws_iot_shadow_update(&mqttClient, AWS_IOT_MY_THING_NAME, JsonDocumentBuffer,
                           ShadowUpdateStatusCallback, NULL, 4, true);
            sprintf(s, "Update Result: %d", rc);
            Serial.println(s);
          }
        }
      }
    }
    lastUpdate = millis();
  }
}

void calculateState() {
  switch(feeder_state) {
    case F_IDLE:
    break;
    case F_START_FEEDING:
      myservo.write(OPENED_ANGLE);
      feeder_state = F_FEEDING;
      feeding_timestamp = millis();
    break;
    case F_FEEDING:
      if ((millis() - feeding_timestamp) > FEEDING_DURATION) {
        myservo.write(CLOSED_ANGLE);
      }
      if ((millis() - feeding_timestamp) > FEEDING_DURATION_WITH_SERVO) {
        feed_count++;
        feeder_state = F_IDLE;
      }
    break;
  }
  switch(cat_state) {
    case C_AWAY:
      lcd.print("AWAY    ");
    break;
    case C_DETECTED:
      cat_presence_timestamp = millis();
      cat_state = C_PRESENT;
      if(operation_mode == MOTION_ACTIVATED || operation_mode == BOTH)
        feedCat();
    break;
    case C_PRESENT:
      lcd.print("PRESENT ");
      //If no motion detected for more than MOTION_DELAY, consider that cat has left
      if((millis() - cat_last_motion_timestamp) > MOTION_DELAY) {
        cat_state = C_AWAY;
        //If cat stayed longer than CAT_FEEDING_PERIOD, then consider that cat ate.
        if((millis() - cat_presence_timestamp) > CAT_FEEDING_PERIOD) {
          cat_count++;
        }
      }
    break;
  }
}
void timerInterrupt() {
  last_feeding_seconds++;
  if(operation_mode == PERIODIC || operation_mode == BOTH) {
    if(last_feeding_seconds > (minutes_between_feeding * 60)) {
      if(feedCat()){
        last_feeding_seconds = 0;
      }
    }
  }
}
void buttonInterrupt() {
  if ((millis() - button_debounce) > DEBOUNCE_DELAY) {
    feeder_state = F_START_FEEDING;
    button_debounce = millis();
  }
}

void motionSensorInterrupt() {
  if(cat_state == C_AWAY) {
    cat_state = C_DETECTED;
  }
  cat_last_motion_timestamp = millis();
}

bool feedCat() {
  if(feeder_state == F_IDLE && cat_count_on_last_feeding != cat_count) {
    feeder_state = F_START_FEEDING;
    cat_count_on_last_feeding = cat_count;
    return true;
  }
  return false;
}

void printLCD() {
  lcd.setCursor(0, 0);
  switch(operation_mode) {
    case MOTION_ACTIVATED:
      lcd.print("M");
    break;
    case PERIODIC:
      lcd.print("P");
    break;
    case BOTH:
      lcd.print("B");
    break;
  } 
  lcd.setCursor(4, 0);
  switch(feeder_state) {
    case F_IDLE:
      lcd.print("IDLE     ");
    break;
    case F_START_FEEDING:
      lcd.print("START    ");
    break;
    case F_FEEDING:
      lcd.print("FEEDING  ");
    break;
  }  
  lcd.print(feed_count);
  lcd.print("             ");
  lcd.setCursor(0, 1);
  lcd.print(minutes_between_feeding, 3);
  lcd.setCursor(4, 1);
  switch(cat_state) {
    case C_AWAY:
      lcd.print("AWAY     ");
    break;
    case C_DETECTED:
      lcd.print("DETECTED ");
    break;
    case C_PRESENT:
      lcd.print("=^._.^=  ");
    break;
  }
  lcd.print(cat_count);
  lcd.print("             ");
}
