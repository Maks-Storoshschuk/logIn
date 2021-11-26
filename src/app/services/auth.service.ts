import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataTransferService} from "./data-transfer.service";
import {IAuth, IToken} from "../interfaces";
import {Observable, pipe, tap} from "rxjs";
import {urls} from "../config";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accessTokenKey = 'access';
  private refreshTokenKey = 'refresh';

  constructor(private httpClient: HttpClient, private dataTransferService: DataTransferService, private userService: UserService) {
  }

  logIn(user: IAuth): Observable<IToken> {
    return this.httpClient.post<IToken>(urls.auth, user)
      .pipe(
        tap((tokens: IToken) => {
          this.userService.getMe().subscribe(me => {
            this.dataTransferService.currentUserSubject.next(me)
          })
          this.setTokens(tokens)
        })
      )
  }

  refreshToken(): Observable<IToken> {
    return this.httpClient.post<IToken>(`${urls.auth}/refresh`, {refresh: this.getRefreshToken()})
      .pipe(
        tap((tokens: IToken) => {
          this.setTokens(tokens)
        })
      )
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  private setAccessToken(access: string): void {
    localStorage.setItem(this.accessTokenKey, access)
  }

  private setRefreshToken(refresh: string): void {
    localStorage.setItem(this.refreshTokenKey, refresh)
  }

  getAccessToken(): null | string {
    return localStorage.getItem(this.accessTokenKey)
  }

  private getRefreshToken(): null | string {
    return localStorage.getItem(this.refreshTokenKey)
  }

  private setTokens(token: IToken): void {
    const {access, refresh} = token
    this.setAccessToken(access);
    this.setRefreshToken(refresh)
  }
}
