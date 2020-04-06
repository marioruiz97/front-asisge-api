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
  empresa: BusinessInfo[] = [];
  equipo: ContactTeam[] = [];
  contactForm: FormGroup;
  isLoading = false;

  constructor(
    private uiService: UiService, private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.onBuildForm();
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isLoading = state));

    /* // subscription para info de la empresa
    this.subs.push(this.firestore.doc('empresa-asisge/info-empresa').valueChanges()
      .subscribe((infoArray: any) => this.empresa = infoArray.info));
    // subscription para equipo de la empresa
    this.subs.push(this.firestore.doc('empresa-asisge/equipo-empresa').valueChanges()
      .subscribe((equipo: any) => this.equipo = equipo.miembros)); */
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
      this.httpClient.post('https://us-central1-elenchos-software.cloudfunctions.net/sendEmail', data, httpOptions)
        .subscribe((res: any) => {
          this.uiService.showSnackBar(res.success, 3);
          this.uiService.loadingState.next(false);
          this.onBuildForm();
        }, error => {
          console.log('error', error);
          this.uiService.showSnackBar('hubo un error enviando el correo, intenta más tarde', 3);
          this.uiService.loadingState.next(false);
        }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
