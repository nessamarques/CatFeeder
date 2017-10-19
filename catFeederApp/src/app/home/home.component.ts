import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable}  from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import { AppComponent } from '../app.component';
import { AwsService } from '../aws.service';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'home', 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  feed_count: number = 0;
  count: number = 0;
  mode: number = 1;
  minutes: number = 5;
  minutesControl = new FormControl();

  timestampList = new Array<any[]>();

  constructor( private aws: AwsService, private db: AngularFireDatabase){

    (db.list('cat')).subscribe(proj => {
        this.timestampList = proj;

        console.log("Items:");
        console.log(this.timestampList);

      }
    );

    aws.catFeeder$.subscribe(c => {
      this.mode = c.operation_mode;
      this.minutes = c.minutes_between_feeding;
      this.count = c.cat_count;
      this.feed_count = c.feed_count;
    });
  }

  ngOnInit(): void {
    this.minutesControl.valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(value => {
        this.aws.changePeriod(value);
      });
  }

  modeChanged(value) {
    if(value != this.mode) {
      this.aws.changeMode(value);
    }
  }

  feedTheCat(){
    this.aws.feed();
  }
}