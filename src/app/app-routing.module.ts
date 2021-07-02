import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QuickReportsComponent } from './quick-reports/quick-reports.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SideNavigationComponent } from './modules/shared/side-navigation/side-navigation.component';
import { AuthGuardService } from './AuthGuardService.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuickReportComponent } from './modules/dashboard/quick-report/quick-report.component';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';
import { ApprovalsComponent } from './modules/dashboard/approvals/approvals.component';
import { AssignmentsComponent } from './modules/dashboard/assignments/assignments.component';
import { CreateComponent } from './modules/dashboard/create/create.component';
import { ReviewCandidatesComponent } from './modules/dashboard/review-candidates/review-candidates.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'timesheet', component: TimesheetComponent,
    canActivate: [AuthGuardService],
    data: { role: 'EMPLOYEE' }
  },
  {
    path: 'dashboard-nav', component: DashboardNavComponent,
    canActivate: [AuthGuardService],
    data: { role: 'MANAGER' }
  },
  {
    path: 'dashboard', component: DashboardComponent,
    children : [
      {
        path: 'quickreports', component: QuickReportComponent,
        canActivate: [AuthGuardService],
        data: { role: 'MANAGER' }
      },
      {
        path: 'approvals', component: ApprovalsComponent,
        canActivate: [AuthGuardService],
        data: { role: 'MANAGER' }
      },
      {
        path: 'assignments', component: AssignmentsComponent,
        canActivate: [AuthGuardService],
        data: { role: 'MANAGER' }
      },
      {
        path: 'create', component: CreateComponent,
        canActivate: [AuthGuardService],
        data: { role: 'MANAGER' }
      },
      {
        path: 'review-candidates', component: ReviewCandidatesComponent,
        canActivate: [AuthGuardService],
        data: { role: 'MANAGER' }
      }
    ]
  },
  {
    path: 'sideNavigation', component: SideNavigationComponent,
    data: { role: 'MANAGER' }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
