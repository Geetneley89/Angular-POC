import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TimesheetHoursMap } from 'src/app/models/timesheet';
import { jsPDF } from 'jspdf';
import { User } from 'src/app/models/user';
import { TimeSheetService } from 'src/app/services/timesheet.service';


@Component({
  selector: 'app-quick-report',
  templateUrl: './quick-report.component.html',
  styleUrls: ['./quick-report.component.scss']
})
export class QuickReportComponent implements OnInit {
  timeSheetMap = new Map<String, User>();
  activeRequestsCount;

  constructor(private timesheetService: TimeSheetService) { }

  ngOnInit(): void {
    this.timeSheetMap = this.timesheetService.data;
    this.activeRequestsCount = this.timesheetService.count;
  }

  downloadReport() {
    let strMap: TimesheetHoursMap = {};
    var doc = new jsPDF();
    var xAxis = 20;
    this.timeSheetMap.forEach((value: User, key: String) => {
      var yAxis = 20;
      doc.text("", 0, 0).setFontSize(10).setFont(undefined, 'bold');
      doc.text("Id : " + value.id.toString(), xAxis, yAxis);
      doc.text("Name : " + value.name, 20, yAxis = yAxis + 10);
      var isManager = value.isManager ? "Y" : "N";
      doc.text("Is a manager : " + isManager, 20, yAxis = yAxis + 10);
      var lineYAxis = yAxis + 5;
      doc.line(20, lineYAxis, 100, lineYAxis);
      console.log("length:" + value.timesheet.length);
      for (let i = 0; i < value.timesheet.length; i++) {
        const isTimeSheetSubmitted = value.timesheet[i].isSubmitted;
        const isTimeSheetApproved = value.timesheet[i].isApproved;

        if (isTimeSheetSubmitted && !isTimeSheetApproved) {
          const datepipe: DatePipe = new DatePipe('en-US')
          let formattedStartDate = datepipe.transform(new Date(value.timesheet[i].dateRange.start), 'dd-MMM-YYYY');
          let formattedEndDate = datepipe.transform(new Date(value.timesheet[i].dateRange.end), 'dd-MMM-YYYY');
          var dateRange = formattedStartDate + " - " + formattedEndDate;
          doc.text("Period : " + dateRange, 20, yAxis = yAxis + 10);
          for (let k of Object.keys(value.timesheet[i].timesheetHours)) {
            strMap[k] = value.timesheet[i].timesheetHours[k];
            doc.text(k + " : " + strMap[k], 20, yAxis = yAxis + 10);
          }
        }
        lineYAxis = yAxis + 5;
        doc.line(20, lineYAxis, 100, lineYAxis);
      }
      // To show each empoyee data in separate page.
      doc.addPage();
    });
    var reportName = "Report" + new Date().toISOString().slice(0, 10) + ".pdf";
    doc.deletePage(doc.internal.pages.length - 1);
    doc.save(reportName);
  }

}
