import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmModalComponent, ConfirmModalDialogData } from '../../shared/components/confirm-modal/confirm-modal.component';
import { DepartmentModel } from '../../shared/models/department';
import { DepartmentService } from '../../shared/services/department.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UtilityService } from '../../shared/services/utility.service';
import { DepartmentModalComponent } from '../department-modal/department-modal.component';

@Component({
  selector: 'ss-departments',
  templateUrl: './departments.component.html',
  styleUrls: [
    './departments.component.scss',
    '../../../scss/pages/admin.scss'
  ],
  standalone: false
})
export class DepartmentsComponent implements OnInit {
  departments: DepartmentModel[] = [];
  loading = false;

  currentSortOption: 'naziv' | 'sifra';
  currentSortIsDescending = false;
  searchTerm = '';
  removeLoading = false;

  detailsDropdown = {
    shown: false,
    activeDepartment: {} as DepartmentModel,
    open: (department: DepartmentModel, event: MouseEvent) => {
      event.stopPropagation();
      this.detailsDropdown.activeDepartment = department;
      this.detailsDropdown.shown = true;
    },
    toggle: (department: DepartmentModel, event: MouseEvent) => {
      event.stopPropagation();
      if (this.detailsDropdown.shown && this.detailsDropdown.activeDepartment === department) {
        this.detailsDropdown.close();
      } else {
        this.detailsDropdown.open(department, event);
      }
    },
    close: () => {
      this.detailsDropdown.shown = false;
    }
  };

  constructor(
    private notification: NotificationService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private router: Router,
    private utilityService: UtilityService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading = true;

    this.departmentService.getDepartments().subscribe({
      next: departments => this.departments = departments,
      error: (errors: any) => this.handleErrors(errors),
      complete: () => this.loading = false
    });
  }

  getDepartments() {
    const sortedResult = this.utilityService.sort(this.departments, this.currentSortOption, this.currentSortIsDescending);

    if (!this.searchTerm) {
      return sortedResult;
    }

    return sortedResult.filter(department => {
      const search = this.searchTerm.trim().toLowerCase();
      return department.naziv?.toLowerCase().includes(search);
    });
  }

  sortBy(sortOption: 'naziv' | 'sifra') {
    if (this.currentSortOption === sortOption) {
      this.currentSortIsDescending = !this.currentSortIsDescending;
    } else {
      this.currentSortOption = sortOption;
      this.currentSortIsDescending = false;
    }
  }

  goToEmployees(departmentId: string) {
    this.router.navigate(['home/employees'], { queryParams: { departmentId } });
  }

  goToSubjects(departmentId: string) {
    this.router.navigate(['home/subjects'], { queryParams: { departmentId } });
  }

  openDepartmentModal(department: DepartmentModel | null, event: MouseEvent) {
    event.stopPropagation();

    if (!department) {
      department = {} as DepartmentModel;
    }

    const dialogRef = this.dialog.open(DepartmentModalComponent, {
      panelClass: 'fullscreen-dialog',
      width: '600px',
      data: department
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const savedDepartment = result as DepartmentModel;
        const existingDepartment = this.departments.find(c => c.id === savedDepartment.id);

        if (existingDepartment) {
          existingDepartment.naziv = savedDepartment.naziv;
          existingDepartment.sifra = savedDepartment.sifra;
        } else {
          this.departments.push(savedDepartment);
        }

        this.searchTerm = '';
      }
    });
  }

  openRemoveConfirmModal(department: DepartmentModel, event: MouseEvent) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      panelClass: 'fullscreen-dialog',
      data: {
        modalTitle: `${this.translateService.instant('label.Are you sure?')}`,
        description: 'RemoveDepartment',
        confirmButtonLabel: `${this.translateService.instant('label.Remove')}`
      } as ConfirmModalDialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onRemoveDepartment(department);
      }
    });
  }

  private onRemoveDepartment(department: DepartmentModel) {
    this.removeLoading = true;

    this.departmentService.deleteDepartment(department.id).subscribe({
      next: () => {
        this.removeLoading = false;
        const indexToRemove = this.departments.indexOf(department);
        this.departments.splice(indexToRemove, 1);
      },
      error: (errors: any) => this.handleErrors(errors)
    });
  }

  private handleErrors(errors: any) {
    this.removeLoading = false;
    this.loading = false;
    this.notification.error({ message: errors.message });
  }
}
