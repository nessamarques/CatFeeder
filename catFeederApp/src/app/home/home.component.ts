import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
//import {HomeService} from '../...'; //TODO

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']//,
  //providers: [HomeService] //TODO
})

export class HomeComponent implements OnInit {

  public function1: string = 'Automatic feeder';
  public function2: string = 'Manual feeder';

  public function1Description: string = 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. ';
  public function2Description: string = 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. ';

  public automaticFeeder: boolean;
  public manualFeeder: boolean;

  public teste: string = "teste";

  ngOnInit(): void {

    // TODO: Pegar configurações salvas do banco
    this.automaticFeeder = true;
    this.manualFeeder = false;

  }

}