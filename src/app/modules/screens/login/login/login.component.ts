import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private api: ApiService, private router: Router) { }

  isLoading = false;

  // Simple submit handler — replace with real auth call
  onSubmit(form: NgForm) {
    if (!form || !form.valid) {
      return;
    }

    this.isLoading = true;
    const { email, password, remember } = form.value;
    // TODO: call AuthService.login(email, password, remember)
    console.log('Login attempt', { email, password, remember });

    this.login();

    // simulate finish
    setTimeout(() => {
      this.isLoading = false;
    }, 700);
  }


  login() {
    this.api.post('auth/login', { email: 'shemilkumar@probeplus.in', password: '1234' }).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        // localStorage.setItem('userId', response.data.user_id);
        // localStorage.setItem('role', response.data.role);

        if (response.data.role === 'SA') this.router.navigateByUrl('/super-admin');
        if (['ADM', 'EX'].includes(response.data.role)) this.router.navigateByUrl('/projects');

      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
