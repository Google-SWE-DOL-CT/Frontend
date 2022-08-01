// exporting PDF done with this tutorial: https://www.positronx.io/angular-pdf-tutorial-export-pdf-in-angular-with-jspdf/

import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { User } from '../user';
import { UserService } from '../user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PrismService } from '../prism.service';
import { AdminService } from '../admin.service';
import { AdminInput } from '../admin-data';
// import * as Prism from 'prismjs';

declare global {
  interface Window { onePageCanvas: any; }
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewChecked {
  // @ViewChild('codeEle') codeEle!: ElementRef;

  user!: User

  highlighted = false
  renderCode: boolean[] = [];
  renderLanguage: boolean[] = [];
  prettyLanguage: string[] = [];
  renderGitHubLink: boolean[] = [];
  renderImage: boolean[] = [];
  imageBuffer: any[] = [];

  adminExpectations: number[] = [];
  adminOnJob: number[] = [];
  adminMVPractice: number[] = [];
  adminNotAttempted: number[] = [];
  adminComments: string[] = [];

  pageCompleted = 0;
  totalPages = 0;

  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private prismService: PrismService,
    ) { }
  
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

  ngOnInit(): void {
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(this.cookieService.get('jwt'));
    if (decodedToken) {
      if (decodedToken.isAdmin != 1) {
        window.location.href = `${environment.frontend_route}/users/${decodedToken.id}`
      } else {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.userService.getSingleUser(id).subscribe({
          next: async data => {
            this.user = data;
            this.totalPages = data.SubFunctions.length;
            for (let index = 0; index < data.SubFunctions.length; index++) {
              const element = data.SubFunctions[index].UserJob;
              if ((element.code == null) || (element.code.length == 0)) {
                this.renderCode.push(false)
              } else {
                this.renderCode.push(true)
              }
              if ((element.language == null) || (element.language.length == 0)) {
                this.prettyLanguage.push('')
                this.renderLanguage.push(false)
              } else {
                const langSelectInd = this.langListType.findIndex(lang => lang == element.language)
                this.prettyLanguage.push(this.langList[langSelectInd])
                this.renderLanguage.push(true)
                console.log(this.langList[langSelectInd])
              }
              if ((element.githubLink == null) || (element.githubLink.length == 0)) {
                this.renderGitHubLink.push(false)
              } else {
                this.renderGitHubLink.push(true)
              }
              if ((element.screenshot == null) ||(element.screenshot == '')) {
                this.renderImage.push(false)
                this.imageBuffer.push('')
              } else {
                const myBlob = await this.getBase64ImageFromUrl(element.screenshot)
                const blobString = myBlob as string
                this.imageBuffer.push(blobString.replace("data:application/octet-stream", "data:image/jpeg"))
                this.renderImage.push(true)
              }
              // admin action
              this.adminService.getSingleAdminAction(id, data.SubFunctions[index].JobFunctionId, data.SubFunctions[index].id).subscribe({
                next: data => {
                  this.adminComments.push(data.adminInput.comments);
                  this.adminExpectations.push(data.adminInput.meetsExpectations)
                  if ((data.adminInput.mvPractice == 0 || data.adminInput.mvPractice == null) && (data.adminInput.onJobPractice == 0 ||data.adminInput.onJobPractice == null )) {
                    this.adminNotAttempted.push(1)
                  } else {
                    this.adminNotAttempted.push(0)
                  }
                  this.adminOnJob.push(data.adminInput.onJobPractice)
                  this.adminMVPractice.push(data.adminInput.mvPractice)
                  
                  // console.log(data.adminInput)
                }
              })
            }
            console.log(data.SubFunctions[0].UserJob);
          }
        })
      }
    }
  }
  
  highlightOperators(): void {
    this.prismService.highlightAll();
    const operatorDiv = document.getElementsByClassName('operator') as HTMLCollection;
    for (let index = 0; index < operatorDiv.length; index++) {
      const element = operatorDiv[index] as HTMLSpanElement;
      element.style.background = 'transparent'
    }
  }

  ngAfterViewChecked(): void {
    this.highlightOperators()
    if (!this.highlighted) {
      this.highlighted = true;
    }
  }

  update(g: number, count: number, elem: HTMLParagraphElement) {
    elem.innerText = g + " / " + count + " pages generated";
  }
  
  openPDF(): void {
    this.highlightOperators()
    let progressDisplay = document.getElementById("printButton") as HTMLParagraphElement;
    // progressDisplay.style.display = "block"
    progressDisplay.innerText = "Generating... please wait"

    const firstPage = document.getElementById(`uj1`) as HTMLElement
    const firstPageRect = firstPage.getBoundingClientRect();
    const topBuffer1 = document.getElementById("noPrint") as HTMLDivElement
    const bufferRect1 = topBuffer1.getBoundingClientRect()
    const topBuffer2 = document.getElementById("banner") as HTMLDivElement
    const bufferRect2 = topBuffer2.getBoundingClientRect()

    // progressDisplay.innerText = `Generating Page ${this.pageCompleted + 1} / ${this.totalPages}`
    // const pdfButton = document.getElementById("printButton") as HTMLButtonElement;
    // pdfButton.style.display = "none"
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
     //! MAKE YOUR PDF
     const firstPageOr = (firstPageRect.width > firstPageRect.height) ? "l" : "p"
     var pdf = new jsPDF(firstPageOr, 'px', [firstPageRect.width, firstPageRect.height], true);
     for (var i = 0; i <= this.totalPages; i++) {
       const singlePage = document.getElementById(`uj${i + 1}`) as HTMLElement;
       if (singlePage) {
        progressDisplay.innerText = "lets goooo! " + i.toString() + "!"
        // setTimeout(() => {
          progressDisplay.innerText = `Generating Page ${i + 1} / ${this.totalPages}`
          console.log(`Generating Page ${i + 1} / ${this.totalPages}`)
          // this.update(i+1, this.totalPages, progressDisplay);
        // })

          const pageRect = singlePage.getBoundingClientRect();
          // console.log("Page", (i+1) + ":", "Top:", pageRect.top, "Right:", pageRect.right, "Bottom:", pageRect.bottom, "Left:", pageRect.left)
          // console.log("Page", (i+1), "Width:", (pageRect.right - pageRect.left), "Height:", (pageRect.bottom - pageRect.top))
             //! This is all just html2canvas stuff
             var srcImg  = canvas;
             var sX      = 0;
            //  var sY      = 980*i; // start 980 pixels down for every new page
            // var sX = pageRect.left;
            var sY = pageRect.top - (bufferRect1.height + bufferRect2.height);
             var sWidth  = pageRect.width;
             var sHeight = pageRect.height;
             var dX      = 0;
             var dY      = 0;
             var dWidth  = sWidth;
             var dHeight = sHeight;

            //  var ratio = sHeight / sWidth;
    
             window.onePageCanvas = document.createElement("canvas");
             window.onePageCanvas.setAttribute('width', sWidth);
             window.onePageCanvas.setAttribute('height', sHeight);
             var ctx = window.onePageCanvas.getContext('2d');
             // details on this usage of this function: 
             // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
             ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

             // document.body.appendChild(canvas);
             var canvasDataURL = window.onePageCanvas.toDataURL("image/png", 1.0);
    
            //  var width         = pdf.internal.pageSize.getWidth();
            //  var height        = pdf.internal.pageSize.getHeight();
            //  height = ratio * width;
             //! If we're on anything other than the first page,
             // add another page
            //  console.log(width, height)
             
             if (i > 0) {
              if (sWidth > sHeight) {
                pdf.addPage([sWidth, sHeight], "l");
              } else {
                pdf.addPage([sWidth, sHeight], "p")
              }
             }
             //! now we declare that we're working on that page
             pdf.setPage(i+1);
             //! now we add content to that page!

            //  
            // const imgProps= pdf.getImageProperties(canvasDataURL);
            // const pdfWidth = pdf.internal.pageSize.getWidth();
            // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            // pdf.addImage(canvasDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // 
             pdf.addImage(canvasDataURL, 'PNG', 0, 0, sWidth, sHeight);
        }
        
      }
     //! after the for loop is finished running, we save the pdf.
     pdf.save(`${this.user.firstName} ${this.user.lastName} DOL Report.pdf`);
     progressDisplay.innerText = "Download PDF"
    });
    // pdfButton.style.display = "block"
    this.highlightOperators()
  }


  async getBase64ImageFromUrl(imageUrl: string) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  
  

}
