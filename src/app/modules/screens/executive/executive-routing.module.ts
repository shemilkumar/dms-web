import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { HomeComponent } from './home/home.component';
import { BoxComponent } from './box/box.component';
import { BoxProductsComponent } from './box-products/box-products.component';
import { BomComponent } from './bom/bom.component';
import { SidebarComponent } from 'src/app/core/components/sidebar/sidebar.component';
import { SidebarLayoutComponent } from 'src/app/core/components/sidebar-layout/sidebar-layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ProjectsComponent,
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
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveRoutingModule { }
