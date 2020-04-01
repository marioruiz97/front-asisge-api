import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from './routing/app-routing.module';


@NgModule({
  declarations: [],
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
  ]
})
export class SharedModule { }
