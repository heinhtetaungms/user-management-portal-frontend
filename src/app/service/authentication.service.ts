import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host = environment.apiUrl
  private token!: string;
  private loggedInUsername! : string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.post<HttpResponse<any> | HttpErrorResponse>(`${this.host}/user/login`, user, {observe: 'response'});
  }

  public register(user: User): Observable<HttpResponse<User | HttpErrorResponse>> {
    return this.http.post<User | HttpErrorResponse>(`${this.host}/user/login`, user, {observe: 'response'});
  }

  public logout() {
    this.token = "";
    this.loggedInUsername = "";
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('users')
  }

  public saveToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token)
  }

  public addUserToLocalCache(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(<string>localStorage.getItem('user'))
  }

  public loadToken() {
    this.token = <string>localStorage.getItem('token')
  }

  public getToken() {
    return this.token;
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '' && !this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub
          return true;
      }
    }
    this.logout()
    return false
  }
}
