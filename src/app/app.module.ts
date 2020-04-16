import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './components/others/home/home.component';
import { TercerosModule } from './components/terceros/terceros.module';
import { MaestrosModule } from './components/maestros/maestros.module';
import { AppService } from './shared/app.service';
import { AboutComponent } from './components/others/about/about.component';
import { ContactComponent } from './components/others/contact/contact.component';
import { ProyectosModule } from './components/proyectos/proyectos.module';

@NgModule({
  declarations: [
    AppComponent, HomeComponent, AboutComponent, ContactComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AuthModule,
    TercerosModule,
    MaestrosModule,
    ProyectosModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
})
export class AppModule { }
