import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { IotData } from 'aws-sdk';

@Injectable()
export class AwsService {
  iotdata: IotData;
  
  constructor() {
    this.iotdata = new AWS.IotData({
      accessKeyId: 'AKIAJ3EXJK4VJSJ63JJA',
      secretAccessKey: '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',
      region:  'us-east-2',
      endpoint: 'a21mlh507sakvq.iot.us-east-2.amazonaws.com'
    });
  }

  test() {
    var params = {
      thingName: 'giohji-edison' /* required */
    };
    /*this.iotdata.getThingShadow(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });*/
  }

}
