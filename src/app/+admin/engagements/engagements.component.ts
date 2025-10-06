import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { forkJoin } from 'rxjs';

import { ConfirmModalComponent, ConfirmModalDialogData } from '../../shared/components/confirm-modal/confirm-modal.component';
import { EmployeeModel } from '../../shared/models/employee';
import { EngagementModel } from '../../shared/models/engagement';
import { SubjectModel } from '../../shared/models/subject';
import { EmployeeService } from '../../shared/services/employee.service';
import { EngagementService } from '../../shared/services/engagement.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SubjectService } from '../../shared/services/subject.service';
import { UtilityService } from '../../shared/services/utility.service';
import { EngagementModalComponent, EngagementModalData } from '../engagement-modal/engagement-modal.component';

@Component({
  selector: 'ss-engagements',
  templateUrl: './engagements.component.html',
  styleUrls: [
    './engagements.component.scss',
    '../../../scss/pages/admin.scss'
  ],
  standalone: false
})
export class EngagementsComponent implements OnInit {
  engagements: EngagementModel[] = [];

  subjects: SubjectModel[] = [];
  subjectId: string;

  employees: EmployeeModel[] = [];
  employeeId: string;
  employee: EmployeeModel;

  loading = false;

  currentSortOption: 'zaposleniIme' | 'predmetNaziv' | 'brojCasova' | 'uloga' | 'akademskaGodina';
  currentSortIsDescending = false;
  searchTerm = '';
  removeLoading = false;

  detailsDropdown = {
    shown: false,
    activeEngagement: {} as EngagementModel,
    open: (engagement: EngagementModel, event: MouseEvent) => {
      event.stopPropagation();
      this.detailsDropdown.activeEngagement = engagement;
      this.detailsDropdown.shown = true;
    },
    toggle: (engagement: EngagementModel, event: MouseEvent) => {
      event.stopPropagation();
      if (this.detailsDropdown.shown && this.detailsDropdown.activeEngagement === engagement) {
        this.detailsDropdown.close();
      } else {
        this.detailsDropdown.open(engagement, event);
      }
    },
    close: () => {
      this.detailsDropdown.shown = false;
    }
  };

  constructor(
    private notification: NotificationService,
    private engagementService: EngagementService,
    private employeeService: EmployeeService,
    private subjectService: SubjectService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params.employeeId;
      this.loadEngagements();
    });
  }

  loadEngagements() {
    this.loading = true;

    if (!this.employees || this.employees.length === 0 || !this.subjects || this.subjects.length === 0) {
      forkJoin({
        subjects: this.subjectService.getSubjects(),
        employees: this.employeeService.getEmployees()
      }).subscribe(({ subjects, employees }) => {
        this.subjects = subjects;
        this.employees = employees;
        this.employee = this.employees.find(e => e.id === this.employeeId);

        this.engagementService.getEngagementsByEmployeeId(this.employeeId).subscribe({
          next: engagements => {
            this.loading = false;
            this.engagements = engagements;
          },
          error: (errors: any) => this.handleErrors(errors)
        });
      });
    } else {
      this.engagementService.getEngagementsByEmployeeId(this.employeeId).subscribe({
        next: engagements => {
          this.loading = false;
          this.engagements = engagements;
        },
        error: (errors: any) => this.handleErrors(errors)
      });
    }
  }

  getEngagements() {
    const sortedResult = this.utilityService.sort(this.engagements, this.currentSortOption, this.currentSortIsDescending);

    if (!this.searchTerm) {
      return sortedResult;
    }

    return sortedResult.filter(engagement => {
      const search = this.searchTerm.trim().toLowerCase();
      return engagement.predmetNaziv?.toLowerCase().includes(search);
    });
  }

  sortBy(sortOption: 'zaposleniIme' | 'predmetNaziv' | 'brojCasova' | 'uloga' | 'akademskaGodina') {
    if (this.currentSortOption === sortOption) {
      this.currentSortIsDescending = !this.currentSortIsDescending;
    } else {
      this.currentSortOption = sortOption;
      this.currentSortIsDescending = false;
    }
  }

  openEngagementModal(engagement: EngagementModel | null, event: MouseEvent) {
    event.stopPropagation();

    if (!engagement) {
      engagement = {} as EngagementModel;

      if (this.subjectId) {
        engagement.predmetId = this.subjectId;
      }

      if (this.employeeId) {
        engagement.zaposleniId = this.employeeId;
      }
    }

    const dialogRef = this.dialog.open(EngagementModalComponent, {
      panelClass: 'fullscreen-dialog',
      width: '600px',
      data: {
        engagement,
        subjects: this.subjects,
        employees: this.employees
      } as EngagementModalData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const savedEngagement = result as EngagementModel;
        const existingEngagement = this.engagements.find(c => c.id === savedEngagement.id);

        if (existingEngagement) {
          existingEngagement.brojCasova = savedEngagement.brojCasova;
          existingEngagement.uloga = savedEngagement.uloga;
          existingEngagement.akademskaGodina = savedEngagement.akademskaGodina;
          existingEngagement.predmetId = savedEngagement.predmetId;
          existingEngagement.zaposleniId = savedEngagement.zaposleniId;
        } else {
          this.engagements.push(savedEngagement);
        }

        this.searchTerm = '';
      }
    });
  }

  openRemoveConfirmModal(engagement: EngagementModel, event: MouseEvent) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      panelClass: 'fullscreen-dialog',
      data: {
        modalTitle: `${this.translateService.instant('label.Are you sure?')}`,
        description: 'RemoveEngagement',
        confirmButtonLabel: `${this.translateService.instant('label.Remove')}`
      } as ConfirmModalDialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onRemoveEngagement(engagement);
      }
    });
  }

  private onRemoveEngagement(engagement: EngagementModel) {
    this.removeLoading = true;

    this.engagementService.deleteEngagement(engagement.id).subscribe({
      next: () => {
        const indexToRemove = this.engagements.indexOf(engagement);
        this.engagements.splice(indexToRemove, 1);
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
