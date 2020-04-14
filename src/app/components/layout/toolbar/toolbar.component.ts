import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NavItem } from 'src/app/shared/routing/app-menu';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/shared/menu.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Output() openMenu = new EventEmitter();
  menu: NavItem[] = [];
  settings: NavItem[] = [];

  isLogged = false;
  private subs: Subscription[] = [];

  constructor(private menuService: MenuService, private authService: AuthService) { }

  ngOnInit() {
    this.subs.push(this.authService.authState.subscribe(state => this.isLogged = state));
    this.authService.isAuthenticated(true);
    if (this.isLogged) {
      this.subs.push(this.menuService.menu.subscribe(menu => this.menu = menu));
      this.settings = this.menuService.settings;
      this.menuService.selectMenu();
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
