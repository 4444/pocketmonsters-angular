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

  constructor(private userService:UserService, private router:Router) { 

  }

  ngOnInit(): void {
  }

  public onLoginSubmit({value}: NgForm) {
    this.loading = true;
    this.userService.get(value.username).subscribe({
      next: (users:User[]) => {
        if (users.length > 0) {
          this.userService.localUser = users.pop();
          this.router.navigateByUrl("game");
        }
      },
      error: (error: HttpErrorResponse) => {

      },
      complete: () => {
        this.loading = false;
      }
    })
  }

}