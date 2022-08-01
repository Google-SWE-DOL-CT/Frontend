import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './login/login.component';
import { NewViewerComponent } from './new-viewer/new-viewer.component';
import { OutsidersComponent } from './outsiders/outsiders.component';
import { ReportComponent } from './report/report.component';
import { SingleUserComponent } from './single-user/single-user.component';
import { SubFunctionComponent } from './sub-function/sub-function.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'outsiders', component: OutsidersComponent},
  {path: 'users', component: UsersComponent},
  {path: 'users/:id', component: SingleUserComponent},
  {path: 'users/:id/report', component: ReportComponent},
  {path: 'users/:id/newViewer', component: NewViewerComponent},
  {path: 'users/:id/admin-dashboard', component: AdminDashboardComponent},
  {path: 'users/:id/jobFunction/:jfId/subFunction/:subId', component: SubFunctionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
