import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  //TODO: Pegar usuário logado
  public username : string = '';    
  public password : string = '';
  public loggedUser : boolean = false;
  
  public title: string = 'Cat feeder';
  public description: string = "Make sure your pets are always fed when you're away.";
  
  public footer: string = 'Cat Feeder 2017';
}
