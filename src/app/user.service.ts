import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRoot, User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = `${environment.backend_route}/users`;
  anotherUserUrl = this.userUrl


  private loginUrl = '${environment.backend_route}/login';

  constructor(private http: HttpClient,
    private cookieService: CookieService,) { }



  getUsers(): Observable<UserRoot> {
    return this.http.get<UserRoot>(`${this.userUrl}`)
      // .pipe(
      //   tap(data => console.log('All: ', JSON.stringify(data))),
      //   catchError(this.handleError)
      // );
  }

  getSingleUser(id: number): Observable<User> {
    //const headers = { 'content-type': 'application/json'}
    // let header = new HttpHeaders().set("Authorization", this.cookieService.get("jwt"))
    // console.log("COOOKKKIEE", this.cookieService.get("jwt"))
    return this.http.get<User>(`${this.userUrl}/${id}`)
    // .pipe(
    //   tap(data => console.log('Single User: ', JSON.stringify(data))),
    //   catchError(this.handleError)
    // );
  }

  postPicture(image: FormData): Observable<FormData> {
    return this.http.post<FormData>(`${this.userUrl}/images`, image, {
      headers: new HttpHeaders()
      .set('content-type', 'form-data')
    })
      //     .pipe(
      //   tap(data => console.log('All: ', JSON.stringify(data))),
      //   catchError(this.handleError)
      // );
  }

  getPicture(imageKey: string): Observable<string> {
    return this.http.get<string>(`${this.userUrl}/images/${imageKey}`);
  } 

  private handleError(err: HttpErrorResponse): Observable<never> {

    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
