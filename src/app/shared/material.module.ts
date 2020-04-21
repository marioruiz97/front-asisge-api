import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatTableModule,
  MatDividerModule,
  MatCardModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatPaginatorModule,
  MatSortModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MAT_DATE_LOCALE,
  MatTreeModule,
  MatStepperModule,
  MatProgressBarModule
} from '@angular/material';

import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [],
  imports: [
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTreeModule,
    MatStepperModule,
    MatProgressBarModule
  ],
  exports: [
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTreeModule,
    MatStepperModule,
    MatProgressBarModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' }
  ]
})
export class MaterialModule { }
