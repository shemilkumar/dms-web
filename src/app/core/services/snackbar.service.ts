import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from 'src/app/shared/components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) { }

  openSnackbar(message: string, type: string, duration: number = 3000) {
    // let updatedMessage: string = message.message;

    // if (updatedMessage === 'Not authenticated') updatedMessage = 'Please Login Again!';
    // else if (updatedMessage === 'Not Found') updatedMessage = 'Data Not Found!';

    this.snackbar.openFromComponent(ToastComponent, {
      data: { message, type },
      duration,
    });
  }
}
