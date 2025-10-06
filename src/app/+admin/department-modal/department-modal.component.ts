import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { DepartmentModel, DepartmentUpsertModel } from '../../shared/models/department';
import { DepartmentService } from '../../shared/services/department.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'ss-department-modal',
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.scss'],
  standalone: false
})
export class DepartmentModalComponent {
  department: DepartmentModel;

  saving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DepartmentModel,
    private dialogRef: MatDialogRef<DepartmentModalComponent>,
    private departmentService: DepartmentService,
    private notification: NotificationService,
    private translateService: TranslateService
  ) {
    this.department = structuredClone(data);
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  saveChanges() {
    this.saving = true;

    if (this.department.id) {
      this.updateDepartment();
    } else {
      this.createDepartment();
    }
  }

  private createDepartment() {
    const createModel = {
      naziv: this.department.naziv,
      sifra: this.department.sifra
    } as DepartmentUpsertModel;

    this.departmentService.createDepartment(createModel).subscribe({
      next: async addedDepartment => {
        this.saving = false;
        this.dialogRef.close(addedDepartment);
        await this.notification.info({ message: `${this.translateService.instant('label.DepartmentSaved')}` });
      },
      error: (errors: any) => this.handleErrors(errors)
    });
  }

  private updateDepartment() {
    const updateModel = {
      naziv: this.department.naziv,
      sifra: this.department.sifra
    } as DepartmentUpsertModel;

    this.departmentService.updateDepartment(this.department.id, updateModel).subscribe({
      next: updatedDepartment => {
        this.saving = false;
        this.dialogRef.close(updatedDepartment);
      },
      error: (errors: any) => this.handleErrors(errors)
    });
  }

  private handleErrors(errors: any) {
    this.saving = false;
    this.notification.error({ message: errors.message });
  }
}
