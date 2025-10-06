import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmModalComponent, ConfirmModalDialogData } from '../../shared/components/confirm-modal/confirm-modal.component';
import { DepartmentModel } from '../../shared/models/department';
import { SubjectModel } from '../../shared/models/subject';
import { DepartmentService } from '../../shared/services/department.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SubjectService } from '../../shared/services/subject.service';
import { UtilityService } from '../../shared/services/utility.service';
import { SubjectModalComponent, SubjectModalData } from '../subject-modal/subject-modal.component';

@Component({
  selector: 'ss-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: [
    './subjects.component.scss',
    '../../../scss/pages/admin.scss'
  ],
  standalone: false
})
export class SubjectsComponent implements OnInit {
  subjects: SubjectModel[] = [];
  departments: DepartmentModel[] = [];
  departmentId: string;
  loading = false;

  currentSortOption: 'naziv' | 'espb' | 'sifra';
  currentSortIsDescending = false;
  searchTerm = '';
  removeLoading = false;

  detailsDropdown = {
    shown: false,
    activeSubject: {} as SubjectModel,
    open: (subject: SubjectModel, event: MouseEvent) => {
      event.stopPropagation();
      this.detailsDropdown.activeSubject = subject;
      this.detailsDropdown.shown = true;
    },
    toggle: (subject: SubjectModel, event: MouseEvent) => {
      event.stopPropagation();
      if (this.detailsDropdown.shown && this.detailsDropdown.activeSubject === subject) {
        this.detailsDropdown.close();
      } else {
        this.detailsDropdown.open(subject, event);
      }
    },
    close: () => {
      this.detailsDropdown.shown = false;
    }
  };

  constructor(
    private notification: NotificationService,
    private subjectService: SubjectService,
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
      this.loadSubjects();
    });
  }

  departmentFilterChanged() {
    this.router.navigate(['/home/subjects'], {
      queryParams: { departmentId: this.departmentId },
    });
  }

  loadSubjects() {
    this.loading = true;

    if (!this.departments || this.departments.length === 0) {
      this.departmentService.getDepartments().subscribe({
        next: departments => {
          this.departments = departments;

          this.subjectService.getSubjects().subscribe({
            next: subjects => {
              if (this.departmentId) {
                this.subjects = subjects.filter(s => s.katedraId === this.departmentId);
              } else {
                this.subjects = subjects;
              }

              this.loading = false;
            },
            error: (errors: any) => this.handleErrors(errors)
          });
        },
        error: (errors: any) => this.handleErrors(errors)
      });
    } else {
      this.subjectService.getSubjects().subscribe({
        next: subjects => {
          if (this.departmentId) {
            this.subjects = subjects.filter(s => s.katedraId === this.departmentId);
          } else {
            this.subjects = subjects;
          }

          this.loading = false;
        },
        error: (errors: any) => this.handleErrors(errors)
      });
    }
  }

  getSubjects() {
    const sortedResult = this.utilityService.sort(this.subjects, this.currentSortOption, this.currentSortIsDescending);

    if (!this.searchTerm) {
      return sortedResult;
    }

    return sortedResult.filter(subject => {
      const search = this.searchTerm.trim().toLowerCase();
      return subject.naziv?.toLowerCase().includes(search);
    });
  }

  sortBy(sortOption: 'naziv' | 'espb' | 'sifra') {
    if (this.currentSortOption === sortOption) {
      this.currentSortIsDescending = !this.currentSortIsDescending;
    } else {
      this.currentSortOption = sortOption;
      this.currentSortIsDescending = false;
    }
  }

  openSubjectModal(subject: SubjectModel | null, event: MouseEvent) {
    event.stopPropagation();

    if (!subject) {
      subject = {} as SubjectModel;

      if (this.departmentId) {
        subject.katedraId = this.departmentId;
      }
    }

    const dialogRef = this.dialog.open(SubjectModalComponent, {
      panelClass: 'fullscreen-dialog',
      width: '600px',
      data: { subject, departments: this.departments } as SubjectModalData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const savedSubject = result as SubjectModel;
        const existingSubject = this.subjects.find(c => c.id === savedSubject.id);

        if (existingSubject) {
          existingSubject.naziv = savedSubject.naziv;
          existingSubject.espb = savedSubject.espb;
          existingSubject.sifra = savedSubject.sifra;
          existingSubject.katedraId = savedSubject.katedraId;

        } else if (savedSubject.katedraId === this.departmentId || !this.departmentId) {
          this.subjects.push(savedSubject);
        }

        this.searchTerm = '';
        this.router.navigate(['/home/subjects'], { queryParams: { departmentId: null } });
      }
    });
  }

  async openRemoveConfirmModal(subject: SubjectModel, event: MouseEvent) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      panelClass: 'fullscreen-dialog',
      data: {
        modalTitle: `${this.translateService.instant('label.Are you sure?')}`,
        description: 'RemoveSubject',
        confirmButtonLabel: `${this.translateService.instant('label.Remove')}`
      } as ConfirmModalDialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onRemoveSubject(subject);
      }
    });
  }

  private onRemoveSubject(subject: SubjectModel) {
    this.removeLoading = true;

    this.subjectService.deleteSubject(subject.id).subscribe({
      next: () => {
        const indexToRemove = this.subjects.indexOf(subject);
        this.subjects.splice(indexToRemove, 1);
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
