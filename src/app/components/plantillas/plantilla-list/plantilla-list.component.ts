import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlantillaService } from '../plantilla.service';
import { Subscription } from 'rxjs';
import { Plantilla } from 'src/app/models/proyectos/plantilla.model';

@Component({
  selector: 'app-plantilla-list',
  templateUrl: './plantilla-list.component.html',
  styleUrls: ['./plantilla-list.component.css']
})
export class PlantillaListComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  plantillas: Plantilla[] = [];

  constructor(private service: PlantillaService) { }

  ngOnInit() {
    this.fetchPlantillas();
  }

  fetchPlantillas() {
    this.subs.push(this.service.fetchPlantillas().subscribe(res => this.plantillas = res.body as Plantilla[]));
  }

  deletePlantilla(idPlantilla: number) {
    this.subs.push(this.service.delete(idPlantilla).subscribe(res => {
      if (res) { this.fetchPlantillas(); }
    }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
