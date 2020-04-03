import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './components/others/home/home.component';
import { UiService } from './shared/ui.service';
import { TercerosModule } from './components/terceros/terceros.module';
import { MaestrosModule } from './components/maestros/maestros.module';
import { AppService } from './shared/app.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AuthModule,
    TercerosModule,
    MaestrosModule
  ],
  providers: [UiService, AppService],
  bootstrap: [AppComponent],
})
export class AppModule { }
