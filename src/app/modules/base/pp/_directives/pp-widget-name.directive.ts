import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ppWidgetName]'
})
export class PpWidgetNameDirective {
  @Input() type: string = '';
  @Input() ppWidgetName: string = '';

  constructor(public template: TemplateRef<any>) { }

  getName(): string {
    return this.ppWidgetName;
  }
  getType(): string {
    return this.type;
  }
}
