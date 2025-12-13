import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent {

  form: FormGroup;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private snackbar: SnackbarService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required],
      passcode: ['', this.data?.action === 'update' ? null : Validators.required],
    });
  }

  modalData = {
    title: this.data?.action === 'update' ? 'Update User' : 'Add User',
    confirmButtonText: this.data?.action === 'update' ? 'Update' : 'Submit',
  }

  role: string = '';

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
    this.populatData();
  }

  populatData() {
    console.log(this.data);

    if (!this.data?.user) return;

    this.form.patchValue({
      username: this.data.user.username || '',
      email: this.data.user.email || '',
      passcode: this.data.user.passcode || '',
      role: this.getRole(this.data.user.role) || '',
      phoneNumber: this.data.user.phoneNumber || '',
    });
  }

  submit() {
    const userPayload = {
      "username": this.form.get('username')?.value,
      "email": this.form.get('email')?.value,
      "phone_number": this.form.get('phoneNumber')?.value,
      "role": this.form.get('role')?.value,
      "passcode": this.form.get('passcode')?.value,
      "user_id": this.data?.user?.userId
    }

    this.isLoading = true;
    if (this.data?.action === 'update') this.updateUser(userPayload);
    else this.createUser(userPayload);
  }

  createUser(user: any) {
    this.api.post('users', user).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.snackbar.openSnackbar('User created successfully', 'success');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.log(error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      });
  }

  updateUser(user: any) {
    this.api.put('users', user).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.snackbar.openSnackbar('User Updated successfully', 'success');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.log(error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      });
  }

  getRole(role: string) {
    if (role === 'Admin') return 'ADM'
    else if (role === 'Executive') return 'EX';
    else if (role === 'Scanner') return 'SC';
    else return 'User'
  }

  validPhoneNumberCharacters = (event: KeyboardEvent): boolean => {
    const allowedPattern = /^[0-9]$/; // Allow digits only
    const inputElement = event.target as HTMLInputElement; // Get the input element
    const key = event.key;

    // Prevent invalid keys (non-digits and special keys except backspace/delete)
    if (!allowedPattern.test(key) && key !== "Backspace" && key !== "Delete") {
      event.preventDefault();
      return false;
    }

    // Prevent typing if length exceeds 10
    if (inputElement.value.length >= 10 && key !== "Backspace" && key !== "Delete") {
      event.preventDefault();
      return false;
    }

    return true;
  };
}