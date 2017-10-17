import { Component } from '@angular/core';
import { AwsService } from './aws.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(aws:AwsService) {
    aws.test();
   }
  //TODO: Pegar usuário logado
  public username : string = '';    
  public password : string = '';
  public loggedUser : boolean = false;
  
  public title: string = 'Cat feeder';
  public description: string = "Make sure your pets are always fed when you're away.";
  
  public footer: string = 'Cat Feeder 2017';
}
