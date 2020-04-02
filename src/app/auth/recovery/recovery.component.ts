import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  resetForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.resetForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(64), Validators.minLength(6), Validators.email]),
    });
  }

  onSubmit() {
    alert('genial');
  }

  redirect(to: string) {
    return this.authService.redirect(to);
  }

}
