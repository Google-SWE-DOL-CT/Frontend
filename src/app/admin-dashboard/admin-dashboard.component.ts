import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminRoot } from '../admin-data';
import { AdminService } from '../admin.service';
import { User, UserRoot } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  sub!: Subscription
  adminsub!: Subscription
  userRoot!: UserRoot
  singleUser!: User;

  userDetails: User[] = []

  incompleteCount: number[] = [];
  inProgressCount: number[] = [];
  rfrCount: number[] = [];
  crownCount: number[] = [];
  totalCount: number[] = [];

  adminUsers!: AdminRoot;

  adminId!: number;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private cookieService: CookieService,
    ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id')); 
    console.log("From Param Route: ", userId)
    this.userService.getSingleUser(userId).subscribe({
      next: userInfo => {
        this.singleUser = userInfo;
        this.cookieService.set('uid', String(userInfo.id));
        this.cookieService.set('admin', String(userInfo.isAdmin));
      } 
    })

    // const helper = new JwtHelperService();

    // const decodedToken = helper.decodeToken(this.cookieService.get('jwt'));
    if (this.singleUser) {
      if (this.singleUser.isAdmin != 1) {
        window.location.href = `${environment.frontend_route}/users/${this.singleUser.id}`
      } else {
        this.adminId = this.singleUser.id;
        this.sub = this.userService.getUsers().subscribe({
          next: users => {
              this.userRoot = users;
              this.userRoot.users.sort(()=> Math.random() - 0.5)
              for (let i = 0; i < users.users.length; i++) {
                const element = users.users[i];
                this.incompleteCount[i] = 0;
                this.inProgressCount[i] = 0;
                this.rfrCount[i] = 0;
                this.crownCount[i] = 0;
                this.totalCount[i] = 0;
                this.userService.getSingleUser(element.id).subscribe({
                  next: data => {
                    // this.userDetails.push(data)
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
                }
                )
                console.log(users.users[i], this.crownCount)
              }
          }
        })
        this.adminsub = this.adminService.getApproval().subscribe({
          next: adminU => {
            this.adminUsers = adminU;
            console.log(adminU)
          }
        })
      }
    }
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe()
  }

  checkStatusPosition(user: User): void {
    // alert(user.email)
    // const clickedSummary = document.getElementById(user.id.toString()) as HTMLDetailsElement
    // const dotRow = document.getElementById(user.email) as HTMLElement
    // if (user.email = dotRow.id) {
    //   if (clickedSummary.open) {
    //     dotRow.style.display = "flex";
    //   } else {
    //     dotRow.style.display = "none";
    //   }
    // }
  }

  toReport(userId: number): void {
    window.location.href = `${environment.frontend_route}/users/${userId}/report`  
  }

  percentage(number1: number, number2: number): number {
    return Math.floor((number1 / number2) * 100)
  }

  newViewer(): void {
    window.location.href = `${environment.frontend_route}/users/${this.adminId}/newViewer`
  }
}
