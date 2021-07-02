import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ReviewCandidatesComponent } from './review-candidates/review-candidates.component';
import { QuickReportComponent } from './quick-report/quick-report.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ApprovalsComponent,
    CreateComponent,
    AssignmentsComponent,
    ReviewCandidatesComponent,
    QuickReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    ApprovalsComponent,
    CreateComponent,
    AssignmentsComponent,
    ReviewCandidatesComponent,
    QuickReportComponent
  ]
})
export class DashboardModule { }
