import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor() { }

  navLinks = [
    { label: 'BOM', route: '/projects/bom' },
    { label: 'BOX', route: '/projects/box' },
    { label: 'Settings', route: '/executive/settings' },
  ]

}
