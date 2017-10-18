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
  public app: AppComponent;
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

    let validLogin:boolean = false;

    (this.app.usersList).forEach(item => {
      if(item.email == this.email && item.password == this.password) {
        validLogin = true;
      }
    });

    if(validLogin){
      this.app.loggedUser = true;
      this.app.username = this.email;
      this.router.navigate(['/home']);
    }
    else{
      alert("Usuário ou senha incorretos."); //TODO: Exibir mensagem bonitinha.
    }

    //TODO: "Recarregar" o menu superior (navbar) para exibir usuário logado.
  }
}