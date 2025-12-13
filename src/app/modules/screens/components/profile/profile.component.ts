import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: SnackbarService
  ) {
    // this.loginForm = this.fb.group({
    //   email: ['', Validators.required],
    //   password: ['', Validators.required]
    // })
  }

  isLoading = false;
  changePasswordForm!: FormGroup;
  isSubmitting = false;
  passwordChangeSuccess = false;
  passwordChangeError: string | null = null;

  isProfileLoading: boolean = false;

  role: string = ''

  ngOnInit() {
    this.fetchUserProfile();

    this.role = localStorage.getItem('role') || ''

    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            // Optional: at least one letter and one number
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
          ]
        ],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: [this.passwordsMatchValidator]
      }
    );
  }

  get homeLink() {
    if (this.role === 'SA') return '/super-admin';
    else return '/home';
  }

  user: any = {};

  fetchUserProfile() {
    this.isProfileLoading = true;

    this.api.get('users').pipe(finalize(() => this.isProfileLoading = false)).subscribe({
      next: (response: any) => {
        console.log(response);
        this.user = response.data;
      },
      error: (error) => {
        console.log(error);
        this.snackbar.openSnackbar(error.message, 'error');
      }
    })
  }

  get displayName(): string {
    // try to show a nice name: part before + or before @
    const base = this.user.username || this.user.email;
    const beforePlus = base?.split('+')[0];
    const beforeAt = beforePlus?.split('@')[0];
    return this.capitalize(beforeAt);
  }

  get avatarInitial(): string {
    return this.displayName?.charAt(0).toUpperCase();
  }

  get roleLabel(): string {
    const map: Record<string, string> = {
      ADM: 'Admin',
      EX: 'Executive',
      SA: 'Super Admin'
    };
    return map[this.user.role] || this.user.role;
  }

  get roleBadgeClass(): string {
    const map: Record<string, string> = {
      ADM: 'bg-purple-100 text-purple-700 border-purple-200',
      EX: 'bg-blue-100 text-blue-700 border-blue-200',
      SA: 'bg-amber-100 text-amber-700 border-amber-200'
    };
    return map[this.user.role] || 'bg-slate-100 text-slate-700 border-slate-200';
  }

  get statusLabel(): string {
    return this.capitalize(this.user.status?.toLowerCase());
  }

  get statusBadgeClass(): string {
    const map: Record<string, string> = {
      ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      INACTIVE: 'bg-slate-100 text-slate-500 border-slate-200',
      BLOCKED: 'bg-red-100 text-red-700 border-red-200'
    };
    return map[this.user.status] || 'bg-slate-100 text-slate-700 border-slate-200';
  }

  private capitalize(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private passwordsMatchValidator(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!newPassword || !confirmPassword) return null;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  isEditMode = false;

  editedUser = { ...this.user };

  enableEdit() {
    this.isEditMode = true;
    this.editedUser = { ...this.user };
  }

  cancelEdit() {
    this.isEditMode = false;
  }

  saveChanges() {
    this.user = { ...this.editedUser };
    this.isEditMode = false;

    console.log(this.user);

    this.updateProfile();
  }


  updateProfile() {
    this.api.put('users', this.user).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.snackbar.openSnackbar('Profile updated successfully', 'success');
          this.fetchUserProfile();
        },
        error: (error) => {
          console.log(error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      })
  }

  isPasswordChange: boolean = false;
  changePassword() {

    this.isPasswordChange = true;

    const payload = {
      new_password: this.f['newPassword'].value,
      user_id: this.user.user_id
    };

    this.api.put('users/change_password', payload).pipe(finalize(() => this.isPasswordChange = false))
      .subscribe({
        next: (response: any) => {
          this.snackbar.openSnackbar('Password changed successfully', 'success');
          this.fetchUserProfile();
        },
        error: (error) => {
          console.log(error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      })
  }
}


