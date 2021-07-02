import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { TimeSheetService } from 'src/app/services/timesheet.service';
import { DateAdapter } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Timesheet, TimesheetHoursMap } from 'src/app/models/timesheet';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewDialogComponent } from '../view-dialog/view-dialog.component';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  timeSheetMap = new Map<String, User>();
  firstDay: any;
  dateRanges: DateRange<Date>[] = [];
  deltaStart: number;
  start: Date;
  end: Date;
  approvalsForm: FormGroup;
  isSelected:boolean;
  submittedTimeSheetMap = new Map<User, Timesheet>();
  timesheetHrsKeyArray: Array<string> = ['sunHours', 'monHours', 'tueHours', 'wedHours', 'thuHours', 'friHours', 'satHours'];
  userWithTimeSheet : FormArray;
  showMsg = false;
  msg : string;
  subscription: Subscription;
  disable: boolean = true;
  constructor(private timesheetService: TimeSheetService, private _dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder, private userService : UserService,private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.populateTimesheetMap();
    this.populateDateRanges();
  }

  private populateTimesheetMap() {
    this.subscription = this.userService.getUsers().subscribe(
      (users: User[]) => {
        for (let i = 0; i < users.length; i++) {
          // Only Employees associated with this manager are considered
          if (users[i].reportingManager === sessionStorage.getItem("userId")) {
            for (let j = 0; j < users[i].timesheet.length; j++) {
              const isTimeSheetSubmitted = users[i].timesheet[j].isSubmitted;
              const isTimeSheetApproved = users[i].timesheet[j].isApproved;

              if (isTimeSheetSubmitted && !isTimeSheetApproved) {
                if (!this.timeSheetMap.has(users[i].id.toString())) {
                  this.timeSheetMap.set(users[i].id.toString(), users[i]);
                }
              }
            }
          }
        }
      }
    );
  }

  //Gets the date ranges for the current month and populates in dateRanges array
  populateDateRanges() {
    var date = new Date();
    var currentWeekRange = this._createWeekRangeForFirstWeek(date);
    this.dateRanges.push(currentWeekRange);
    this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var firstWeekdateRange = this._createWeekRangeForFirstWeek(this.firstDay);
    if(currentWeekRange.start.getTime() !== firstWeekdateRange.start.getTime()){
      this.dateRanges.push(firstWeekdateRange);
    }
    var secondWeekDateRange = this._createWeekRange(this._dateAdapter.addCalendarDays(firstWeekdateRange.end, 1));
    if(currentWeekRange.start.getTime() !== secondWeekDateRange.start.getTime()){
      this.dateRanges.push(secondWeekDateRange);
    }
    var thirdWeekDateRange = this._createWeekRange(this._dateAdapter.addCalendarDays(secondWeekDateRange.end, 1));
    if(currentWeekRange.start.getTime() !== thirdWeekDateRange.start.getTime()){
      this.dateRanges.push(thirdWeekDateRange);
    }
    var fourthWeekDateRange = this._createWeekRange(this._dateAdapter.addCalendarDays(thirdWeekDateRange.end, 1));
    if(currentWeekRange.start.getTime() !== fourthWeekDateRange.start.getTime()){
      this.dateRanges.push(fourthWeekDateRange);
    }
    var fifthWeekDateRange = this._createWeekRange(this._dateAdapter.addCalendarDays(fourthWeekDateRange.end, 1));
    if(currentWeekRange.start.getTime() !== fifthWeekDateRange.start.getTime()){
      this.dateRanges.push(fifthWeekDateRange);
    }

    //initialize a default form
    this.approvalsForm = this.formBuilder.group({
      dateRangeSelected: [currentWeekRange, [Validators.required]],
      userWithTimeSheet: this.formBuilder.array([], [Validators.required])
    });
    //get the timesheetsMap here. Use the firstWeekdateRange to filter the timehseets based on the start/end dates
    //Add all matched users with matched timehseets into an array, iterate that array and display the user details
    //in a table.
    this.populateSubmittedTimesheetMap(currentWeekRange.start);
  console.log(this.submittedTimeSheetMap);
}

  private populateSubmittedTimesheetMap(weekRangeStartDate: Date) {
    this.submittedTimeSheetMap ? this.submittedTimeSheetMap.clear() : this.submittedTimeSheetMap;
    this.timeSheetMap.forEach((user: User, key: string) => {
      var matchedTimesheet = user.timesheet.find(timesheetToMatch => weekRangeStartDate.getTime() ===
        new Date(timesheetToMatch.dateRange.start).getTime());
      if (matchedTimesheet && matchedTimesheet.isSubmitted && !matchedTimesheet.isApproved) {
        this.submittedTimeSheetMap.set(user, matchedTimesheet);
      }
    });
  }

  public _createWeekRangeForFirstWeek(date?: Date | null): DateRange<Date> {
    date = date ? date : this._dateAdapter.today();
    //6 is the number for saturday  and 0 is the number for sunday
    this.deltaStart = (this._dateAdapter.getFirstDayOfWeek() - this._dateAdapter.getDayOfWeek(date))-1;
    this.start = this._dateAdapter.addCalendarDays(date, this.deltaStart);
    this.end = this._dateAdapter.addCalendarDays(this.start, 6);
    return new DateRange<Date>(this.start, this.end);
  }

  public _createWeekRange(date?: Date | null): DateRange<Date> {
    date = date ? date : this._dateAdapter.today();
    //6 is the number for saturday  and 0 is the number for sunday
    this.start = this._dateAdapter.addCalendarDays(date, 0);
    this.end = this._dateAdapter.addCalendarDays(this.start, 6);
    return new DateRange<Date>(this.start, this.end);
  }

  onDateRangeChange() {
    this.userWithTimeSheet ? this.userWithTimeSheet.clear() : this.userWithTimeSheet;
    this.submittedTimeSheetMap ? this.submittedTimeSheetMap.clear() : this.submittedTimeSheetMap;
    let dateRangeSelected = this.approvalsForm.get('dateRangeSelected');
    //get the selectedDateRange, filter the users based on this selectedDateRange and
    // replace the same array of matched timesheet users which was created on page laod
    this.populateSubmittedTimesheetMap(new Date(dateRangeSelected.value.start));
  }


  onSubmit(event: String) {
    let userWithTimeSheetArray = this.approvalsForm.value.userWithTimeSheet;
    userWithTimeSheetArray.forEach(userWithTimesheetToMatch=> {
      let userObjToUpdate : User = userWithTimesheetToMatch.key;
      let timesheetToUpdate: Timesheet = userWithTimesheetToMatch.value;
      if(event === 'approveBtn'){
        timesheetToUpdate.isApproved = true;
      }else if(event === 'rejectBtn'){
        timesheetToUpdate.isApproved = false;
        timesheetToUpdate.isSubmitted = false;
      }
      var timesheetToUpdateIndex = userObjToUpdate.timesheet.findIndex(matchedTimesheetIndex =>
        new Date(timesheetToUpdate.dateRange.start).getTime() ===
      new Date(matchedTimesheetIndex.dateRange.start).getTime());

      if (timesheetToUpdateIndex > -1) {
        userObjToUpdate.timesheet.splice(timesheetToUpdateIndex, 1, timesheetToUpdate);
      }

      const sub: Subscription = this.userService.updateUser(new User(userObjToUpdate)).subscribe(
        (updatedUsers: User[]) => {
          console.log('Users with updated timehseets', updatedUsers);
          this.showMsg = true;
          if(event === 'approveBtn'){
            this.msg = 'Timesheet approved successfully!';
          }else{
            this.msg = 'Timesheet rejected successfully!';
          }
            setTimeout(()=>{
            this.showMsg = false;
       }, 3000);
        },
        () => {
          this.msg = 'Unexpected issue occurred,please contact helpdesk';
        },
        () => {
          sub.unsubscribe();
        }
      );
    });
     this.populateSubmittedTimesheetMap(new Date(this.approvalsForm.get('dateRangeSelected').value.start));
    }


  totalHours(timesheetHours: TimesheetHoursMap){
    let total =0;
    this.timesheetHrsKeyArray.forEach(timeSheetHrsKey => {
       total += timesheetHours[timeSheetHrsKey];
    });
    return total;
  }

  onCheckboxChange(submittedUser: User, e) {
    this.userWithTimeSheet = this.approvalsForm.get('userWithTimeSheet') as FormArray;
     console.log('this.approvalsForm.value.userWithTimeSheet',this.userWithTimeSheet);
    if (e.target.checked) {
      this.disable = false;
      this.userWithTimeSheet.push(new FormControl(submittedUser));
    } else {
      if(this.userWithTimeSheet.value.length === 1) {
        this.disable = true;
      }
       const index = this.userWithTimeSheet.controls.findIndex(x => x.value.id === submittedUser.id);
       this.userWithTimeSheet.removeAt(index);
    }
  }

  onClickView(timesheetHours: TimesheetHoursMap){
    console.log(timesheetHours);
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    dialogConfig.data = { timesheetHours: timesheetHours};
    this.dialog.open(ViewDialogComponent, dialogConfig);
  }

}


