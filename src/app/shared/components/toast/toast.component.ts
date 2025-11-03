import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  toastType: 'success' | 'error' | 'warning' = 'success';
  toastMessage: any;

  constructor(
    public snackBarRef: MatSnackBarRef<ToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: any, type: 'success' | 'error' }
  ) { }

  ngOnInit() {
    if (this.data.type) this.toastType = this.data.type;

    if (this.data.message.message === 'Not Found') this.toastMessage = 'Oops! Something went wrong. Please try again later.';
    else if (this.data.message.message === 'Not authenticated') {
      this.toastMessage = 'You are logged out, Please Login Again!';
      window.location.href = '/login';
    } else if (this.data.message.message === 'Unauthorized') {
      window.location.href = '/login';
      this.toastMessage = 'You have been logged out due to inactivity';
    }
    else this.toastMessage = this.data.message;
  }

  close() {
    this.snackBarRef.dismiss()
  }
}
