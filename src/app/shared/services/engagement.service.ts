import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EngagementModel, EngagementUpsertModel } from '../models/engagement';

@Injectable({ providedIn: 'root' })
export class EngagementService {
  private readonly API_ENDPOINT: string = `${environment.apiUrl}/engagements`;

  constructor(private http: HttpClient) { }

  getEngagements(): Observable<EngagementModel[]> {
    return this.http.get<EngagementModel[]>(this.API_ENDPOINT);
  }

  getEngagementsByEmployeeId(employeeId: string): Observable<EngagementModel[]> {
    return this.http.get<EngagementModel[]>(`${this.API_ENDPOINT}/employees/${employeeId}`);
  }

  createEngagement(model: EngagementUpsertModel): Observable<EngagementUpsertModel> {
    return this.http.post<EngagementUpsertModel>(this.API_ENDPOINT, model);
  }

  updateEngagement(id: string, model: EngagementUpsertModel): Observable<EngagementUpsertModel> {
    return this.http.put<EngagementUpsertModel>(`${this.API_ENDPOINT}/${id}`, model);
  }

  deleteEngagement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }
}
