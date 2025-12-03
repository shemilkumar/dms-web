import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { BoxComponent } from './box/box.component';
import { BoxProductsComponent } from './box-products/box-products.component';
import { BomComponent } from './bom/bom.component';
import { SidebarLayoutComponent } from 'src/app/core/components/sidebar-layout/sidebar-layout.component';
import { StickerPageComponent } from './sticker-page/sticker-page.component';
import { NavbarLayoutComponent } from 'src/app/core/components/navbar-layout/navbar-layout.component';
import { UserManagementComponent } from 'src/app/shared/components/user-management/user-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
  {
    path: '',
    component: NavbarLayoutComponent,
    children: [
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      {
        path: 'users',
        component: UserManagementComponent
      }
    ]
  },
  {
    path: '',
    component: SidebarLayoutComponent,
    children: [
      {
        path: 'bom',
        component: BomComponent,
      },
      {
        path: 'box',
        component: BoxComponent,
      },
      {
        path: 'package-list',
        component: BoxProductsComponent,
      },
      {
        path: 'sticker',
        component: StickerPageComponent,
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveRoutingModule { }
