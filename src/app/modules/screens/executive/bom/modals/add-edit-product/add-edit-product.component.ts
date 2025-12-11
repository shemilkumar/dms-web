import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';


@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent {

  form: FormGroup;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private snackbar: SnackbarService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      slNo: ['', Validators.required],
      description: ['', Validators.required],
      specification: ['', Validators.required],
      moc: ['',],
      quantity: ['', Validators.required],
      uom: ['',],
      // etchingMark: [''],
      pageNo: ['',],
      section: ['', Validators.required],
      remarks: [''],
    });
  }


  modalData = {
    title: this.data?.action === 'update' ? 'Update Product' : 'Create Product',
    confirmButtonText: this.data?.action === 'update' ? 'Update' : 'Submit',
  }

  ngOnInit() {
    this.populatData();
  }

  populatData() {
    if (!this.data?.product) return;

    this.form.patchValue({
      description: this.data.product.description || '',
      specification: this.data.product.specification || '',
      moc: this.data.product.moc || '',
      quantity: this.data.product.quantity || '',
      uom: this.data.product.uom || '',
      // etchingMark: this.data.product.etchingMark || '',
      pageNo: this.data.product.pageNo || '',
      remarks: this.data.product.remarks || '',
      section: this.data.product.section || '',
      slNo: this.data.product.slNo || ''
    });
  }


  submit() {

    console.log(this.form.value);

    this.isLoading = true;

    const productPayload = {
      "description": this.form.get('description')?.value,
      "dispatched_quantity": 0,
      // "etching_mark": this.form.get('etchingMark')?.value,
      "moc": this.form.get('moc')?.value,
      "page_no": this.form.get('pageNo')?.value,
      "project_id": this.data?.project?.projectId,
      "project_name": this.data?.project?.projectName,
      "quantity": this.form.get('quantity')?.value,
      "remarks": this.form.get('remarks')?.value,
      "specification": this.form.get('specification')?.value,
      "uom": this.form.get('uom')?.value,
      "section": this.form.get('section')?.value,
      "sl_no": this.form.get('slNo')?.value
    }

    if (this.data?.action === 'update') this.updateProduct(productPayload)
    else this.createProduct(productPayload);
  }

  createProduct(payload: any) {
    this.api.post(`boms/project/${this.data?.project.projectId}`, payload).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.snackbar.openSnackbar('Product created successfully', 'success');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.log(error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      })
  }

  updateProduct(payload: any) {
    this.api.put(`boms/${this.data?.product.bomId}`, payload).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.snackbar.openSnackbar('Product Updated successfully', 'success');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.log(error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      })
  }

  changeTimeFormat(date: Date) {
    return date.toISOString()
  }
}
