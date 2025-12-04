import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/screens/components/login/login.component';
import { NavbarLayoutComponent } from './core/components/navbar-layout/navbar-layout.component';
import { ProfileComponent } from './modules/screens/components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/screens/executive/executive.module')
        .then((module) => module.ExecutiveModule),
  },
  // {
  //   path: 'super-admin',
  //   loadChildren: () =>
  //     import('./modules/screens/super-admin/super-admin.module')
  //       .then((module) => module.SuperAdminModule),
  // },
  {
    path: 'profile',
    component: NavbarLayoutComponent,
    children: [{
      path: '',
      component: ProfileComponent
    }]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
