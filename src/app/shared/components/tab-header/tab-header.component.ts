import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.scss']
})
export class TabHeaderComponent {
  constructor() { }

  routes: any;

  defaultRoutes = [
    {
      title: 'Dashboard',
      path: ['/dashboard'],
    },
    {
      title: 'Service Providers',
      path: ['/service-providers'],
    },
    {
      title: 'Users',
      path: ['/users'],
    }
  ];

  cloneRoutes = [
    {
      title: 'Dashboard',
      path: ['/dashboard'],
    },
    {
      title: 'Service Providers',
      path: ['/service-providers'],
    }
  ];

  ngOnInit() {
    const role = localStorage.getItem('role') || '';
    if (role === 'sa') this.routes = this.defaultRoutes;
    else this.routes = this.cloneRoutes;
  }
}
