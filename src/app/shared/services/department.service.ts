import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DepartmentModel, DepartmentUpsertModel } from '../models/department';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly API_ENDPOINT: string = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<DepartmentModel[]> {
    return this.http.get<DepartmentModel[]>(this.API_ENDPOINT, { withCredentials: true });
  }

  createDepartment(model: DepartmentUpsertModel): Observable<DepartmentUpsertModel> {
    return this.http.post<DepartmentUpsertModel>(this.API_ENDPOINT, model);
  }

  updateDepartment(id: string, model: DepartmentUpsertModel): Observable<DepartmentUpsertModel> {
    return this.http.put<DepartmentUpsertModel>(`${this.API_ENDPOINT}/${id}`, model);
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }
}
