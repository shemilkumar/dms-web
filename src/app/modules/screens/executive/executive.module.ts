import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutiveRoutingModule } from './executive-routing.module';
import { ProjectsComponent } from './projects/projects.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AddEditProjectComponent } from './modals/add-edit-project/add-edit-project.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProjectsComponent, AddEditProjectComponent],
  imports: [CommonModule, ExecutiveRoutingModule, SharedModule, MatDialogModule, FormsModule],
})
export class ExecutiveModule {}
