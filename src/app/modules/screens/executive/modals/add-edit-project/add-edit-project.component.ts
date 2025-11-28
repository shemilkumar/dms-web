import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrls: ['./add-edit-project.component.scss'],
})

export class AddEditProjectComponent {

  form: FormGroup;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private snackbar: SnackbarService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      projectName: ['', Validators.required],
      clientName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  modalData = {
    title: this.data?.action === 'update' ? 'Update Project' : 'Add Project',
    confirmButtonText: this.data?.action === 'update' ? 'Update' : 'Submit',
  }

  ngOnInit() {
    this.populatData();
  }

  populatData() {
    console.log(this.data);

    if (!this.data?.project) return;

    this.form.patchValue({
      projectName: this.data.project.projectName || '',
      clientName: this.data.project.clientName || '',
      startDate: new Date(this.data.project.startDate) || '',
      endDate: new Date(this.data.project.endDate) || '',
      description: this.data.project.description || '',
    });
  }


  submit() {

    this.isLoading = true;

    const projectPayload = {
      "name": this.form.get('projectName')?.value,
      "client_name": this.form.get('clientName')?.value,
      "start_date": this.changeTimeFormat(this.form.get('startDate')?.value),
      "end_date": this.changeTimeFormat(this.form.get('endDate')?.value),
      "description": this.form.get('description')?.value,
      "status": 'ACTIVE'
    }
    // {expected: "'DRAFT', 'ACTIVE', 'CLOSED' or 'ARCHIVED'"}

    console.log(projectPayload);

    if (this.data?.action === 'update') {
      this.api.put(`projects/${this.data?.project.projectId}`, projectPayload).pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (response: any) => {
            this.snackbar.openSnackbar('Project updated successfully', 'success');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.log(error);
            this.snackbar.openSnackbar(error.message, 'error');
          }
        })
    }
    else {
      this.api.post('projects', projectPayload).pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (response: any) => {
            this.snackbar.openSnackbar('Project created successfully', 'success');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.log(error);
            this.snackbar.openSnackbar(error.message, 'error');
          }
        })
    }

  }

  changeTimeFormat(date: Date) {
    return date.toISOString()
  }
}
