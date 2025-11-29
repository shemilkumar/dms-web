import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() data: any = {};

  constructor(private router: Router) { }

  goTo(link: string) {
    console.log(link);

    this.router.navigateByUrl(link);
  }

  logout() {

  }
}