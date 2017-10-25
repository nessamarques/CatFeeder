import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  public app: AppComponent;
  public router: Router;

  constructor(appComp: AppComponent, router: Router) {
    this.app = appComp;
    this.router = router;
  }

  logout(){
    this.app.loggedUser = false;
    this.router.navigate(['/login']);
  }
}