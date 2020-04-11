import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './views/login/login.component';
import { AuthService } from './auth.service';
import { RecoveryComponent } from './views/recovery/recovery.component';
import { MiCuentaComponent } from './views/mi-cuenta/mi-cuenta.component';
import { CuentaService } from './views/mi-cuenta/cuenta.service';
import { ChangePasswordComponent } from './views/change-password/change-password.component';



@NgModule({
  declarations: [LoginComponent, RecoveryComponent, MiCuentaComponent, ChangePasswordComponent],
  imports: [
    SharedModule,
  ],
  providers: [AuthService, CuentaService],
  entryComponents: [ChangePasswordComponent]
})
export class AuthModule { }
