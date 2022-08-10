// import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';
// import {CookieService} from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  // isLoginPage!: boolean;
  // userLogin = new User();
  // loginUrl = 'http://localhost:8080/api/login';


  userEmail = new FormControl();
  userPassword = new FormControl();
  constructor(
    private router: Router,
    // private http: HttpClient,
    // private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
  }

  githubLogin() {
    window.location.href = `${environment.backend_route}/login/github`;
  }
  
  // loginCheck(): void {
  //   this.userLogin.email = this.userEmail.value;
  //   this.userLogin.password = this.userPassword.value;
  //   let userId = 0
  //   let admin = 0
  //   const headers = { 'content-type': 'application/json'}  
  //   const body=JSON.stringify(this.userLogin);
  //   this.http.post<User>(`${this.loginUrl}`, body, {'headers': headers}).subscribe({
  //       next: data => {
  //         userId = data.id
  //         this.cookieService.set('user', userId.toString(), 2);
  //         this.router.navigateByUrl(`users`);
  //       },
  //       error: error => {
  //         alert("Unable to log in with those credentials. Please try again")
  //         console.log("Bad Credentials", error)
  //       }
  //     })
  // }

  outsiders(): void {
    this.router.navigateByUrl('/outsider');
  }

}
