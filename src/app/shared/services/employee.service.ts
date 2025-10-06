import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EmployeeModel, EmployeeUpsertModel } from '../models/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly API_ENDPOINT: string = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(this.API_ENDPOINT);
  }

  createEmployee(model: EmployeeUpsertModel): Observable<EmployeeUpsertModel> {
    return this.http.post<EmployeeUpsertModel>(this.API_ENDPOINT, model);
  }

  updateEmployee(id: string, model: EmployeeUpsertModel): Observable<EmployeeUpsertModel> {
    return this.http.put<EmployeeUpsertModel>(`${this.API_ENDPOINT}/${id}`, model);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }
}
