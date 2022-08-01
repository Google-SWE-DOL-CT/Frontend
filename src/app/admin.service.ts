import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminInput, AdminInputRoot, AdminRoot } from './admin-data';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminUrl = `${environment.backend_route}/admin`;

  constructor(private http: HttpClient) { }

  getApproval(): Observable<AdminRoot> {
    return this.http.get<AdminRoot>(`${this.adminUrl}`)
      // .pipe(
      //   tap(data => console.log('All: ', JSON.stringify(data))),
      //   catchError(this.handleError)
      // );
  }

  getSingleAdminAction(userId: number, jfId: number, subId: number): Observable<AdminInputRoot> {
    return this.http.get<AdminInputRoot>(`${this.adminUrl}/users/${userId}/jobFunction/${jfId}/subFunction/${subId}`)
  }

}
