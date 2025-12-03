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
      clientName: ['',],
      startDate: ['',],
      endDate: ['',],
      description: ['',],
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
      startDate: this.data.project.startDate ? new Date(this.data.project.startDate) : undefined,
      endDate: this.data.project.endDate ? new Date(this.data.project.endDate) : undefined,
      description: this.data.project.description || '',
    });
  }


  submit() {

    this.isLoading = true;

    console.log(this.form.get('startDate'));


    const projectPayload = {
      "name": this.form.get('projectName')?.value,
      "client_name": this.form.get('clientName')?.value,
      "start_date": this.form.get('startDate')?.value ? this.getEpoch(this.form.get('startDate')?.value) : undefined,
      "end_date": this.form.get('staend_datertDate')?.value ? this.getEpoch(this.form.get('endDate')?.value) : undefined,
      "description": this.form.get('description')?.value,
      "status": 'ACTIVE'
    }

    // {expected: "'DRAFT', 'ACTIVE', 'CLOSED' or 'ARCHIVED'"}

    if (this.data?.action === 'update') this.updateProject(projectPayload);
    else this.createProject(projectPayload);

  }

  createProject(payload: any) {
    this.api.post('projects', payload).pipe(finalize(() => this.isLoading = false))
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

  updateProject(payload: any) {
    this.api.put(`projects/${this.data?.project.projectId}`, payload).pipe(finalize(() => this.isLoading = false))
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

  getEpoch(date: Date) {
    return date?.getTime()
  }
}
