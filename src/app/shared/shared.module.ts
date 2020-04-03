import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from './routing/app-routing.module';
import { ToolbarComponent } from '../components/layout/toolbar/toolbar.component';
import { UiService } from './ui.service';
import { SidenavComponent } from '../components/layout/sidenav/sidenav.component';
import { FooterComponent } from '../components/layout/footer/footer.component';
import { ConfirmDialogComponent } from '../components/layout/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    ToolbarComponent, SidenavComponent, FooterComponent, ConfirmDialogComponent
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
    ToolbarComponent,
    SidenavComponent,
    FooterComponent,
    ConfirmDialogComponent
  ],
  providers: [UiService],
  entryComponents: [ConfirmDialogComponent]
})
export class SharedModule { }
