import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { HomeComponent } from './home/home.component';
import { BoxComponent } from './box/box.component';
import { BoxProductsComponent } from './box-products/box-products.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'box',
    component: BoxComponent,
  },
  {
    path: 'package-list',
    component: BoxProductsComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveRoutingModule { }
