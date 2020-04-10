import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { RecoveryComponent } from './recovery/recovery.component';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { CuentaService } from './mi-cuenta/cuenta.service';
import { ChangePasswordComponent } from './change-password/change-password.component';



@NgModule({
  declarations: [LoginComponent, RecoveryComponent, MiCuentaComponent, ChangePasswordComponent],
  imports: [
    SharedModule,
  ],
  providers: [AuthService, CuentaService],
  entryComponents: [ChangePasswordComponent]
})
export class AuthModule { }
