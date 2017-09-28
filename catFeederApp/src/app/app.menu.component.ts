import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.css']
})
export class AppMenuComponent {
    //TODO: Pegar usuário logado
    public user : string = 'Vanessa Marques';
    
    public loggedUser : boolean = true;

}