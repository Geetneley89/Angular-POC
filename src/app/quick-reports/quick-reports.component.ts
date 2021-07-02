import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-quick-reports',
  templateUrl: './quick-reports.component.html',
  styleUrls: ['./quick-reports.component.scss']
})
export class QuickReportsComponent implements OnInit {

  constructor(private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("Approvals, Reports & More");
  }

}
