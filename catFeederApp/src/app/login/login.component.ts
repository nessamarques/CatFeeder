import { Component } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public title: string = 'Please login';
  public app: any;

  constructor(appComp: AppComponent) {
    this.app = appComp;
  }

  onsubmit(){
    console.log("submit");

    this.app.loggedUser = true;
  }
}