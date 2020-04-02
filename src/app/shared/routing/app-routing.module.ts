import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RecoveryComponent } from 'src/app/auth/recovery/recovery.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recovery', component: RecoveryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
