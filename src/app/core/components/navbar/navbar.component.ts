import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  logout() {

    const token = localStorage.getItem('refresh_token') || '';

    if (token) {
      this.api.post('auth/logout', { refresh_token: token }).subscribe({
        next: (data: any) => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigateByUrl('/login');
        },
      });
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.router.navigateByUrl('/login');
    }
  }
}