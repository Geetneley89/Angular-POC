import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { TimesheetService } from '../timesheet.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit,OnDestroy {
  userId : any;
  user: User;
  users: User[];
  subscription: Subscription;
  dateRangeSelected: DateRange<Date>;
  manager: User;
  constructor(private userService: UserService, private timesheetService: TimesheetService) { }


  ngOnInit(): void {
    //the retrieved value from sessionStorage is string, prefixing with + makes it a number
    this.userId = +sessionStorage.getItem('userId');
    this.subscription = this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
        this.user = this.users.find(user => user.id === this.userId);
        this.getManagerNameById();
      }
    )
      
    this.timesheetService.currentDateRangeSelected.subscribe(dateRange =>
      this.dateRangeSelected = dateRange);
 }

 ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

  getManagerNameById(){
    let mgrId = +this.user.reportingManager;
    this.manager = this.users.find(mgr => mgr.id === mgrId);
}
}
