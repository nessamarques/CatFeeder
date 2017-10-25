import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {FormControl} from '@angular/forms';
import {Observable}  from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
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
  mode: number = null;
  minutes: number = null;
  minutesControl = new FormControl();
  series1 = [{ data:[], label: "Times the cat ate"}];
  labels1 = [];
  series2 = [{ data:[], label: "Times the cat ate"}];
  labels2 = [];
  timestampList = new Array<any>();
  
  public app: AppComponent;
  public router: Router;

  constructor( private aws: AwsService, private db: AngularFireDatabase, private datePipe: DatePipe, appComp: AppComponent, router: Router){

    this.app = appComp;
    this.router = router;

    (db.list('cat')).subscribe(proj => {
        this.timestampList = proj;
        let index = -1;
        let lastLabel = "";
        
        //Chart 1
        let data = [];
        let labels = [];
        
        this.timestampList.forEach( i => {
          let dateString = this.datePipe.transform(new Date(i.$value), "MM/dd");
          if(lastLabel == dateString) {
            data[index] = data[index] + 1;
          } else {
            index++;
            data.push(1);
            labels.push(dateString);
            lastLabel = dateString;
          }
        });
        this.series1[0].data = data;
        this.labels1 = labels;

        //Chart 2
        data = [];
        labels = [];
        
        for(let h = 1; h <= 24; h++) {
          data.push(0);
          labels.push(h + ":00");
        }
        
        this.timestampList.forEach( i => {
          let hour = this.datePipe.transform(new Date(i.$value), "H");
          data[hour] = data[hour] + 1;
        });

        this.series2[0].data = data;
        this.labels2 = labels;

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

    if(!this.app.loggedUser){
      this.router.navigate(['/login']);
    }
    else{
      this.router.navigate(['/home']);
    }

    this.minutesControl.valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(value => {
        if(this.minutes != null) {
          this.aws.changePeriod(value);
        }
      });
  }

  modeChanged(value) {
    if(this.mode != null && value != this.mode) {
      this.aws.changeMode(value);
    }
  }

  feedTheCat(){
    this.aws.feed();
  }
}