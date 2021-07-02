import {DatePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {DateRange} from '@angular/material/datepicker';

import {Subscription} from 'rxjs';

import {User} from '../../models/user';
import { UserService } from 'src/app/services/user.service';
import {Timesheet, TimesheetHoursMap} from '../../models/timesheet';
import { TimesheetService } from '../timesheet.service';


@Component({
  selector: 'app-date-range-dropdown',
  templateUrl: './date-range-dropdown.component.html',
  styleUrls: ['./date-range-dropdown.component.scss']
})
export class DateRangeDropdownComponent implements OnInit {
  firstDay: any;
  dateRanges: DateRange<Date>[] = [];
  deltaStart: number;
  users: User[];
  loggedInUser: User;
  loggedInUserId: number;
  start: Date;
  end: Date;
  sun: any;
  mon: any;
  tue: any;
  wed: any;
  thu: any;
  fri: any;
  sat: any;
  sunHours: any;
  monHours: any;
  tueHours: any;
  wedHours: any;
  thuHours: any;
  friHours: any;
  satHours: any;
  campaignTwo: FormGroup;
  dateRangeSelected: any;
  total: number;
  userPayCode: string;
  canEdit = false;
  subscription: Subscription;
  timesheets: Array<Timesheet>;
  showMsg = false;
  isDisabled = false;
  msg: any;
  allowUnsubmit = false;
  isHoursInvalid = false;
  timesheetHrsKeyArray: Array<string> = ['sunHours', 'monHours', 'tueHours', 'wedHours', 'thuHours', 'friHours', 'satHours'];

  constructor(private _dateAdapter: DateAdapter<Date>, private datePipe: DatePipe,
              private formBuilder: FormBuilder, private userService: UserService,private timesheetService: TimesheetService) {
  }

  ngOnInit(): void {
    //From sessionStorage we get the userId as string, prefixing with + makes it a number
    this.loggedInUserId = +sessionStorage.getItem('userId');

    //get all the users from json on page load and observes for any changes in the json
    this.subscription = this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
        //get the loggedIn user object
        this.loggedInUser = this.users.find(user => user.id === this.loggedInUserId);
        this.getUserPayCode();
        //sets all the deafult values required to be present on page load
        this.setDefaultValues();
        this.validate();
      }
    );


  }

  getUserPayCode() {
    if (this.loggedInUser) {
      if (this.loggedInUser.isFullTime) {
        this.userPayCode = 'Paycode -Regular';
      } else {
        this.userPayCode = 'Paycode -Contract';
      }
    }
  }

  setDefaultValues() {
    this.total = 0;
    var date = new Date();
    this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var firstWeekdateRange = this._createWeekRangeForFirstWeek(this.firstDay);
    this.dateRanges.push(firstWeekdateRange);
    var secondWeekDateRange = this._createWeekRange(this._dateAdapter.addCalendarDays(firstWeekdateRange.end, 1));
    this.dateRanges.push(secondWeekDateRange);
    var thirdWeekDateRange = this._createWeekRange(this._dateAdapter.addCalendarDays(secondWeekDateRange.end, 1));
    this.dateRanges.push(thirdWeekDateRange);
    var fourthWeekDateRange = this._createWeekRange(this._dateAdapter.addCalendarDays(thirdWeekDateRange.end, 1));
    this.dateRanges.push(fourthWeekDateRange);
    var fifthWeekDateRange = this._createWeekRange(this._dateAdapter.addCalendarDays(fourthWeekDateRange.end, 1));
    this.dateRanges.push(fifthWeekDateRange);

    this.campaignTwo = this.formBuilder.group({
      dateRangeSelected: [firstWeekdateRange, [Validators.required]],
      sunHours: [0, [Validators.required,Validators.max(24)]],
      monHours: [0, [Validators.required,Validators.max(24)]],
      tueHours: [0, [Validators.required,Validators.max(24)]],
      wedHours: [0, [Validators.required,Validators.max(24)]],
      thuHours: [0, [Validators.required,Validators.max(24)]],
      friHours: [0, [Validators.required,Validators.max(24)]],
      satHours: [0, [Validators.required,Validators.max(24)]],
      comments: ['']
    });
    //updatating the current dateRangeSelected in timehseetService observable so that datea is available in userDetailsComponent
    this.timesheetService.updateDateRangeSelected(firstWeekdateRange);
    this.timesheets = this.loggedInUser.timesheet;
    var matchedTimesheet = this.timesheets.find(timesheet => firstWeekdateRange.start.getTime() ===
      new Date(timesheet.dateRange.start).getTime());

    if (matchedTimesheet) {
      console.log('The firstweekRange is already present in user\'s timehseet, these will be displayed on page load');
      var timesheetHours = matchedTimesheet.timesheetHours;
      let strMap: TimesheetHoursMap = {};

      //trick to know the actual type of the object
      //console.log(Object.prototype.toString.call(strMap));

      this.timesheetHrsKeyArray.forEach(timeSheetHrsKey => {
        this.campaignTwo.controls[timeSheetHrsKey].patchValue(timesheetHours[timeSheetHrsKey] || 0);
        this.total += timesheetHours[timeSheetHrsKey];
      });
      this.campaignTwo.controls['comments'].patchValue(matchedTimesheet.comments);
    }
    this.getDays(firstWeekdateRange.start);
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

  addDays(date, days) {
    const find = new Date(Number(date));
    find.setDate(date.getDate() + days);
    return find;
  }

  getDays(start: Date) {
    this.sat = this.datePipe.transform(this.addDays(start || new Date(), 0), 'MM/d');
    this.sun = this.datePipe.transform(this.addDays(start || new Date(), 1), 'MM/d');
    this.mon = this.datePipe.transform(this.addDays(start || new Date(), 2), 'MM/d');
    this.tue = this.datePipe.transform(this.addDays(start || new Date(), 3), 'MM/d');
    this.wed = this.datePipe.transform(this.addDays(start || new Date(), 4), 'MM/d');
    this.thu = this.datePipe.transform(this.addDays(start || new Date(), 5), 'MM/d');
    this.fri = this.datePipe.transform(this.addDays(start || new Date(), 6), 'MM/d');

  }

  onSubmit(event: String) {
    var isSubmitted = false;
    var isUnSubmitted = false;
    console.log('this.compaignTwo', this.campaignTwo.value);
    //updatating the current dateRangeSelected in timehseetService observable so that datea is available in userDetaildComponent
    this.timesheetService.updateDateRangeSelected(this.campaignTwo.value.dateRangeSelected);
    //update the user json on click of submit
    if (this.users) {
      console.log('The loggedIn user before update', this.loggedInUser);
      const userObj = this.loggedInUser;
      var dateRangeSubmittedStart = this.campaignTwo.value.dateRangeSelected.start;
      const timesheetHours: TimesheetHoursMap = {};
      timesheetHours['sunHours'] = +this.campaignTwo.value.sunHours || 0;
      timesheetHours['monHours'] = +this.campaignTwo.value.monHours || 0;
      timesheetHours['tueHours'] = +this.campaignTwo.value.tueHours || 0;
      timesheetHours['wedHours'] = +this.campaignTwo.value.wedHours || 0;
      timesheetHours['thuHours'] = +this.campaignTwo.value.thuHours || 0;
      timesheetHours['friHours'] = +this.campaignTwo.value.friHours || 0;
      timesheetHours['satHours'] = +this.campaignTwo.value.satHours || 0;
      var comments = this.campaignTwo.value.comments;
      var matchedTimesheet = userObj.timesheet.find(timesheet => new Date(dateRangeSubmittedStart).getTime() ===
        new Date(timesheet.dateRange.start).getTime());

      //IF the timehseet for the selected range is available in json, we are updating the same
      if (matchedTimesheet) {
        console.log('The selected dateRange is already present in user\'s timehseet, the same will be updated with new timesheetHours');
        //If the action is unsubmit, we are only updating the isSubmitted value to false in json
        if (event === 'unsubmit-btn') {
          matchedTimesheet.isSubmitted = false;
          isUnSubmitted = true;
         }else{
          //If the action is for submit/save, we are updating the timesheetHours and comments fetched from form
          matchedTimesheet.timesheetHours = timesheetHours;
          matchedTimesheet.comments = comments;
          //If the action is submit, we are updating isSubmitted to true in json and false for save
          if (event === 'submit-btn') {
            matchedTimesheet.isSubmitted = true;
            isSubmitted = true;
          }else{
            matchedTimesheet.timesheetHours = timesheetHours;
            matchedTimesheet.comments = comments;
          }
         }
        var timesheetToUpdateIndex = userObj.timesheet.findIndex(matchedTimesheetIndex => new Date(dateRangeSubmittedStart).getTime() ===
          new Date(matchedTimesheetIndex.dateRange.start).getTime());

        if (timesheetToUpdateIndex > -1) {
          userObj.timesheet.splice(timesheetToUpdateIndex, 1, matchedTimesheet);
        }
      }
      //If timesheet for the selected dateRange is not available in the json, we are inserting the same
      else {
        console.log('The selected dateRange is not present in user\'s timehseet, new timehseet will be created with new timesheetHours');
        var timesheetToInsert = new Timesheet(false, false, this.campaignTwo.value.dateRangeSelected, timesheetHours, comments);
        if (event === 'submit-btn') {
          timesheetToInsert.isSubmitted = true;
          isSubmitted = true;
        }
        userObj.timesheet.push(timesheetToInsert);
      }

      const sub: Subscription = this.userService.updateUser(new User(userObj)).subscribe(
        (updatedUsers: User[]) => {
          console.log('LoggedIn user after update', updatedUsers);
          this.showMsg = true;
          if(isSubmitted){
            this.msg = 'Timesheet submitted successfully!';
          }else{
            this.msg = 'Timesheet saved successfully!';
          }
          if(isUnSubmitted){
            this.msg = 'Timesheet unsubmitted successfully';
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
    }
    this.validate();
  }


  onDateRangeChange() {
    this.total = 0;
    this.showMsg = false;
    this.dateRangeSelected = this.campaignTwo.get('dateRangeSelected');
    //updatating the current dateRangeSelected in timehseetService observable so that datea is available in userDetaildComponent
    this.timesheetService.updateDateRangeSelected(this.campaignTwo.value.dateRangeSelected);
    this.timesheets = this.loggedInUser.timesheet;

    var matchedTimesheet;
    matchedTimesheet = this.timesheets.find(timesheet => new Date(timesheet.dateRange.start).getTime() ===
      new Date(this.dateRangeSelected.value.start).getTime());

    if (matchedTimesheet) {
      console.log('The selected dateRange is already present in user\'s timesheet, these timesheetHours will be displayed');
      var timesheetHours = matchedTimesheet.timesheetHours;
      this.timesheetHrsKeyArray.forEach(timeSheetHrsKey => {
        this.campaignTwo.controls[timeSheetHrsKey].patchValue(timesheetHours[timeSheetHrsKey] || 0);
        this.total += timesheetHours[timeSheetHrsKey];
      });

      this.campaignTwo.controls['comments'].patchValue(matchedTimesheet.comments);
    } else {
      console.log('The selected dateRange is not present in user\'s timesheet, these timesheetHours will patched with 0 hours');
      this.timesheetHrsKeyArray.forEach(timeSheetHrsKey => {
        this.campaignTwo.controls[timeSheetHrsKey].patchValue(0);
        this.total = 0;
      });
      this.campaignTwo.controls['comments'].patchValue('');
    }
    this.getDays(this.dateRangeSelected.value.start);
    this.validate();
  }


  validate() {
    this.dateRangeSelected = this.campaignTwo.get('dateRangeSelected');
    console.log(this.dateRangeSelected);
    this.timesheets = this.loggedInUser.timesheet;
    let matchedTimesheet;


    matchedTimesheet = this.timesheets.find(timesheet => new Date(timesheet.dateRange.start).getTime() ===
      new Date(this.dateRangeSelected.value.start).getTime());
    if (matchedTimesheet) {
      this.isDisabled = matchedTimesheet.isSubmitted;
      this.allowUnsubmit = matchedTimesheet.isSubmitted && !matchedTimesheet.isApproved;
      if(this.isDisabled) {
        this.disable();
      }else{
       this.enable();
      }
    } else {
      this.allowUnsubmit =false;
      this.enable();
      this.isDisabled = false;

    }
  }

  enable() {
    this.timesheetHrsKeyArray.forEach(timeSheetHrsKey => {
      this.campaignTwo.controls[timeSheetHrsKey].enable();
    });
  }

  disable(){
    this.timesheetHrsKeyArray.forEach(timeSheetHrsKey => {
      this.campaignTwo.controls[timeSheetHrsKey].disable();
    });
  }

  onChangeEvent(event: any){
    let formControlName = event.target.getAttribute('formControlName');
    this.isHoursInvalid = this.isFormGroupFormControlInValid(this.campaignTwo, formControlName,'max');
    this.total = 0;
    this.timesheetHrsKeyArray.forEach(timeSheetHrsKey => {
      this.total+= +this.campaignTwo.controls[timeSheetHrsKey].value;
    });
  }

  public isFormGroupFormControlInValid(formGroup: FormGroup, formControlName: string, errorCode: string): boolean {
		let isFormGroupFormControlInValid: boolean = false;

		if(formGroup) {
      const formControl: FormControl = formGroup.get(formControlName) as FormControl;
      isFormGroupFormControlInValid = this.isFormControlInvalid(formControl, errorCode);
    }

		return isFormGroupFormControlInValid;
	}

  public isFormControlInvalid(formControl: FormControl, errorCode: string): boolean {
		let isFormControlValid: boolean = false;

		if(formControl) {
      isFormControlValid = formControl.hasError(errorCode)
    }

		return isFormControlValid;
	}

}
