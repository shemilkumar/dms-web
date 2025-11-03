import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./modules/screens/executive/executive.module')
        .then((module) => module.ExecutiveModule),
  },
  {
    path: 'super-admin',
    loadChildren: () =>
      import('./modules/screens/super-admin/super-admin.module')
        .then((module) => module.SuperAdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
