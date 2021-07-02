import { Injectable } from "@angular/core";
import { DateRange } from "@angular/material/datepicker";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
   })
   export class TimesheetService {
   
    private dateRangeSelected = new BehaviorSubject<DateRange<Date>>(null);
    currentDateRangeSelected = this.dateRangeSelected.asObservable();
   
    //Observable that gets updates on every dateRange change, so that this data is avaialble to all the components listening
    updateDateRangeSelected(dateRange: DateRange<Date>) {
    this.dateRangeSelected.next(dateRange);
    }
}