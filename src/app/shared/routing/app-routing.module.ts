import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RecoveryComponent } from 'src/app/auth/recovery/recovery.component';
import { HomeComponent } from 'src/app/components/others/home/home.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { TipoDocumentoPageComponent } from 'src/app/components/maestros/tipo-documento/tipo-documento-page/tipo-documento-page.component';
import { TipoDocumentoFormComponent } from 'src/app/components/maestros/tipo-documento/tipo-documento-form/tipo-documento-form.component';
import { ClienteListComponent } from 'src/app/components/terceros/clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from 'src/app/components/terceros/clientes/cliente-form/cliente-form.component';
import { UsuarioFormComponent } from 'src/app/components/terceros/usuarios/usuario-form/usuario-form.component';
import { UsuarioListComponent } from 'src/app/components/terceros/usuarios/usuario-list/usuario-list.component';
import { AboutComponent } from 'src/app/components/others/about/about.component';
import { ContactComponent } from 'src/app/components/others/contact/contact.component';

// tslint:disable-next-line: max-line-length
import { EstadoProyectoPageComponent } from 'src/app/components/maestros/estados-proyectos/estado-proyecto-page/estado-proyecto-page.component';
// tslint:disable-next-line: max-line-length
import { EstadoProyectoFormComponent } from 'src/app/components/maestros/estados-proyectos/estado-proyecto-form/estado-proyecto-form.component';
import { MaestrosListComponent } from 'src/app/components/maestros/maestros-list/maestros-list.component';
import { AuditPageComponent } from 'src/app/components/maestros/audit/audit-page/audit-page.component';
import { RoleGuard } from 'src/app/auth/role.guard';
import { MiCuentaComponent } from 'src/app/auth/mi-cuenta/mi-cuenta.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'micuenta', component: MiCuentaComponent, canActivate: [AuthGuard] },

  {
    path: 'maestros', component: MaestrosListComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] }
  },
  { path: 'audit', component: AuditPageComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ROLE_ADMIN'] } },

  { path: 'tipo-documento', component: TipoDocumentoPageComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'tipo-documento/:id', component: TipoDocumentoFormComponent, canActivate: [AuthGuard] },
  { path: 'estado-proyecto', component: EstadoProyectoPageComponent, canActivate: [AuthGuard] },
  { path: 'estado-proyecto/:id', component: EstadoProyectoFormComponent, canActivate: [AuthGuard] },

  { path: 'clientes', component: ClienteListComponent, canActivate: [AuthGuard] },
  { path: 'clientes/:id', component: ClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuarioListComponent, canActivate: [AuthGuard] },
  { path: 'usuarios/:id', component: UsuarioFormComponent, canActivate: [AuthGuard] },

  { path: 'acerca', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contacto', component: ContactComponent, canActivate: [AuthGuard] },

  { path: 'login', component: LoginComponent },
  { path: 'recovery', component: RecoveryComponent },


  // usar rutas que no estan mapeadas, cambiar el redirect por un componente error
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard]
})
export class AppRoutingModule { }
