import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit {
  
  opened: boolean = true;
  timeSheetMap = new Map<String, User>();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }

}
