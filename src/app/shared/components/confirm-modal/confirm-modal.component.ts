import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ButtonComponent } from '../../button/button.component';
import { IconComponent } from '../icon/icon.component';

export interface ConfirmModalDialogData {
  modalTitle: string;
  description: string;
  descriptionParams: any;
  confirmButtonLabel: string;
  cancelButtonLabel?: string;
  additionalButtonLabel?: string;
  checkboxLabel?: string;
  hideCancelButton?: boolean;
  additionalButtonCallback?: () => void;
  errors?: any;
}

export interface DialogResultWithCheckbox {
  dialogResult: boolean,
  checkboxValue: boolean
}

@Component({
  selector: 'ss-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  imports: [ButtonComponent, IconComponent, TranslatePipe, CommonModule, MatCheckboxModule, FormsModule, MatDialogModule]
})
export class ConfirmModalComponent {

  modalTitle: string;
  description: string;
  descriptionParams: any;
  errors: any = [];
  confirmButtonLabel: string;
  cancelButtonLabel = 'Close';
  additionalButtonLabel?: string;
  checkboxLabel?: string;
  hideCancelButton = false;
  additionalButtonCallback = () => { };

  checkboxValue: boolean | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmModalDialogData,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<ConfirmModalComponent>
  ) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = (data as any)[key];
        (this as any)[key] = element;
      }
    }
    this.cancelButtonLabel = data.cancelButtonLabel || this.translateService.instant('label.Close');
    this.hideCancelButton = data.hideCancelButton || false;
    this.errors = data.errors || [];
    this.checkboxValue = this.checkboxLabel ? false : undefined;
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onCancel();
    }
  }

  onConfirm() {
    if (this.checkboxLabel !== undefined) {
      this.dialogRef.close({ dialogResult: true, checkboxValue: this.checkboxValue } as DialogResultWithCheckbox);
      return;
    }

    this.dialogRef.close(true);
  }

  onCancel() {
    if (this.checkboxLabel !== undefined) {
      this.dialogRef.close({ dialogResult: false, checkboxValue: this.checkboxValue } as DialogResultWithCheckbox);
      return;
    }

    this.dialogRef.close(false);
    this.errors = [];
  }
}
