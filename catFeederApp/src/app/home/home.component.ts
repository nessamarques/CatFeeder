import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable}  from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import { AppComponent } from '../app.component';
import { AwsService } from '../aws.service';

//import { AngularFire } from 'angularfire2';
//import { AngularFireDatabaseModule, AngularFireDatabase, FirebasListObservable } from "angularfire2/database";
//import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

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
  app: any;
  minutesControl = new FormControl();
  constructor(appComp: AppComponent, private aws: AwsService) {//, af: AngularFireDatabase) {
    this.app = appComp;

    //this.items = af.list('/items');
    //console.log("Firebase items: ");
    //console.log(this.items);

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
    console.log("Logged username: ");
    console.log(this.app.username);

    console.log("Logged user: ");
    console.log(this.app.loggedUser);

  }

  modeChanged(value) {
    if(value != this.mode) {
      this.aws.changeMode(value);
    }
  }

  feedTheCat(){
    console.log("Feed the cat!");
    this.aws.feed();
    // TODO: Enviar comando que permite alimentar o gato.
  }
}