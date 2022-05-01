import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-trainer-name',
  templateUrl: './trainer-name.component.html',
  styleUrls: ['./trainer-name.component.scss']
})
export class TrainerNameComponent implements OnInit {

  constructor(private userService:UserService) { }

  public get username():string | undefined {
    return this.userService.localUser?.username;
  }

  ngOnInit(): void {
  }

}
