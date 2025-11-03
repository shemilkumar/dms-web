import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() variant: 'primary' | 'error' | 'success' | 'outline' | 'outline-icon' | 'outline-icon-error' | 'outline-icon-neutral' | 'outline-icon-success' | 'outline-with-icon-error' | 'outline-with-icon-neutral' | 'full-success' | 'outline-with-icon-success' = 'primary';
  @Input() type: 'normal' | 'add' | 'icon' | 'with-icon' = 'normal';
  @Input() iconSrc?: string = '';
  @Input() label: string = 'Button';
  @Input() disabled: boolean = false;
  @Input() loading?: boolean | null = false;
  @Input() fullWidth: boolean = false;

  @Input() class?: string = '';

  @Output() onClick = new EventEmitter();

  handleClick() {
    if (!this.disabled && !this.loading) {
      this.onClick.emit();
    }
  }
}
