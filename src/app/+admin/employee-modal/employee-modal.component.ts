import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { EmployeeTitle } from '../../shared/enums/employee-title.enum';
import { DepartmentModel } from '../../shared/models/department';
import { EmployeeModel, EmployeeUpsertModel } from '../../shared/models/employee';
import { EmployeeService } from '../../shared/services/employee.service';
import { NotificationService } from '../../shared/services/notification.service';

export interface EmployeeModalData {
  employee: EmployeeModel;
  departments: DepartmentModel[]
}

@Component({
  selector: 'ss-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.scss'],
  standalone: false
})
export class EmployeeModalComponent {
  employee: EmployeeModel;

  saving = false;

  titles: EmployeeTitle[] = [EmployeeTitle.REDOVNI_PROFESOR, EmployeeTitle.ASISTENT, EmployeeTitle.VANDREDNI_PROFESOR];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EmployeeModalData,
    private dialogRef: MatDialogRef<EmployeeModalComponent>,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private translateService: TranslateService
  ) {
    this.employee = structuredClone(data.employee);
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

    if (this.employee.id) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }
  }

  private createEmployee() {
    const createModel = {
      ime: this.employee.ime,
      prezime: this.employee.prezime,
      email: this.employee.email,
      datumZaposlenja: this.employee.datumZaposlenja,
      jmbg: this.employee.jmbg,
      zvanje: this.employee.zvanje,
      katedraId: this.employee.katedraId
    } as EmployeeUpsertModel;
    this.employeeService.createEmployee(createModel).subscribe({
      next: async addedEmployee => {
        this.saving = false;
        this.dialogRef.close(addedEmployee);
        await this.notification.info({ message: `${this.translateService.instant('label.EmployeeSaved')}` });
      },
      error: (errors: any) => this.handleErrors(errors)
    });
  }

  private updateEmployee() {
    const updateModel = {
      ime: this.employee.ime,
      prezime: this.employee.prezime,
      email: this.employee.email,
      datumZaposlenja: this.employee.datumZaposlenja,
      jmbg: this.employee.jmbg,
      zvanje: this.employee.zvanje,
      katedraId: this.employee.katedraId
    } as EmployeeUpsertModel;

    this.employeeService.updateEmployee(this.employee.id, updateModel).subscribe({
      next: updatedEmployee => {
        this.saving = false;
        this.dialogRef.close(updatedEmployee);
      },
      error: (errors: any) => this.handleErrors(errors)
    });
  }

  private handleErrors(errors: any) {
    this.saving = false;
    this.notification.error({ message: errors.message });

  }
}
