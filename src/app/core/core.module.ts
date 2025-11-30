import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from './components/sidebar-layout/sidebar-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatMenuModule } from '@angular/material/menu';
import { NavbarLayoutComponent } from './components/navbar-layout/navbar-layout.component';

@NgModule({
  declarations: [
    SidebarComponent,
    SidebarLayoutComponent,
    NavbarComponent,
    NavbarLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatMenuModule
  ]
})
export class CoreModule { }
