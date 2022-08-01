import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserRoot } from '../user';
import { UserService } from '../user.service';
import {CookieService} from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  PageTitle = "Users"
  sub!: Subscription
  userRoot!: UserRoot;
  viewStats = false;
  incompleteCount: number[] = [];
  inProgressCount: number[] = [];
  rfrCount: number[] = [];
  crownCount: number[] = [];
  totalCount: number[] = [];
  
  canView!: false

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    ) {}

  ngOnInit(): void {
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(this.cookieService.get('jwt'));
    if (decodedToken) {
      if (decodedToken.id != 0) {
        this.viewStats = true;
      }

      this.sub = this.userService.getUsers().subscribe({
        next: users => {
            this.userRoot = users;
            this.userRoot.users.sort(()=> Math.random() - 0.5)
            for (let i = 0; i < this.userRoot.users.length; i++) {
              this.incompleteCount[i] = 0;
              this.inProgressCount[i] = 0;
              this.rfrCount[i] = 0;
              this.crownCount[i] = 0;
              this.totalCount[i] = 0;
              this.userService.getSingleUser(users.users[i].id).subscribe({
                next: data => {
                  for (let j = 0; j < data.SubFunctions.length; j++) {
                    this.totalCount[i]++;
                    const uj = data.SubFunctions[j].UserJob;
                    if (uj.adminApproval == 1) {
                      this.crownCount[i]++;
                    } else {
                      switch (uj.status) {
                        case "Not Started":
                          this.incompleteCount[i]++
                          break;
                        case "In Progress":
                          this.inProgressCount[i]++
                          break;
                        case "Ready for Review":
                          this.rfrCount[i]++  
                          break;
                        default:
                          break;
                      }
                    }
                  }
                }
              })
            }
        }
      })
    } else {
      window.location.href = `${environment.frontend_route}/login`;
    }

  }

  ngOnDestroy(): void {
      this.sub.unsubscribe()
  }

  percentage(number1: number, number2: number): number {
    return Math.floor((number1 / number2) * 100)
  }

}
