import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { TeachingForm } from '../../shared/enums/teaching-form.enum';
import { EmployeeModel } from '../../shared/models/employee';
import { EngagementModel, EngagementUpsertModel } from '../../shared/models/engagement';
import { SubjectModel } from '../../shared/models/subject';
import { EngagementService } from '../../shared/services/engagement.service';
import { NotificationService } from '../../shared/services/notification.service';

export interface EngagementModalData {
  engagement: EngagementModel;
  subjects: SubjectModel[]
  employees: EmployeeModel[]
}

export const YEAR_FORMATS = {
  parse: { dateInput: 'YYYY' },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY'
  },
};

@Component({
  selector: 'ss-engagement-modal',
  templateUrl: './engagement-modal.component.html',
  styleUrls: ['./engagement-modal.component.scss'],
  standalone: false,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: YEAR_FORMATS }
  ]
})
export class EngagementModalComponent implements OnInit {
  engagement: EngagementModel;
  employeeId: string | null = null;

  saving = false;
  teachingFormOptions: TeachingForm[] = [TeachingForm.PREDAVANJA, TeachingForm.VEZBE];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EngagementModalData,
    private dialogRef: MatDialogRef<EngagementModalComponent>,
    private engagementService: EngagementService,
    private notification: NotificationService,
    private dateAdapter: DateAdapter<Date>,
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.engagement = structuredClone(data.engagement);
    this.dateAdapter.setLocale('en');
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params.employeeId;
    });

    if (this.engagement.akademskaGodina) {
      const akademskaGodina = this.engagement.akademskaGodina as number;
      this.engagement.akademskaGodina = new Date();
      this.engagement.akademskaGodina.setFullYear(akademskaGodina);
      this.engagement.akademskaGodina.setMonth(0);
      this.engagement.akademskaGodina.setDate(1);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  saveChanges() {
    this.saving = true;

    if (this.engagement.id) {
      this.updateEngagement();
    } else {
      this.createEngagement();
    }
  }

  chosenYearHandler(normalizedYear: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = new Date();
    ctrlValue.setFullYear(normalizedYear.getFullYear(), 0, 1);
    this.engagement.akademskaGodina = ctrlValue;
    datepicker.close();
  }

  private createEngagement() {
    const createModel = {
      brojCasova: this.engagement.brojCasova,
      uloga: this.engagement.uloga,
      akademskaGodina: (this.engagement.akademskaGodina as Date).getFullYear(),
      predmetId: this.engagement.predmetId,
      zaposleniId: this.engagement.zaposleniId
    } as EngagementUpsertModel;

    this.engagementService.createEngagement(createModel).subscribe({
      next: async addedEngagement => {
        this.saving = false;
        this.dialogRef.close(addedEngagement);
        await this.notification.info({ message: `${this.translateService.instant('label.EngagementSaved')}` });
      },
      error: (errors: any) => this.handleErrors(errors)
    });
  }

  private updateEngagement() {
    const updateModel = {
      brojCasova: this.engagement.brojCasova,
      uloga: this.engagement.uloga,
      akademskaGodina: (this.engagement.akademskaGodina as Date).getFullYear(),
      predmetId: this.engagement.predmetId,
      zaposleniId: this.engagement.zaposleniId
    } as EngagementUpsertModel;

    this.engagementService.updateEngagement(this.engagement.id, updateModel).subscribe({
      next: updatedEngagement => {
        this.saving = false;
        this.dialogRef.close(updatedEngagement);
      },
      error: (errors: any) => this.handleErrors(errors)
    });
  }

  private handleErrors(errors: any) {
    this.saving = false;
    this.notification.error({ message: errors.message });
  }
}
