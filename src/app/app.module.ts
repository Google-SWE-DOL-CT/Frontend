import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { JobFunctionsComponent } from './job-functions/job-functions.component';
import { UsersComponent } from './users/users.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SingleUserComponent } from './single-user/single-user.component';
import { SubFunctionComponent } from './sub-function/sub-function.component';
import { PrismService } from './prism.service';
import {CookieService} from 'ngx-cookie-service';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { OutsidersComponent } from './outsiders/outsiders.component';
import { AuthInterceptor } from './auth-interceptor';
import { ReportComponent } from './report/report.component';
import { NewViewerComponent } from './new-viewer/new-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JobFunctionsComponent,
    UsersComponent,
    SideBarComponent,
    SingleUserComponent,
    SubFunctionComponent,
    LoginComponent,
    AdminDashboardComponent,
    OutsidersComponent,
    ReportComponent,
    NewViewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [PrismService, CookieService, {provide: HTTP_INTERCEPTORS,useClass: AuthInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
