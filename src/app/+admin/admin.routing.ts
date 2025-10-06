import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { AdminComponent } from './admin.component';
import { DepartmentsComponent } from './departments/departments.component';
import { EmployeesComponent } from './employees/employees.component';
import { EngagementsComponent } from './engagements/engagements.component';
import { SubjectsComponent } from './subjects/subjects.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: '', component: AdminComponent,
    canActivate: [AuthenticatedGuard],
    children: [
      { path: 'departments', component: DepartmentsComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'subjects', component: SubjectsComponent },
      { path: 'engagements/:employeeId', component: EngagementsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
