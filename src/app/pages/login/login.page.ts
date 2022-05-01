import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  public loading: boolean = false;

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
  }

  public onLoginSubmit({value}: NgForm) {
    console.log("hi");
    this.loading = true;

    const username:string = value.username.toLowerCase();

    this.userService.get(value.username).subscribe({
      next: (users:User[]) => {
        if (users.length > 0) {
          this.userService.localUser = users.pop(); // Store the user in localStorage and continue
          this.router.navigateByUrl("game");
        }
        else {
          // User does not exist, create a new one.
          this.userService.create(username).subscribe({
            next:(user:User) => {
              this.userService.localUser = user;
              this.router.navigateByUrl("game");
            },
            error:() => {
              alert("Error. Could not create account.");
            },
            complete:() => {
              this.loading = false;
            }
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        alert("Error. Could not log in.");
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

}