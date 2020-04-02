import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UiService } from 'src/app/shared/ui.service';
import { NavItem } from 'src/app/shared/routing/app-menu';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() openMenu = new EventEmitter();
  isLogged = true;
  menu: NavItem[];
  settings: NavItem[];

  constructor(private uiService: UiService) {
    this.menu = uiService.menu;
    this.settings = uiService.settings;
  }

  ngOnInit() {
  }

  onLogout() {

  }


}
