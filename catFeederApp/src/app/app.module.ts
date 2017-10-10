import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http' ;
import { FormsModule }   from '@angular/forms';   
import { AppRoutingModule } from './routing.module';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AwsService } from './aws.service';


//import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule //,

    //BootstrapSwitchModule.forRoot(),
    //BrowserAnimationsModule
  ],
  providers: [
    AwsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
