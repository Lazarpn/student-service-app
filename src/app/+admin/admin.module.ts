import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ButtonComponent } from '../shared/button/button.component';
import { InputComponent } from '../shared/components/input/input.component';
import { LaddaModule } from '../shared/components/ladda/ladda.module';
import { IconComponent } from '../shared/icon/icon.component';
import { HttpLoaderFactory } from '../shared/loaders/http-loader-factory';
import { SelectComponent } from '../shared/select/select.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';
import { DepartmentModalComponent } from './department-modal/department-modal.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import { EmployeesComponent } from './employees/employees.component';
import { EngagementModalComponent } from './engagement-modal/engagement-modal.component';
import { EngagementsComponent } from './engagements/engagements.component';
import { SubjectModalComponent } from './subject-modal/subject-modal.component';
import { SubjectsComponent } from './subjects/subjects.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatInputModule,
    AdminRoutingModule,
    MatSortModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatExpansionModule,
    IconComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    LaddaModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    AdminComponent,
    DropdownComponent,
    DepartmentsComponent,
    DepartmentModalComponent,
    SubjectsComponent,
    SubjectModalComponent,
    EmployeesComponent,
    EmployeeModalComponent,
    EngagementsComponent,
    EngagementModalComponent
  ],
})
export class AdminModule { }
