import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterPayload } from './register-payload';
import { Observable } from 'rxjs';
import { LoginPayload } from './login-payload';
import { JwtAutResponse } from './jwt-aut-response';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:8080/api/auth/';

  constructor(private httpClient: HttpClient, private localStoraqeService: LocalStorageService) {
  }

  register(registerPayload: RegisterPayload): Observable<any> {
    return this.httpClient.post(this.url + 'signup', registerPayload);
  }

  login(loginPayload: LoginPayload): Observable<boolean> {
    return this.httpClient.post<JwtAutResponse>(this.url + 'login', loginPayload).pipe(map(data => {
      localStorage.setItem('token', data.authenticationToken);
      localStorage.setItem('username', data.username);
      return true;
    }));
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') != null && localStorage.getItem('token') != undefined && localStorage.getItem('token') != '';
  }

  isOwner(userName: string): boolean {
    const token = localStorage.getItem('token');
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken && decodedToken.sub === userName;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
}
