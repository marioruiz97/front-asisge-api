import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RecoveryComponent } from 'src/app/auth/recovery/recovery.component';
import { HomeComponent } from 'src/app/components/others/home/home.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { TipoDocumentoListComponent } from 'src/app/components/maestros/tipo-documento/tipo-documento-list/tipo-documento-list.component';
import { TipoDocumentoFormComponent } from 'src/app/components/maestros/tipo-documento/tipo-documento-form/tipo-documento-form.component';
import { ClienteListComponent } from 'src/app/components/terceros/clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from 'src/app/components/terceros/clientes/cliente-form/cliente-form.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'tipo-documento', component: TipoDocumentoListComponent, canActivate: [AuthGuard] },
  { path: 'tipo-documento/:id', component: TipoDocumentoFormComponent, canActivate: [AuthGuard] },
  { path: 'clientes', component: ClienteListComponent, canActivate:[AuthGuard]},
  { path: 'clientes/:id', component: ClienteFormComponent, canActivate:[AuthGuard]},

  { path: 'login', component: LoginComponent },
  { path: 'recovery', component: RecoveryComponent },


  // usar rutas que no estan mapeadas, cambiar el redirect por un componente error
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
