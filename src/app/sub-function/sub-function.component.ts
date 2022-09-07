// code snippet input began with this tutorial: https://www.youtube.com/watch?v=avByjLNGV3E
// uploading photo was done with this tutorial: https://www.youtube.com/watch?v=NZElg91l_ms&t=4s

import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserJob } from '../user';
import { UserService } from '../user.service';
import { PrismService } from '../prism.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { JobFunc } from '../job-functions';
import { JobFunctionService } from '../job-function.service';
import {CookieService} from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../admin.service';
import { AdminInput } from '../admin-data';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-sub-function',
  templateUrl: './sub-function.component.html',
  styleUrls: ['./sub-function.component.scss']
})
export class SubFunctionComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {

  @ViewChild('usertextarea', {static: false })
  usertextarea!: ElementRef;
  @ViewChild('formattedcodecontent', { static: false })
  formattedcodecontent!: ElementRef;
  @ViewChild('pre', { static: false })
  pre!: ElementRef;

  sub!: Subscription;
  highlighted = false;
  codeType = 'html';

  jobFunction!: JobFunc[];

  form = this.fb.group({
    content: ''
  });

  get contentControl() {
    return this.form.get('content');
  }

  isCurrentUser = false;
  isAdmin = false;
  hasApproval = 0;
  currentLanguage = ""
  userLink = ""
  isVisible = true


  user!: User;
  adminJob!: AdminInput;

  jfIndex!: number;
  subIndex!: number;
  openVariable = false;
  userCode!: string;
  userCookie!: string;

  userStats: string[] = [];

  userJobStatus!: string

  showRemove = false;

  displayLink!: boolean

  selectedFile!: File;
  fd = new FormData();
  imagePath!: string;
  uploadedImage!: string;
  
  statusSelect: string [] = [
    "Not Started",
    "In Progress",
    "Ready for Review"
  ]

  subFuncStatus = new FormControl()
  languageSelect = new FormControl()
  justification = new FormControl()
  githubLink = new FormControl()
  content = new FormControl()


