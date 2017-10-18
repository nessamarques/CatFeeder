import { environment } from './../environments/environment.prod';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http' ;
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';   
import { AppRoutingModule } from './routing.module';
import { ChartsModule } from 'ng2-charts';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

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
    ChartsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  exports:[
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    AwsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { 
}
