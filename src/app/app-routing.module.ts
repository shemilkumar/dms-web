import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/screens/login/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
  {
    path: 'login',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
