import { Component, OnInit, OnChanges } from '@angular/core';
import { AppComponent } from '../app.component';
//import {HomeService} from '../...'; //TODO

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']//,
  //providers: [HomeService] //TODO
})

export class HomeComponent implements OnInit, OnChanges {

  public automaticFunc: string = 'Automatic feeder';
  public manualFunc: string = 'Manual feeder';

  public automaticFuncDescription: string = 'Enable this feature that allows you to automatically feed your cat whenever it approaches the feeder. ';
  public manualFuncDescription: string = 'Enable this feature to feed your cat whenever you want using the application. ';

  public automaticFeeder: boolean;
  public manualFeeder: boolean;

  ngOnInit(): void {

    // TODO: Pegar configurações salvas do banco
    this.automaticFeeder = true;
    this.manualFeeder = false;

  }

  ngOnChanges(changes: any): void{
    console.log("on change");
  }

}