  // adminMeetsExpectations: any
  // adminComments: any
  adminOnJobPractice: any
  adminMvPractice: any
  adminMeetsExpectations = new FormControl()
  adminComments = new FormControl()

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private prismService: PrismService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private jobFunctionService: JobFunctionService,
    private cookieService: CookieService,
    private http: HttpClient,
    private adminService: AdminService,
  ) { }


  ngOnInit(): void {
    // const helper = new JwtHelperService();

    // const decodedToken = helper.decodeToken(this.cookieService.get('jwt'));
    const userId = Number(window.localStorage.getItem('uid'));
    const adminId = Number(window.localStorage.getItem('admin'));
    if (userId) {
      if (adminId != 1) {
        const adminCommentDiv = document.getElementById("adminComments") as HTMLElement;
        adminCommentDiv.setAttribute('disabled', '')
        const meetsExpectationsDiv = document.getElementById("meetsExpectations") as HTMLElement;
        meetsExpectationsDiv.setAttribute('disabled', 'true')
        const onTheJobDiv = document.getElementById("onTheJob") as HTMLElement;
        onTheJobDiv.setAttribute('disabled', 'true')
        const mvPracticeDiv = document.getElementById("mvPractice") as HTMLElement;
        mvPracticeDiv.setAttribute('disabled', 'true')
      } else {
        this.isAdmin = true
      }

      if (Number(this.route.snapshot.paramMap.get('id')) == userId) {
        this.isCurrentUser = true;
      } else {
        this.isVisible = false

        const codeInput = document.getElementById("usertextarea") as HTMLElement;
        codeInput.setAttribute('disabled', '');

        const justificationInput = document.getElementById("userJustification") as HTMLElement;
        justificationInput.setAttribute('disabled', '')
      }

      const jfId = Number(this.route.snapshot.paramMap.get('jfId'));
      const subId = Number(this.route.snapshot.paramMap.get('subId'));
      this.jobFunctionService.getJobFunctions().subscribe({
        next: data => {
          this.jobFunction = data.jobFunc;
          this.jfIndex = data.jobFunc.findIndex(jf => jf.id == jfId)
        }
      })
      
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.userService.getSingleUser(id).subscribe({
        next: data => {
          this.user = data
          this.subIndex = data.SubFunctions.findIndex(subfunc => subfunc.id == subId)
          this.userCode = data.SubFunctions[this.subIndex].UserJob.code;
          this.codeType = data.SubFunctions[this.subIndex].UserJob.language
          this.uploadedImage = data.SubFunctions[this.subIndex].UserJob.screenshot;
          this.hasApproval = data.SubFunctions[this.subIndex].UserJob.adminApproval;
          const userJustification = data.SubFunctions[this.subIndex].UserJob.justification;
          this.justification.setValue(userJustification)
          const langSelectInd = this.langListType.findIndex(lang => lang == this.codeType)
          if (this.codeType == null) {
            this.codeType = ""
          }
          this.languageSelect.setValue(this.codeType)
          this.userLink = data.SubFunctions[this.subIndex].UserJob.githubLink
          this.githubLink.setValue(this.userLink)
          this.currentLanguage = this.langList[langSelectInd]
          
          const codeSummary = document.getElementById("userCodeSummary") as HTMLDetailsElement
          const imageSummary = document.getElementById("screenshotSummary") as HTMLDetailsElement

          if ((this.userCode == "") || (this.userCode == null)) {
            if (!this.isVisible) {
              if (codeSummary) {
                codeSummary.style.display = "none"
              }
              if ((this.userLink == "") || (this.userLink == null)) {
                this.displayLink = false
                // const userGithubDiv = document.getElementById("viewerLink") as HTMLElement

                // console.log(userGithubDiv)
                // userGithubDiv.style.display = "none"
              } else {
                this.displayLink = true
              }
              if (this.uploadedImage == "" || this.uploadedImage == null) {
                imageSummary.style.display = 'none'
              }
            }
            codeSummary.open = false          
          } else {
            codeSummary.open = true
          }          

          if (this.uploadedImage == "" || this.uploadedImage == null) {
            this.uploadedImage = "../../assets/images/image-not-found.png";
            this.showRemove = false
            // imageSummary.style.display = 'none'
          } else {
            imageSummary.open = true
            this.showRemove = true
          }

          const subFunctionCount = data.SubFunctions.length; 
          for (let i = 0; i < subFunctionCount; i++) {
            
            const status = data.SubFunctions[i].UserJob.status;
            
            if (data.SubFunctions[i].UserJob.adminApproval == 1) {
              this.userStats.push("crown");
            } else {
              if (status == "Not Started") {
                this.userStats.push("#d9d9d9");
              } else if (status == "In Progress") {
                this.userStats.push("#5C89CC");
              } else if (status == "Ready for Review") {
                this.userStats.push("#008000");
              }
            }
          }
  
          // console.log(this.userStats[this.subIndex])
          this.subFuncStatus.setValue(this.userStats[this.subIndex])
        }
      })

      this.adminService.getSingleAdminAction(id, jfId, subId).subscribe({
        next: adminData => {
          this.adminJob = adminData.adminInput,
          console.log("Admin data: " + adminData.adminInput.id),
          this.adminComments.setValue(adminData.adminInput.comments)
          console.log("Meets stuff: ",adminData.adminInput.meetsExpectations)
            this.adminMeetsExpectations.setValue(adminData.adminInput.meetsExpectations)

          if (adminData.adminInput.onJobPractice == null) {
            this.adminOnJobPractice = 0
          } else {
            this.adminOnJobPractice = adminData.adminInput.onJobPractice
          }

          if (adminData.adminInput.mvPractice == null) {
            this.adminMvPractice = 0
          } else {
            this.adminMvPractice = adminData.adminInput.mvPractice
          }
        }
      })

      // this.listenForm();
      // this.synchronizeScroll();
    } else {
      window.location.href = `${environment.frontend_route}/login`;
    }

  }

  langList: string[] = [
    "Bash",
    "C",
    "CSS",
    "C++",
    "C#",
    "Dart",
    "Go",
    "Handlebars",
    "HTML",
    "Java",
    "Javascript",
    "JSON",
    "Lua",
    "Markdown",
    "MongoDB",
    "Objective-C",
    "Protocol Buffers",
    "Python",
    "R",
    "React JSX",
    "Sass",
    "Scss",
    "Soy",
    "Swift",
    "TypeScript"
  ]

  langListType: string[] = [
    "bash",
    "c",
    "css",
    "cpp",
    "csharp",
    "dart",
    "go",
    "handlebars",
    "html",
    "java",
    "javascript",
    "json",
    "lua",
    "markdown",
    "mongodb",
    "objectivec",
    "protobuf",
    "python",
    "r",
    "jsx",
    "sass",
    "scss",
    "soy",
    "swift",
    "typescript"
  ]
  
  highlightOperators(): void {
    this.prismService.highlightAll();
    const operatorDiv = document.getElementsByClassName('operator') as HTMLCollection;
    for (let index = 0; index < operatorDiv.length; index++) {
      const element = operatorDiv[index] as HTMLSpanElement;
      console.log(element.style)
      element.style.background = 'transparent'
      
    }
  }
  
  ngAfterViewInit():void {
    const jfDetails = document.getElementsByTagName('details') as HTMLCollection;
    const singleJf = jfDetails[this.jfIndex] as HTMLDetailsElement
    const dotRow = singleJf.children[0].children[0] as HTMLElement
    dotRow.style.display = "none";
    singleJf.open = true
    this.listenForm();
    this.synchronizeScroll();
    this.highlightOperators();
  }
  
  ngAfterViewChecked(): void {
    if (this.highlighted) {
      // this.prismService.highlightAll();
      this.highlightOperators()
      this.highlighted = false;
    }
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  private listenForm(): void {
      this.sub = this.form.valueChanges.subscribe((val: any) => {
        const modifiedContent = this.prismService.convertHtmlIntoString(val.content);
  
        this.renderer.setProperty(this.formattedcodecontent.nativeElement, 'innerHTML', modifiedContent);

        this.highlighted = true;
      });
  }

  private synchronizeScroll(): void {
    const localSub  = fromEvent(this.usertextarea.nativeElement, 'scroll').subscribe(() => {
      const toTop = this.usertextarea.nativeElement.scrollTop;
      const toLeft = this.usertextarea.nativeElement.scrollLeft;

      this.renderer.setProperty(this.pre.nativeElement, 'scrollTop', toTop);
      this.renderer.setProperty(this.pre.nativeElement, 'scrollLeft', toLeft + 0.2);
    });
    this.sub.add(localSub);
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

  update(e:any): void {
    // const codeblock = document.getElementById("formattedcodecontent")
    this.codeType = e.target.value;
    this.renderer.setAttribute(this.pre.nativeElement, "class", `pre language-${this.codeType}`)
    this.renderer.setAttribute(this.formattedcodecontent.nativeElement, "class", `code language-${this.codeType}`)
    this.highlighted = true
    // this.prismService.highlightAll();
  }

  statusUpdate(e: any): void {
    this.userJobStatus = e.target.options[e.target.options.selectedIndex].text;
    console.log(this.userJobStatus)
    this.userStats[this.subIndex] = e.target.value
  }

  removeImage():void {
    const dogImage = document.getElementById("dogImage") as HTMLImageElement;
    dogImage.src = "../../assets/images/image-not-found.png";
    this.showRemove = false
  }

  onFileSelected(event: any): void {
    if (event.target.value) {
      this.selectedFile = <File>event.target.files[0];
      this.fd.append('file', this.selectedFile, this.selectedFile.name);
      const dogImage = document.getElementById("dogImage") as HTMLImageElement;
      const imgString = URL.createObjectURL(this.selectedFile);
      dogImage.src = imgString
      this.imagePath = this.selectedFile.name;
      this.showRemove = true
    }
  }

  postImage(): void {
    this.http.post(`${this.userService.anotherUserUrl}/images`, this.fd)
    .subscribe( result => {
      console.log("Post Result: " + result)
    });
  }

  postData(): void {
    const currentUserJob = this.user.SubFunctions[this.subIndex].UserJob
    const jfId = Number(this.route.snapshot.paramMap.get('jfId'));
    const subId = Number(this.route.snapshot.paramMap.get('subId'));
    const dogImage = document.getElementById("dogImage") as HTMLImageElement;
    let postPicture = ""

    if (dogImage.src.indexOf("blob:") != -1) {
      this.postImage();
      postPicture = `${this.userService.anotherUserUrl}/images/${this.imagePath}`;
    } else {
      if (dogImage.src.indexOf('/images/image-not-found.png') != -1) {
        postPicture = ""
      } else {
        postPicture = this.uploadedImage
      }
    }

    currentUserJob.screenshot = postPicture;
    const userCodeInput = document.getElementById("formattedcodecontent") as HTMLElement
    currentUserJob.code = userCodeInput.innerText
    if ((userCodeInput.innerText == null) || (userCodeInput.innerText == "")) {
      currentUserJob.language = ""
    } else {
      console.log('posted new lang' + this.codeType)
      currentUserJob.language = this.codeType
    }
    currentUserJob.status = this.userJobStatus;
    if (this.githubLink.value) {
      currentUserJob.githubLink = this.githubLink.value
    } else {
      currentUserJob.githubLink = ""
    }
    currentUserJob.justification = this.justification.value

    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(currentUserJob);
    this.http.put<UserJob>(`${environment.backend_route}/users/${this.user.id}/jobFunction/${jfId}/subFunction/${subId}`, body, {'headers':headers})
    .subscribe(result => { console.log("Posted" + JSON.stringify(result)); }, error => console.error(error));
    // Mod 3 feature - instead of reload, toast or customized alert of somekind?
    window.location.reload();
  }

  adminApproval(e: any): void {
    if (e.target.value == 1) {
      console.log("Change to Approved")
      this.userStats[this.subIndex] == "crown"
      this.user.SubFunctions[this.subIndex].UserJob.adminApproval = 1
      this.hasApproval = 1
      this.subFuncStatus.setValue("crown")
    } else if (e.target.value == 0) {
      this.userJobStatus = "In Progress";
      this.userStats[this.subIndex] = "#5C89CC"
      this.user.SubFunctions[this.subIndex].UserJob.adminApproval = 0
      this.hasApproval = 0
      this.subFuncStatus.setValue("#5C89CC")
    }
  }

  adminPostData(): void {
    const jfId = Number(this.route.snapshot.paramMap.get('jfId'));
    const subId = Number(this.route.snapshot.paramMap.get('subId'));

    this.adminJob.comments = this.adminComments.value;
    const meetsExpectationsDiv  = document.getElementById("meetsExpectations") as HTMLSelectElement
    this.adminJob.meetsExpectations = Number.parseInt(meetsExpectationsDiv.value)
    const onTheJobDiv = document.getElementById("onTheJob") as HTMLInputElement;
    this.adminJob.onJobPractice = onTheJobDiv.checked ? 1 : 0
    const mvPracticeDiv = document.getElementById("mvPractice") as HTMLInputElement;
    this.adminJob.mvPractice = mvPracticeDiv.checked ? 1 : 0 

    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(this.adminJob);
    this.http.put<AdminInput>(`${environment.backend_route}/admin/users/${this.user.id}/jobFunction/${jfId}/subFunction/${subId}`, body, {'headers':headers})
    .subscribe(result => { console.log("Posted" + JSON.stringify(result)); }, error => console.error(error));
    window.location.reload();
  }

  backToProgress(e: any): void {
    this.userJobStatus = "In Progress";
    this.userStats[this.subIndex] = "#5C89CC"
    this.user.SubFunctions[this.subIndex].UserJob.adminApproval = 0
    this.adminJob.meetsExpectations = null
    this.hasApproval = 0
    this.subFuncStatus.setValue("#5C89CC")
  }

}
