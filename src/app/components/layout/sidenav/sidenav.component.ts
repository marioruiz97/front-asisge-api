import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { NavItem } from 'src/app/shared/routing/app-menu';
import { UiService } from 'src/app/shared/ui.service';
import { MatAccordion } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService, TokenInfo } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  @Output() closeSidenav = new EventEmitter();
  @ViewChild('accordion', { static: false }) accordion: MatAccordion;

  user: TokenInfo;
  isLogged = false;
  authSubscription: Subscription;

  collapsible: NavItem[];
  menu: NavItem[];
  settings: NavItem[];

  constructor(private uiService: UiService, private authService: AuthService) {
    this.menu = uiService.noChild;
    this.collapsible = uiService.children;
    this.settings = uiService.settings.filter(nav => nav.url.search('micuenta') === -1);
  }

  ngOnInit() {
    this.authSubscription = this.authService.authState.subscribe(state => this.isLogged = state);
    this.authService.isAuthenticated();
    this.user = this.authService.currentUser;
  }

  onToggle() {
    this.accordion.closeAll();
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onToggle();
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}
