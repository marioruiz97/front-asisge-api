import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from './routing/app-routing.module';
import { ToolbarComponent } from '../components/layout/toolbar/toolbar.component';
import { UiService } from './ui.service';
import { SidenavComponent } from '../components/layout/sidenav/sidenav.component';
import { FooterComponent } from '../components/layout/footer/footer.component';
import { ConfirmDialogComponent } from '../components/layout/confirm-dialog/confirm-dialog.component';
import { AuthInterceptor } from '../auth/interceptors/auth.interceptor';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  declarations: [
    ToolbarComponent, SidenavComponent, FooterComponent, ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MaterialModule,
    AvatarModule
  ],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MaterialModule,
    AvatarModule,
    ToolbarComponent,
    SidenavComponent,
    FooterComponent,
    ConfirmDialogComponent
  ],
  providers: [
    UiService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class SharedModule { }
