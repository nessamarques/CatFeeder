import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http' ;
import { FormsModule }   from '@angular/forms';   
import { AppRoutingModule } from './routing.module';

import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ChartComponent } from './chart/chart.component';

import { AwsService } from './aws.service';

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
    ChartsModule
  ],
  providers: [
    AwsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
