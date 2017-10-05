import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
//import {LoginService} from '../...'; //TODO

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public title: string = 'Please login';
  public app: any;

  constructor(appComp: AppComponent) {
    this.app = appComp;
  }

  public email: string = "";
  public password: string = "";
  public rememberme: boolean = false;


  ngOnInit(): void {
  }

  onsubmit(){

    //TODO: .. 

    console.log("submit");

    this.app.loggedUser = true;
  }
}