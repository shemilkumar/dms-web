import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrls: ['./add-edit-project.component.scss'],
})
export class AddEditProjectComponent {
  constructor(public dialogRef: MatDialogRef<AddEditProjectComponent>) {}

  modalData = {
    title: 'Create Project',
    confirmButtonText: 'Submit',
  };

  isLoading: boolean = false;
  project: string = '';

  submit() {
    this.isLoading = true;
  }
}
