import { DateRange } from "@angular/material/datepicker";

export interface TimesheetHoursMap{
    [key: string]: number;
}

export class Timesheet {
    isApproved: boolean;
    isSubmitted: boolean;
    dateRange: DateRange<Date>;
    timesheetHours: TimesheetHoursMap;
    comments: string;
    constructor(isApproved: boolean, isSubmitted: boolean, dateRange: DateRange<Date>, 
        timesheetHours: TimesheetHoursMap, comments: string) {
        this.isApproved = isApproved;
        this.isSubmitted = isSubmitted;
        this.dateRange = dateRange;
        this.timesheetHours = timesheetHours;
        this.comments = comments;
     }
  }
