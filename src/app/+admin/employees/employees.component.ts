import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmModalComponent, ConfirmModalDialogData } from '../../shared/components/confirm-modal/confirm-modal.component';
import { DepartmentModel } from '../../shared/models/department';
import { EmployeeModel } from '../../shared/models/employee';
import { DepartmentService } from '../../shared/services/department.service';
import { EmployeeService } from '../../shared/services/employee.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UtilityService } from '../../shared/services/utility.service';
import { EmployeeModalComponent, EmployeeModalData } from '../employee-modal/employee-modal.component';

@Component({
  selector: 'ss-employees',
  templateUrl: './employees.component.html',
  styleUrls: [
    './employees.component.scss',
    '../../../scss/pages/admin.scss'
  ],
  standalone: false
})
export class EmployeesComponent implements OnInit {
  employees: EmployeeModel[] = [];
  departments: DepartmentModel[] = [];
  departmentId: string;
  loading = false;

  currentSortOption: 'ime' | 'prezime' | 'email' | 'zvanje' | 'datumZaposlenja';
  currentSortIsDescending = false;
  searchTerm = '';
  removeLoading = false;

  detailsDropdown = {
    shown: false,
    activeEmployee: {} as EmployeeModel,
    open: (employee: EmployeeModel, event: MouseEvent) => {
      event.stopPropagation();
      this.detailsDropdown.activeEmployee = employee;
      this.detailsDropdown.shown = true;
    },
    toggle: (employee: EmployeeModel, event: MouseEvent) => {
      event.stopPropagation();
      if (this.detailsDropdown.shown && this.detailsDropdown.activeEmployee === employee) {
        this.detailsDropdown.close();
      } else {
        this.detailsDropdown.open(employee, event);
      }
    },
    close: () => {
      this.detailsDropdown.shown = false;
    }
  };

  constructor(
    private notification: NotificationService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(query => {
      this.departmentId = query.departmentId;
      this.loadEmployees();
    });
  }

  departmentFilterChanged() {
    this.router.navigate(['/home/employees'], {
      queryParams: { departmentId: this.departmentId },
    });
  }

  loadEmployees() {
    this.loading = true;

    if (!this.departments || this.departments.length === 0) {
      this.departmentService.getDepartments().subscribe({
        next: departments => {
          this.departments = departments;

          this.employeeService.getEmployees().subscribe({
            next: employees => {
              if (this.departmentId) {
                this.employees = employees.filter(s => s.katedraId === this.departmentId);
              } else {
                this.employees = employees;
              }

              this.loading = false;
            },
            error: (errors: any) => this.handleErrors(errors)
          });
        },
        error: (errors: any) => this.handleErrors(errors)
      });
    } else {
      this.employeeService.getEmployees().subscribe({
        next: employees => {
          if (this.departmentId) {
            this.employees = employees.filter(s => s.katedraId === this.departmentId);
          } else {
            this.employees = employees;
          }
          this.loading = false;
        },
        error: (errors: any) => this.handleErrors(errors)
      });
    }
  }

  getEmployees() {
    const sortedResult = this.utilityService.sort(this.employees, this.currentSortOption, this.currentSortIsDescending);

    if (!this.searchTerm) {
      return sortedResult;
    }

    return sortedResult.filter(employee => {
      const search = this.searchTerm.trim().toLowerCase();
      return employee.ime?.toLowerCase().includes(search);
    });
  }

  sortBy(sortOption: 'ime' | 'prezime' | 'email'
    | 'zvanje' | 'datumZaposlenja') {
    if (this.currentSortOption === sortOption) {
      this.currentSortIsDescending = !this.currentSortIsDescending;
    } else {
      this.currentSortOption = sortOption;
      this.currentSortIsDescending = false;
    }
  }

  openEmployeeModal(employee: EmployeeModel | null, event: MouseEvent) {
    event.stopPropagation();

    if (!employee) {
      employee = {} as EmployeeModel;

      if (this.departmentId) {
        employee.katedraId = this.departmentId;
      }
    }

    const dialogRef = this.dialog.open(EmployeeModalComponent, {
      panelClass: 'fullscreen-dialog',
      width: '600px',
      data: { employee, departments: this.departments } as EmployeeModalData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const savedEmployee = result as EmployeeModel;
        const existingEmployee = this.employees.find(c => c.id === savedEmployee.id);

        if (existingEmployee) {
          existingEmployee.ime = savedEmployee.ime;
          existingEmployee.prezime = savedEmployee.prezime;
          existingEmployee.email = savedEmployee.email;
          existingEmployee.jmbg = savedEmployee.jmbg;
          existingEmployee.zvanje = savedEmployee.zvanje;
          existingEmployee.datumZaposlenja = savedEmployee.datumZaposlenja;
          existingEmployee.katedraId = savedEmployee.katedraId;
        } else if (savedEmployee.katedraId === this.departmentId || !this.departmentId) {
          this.employees.push(savedEmployee);
        }

        this.searchTerm = '';
        this.router.navigate(['/home/employees'], { queryParams: { departmentId: null } });
      }
    });
  }

  manageEngagements(employee: EmployeeModel, event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate([`home/engagements/${employee.id}`]);
  }

  openRemoveConfirmModal(employee: EmployeeModel, event: MouseEvent) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      panelClass: 'fullscreen-dialog',
      data: {
        modalTitle: `${this.translateService.instant('label.Are you sure?')}`,
        description: 'RemoveEmployee',
        confirmButtonLabel: `${this.translateService.instant('label.Remove')}`
      } as ConfirmModalDialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onRemoveEmployee(employee);
      }
    });
  }

  private onRemoveEmployee(employee: EmployeeModel) {
    this.removeLoading = true;

    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        const indexToRemove = this.employees.indexOf(employee);
        this.employees.splice(indexToRemove, 1);
        this.removeLoading = false;
      },
      error: (errors: any) => this.handleErrors(errors)
    });
  }

  private handleErrors(errors: any) {
    this.loading = false;
    this.removeLoading = false;
    this.notification.error({ message: errors.message });
  }
}
