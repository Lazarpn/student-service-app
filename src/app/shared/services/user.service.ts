import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginationRequestModel, PaginationResponseModel } from '../models/pagination';
import { UserAdminCreateModel, UserAdminModel, UserAdminUpdateModel, UserShortModel } from '../models/user';
import { UtilityService } from './utility.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API_ENDPOINT: string = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) { }

  search(paginationRequestModel: PaginationRequestModel): Observable<PaginationResponseModel<UserAdminModel>> {
    return this.http.post<PaginationResponseModel<UserAdminModel>>(`${this.API_ENDPOINT}/search`, paginationRequestModel);
  }

  searchActive(searchTerm: string): Observable<UserShortModel[]> {
    return this.http.get<UserShortModel[]>(`${this.API_ENDPOINT}/search-active?searchTerm=${searchTerm}`);
  }

  addUser(model: UserAdminCreateModel): Observable<UserAdminModel> {
    const formData = this.utilityService.createFormData(model);
    return this.http.post<UserAdminModel>(this.API_ENDPOINT, formData);
  }

  updateUser(userId: string, model: UserAdminUpdateModel): Observable<UserAdminModel> {
    const formData = this.utilityService.createFormData(model);
    return this.http.put<UserAdminModel>(`${this.API_ENDPOINT}/${userId}`, formData);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_ENDPOINT}/${userId}`);
  }
}
