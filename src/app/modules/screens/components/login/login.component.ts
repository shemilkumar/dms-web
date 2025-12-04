import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup

  constructor(private api: ApiService, private router: Router,
    private fb: FormBuilder, private snackbar: SnackbarService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  isLoading = false;


  login() {
    this.isLoading = true;

    this.api.post('auth/login', this.loginForm.value).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          console.log('Login successful', response);

          const accessToken = response.data.access_token;
          const refreshToken = response.data.refresh_token;

          localStorage.setItem('role', response.data.role);
          if (response.data.role === 'EX') {
            this.snackbar.openSnackbar(
              'Please log in through the mobile application, your account does not have permission to access the web portal',
              'warning'
            );
            return;
          }

          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          // localStorage.setItem('userId', response.data.user_id);

          this.getUserRights();

          // if (response.data.role === 'SA') this.router.navigateByUrl('/super-admin');
          // if (['ADM', 'EX'].includes(response.data.role))

          this.router.navigateByUrl('/home/projects');

        },
        error: (error) => {
          console.error('Login failed', error);
          this.snackbar.openSnackbar(error.message, 'error');
        }
      });
  }

  getUserRights() {
    this.api.get('users/user_rights').subscribe({
      next: (response: any) => {
        console.log(response);
        const userRights = response.data.rights;
        localStorage.setItem('userRights', JSON.stringify(userRights));
      }
    })
  }
}
