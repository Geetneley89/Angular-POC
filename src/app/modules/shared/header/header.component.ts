import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavigationComponent } from '../side-navigation/side-navigation.component';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username = "Ananymous";
  user: User;
  isManager :boolean = false;
  
  constructor(private sideNav: SideNavigationComponent, private router: Router, private userService: UserService ) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem("username");
    if (this.userService.isManager(this.username)){
        this.isManager = true;
    } 
  }
  
  hideNav(){
    this.sideNav.toggleSidebar();
  }

  logoutUser(){
    sessionStorage.clear();
    this.router.navigateByUrl("/login");
  }
  
}


