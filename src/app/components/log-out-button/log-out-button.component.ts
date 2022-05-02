import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-log-out-button',
  templateUrl: './log-out-button.component.html',
  styleUrls: ['./log-out-button.component.scss']
})
export class LogOutButtonComponent implements OnInit {

  constructor(private userService:UserService, private router:Router) { }

  public logout():void {
    if (confirm("Are you sure you want to log out?")) {
      this.userService.logOut();
      this.router.navigateByUrl(""); // Navigate back to the homepage
    }
  }

  ngOnInit(): void {
  }

}
