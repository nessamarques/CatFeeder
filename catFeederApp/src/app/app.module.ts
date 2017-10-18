import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http' ;
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';   
import { AppRoutingModule } from './routing.module';
import { ChartsModule } from 'ng2-charts';
//import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ChartComponent } from './chart/chart.component';

import { AwsService } from './aws.service';
import { AuthService } from './providers/auth.service';

/*
export const firebaseConfig = {
  apiKey: "AIzaSyD3gVZKfrkGVpGrZzyp63ls0dWPA2TlO-Y",
  authDomain: "cat-feeder-ba350.firebaseapp.com",
  databaseURL: "https://cat-feeder-ba350.firebaseio.com",
  projectId: "cat-feeder-ba350",
  storageBucket: "cat-feeder-ba350.appspot.com",
  messagingSenderId: "124702802311"
};
*/

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    ChartsModule,
    ReactiveFormsModule 
  ],
  providers: [
    AwsService,
    AuthService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
