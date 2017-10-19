import { Component } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  public app: AppComponent;
  
    constructor(appComp: AppComponent) {
      this.app = appComp;
    }
}