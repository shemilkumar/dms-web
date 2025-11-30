import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() data: any = {};

  constructor(private router: Router, private api: ApiService) { }

  goTo(link: string) {
    console.log(link);

    this.router.navigateByUrl(link);
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    const cleanupAndRedirect = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.router.navigateByUrl('/login');
    };

    if (!refreshToken || !accessToken) {
      cleanupAndRedirect();
      return;
    }

    this.api.post('auth/logout', {
      refresh_token: refreshToken,
      access_token: accessToken,
    }).subscribe({
      next: cleanupAndRedirect,
      error: cleanupAndRedirect,
    });
  }

}