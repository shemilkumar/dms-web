import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'pp-widget',
  templateUrl: './pp-widget.component.html',
  styleUrls: ['./pp-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpWidgetComponent {
  @Input() value: any;
  @Input() ppTemplate!: TemplateRef<any>;

  constructor() { }
}
