import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor() { }

  navLinks = [
    { label: 'BOM', route: '/home/bom' },
    { label: 'BOX', route: '/home/box' },
    { label: 'Settings', route: '/executive/settings' },
  ]

}
