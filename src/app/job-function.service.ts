import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { JobFunc, JobFunctionRoot } from './job-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobFunctionService {

  private jfUrl = `${environment.backend_route}/jobFunctions`;

  constructor(private http: HttpClient) { }

  getJobFunctions(): Observable<JobFunctionRoot> {
    return this.http.get<JobFunctionRoot>(`${this.jfUrl}`)
      // .pipe(
      //   tap(data => console.log('All: ', JSON.stringify(data))),
      //   catchError(this.handleError)
      // );
  }

  getSingleJobFunction(id: number): Observable<JobFunc> {
    return this.http.get<JobFunc>(`${this.jfUrl}/${id}`)
  }

  getAllJobFunctionData(): Observable<JobFunctionRoot> {
    return this.http.get<JobFunctionRoot>(`${this.jfUrl}/subtasks`)
  }


  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
