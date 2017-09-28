import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppMenuComponent } from './app.menu.component';
import { AppLoginComponent} from './app.login.component';

@NgModule({
  declarations: [
    AppComponent,
    AppMenuComponent,
    AppLoginComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
