import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { TimeSheetService } from 'src/app/services/timesheet.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  activeRequestsCount:number = 0;
  timeSheetMap = new Map<String, User>();

  constructor(private title: Title, private userService: UserService,
    private timesheetService: TimeSheetService) { }

  ngOnInit(): void {
    this.title.setTitle("Manager Dashboard");

    subscription: Subscription;
    this.subscription = this.userService.getUsers().subscribe(
      (users: User[]) => {
        for (let i = 0; i < users.length; i++) {
          // Only Employees associated with this manager are considered
          if (users[i].reportingManager === sessionStorage.getItem("userId")) {
            for (let j = 0; j < users[i].timesheet.length; j++) {
              const isTimeSheetSubmitted = users[i].timesheet[j].isSubmitted;
              const isTimeSheetApproved = users[i].timesheet[j].isApproved;
              // If timesheet is submitted but not approved, then consider and increment the count.
              if (isTimeSheetSubmitted && !isTimeSheetApproved) {
                this.activeRequestsCount++;
                if (!this.timeSheetMap.has(users[i].id.toString())) {
                  this.timeSheetMap.set(users[i].id.toString(), users[i]);
                }
              }
            }
          }
        }
        console.log("There are totally " + this.activeRequestsCount + " timesheets submitted by the employees");
      }
    )
    this.timesheetService.data = this.timeSheetMap;
    this.timesheetService.count = this.activeRequestsCount;
  }

  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }

}
