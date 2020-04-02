import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { RecoveryComponent } from './recovery/recovery.component';



@NgModule({
  declarations: [LoginComponent, RecoveryComponent],
  imports: [
    SharedModule,
  ],
  providers: [AuthService]
})
export class AuthModule { }
