import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';
import { IotData } from 'aws-sdk';
import { Observable, BehaviorSubject, Observer } from 'rxjs/Rx';

import { CatFeeder } from './catfeeder.model';

@Injectable()
export class AwsService {
  iotdata: IotData;
  private catFeeder: CatFeeder = null;
  private catFeederSubject: BehaviorSubject<CatFeeder> = new BehaviorSubject(null);
  private catFeederSource: Observable<CatFeeder> = Observable.create( (observer: Observer<CatFeeder>) => {
    let getShadow = () =>{
      let params = {
        thingName: this.THING_NAME /* required */
      };
      console.log("Getting thing shadow!");
      this.iotdata.getThingShadow(params, (err, data) => {
        if (err) {
          console.log(err, err.stack); // an error occurred
        } else {
          console.log(data); // successful response
          let shadow = JSON.parse(data.payload.toString());
          if(shadow.state != null) {
            if(shadow.state.reported != null) {
              let reportedCatFeeder = new CatFeeder({
                cat_count: shadow.state.reported.cat_count,
                minutes_between_feeding: shadow.state.reported.minutes_between_feeding,
                operation_mode: shadow.state.reported.operation_mode,
                //feed_count: shadow.state.reported.feed_count
              });
              if(!_.isEqual(this.catFeeder, reportedCatFeeder)) {
                this.catFeeder = reportedCatFeeder;
                observer.next(this.catFeeder);
              }
            }
          }
        }
      });
    }
    if(this.catFeeder != null) {
      observer.next(this.catFeeder);
    } else {
      getShadow();
    }
    var intervalID = setInterval(getShadow, 10000); //Update every 10 seconds
    return function unsubscribe() {
      clearInterval(intervalID);
    };
  });
  catFeeder$: Observable<CatFeeder> = this.catFeederSource.publish().refCount();
  readonly THING_NAME = 'giohji-edison';
  constructor() {
    this.iotdata = new AWS.IotData({
      accessKeyId: 'AKIAJ3EXJK4VJSJ63JJA',
      secretAccessKey: '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',
      region:  'us-east-2',
      endpoint: 'a21mlh507sakvq.iot.us-east-2.amazonaws.com'
    });
  }
  changeMode(mode: number){
    if(this.catFeeder != null && this.catFeeder.operation_mode != mode) {
      this.updateThingShadow({mode: mode});
    }
  }
  changePeriod(minutes: number){
    if(this.catFeeder != null && this.catFeeder.minutes_between_feeding != minutes) {
      this.updateThingShadow({minutes_between_feeding: minutes});
    }
  }
  feed() {
    this.updateThingShadow({remote_button_count: Math.floor(Math.random() * 1000000)});
  }
  private updateThingShadow(desired: {remote_button_count?: number, mode?: number, minutes_between_feeding?:number}) {
    let desiredShadow = {
      state :{
        desired: {
        }
      }
    };
    if(desired.remote_button_count != null) desiredShadow.state.desired["remote_button_count"] = desired.remote_button_count;
    if(desired.mode != null) desiredShadow.state.desired["operation_mode"] = desired.mode;
    if(desired.minutes_between_feeding != null) desiredShadow.state.desired["minutes_between_feeding"] = desired.minutes_between_feeding;
    let params = {
      thingName: this.THING_NAME, /* required */
      payload: Buffer.from(JSON.stringify(desiredShadow))
    };
    console.log("Updating thing shadow!");
    this.iotdata.updateThingShadow(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  }
}
