import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) { this.authService.goToHome(); }
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(64), Validators.minLength(6), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(6)]),
    });
  }

  onSubmit() {
    const usuario = this.loginForm.value;
    this.authService.login({ email: usuario.username, password: usuario.password });
  }

  redirect(to: string) {
    return this.authService.redirect(to);
  }

}
