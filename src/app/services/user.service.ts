import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";

const { apiURL, apiKey } = environment;

const HTTP_HEADERS:HttpHeaders = new HttpHeaders({
  "Content-Type": "application/json",
  "X-Api-Key" : apiKey
});

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== undefined && storedUser != null) {
      this._user = JSON.parse(storedUser);
    }
  }

  private _user?:User;

  get localUser(): User | undefined {
    return this._user;
  }

  set localUser(user: User | undefined) {
    localStorage.setItem("user", JSON.stringify(user));
    this._user = user;
  }

  // Get a user with the given username
  public get(username: string):Observable<User[]> {
    return this.http.get<User[]>(apiURL + "?username=" + username);
  }

  // Create a new user with the given username
  public create(username: string):Observable<User> {
    const newUser = {
      username: username,
      pokemon: [],
      sprite: -1
    };

    return this.http.post<User>(apiURL, JSON.stringify(newUser), { headers: HTTP_HEADERS});
  }

  // Update an existing user
  public update(user: User):Observable<User> {
    return this.http.patch<User>(`${apiURL}/${user.id}`, JSON.stringify(user), { headers: HTTP_HEADERS});
  }

  // Clears local storage to remove stored user data
  public logOut():void {
    this.localUser = undefined;
    localStorage.clear();
  }

  // Get request to wake up the API server
  public pingAPI() {
    return this.http.get(apiURL);
  }
}
