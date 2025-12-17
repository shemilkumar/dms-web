import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
@Component({
  selector: 'app-stickers',
  templateUrl: './stickers.component.html',
  styleUrls: ['./stickers.component.scss']
})
export class StickersComponent {

  isLoading: boolean = false;
  stickers = Array.from({ length: 40 });

  constructor(
    public dialogRef: MatDialogRef<StickersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
  ) { }

  modalData = {
    title: this.data?.action === 'update' ? 'Update Product' : 'Add Product',
    confirmButtonText: this.data?.action === 'update' ? 'Update' : 'Submit',
    closeButtonOnly: true
  }

  ngOnInit() {
  }


  submit() {
  }




  printStickers() {
    window.print();
  }
}
