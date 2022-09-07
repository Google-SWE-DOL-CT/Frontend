import { trigger, state, style, AUTO_STYLE, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { JobFunctionService } from '../job-function.service';
import { JobFunc, JobFunctionRoot } from '../job-functions';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SubFunction, User, UserJob } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(0.2 + 'ms ease-in')),
      transition('true => false', animate(0.2 + 'ms ease-out'))
    ])
  ]
})
export class SingleUserComponent implements OnInit {

  user!: User
  jobFunction!: JobFunc[];

  userStats: string[] = [];
  userStatAngles: number[] = [];
  subFunc = []

  completedSubFunc: SubFunction[] = []
  rfrSubFunc: SubFunction[] = []
  inProgressSubFunc: SubFunction[] = []
  notStartedSubFunc: SubFunction[] = []
  
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private jobFunctionService: JobFunctionService,
    private cookieService: CookieService,
    ) { }
    userId = Number(this.route.snapshot.paramMap.get('id')); 

    setCookie(): void {      
      console.log("Set cookie from param route: ", this.userId)
      this.userService.getSingleUser(this.userId).subscribe({
        next: userInfo => {
          this.cookieService.set('uid', String(userInfo.id));
          this.cookieService.set('admin', String(userInfo.isAdmin));
        } 
      })
    }
    
    isAdmin = false;
    isCurrentUser = false;

    ngOnInit(): void {
      if (this.cookieService.get('uid')) {
        console.log('No need to set cookie');
      } else {
        this.setCookie();
      }
      // const helper = new JwtHelperService();

      // const decodedToken = helper.decodeToken(this.cookieService.get('jwt'));
      const cookieId = Number(this.cookieService.get('uid'));
      const cookieAdmin = Number(this.cookieService.get('admin'));

      if (cookieId && cookieAdmin) {
        if (cookieAdmin != 1) {
          this.isAdmin = false
        } else {
          this.isAdmin = true
        }
  
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id == cookieId) {
          this.isCurrentUser = true;
        } 
      
      this.userService.getSingleUser(id).subscribe({
        next: data => {
          this.user = data;
          const jfCount = 1;
          const subFunctions = [];
        const subFunctionCount = data.SubFunctions.length; 
        for (let i = 0; i < subFunctionCount; i++) {
          
          const myAngle = -120 +  ((360 / subFunctionCount) * i);
          this.userStatAngles.push(myAngle);

          const status = data.SubFunctions[i].UserJob.status;
          const currentSubFunc = data.SubFunctions[i]
          if (data.SubFunctions[i].UserJob.adminApproval == 1) {
            this.userStats.push("crown");
            this.completedSubFunc.push(currentSubFunc)
          } else {
            if (status == "Not Started") {
              this.userStats.push("#d9d9d9");
              this.notStartedSubFunc.push(currentSubFunc)
            } else if (status == "In Progress") {
              this.userStats.push("#5C89CC");
              this.inProgressSubFunc.push(currentSubFunc)
            } else if (status == "Ready for Review") {
              this.userStats.push("#008000");
              this.rfrSubFunc.push(currentSubFunc)
            }
          }
        }
      }
    })
    this.jobFunctionService.getJobFunctions().subscribe({
      next: data => {
        this.jobFunction = data.jobFunc;
        // console.log(this.jobFunction)
      }
    })
  }
}

  checkStatusPosition(jf: JobFunc): void {
    const clickedSummary = document.getElementById(jf.id.toString()) as HTMLDetailsElement
    const dotRow = document.getElementById(jf.title) as HTMLElement
    if (jf.title = dotRow.id) {
      if (clickedSummary.open) {
        dotRow.style.display = "flex";
      } else {
        dotRow.style.display = "none";
      }
    }
  }

  openStat(evt: any, cityName: string) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent") as HTMLCollection;
    for (i = 0; i < tabcontent.length; i++) {
      const element = tabcontent[i] as HTMLElement;
      element.style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    const tabTitle = document.getElementById(cityName) as HTMLElement
    tabTitle.style.display = "block";
    evt.currentTarget.className += " active";
  }

  percentage(number1: number, number2: number): number {
    return Math.floor((number1 / number2) * 100)
  }
}
