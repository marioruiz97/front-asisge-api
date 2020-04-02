import { NgModule } from '@angular/core';
import { TipoDocumentoListComponent } from './tipo-documento/tipo-documento-list/tipo-documento-list.component';
import { TipoDocumentoFormComponent } from './tipo-documento/tipo-documento-form/tipo-documento-form.component';
import { TipoDocumentoService } from './tipo-documento/tipo-documento.service';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [TipoDocumentoListComponent, TipoDocumentoFormComponent],
  imports: [
    SharedModule
  ],
  providers: [
    TipoDocumentoService
  ]
})
export class MaestrosModule { }
