import { DatePipe } from '@angular/common';
import {Component, Inject, Injectable, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import {User} from '../../models/user';

@Injectable()
export class WeekRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
    constructor(private _dateAdapter: DateAdapter<D>, private datePipe: DatePipe) {}
    deltaStart: number;
    start: D;
    end: D;

    selectionFinished(date: D | null): DateRange<D> {
      return this._createWeekRange(date);
    }

    createPreview(activeDate: D | null): DateRange<D> {
      return this._createWeekRange(activeDate);
    }

    public _createWeekRange(date?: D | null): DateRange<D> {
      date = date ? date : this._dateAdapter.today();

      this.deltaStart = this._dateAdapter.getFirstDayOfWeek() - this._dateAdapter.getDayOfWeek(date);
      this.start = this._dateAdapter.addCalendarDays(date, this.deltaStart);
      this.end = this._dateAdapter.addCalendarDays(this.start, 6);

      return new DateRange<D>(this.start, this.end);

    }

  }


@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [{
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: WeekRangeSelectionStrategy
  }]
})
export class DatePickerComponent implements OnInit {
  users: User[];
  user: User;
  userId:number;
  invalidCred:boolean;
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
  campaignTwo : FormGroup;

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday=6 and Sunday=0 from being selected.
    return day !== 0 && day !== 6;
  }

  constructor(@Inject(MAT_DATE_RANGE_SELECTION_STRATEGY) private selectionStrategy: WeekRangeSelectionStrategy<Date>,
  private datePipe: DatePipe, private userService: UserService) { }
  onDateChange(): void {
    console.log("invoked");
    this.selectionStrategy._createWeekRange();
    this.campaignTwo = new FormGroup({
      start: new FormControl(this.selectionStrategy.start,Validators.required),
      end: new FormControl(this.selectionStrategy.end,Validators.required),
    })

    this.getDays(this.campaignTwo.value.start);
  }

  ngOnInit(): void {
    this.selectionStrategy._createWeekRange();
    this.campaignTwo = new FormGroup({
      start: new FormControl(this.selectionStrategy.start,Validators.required),
      end: new FormControl(this.selectionStrategy.end,Validators.required),
      sunHours: new FormControl(this.sun,Validators.required),
      monHours: new FormControl(this.mon,Validators.required),
      tueHours: new FormControl(this.tue,Validators.required),
      wedHours: new FormControl(this.wed,Validators.required),
      thuHours: new FormControl(this.thu,Validators.required),
      friHours: new FormControl(this.fri,Validators.required),
      satHours: new FormControl(this.sat,Validators.required)
    })
    this.getDays(this.campaignTwo.value.start);
    this.campaignTwo.get('start').valueChanges.subscribe({
      next: (value) => {
        console.log(value);
         this.getDays(value);
      }
    })
  }

  addDays(date, days) {
    const find = new Date(Number(date))
    find.setDate(date.getDate() + days)
    return find
  }


  getDays(start: Date){
    this.sun = this.datePipe.transform(this.addDays(start || new Date(),0), 'MM/d');
    this.mon = this.datePipe.transform(this.addDays(start || new Date(),1), 'MM/d');
    this.tue = this.datePipe.transform(this.addDays(start || new Date(),2), 'MM/d');
    this.wed = this.datePipe.transform(this.addDays(start || new Date(),3), 'MM/d');
    this.thu = this.datePipe.transform(this.addDays(start || new Date(),4), 'MM/d');
    this.fri = this.datePipe.transform(this.addDays(start || new Date(),5), 'MM/d');
    this.sat = this.datePipe.transform(this.addDays(start || new Date(),6), 'MM/d');
  }

 onSubmit() {
  this.userId = +sessionStorage.getItem('userId');
   this.userService.getUsers().subscribe(
       (users: User[]) => {
         this.users = users;
         this.user = this.users.find(user => user.id === this.userId);
         console.log(this.user);
       }
     );
   }

}
