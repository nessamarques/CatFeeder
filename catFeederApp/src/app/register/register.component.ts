import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  public username: string = "";
  public email: string = "";
  public password: string = "";
  public confirmPassword: string = "";

  public app: AppComponent;
  public router: Router;
  
    constructor(appComp: AppComponent, router: Router) {
      this.app = appComp;
      this.router = router;
    }

  ngOnInit(): void {
  }

  onSubmit(event: any){    
    if(this.username != "" && this.email != "" && this.password != "" && this.confirmPassword != "" && (this.password == this.confirmPassword)) {
        this.app.usersList.push({username: this.username, password:this.password, email:this.email});
        this.router.navigate(['/login']);
    }
    else{
      alert("Preencha todos os campos e verifique se a senha é igual a confirmação de senha."); // TODO: Fazer mensagem mais bonitinha.
    }
  }
}