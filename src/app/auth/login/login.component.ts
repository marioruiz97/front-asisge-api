import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(64), Validators.minLength(6), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(6)]),
    });
  }

  onSubmit() {
    alert('genial');
  }

  redirect(to: string) {
    return this.authService.redirect(to);
  }

}
