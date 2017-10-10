import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
//import {RegisterService} from '../...'; //TODO

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  public name: string = "";
  public email: string = "";
  public password: string = "";
  public confirmPassword: string = "";

  ngOnInit(): void {
  }

  onsubmit(){
    //TODO: .. 
    console.log("submit");
  }
}