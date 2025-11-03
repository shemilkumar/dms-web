import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent {

  constructor() { }

  @Input() data: any;
  @Input() isFormValid?: boolean | string = true;
  @Input() loading?: boolean | null = false;
  @Input() noButton?: boolean | null = true;

  @Output() onSubmit = new EventEmitter;
  @Output() onCancel = new EventEmitter;
  @Output() onClose = new EventEmitter;

  ngOnInit() { }

  cancel(): void {
    this.onCancel.emit();
  }

  submit(): void {
    this.onSubmit.emit();
  }

  close(): void {
    this.onClose.emit();
  }
}
