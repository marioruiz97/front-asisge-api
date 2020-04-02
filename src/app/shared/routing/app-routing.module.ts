import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RecoveryComponent } from 'src/app/auth/recovery/recovery.component';
import { HomeComponent } from 'src/app/components/others/home/home.component';
import { AuthGuard } from 'src/app/auth/auth.guard';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

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
