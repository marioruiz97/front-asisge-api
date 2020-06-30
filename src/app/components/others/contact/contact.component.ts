import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

export interface ContactTeam {
  cargo: string;
  email: string;
  nombre: string;
  telefono: string;
}

export interface BusinessInfo {
  title: string;
  icon: string;
  value: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  contactForm: FormGroup;
  isLoading = false;

  empresa: BusinessInfo[] = [
    { icon: 'phonelink_ring', title: 'Teléfono: 448 61 02', value: 'Consulta Gratis' },
    { icon: 'apartment', title: 'Dirección: CRA. 42 # 3 Sur 81 Torre 1 Piso 15', value: 'Barrio El Poblado' }
  ];

  equipo: ContactTeam[] = [
    {
      nombre: 'JUAN ERASMO LAVERDE', cargo: 'GERENTE',
      telefono: '313 748 20 30', email: 'gerencia@asisge.com'
    },
    {
      nombre: 'OSCAR LAVERDE', cargo: 'ASISTENTE ADMINISTRATIVO',
      telefono: '318 502 66 41', email: 'administrativo@asisge.com'
    },
    {
      nombre: 'MATEO MORALES', cargo: 'SOPORTE TÉCNICO',
      telefono: '311 300 00 51', email: 'soporteasisge@gmail.com'
    },
  ];


  constructor(
    private uiService: UiService, private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.onBuildForm();
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isLoading = state));
  }

  onBuildForm(): void {
    this.contactForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(14)]),
      mensaje: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  onSubmit(): void {
    this.sendEmail();
  }

  private sendEmail() {
    const data = this.contactForm.value;
    this.uiService.loadingState.next(true);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    this.subs.push(
      this.httpClient.post('https://us-central1-proyectos-asisge.cloudfunctions.net/sendEmail', data, httpOptions)
        .subscribe((res: any) => {
          this.uiService.showSnackBar(res.success, 3);
          this.uiService.loadingState.next(false);
          this.onBuildForm();
        }, _ => {
          this.uiService.showSnackBar('hubo un error enviando el correo, intenta más tarde', 3);
          this.uiService.loadingState.next(false);
        }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
