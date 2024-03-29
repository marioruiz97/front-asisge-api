import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/auth/role.guard';
import { AuthGuard } from 'src/app/auth/auth.guard';

import { LoginComponent } from 'src/app/auth/views/login/login.component';
import { RecoveryComponent } from 'src/app/auth/views/recovery/recovery.component';
import { MiCuentaComponent } from 'src/app/auth/views/mi-cuenta/mi-cuenta.component';

import { ClienteListComponent } from 'src/app/components/terceros/clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from 'src/app/components/terceros/clientes/cliente-form/cliente-form.component';
import { UsuarioFormComponent } from 'src/app/components/terceros/usuarios/usuario-form/usuario-form.component';
import { UsuarioListComponent } from 'src/app/components/terceros/usuarios/usuario-list/usuario-list.component';

import { HomeComponent } from 'src/app/components/others/home/home.component';
import { AboutComponent } from 'src/app/components/others/about/about.component';
import { ContactComponent } from 'src/app/components/others/contact/contact.component';

import { MaestrosListComponent } from 'src/app/components/maestros/maestros-list/maestros-list.component';
import { AuditPageComponent } from 'src/app/components/maestros/audit/audit-page/audit-page.component';
import { TipoDocumentoPageComponent } from 'src/app/components/maestros/tipo-documento/tipo-documento-page/tipo-documento-page.component';
import { TipoDocumentoFormComponent } from 'src/app/components/maestros/tipo-documento/tipo-documento-form/tipo-documento-form.component';
// tslint:disable-next-line: max-line-length
import { EstadoProyectoPageComponent } from 'src/app/components/maestros/estados-proyectos/estado-proyecto-page/estado-proyecto-page.component';
// tslint:disable-next-line: max-line-length
import { EstadoProyectoFormComponent } from 'src/app/components/maestros/estados-proyectos/estado-proyecto-form/estado-proyecto-form.component';
// tslint:disable-next-line: max-line-length
import { EstadoActividadPageComponent } from 'src/app/components/maestros/estados-actividad/estado-actividad-page/estado-actividad-page.component';
// tslint:disable-next-line: max-line-length
import { EstadoActividadFormComponent } from 'src/app/components/maestros/estados-actividad/estado-actividad-form/estado-actividad-form.component';

import { ProyectoListComponent } from 'src/app/components/proyectos/proyecto-list/proyecto-list.component';
import { ProyectoFormComponent } from 'src/app/components/proyectos/proyecto-form/proyecto-form.component';
import { DashboardComponent } from 'src/app/components/proyectos/dashboard/dashboard.component';
import { PlanFormComponent } from 'src/app/components/proyectos/plan-trabajo/plan-form/plan-form.component';
import { PlantillaFormComponent } from 'src/app/components/plantillas/plantilla-form/plantilla-form.component';
import { PlantillaListComponent } from 'src/app/components/plantillas/plantilla-list/plantilla-list.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },

  /**
   * PAGINAS SIN ROLES O SOLO CON ESTAR AUTENTICADO
   */
  { path: 'login', component: LoginComponent },
  { path: 'recovery', component: RecoveryComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'micuenta', component: MiCuentaComponent, canActivate: [AuthGuard] },
  { path: 'acerca', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contacto', component: ContactComponent, canActivate: [AuthGuard] },

  /**
   * ADMINISTRACIÓN Y MAESTROS, SOLO PARA ADMIN
   */
  {
    path: 'maestros', component: MaestrosListComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'audit', component: AuditPageComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'tipo-documento', component: TipoDocumentoPageComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'tipo-documento/:id', component: TipoDocumentoFormComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'estado-proyecto', component: EstadoProyectoPageComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'estado-proyecto/:id', component: EstadoProyectoFormComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'estado-actividad', component: EstadoActividadPageComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'estado-actividad/:id', component: EstadoActividadFormComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },


  /**
   * MODULOS DE TERCEROS
   */
  { path: 'clientes', component: ClienteListComponent, canActivate: [AuthGuard] },
  { path: 'clientes/:id', component: ClienteFormComponent, canActivate: [AuthGuard] },
  {
    path: 'usuarios', component: UsuarioListComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] }
  },
  {
    path: 'usuarios/:id', component: UsuarioFormComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] }
  },

  /**
   * MODULOS DE PROYECTOS
   */
  {
    path: 'plantillas', component: PlantillaListComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] }
  },
  {
    path: 'plantillas/:id', component: PlantillaFormComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] }
  },
  {
    path: 'proyectos/nuevo', pathMatch: 'full', component: ProyectoFormComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] }
  },
  {
    path: 'proyectos/:id/editar', pathMatch: 'full', component: ProyectoFormComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] }
  },
  {
    path: 'proyectos/:id/nuevo-plan', pathMatch: 'full', component: PlanFormComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] }
  },
  {
    path: 'proyectos/:id/plan/:idPlan', pathMatch: 'full', component: PlanFormComponent, canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] }
  },
  { path: 'proyectos', component: ProyectoListComponent, canActivate: [AuthGuard] },
  { path: 'proyectos/:id', component: DashboardComponent, canActivate: [AuthGuard] },

  // usar rutas que no estan mapeadas, cambiar el redirect por un componente error
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard]
})
export class AppRoutingModule { }
