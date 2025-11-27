import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutiveRoutingModule } from './executive-routing.module';
import { ProjectsComponent } from './projects/projects.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AddEditProjectComponent } from './modals/add-edit-project/add-edit-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { PpModule } from '../../base/pp/pp.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { BoxComponent } from './box/box.component';
import { BomComponent } from './bom/bom.component';
import { BoxProductsComponent } from './box-products/box-products.component';

@NgModule({
  declarations: [ProjectsComponent, AddEditProjectComponent, HomeComponent, BoxComponent, BomComponent, BoxProductsComponent],
  imports: [CommonModule, ExecutiveRoutingModule, SharedModule, MatDialogModule, FormsModule,
    ReactiveFormsModule,
    PpModule, MatTooltipModule, MatMenuModule
  ],
})
export class ExecutiveModule { }
