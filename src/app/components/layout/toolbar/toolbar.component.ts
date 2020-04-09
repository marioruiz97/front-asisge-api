import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/shared/ui.service';
import { NavItem } from 'src/app/shared/routing/app-menu';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Output() openMenu = new EventEmitter();
  menu: NavItem[];
  settings: NavItem[];

  isLogged = false;
  authSubscription: Subscription;

  constructor(private uiService: UiService, private authService: AuthService) {
    this.menu = uiService.menu;
    this.settings = uiService.settings;
  }

  ngOnInit() {
    this.authSubscription = this.authService.authState.subscribe(state => this.isLogged = state);
    this.authService.isAuthenticated();
  }

  onLogout() {
    this.authService.logout();
  }


  ngOnDestroy() {
    if (this.authSubscription) { this.authSubscription.unsubscribe(); }
  }

}
