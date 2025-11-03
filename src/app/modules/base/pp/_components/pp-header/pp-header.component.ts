import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'pp-header',
  templateUrl: './pp-header.component.html',
  styleUrls: ['./pp-header.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class PpHeaderComponent {
  @Input() canGoBack: boolean = false;
  @Input() searchAndFilter: boolean = false;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
