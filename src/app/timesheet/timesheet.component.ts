import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  username: any;
  constructor(private title: Title) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.title.setTitle("TimeSheet Submission");
  }

}
