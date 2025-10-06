import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { DepartmentModel } from '../../shared/models/department';
import { SubjectModel, SubjectUpsertModel } from '../../shared/models/subject';
import { NotificationService } from '../../shared/services/notification.service';
import { SubjectService } from '../../shared/services/subject.service';

export interface SubjectModalData {
  subject: SubjectModel;
  departments: DepartmentModel[]
}

@Component({
  selector: 'ss-subject-modal',
  templateUrl: './subject-modal.component.html',
  styleUrls: ['./subject-modal.component.scss'],
  standalone: false
})
export class SubjectModalComponent {
  subject: SubjectModel;

  saving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SubjectModalData,
    private dialogRef: MatDialogRef<SubjectModalComponent>,
    private subjectService: SubjectService,
    private notification: NotificationService,
    private translateService: TranslateService
  ) {
    this.subject = structuredClone(data.subject);
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

    if (this.subject.id) {
      this.updateSubject();
    } else {
      this.createSubject();
    }
  }

  private createSubject() {
    const createModel = {
      naziv: this.subject.naziv,
      sifra: this.subject.sifra,
      espb: this.subject.espb,
      katedraId: this.subject.katedraId,
    } as SubjectUpsertModel;

    this.subjectService.createSubject(createModel).subscribe({
      next: async addedSubject => {
        this.saving = false;
        this.dialogRef.close(addedSubject);
        await this.notification.info({ message: `${this.translateService.instant('label.SubjectSaved')}` });
      },
      error: async (errors: any) => {
        await this.notification.info({ message: `${this.translateService.instant('label.SubjectNotSaved')}` });

        this.handleErrors(errors);
      }
    });
  }

  private updateSubject() {
    const updateModel = {
      naziv: this.subject.naziv,
      sifra: this.subject.sifra,
      espb: this.subject.espb,
      katedraId: this.subject.katedraId,
    } as SubjectUpsertModel;

    this.subjectService.updateSubject(this.subject.id, updateModel).subscribe({
      next: updatedSubject => {
        this.saving = false;
        this.dialogRef.close(updatedSubject);
      },
      error: (errors: any) => this.handleErrors(errors)
    });
  }

  private handleErrors(errors: any) {
    this.saving = false;
    this.notification.error({ message: errors.message });
  }
}
