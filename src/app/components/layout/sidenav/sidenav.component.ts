import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { NavItem } from 'src/app/shared/routing/app-menu';
import { MatAccordion } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService, TokenInfo } from 'src/app/auth/auth.service';
import { MenuService } from 'src/app/shared/menu.service';


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
  private subs: Subscription[] = [];

  collapsible: NavItem[];
  menu: NavItem[] = [];
  settings: NavItem[] = [];

  constructor(private menuService: MenuService, private authService: AuthService) { }

  ngOnInit() {
    this.subs.push(this.authService.authState.subscribe(state => this.isLogged = state));
    this.subs.push(this.authService.currentUser.subscribe(u => this.user = u));
    this.subs.push(this.menuService.menu.subscribe(menu => {
      this.menu = this.menuService.getNoChild(menu);
      this.collapsible = this.menuService.getChildren(menu);
    }));
    this.authService.initAuth();
    this.settings = this.menuService.settings.filter(nav => nav.url.search('micuenta') === -1);
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
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

}
