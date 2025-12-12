import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-add-edit-box',
  templateUrl: './add-edit-box.component.html',
  styleUrls: ['./add-edit-box.component.scss']
})
export class AddEditBoxComponent {

  form: FormGroup;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private snackbar: SnackbarService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      boxName: ['', Validators.required],
      description: [''],
      invoiceNo: [''],
      invoiceDate: [''],
      poNo: [''],
      vehicleNo: ['']
    });
  }

  modalData = {
    title: this.data?.action === 'update' ? 'Update Box' : 'Create Box',
    confirmButtonText: this.data?.action === 'update' ? 'Update' : 'Submit',
  }

  ngOnInit() {
    console.log(this.data);
    this.populatData();
  }

  populatData() {
    console.log(this.data);

    if (!this.data?.box) return;

    this.form.patchValue({
      boxName: this.data.box.boxName || '',
      description: this.data.box.description || '',

      invoiceNo: this.data.box.invoiceNo || '',
      invoiceDate: this.data.box.invoiceDate || '',
      poNo: this.data.box.poNo || '',
      vehicleNo: this.data.box.vehicleNo || ''
    });
  }


  submit() {

    this.isLoading = true;

    const boxPayload = {
      "name": this.form.get('boxName')?.value,
      "description": this.form.get('description')?.value,

      "invoice_no": this.form.get('invoiceNo')?.value,
      "invoice_date": this.form.get('invoiceDate')?.value ? this.form.get('invoiceDate')?.value?.getTime() : undefined,
      "po_no": this.form.get('poNo')?.value,
      "vehicle_no": this.form.get('vehicleNo')?.value,

      "project_id": this.data?.project?.projectId
    }

    if (this.data?.action === 'update') this.updateBox(boxPayload);
    else this.createBox(boxPayload);

  }

  createBox(payload: any) {
    this.api.post('boxes', payload).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.snackbar.openSnackbar('Box created successfully', 'success');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.log(error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      })
  }

  updateBox(payload: any) {
    this.api.put(`boxes/${this.data?.box.boxId}`, payload).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.snackbar.openSnackbar('Box updated successfully', 'success');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.log(error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      })
  }

  getEpoch(date: Date) {
    return date.getTime()
  }
}
