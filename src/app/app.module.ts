import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule} from '@angular/material/list';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { DatePickerComponent } from './timesheet/date-picker/date-picker.component';
import { UserDetailsComponent } from './timesheet/user-details/user-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { QuickReportsComponent } from './quick-reports/quick-reports.component';
import { DatePipe } from '@angular/common';
import { DateRangeDropdownComponent } from './timesheet/date-range-dropdown/date-range-dropdown.component';
import { AuthGuardService } from './AuthGuardService.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatMenuModule }  from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SharedModule } from './modules/shared/shared.module';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';
import { TimeSheetService } from './services/timesheet.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TimesheetComponent,
    DatePickerComponent,
    UserDetailsComponent,
    QuickReportsComponent,
    DashboardComponent,
    DateRangeDropdownComponent,
    PageNotFoundComponent,
    DashboardNavComponent
  ],
  imports: [
    AppRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatToolbarModule,
		MatButtonModule,
		MatIconModule,
    MatListModule,
		MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DashboardModule,
    MatMenuModule,
    MatTabsModule,
    SharedModule

  ],
  providers: [DatePipe, AuthGuardService, TimeSheetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
