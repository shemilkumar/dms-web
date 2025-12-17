import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  role: string = 'EX'

  ngOnInit() {
    this.role = localStorage.getItem('role') || 'EX';
  }

  logout() {

    const token = localStorage.getItem('refresh_token') || '';

    if (token) this.api.post('auth/logout', { refresh_token: token }).subscribe();

    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}