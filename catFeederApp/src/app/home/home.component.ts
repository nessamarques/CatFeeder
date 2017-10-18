import { Component, OnInit } from '@angular/core';
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

  count: number = 0;
  mode: number = 1;
  minutes: number = 5;
  app: any;

  //items: FirebaseListObservable<any[]>;

  constructor(appComp: AppComponent, aws: AwsService){//, af: AngularFireDatabase) {
    this.app = appComp;

    //this.items = af.list('/items');
    //console.log("Firebase items: ");
    //console.log(this.items);

    aws.catFeeder$.subscribe(c => {
      this.mode = c.operation_mode;
      this.minutes = c.minutes_between_feeding;
      this.count = c.cat_count;
    });
  }

  ngOnInit(): void {

    console.log("Logged username: ");
    console.log(this.app.username);

    console.log("Logged user: ");
    console.log(this.app.loggedUser);

  }

  public feedTheCat(){
    console.log("Feed the cat!");

    // TODO: Enviar comando que permite alimentar o gato.
  }
}