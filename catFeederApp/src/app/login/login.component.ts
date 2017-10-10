import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public title: string = 'Please login';
  public app: any;
  public router: Router;

  constructor(appComp: AppComponent, router: Router) {
    this.app = appComp;
    this.router = router;
  }

  public email: string = "";
  public password: string = "";
  public rememberme: boolean = false;


  ngOnInit(): void {
  }

  onSubmit(event: any){

    console.log("submit");
    console.log("Email: " + this.email);
    console.log("Password: " + this.password);

    //TODO: validar login, chamar post e pegar o username 
    this.app.loggedUser = true;
    this.app.username = this.email;

    this.router.navigate(['/home']);

    //TODO: "Recarregar" o menu superior (navbar) para exibir usuário logado.
  }
}