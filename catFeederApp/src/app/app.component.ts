import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  implements OnInit {
  
  public router: Router;
  
  constructor(router: Router) {
    this.router = router;
   }

  public username : string = '';
  public password : string = '';
  public email: string = '';

  public loggedUser : boolean = false;
  
  public usersList: { username: string, password: string, email: string }[] = [
      { "username": "admin", "password": "admin123","email": "admin@catfeeder.com"  }, // Login cadastrado no Firebase
      { "username": "admin", "password": "admin","email": "admin"  }
  ];

  public title: string = 'Cat feeder';
  public description: string = "Make sure your pets are always fed when you're away.";
  
  public footer: string = 'Cat Feeder 2017';

  ngOnInit(): void {
    if(!this.loggedUser){
      this.router.navigate(['/login']);
    }
    else{
      this.router.navigate(['/home']);
    }
  }
}
