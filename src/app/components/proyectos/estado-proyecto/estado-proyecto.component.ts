import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EstadoProyecto, Proyecto } from 'src/app/models/proyectos/proyecto.model';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { ProyectoService } from '../proyecto.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './estado-proyecto.component.html',
  styleUrls: ['./estado-proyecto.component.css']
})
export class EstadoProyectoComponent implements OnInit, OnDestroy {

  isWaiting = false;
  estadoForm: FormGroup;
  estados: EstadoProyecto[] = [];
  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Proyecto,
    private dialogRef: MatDialogRef<EstadoProyectoComponent>,
    private uiService: UiService,
    private proyectoService: ProyectoService) { }

  ngOnInit() {
    this.initForm();
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.proyectoService.fetchEstados(this.data.estadoProyecto.id).subscribe(res => this.estados = res.body));
  }

  private initForm() {
    this.estadoForm = new FormGroup({
      estado: new FormControl('', Validators.required)
    });
  }


  onSubmit() {
    this.proyectoService.pasarEstadoProyecto(this.data.idProyecto, this.estadoForm.value.estado).subscribe(exito => {
      if (exito) { this.dialogRef.close(this.data); }
    });
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
