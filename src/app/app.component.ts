import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'front-asisge-api';
  $isHandset: Observable<boolean>;

  constructor(
    private breakPointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.initAuth();
    this.$isHandset = this.breakPointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        tap(() => this.changeDetectorRef.detectChanges())
      );
  }

}
