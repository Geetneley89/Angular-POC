import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimesheetHoursMap } from 'src/app/models/timesheet';

@Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.component.html',
  styleUrls: ['./view-dialog.component.scss']
})
export class ViewDialogComponent implements OnInit {

  timesheetHours: TimesheetHoursMap;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private dialogRef: MatDialogRef<ViewDialogComponent>) { }
  strMap: TimesheetHoursMap = {};

  ngOnInit(): void {
    this.timesheetHours = this.data.timesheetHours;
   
    for (let k of Object.keys(this.timesheetHours)) {
      this.strMap[k] = this.timesheetHours[k];
      console.log(k + " : " + this.strMap[k]);
    }
  }

  public close(){
    this.dialogRef.close(this);
  }

}
