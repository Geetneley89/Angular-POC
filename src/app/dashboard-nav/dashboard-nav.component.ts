import { Component, OnInit } from '@angular/core';
import { UtilService } from "../services/util.service";


@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss']
})
export class DashboardNavComponent implements OnInit {

  currentDate: Date;
  greetings: string;
  currentTemperature: number;
  // timeInterval: any;

  constructor(private utilService: UtilService) { }

  ngOnInit(): void {
    this.setTimeAndGreeting();
    /* this.timeInterval = setInterval(()=>{
       console.log('setInterval')
       this.setTimeAndGreeting();
     }, 60000);*/

    this.getCurrentTemperature();
  }

  getCurrentTemperature() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.utilService.getCurrentTemperature(position.coords.latitude, position.coords.longitude)
          .subscribe((response: any) => {
            this.currentTemperature = Math.round(response.main.temp  - 273.15);
          });
      });
    }
  }


  setTimeAndGreeting() {

      this.currentDate = new Date();
      if (this.currentDate.getHours() >= 5 && this.currentDate.getHours() < 12 ) {
        this.greetings = 'Good Morning !';
      } else if (this.currentDate.getHours() >= 12 && this.currentDate.getHours() < 17) {
        this.greetings = 'Good Afternoon !';
      } else {
        this.greetings = 'Good Evening !';
      }

  }


}
