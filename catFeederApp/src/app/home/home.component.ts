import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  public automaticFunc: string = 'Automatic feeder';
  public manualFunc: string = 'Manual feeder';

  public automaticFuncDescription: string = 'Enable this feature that allows you to automatically feed your cat whenever it approaches the feeder. ';
  public manualFuncDescription: string = 'Enable this feature to feed your cat whenever you want using the application. ';

  public automaticFeeder: boolean;
  public manualFeeder: boolean;

  public app: any;

  constructor(appComp: AppComponent) {
    this.app = appComp;
  }

  ngOnInit(): void {

    // TODO: Pegar configurações salvas do banco
    this.automaticFeeder = true;
    this.manualFeeder = false;

    console.log("Logged username: ");
    console.log(this.app.username);

    console.log("Logged user: ");
    console.log(this.app.loggedUser);
  }
}