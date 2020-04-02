import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './components/others/home/home.component';
import { UiService } from './shared/ui.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AuthModule
  ],
  providers: [UiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
