import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  subscription: Subscription;
  users: User[];
  errorMsg:String = "Invalid username & password";
  invalidCred:boolean;

  constructor(private userService: UserService, private router: Router, private title:Title) { }

  ngOnInit(): void {
    // Initially clear the session storage
    sessionStorage.clear();
    this.title.setTitle("Kinsale - User Login");
    this.subscription = this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
        console.log(this.users);
      }
    )
  }

  onClickSubmit(data) {
    var usersCount = 0;
    for (let i = 0; i < this.users.length; i++) {
      var count = 0;
      if (this.users[i].username === data.username && this.users[i].password === data.pwd) {
        sessionStorage.setItem("userId", this.users[i].id.toString());
        sessionStorage.setItem("username", this.users[i].name);
        sessionStorage.setItem("typeOfUser", this.users[i].isManager ? "MANAGER" : "EMPLOYEE");
        usersCount++;
        if (this.users[i].isManager) {
          this.router.navigateByUrl("/dashboard-nav");
        } else {
          this.router.navigateByUrl("/timesheet");
        }
      }
    }
    if (usersCount === 0) {
      this.invalidCred = true;
    }
  }

}
