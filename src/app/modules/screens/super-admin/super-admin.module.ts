import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { SharedModule } from "src/app/shared/shared.module";
import { PpModule } from '../../base/pp/pp.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddEditUserComponent } from './modals/add-edit-user/add-edit-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    SuperAdminComponent,
    AddEditUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PpModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    SuperAdminRoutingModule,
  ]
})
export class SuperAdminModule { }
