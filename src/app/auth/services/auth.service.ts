import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { environment } from '@environments/environment';
import { User } from '@auth/interfaces/user.interface';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'no-authenticated';
const BASE_URL = environment.baseUrl


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  checkStatusResource = rxResource({
    loader: () => this.checkStatus()
  })

  // Getters
  user = computed<User | null>( () => this._user());
  token = computed<string | null>( () => this._token());
  authStatus = computed<AuthStatus>( () => {
    if (this._authStatus() === 'checking') return 'checking';
    if( this._user()) return 'authenticated';
    return 'no-authenticated';
  })

  // Methods
  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${ BASE_URL }/auth/login`, { email, password })
      .pipe(
        map( resp => this.handlerAuthSuccess(resp)),
        catchError( err => this.handlerAuthError(err))
      )
  }

  register(email: string, password: string, fullName: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${ BASE_URL }/auth/register`, { email, password, fullName })
      .pipe(
        map( resp => this.handlerRegisterSuccess(resp)),
        catchError( err => this.handlerAuthError(err))
      )
  }

  logOut() {
    this._user.set(null)
    this._token.set(null)
    this._authStatus.set('no-authenticated')
    localStorage.removeItem('token')
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this._authStatus.set('no-authenticated');
      return of(false);
    }

    return this.http.get<AuthResponse>(`${ BASE_URL }/auth/check-status`)
    .pipe(
      map( resp => this.handlerAuthSuccess(resp)),
      catchError( err => this.handlerAuthError(err))
    )
  }

  private handlerAuthSuccess({user, token}: AuthResponse) {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', token);
    return true;
  }

  private handlerAuthError(error: any) {
    this.logOut()
    return of(false);
  }

  private handlerRegisterSuccess({user, token}: AuthResponse) {
    this._authStatus.set('no-authenticated')
    return true
  }
}
