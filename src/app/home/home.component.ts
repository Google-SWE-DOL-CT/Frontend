import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';

@Component({
  selector: 'app-banner',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoginPage!: boolean;
  isAdmin!: number;
  userId!: number;

  profileLink!: string;

  hasUserData = false;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    const currentURL = window.location.pathname;

    if ((currentURL.split('/')[1] == 'login') || (currentURL.split('/')[1] == '')) {
      this.isLoginPage = true;
    } else {
      this.isLoginPage = false
    }
  }

  myProfile(): void {
    window.location.href = this.profileLink
  }

  switchRole(): void {
    // const helper = new JwtHelperService();
    // const decodedToken = helper.decodeToken(this.cookieService.get('jwt'));
    const id = this.cookieService.get('uid')
    // console.log("Before: " + decodedToken.isAdmin)

    this.http.get(`${environment.backend_route}/users/switchAdmin/${id}`).subscribe(data => console.log(data));
    // const newId = helper.decodeToken(this.cookieService.get('jwt'))
    // console.log("After: " + newId.isAdmin)
    window.location.href = `${environment.backend_route}/login/github`;
  }

  ngOnDestroy(): void {
  }

}
