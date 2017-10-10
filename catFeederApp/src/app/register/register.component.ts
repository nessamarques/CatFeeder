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

  public name: string = "";
  public email: string = "";
  public password: string = "";
  public confirmPassword: string = "";

  public router: Router;
  
    constructor(router: Router) {
      this.router = router;
    }

  ngOnInit(): void {
  }

  onSubmit(event: any){
      //TODO: validar form e chamar post 
      this.router.navigate(['/login']);
  }
}