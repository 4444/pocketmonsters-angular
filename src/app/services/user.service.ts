import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";

const { apiURL } = environment;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      this._user = JSON.parse(storedUser);
    }
  }

  private _user?:User;

  get localUser(): User | undefined {
    return this._user;
  }

  set localUser(user: User | undefined) {
    sessionStorage.setItem("user", JSON.stringify(user));
    this._user = user;
  }

  public get(username: string) {
    return this.http.get<User[]>(apiURL + "?username=" + username);
  }

  public create(user: User) {
    return this.http.post<User>(apiURL, JSON.stringify(user));
  }
}
