import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NavItem } from 'src/app/shared/routing/app-menu';
import { UiService } from 'src/app/shared/ui.service';
import { MatAccordion } from '@angular/material';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Output() closeSidenav = new EventEmitter();
  @ViewChild('accordion', { static: false }) accordion: MatAccordion;
  isLogged = true;

  collapsible: NavItem[];
  menu: NavItem[];
  settings: NavItem[];

  constructor(private uiService: UiService) {
    this.menu = uiService.noChild;
    this.collapsible = uiService.children;
    this.settings = uiService.settings.filter(nav => nav.url.search('micuenta') === -1);
  }

  ngOnInit() {
  }

  onToggle() {
    this.accordion.closeAll();
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onToggle();
  }

}
