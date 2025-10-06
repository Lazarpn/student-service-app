import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SubjectModel, SubjectUpsertModel } from '../models/subject';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly API_ENDPOINT: string = `${environment.apiUrl}/subjects`;

  constructor(private http: HttpClient) { }

  getSubjects(): Observable<SubjectModel[]> {
    return this.http.get<SubjectModel[]>(this.API_ENDPOINT);
  }

  createSubject(model: SubjectUpsertModel): Observable<SubjectUpsertModel> {
    return this.http.post<SubjectUpsertModel>(this.API_ENDPOINT, model);
  }

  updateSubject(id: string, model: SubjectUpsertModel): Observable<SubjectUpsertModel> {
    return this.http.put<SubjectUpsertModel>(`${this.API_ENDPOINT}/${id}`, model);
  }

  deleteSubject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }
}
