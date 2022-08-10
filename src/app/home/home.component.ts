import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
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
  userId!: number

  profileLink!: string

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    const currentURL = window.location.pathname;
    console.log("HERE IS THE LOGIN PAGE")
    this.http.get('https://serene-inlet-74805.herokuapp.com/api/login/github/callback').subscribe(data => console.log("DATA!",data));

    if ((currentURL.split('/')[1] == 'login') || (currentURL.split('/')[1] == '')) {
      this.isLoginPage = true;
    } else {
      this.isLoginPage = false
      const helper = new JwtHelperService();
  
      const decodedToken = helper.decodeToken(this.cookieService.get('jwt'));
      if (decodedToken) {
        this.userId = decodedToken.id;
        this.isAdmin = decodedToken.isAdmin
        console.log(this.isAdmin)
        if (decodedToken.isAdmin == 1) {
          this.profileLink = `http://localhost:4200/users/${this.userId}/admin-dashboard`
        } else {
          this.profileLink = `http://localhost:4200/users/${this.userId}`
        }
      } else {
        window.location.href = 'http://localhost:4200/login';
      }
    }

  }

  myProfile(): void {
    window.location.href = this.profileLink
  }

  switchRole(): void {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.cookieService.get('jwt'));
    const id = decodedToken.id
    console.log("Before: " + decodedToken.isAdmin)

    this.http.get(`${environment.backend_route}/users/switchAdmin/${id}`).subscribe(data => console.log(data));
    const newId = helper.decodeToken(this.cookieService.get('jwt'))
    console.log("After: " + newId.isAdmin)
    window.location.href = `${environment.backend_route}/login/github`;
  }

  ngOnDestroy(): void {
  }

}
