import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cat feeder';

  //TODO: Pegar usuário logado
  public user : string = 'Vanessa Marques';    
  public loggedUser : boolean = false;
}
