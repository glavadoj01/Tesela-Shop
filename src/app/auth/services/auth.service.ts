import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { environment } from '@environments/environment';
import { User } from '@auth/interfaces/user.interface';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'no-authenticated';
const BASE_URL = environment.baseUrl


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus()
  })

  // Getters
  authStatus = computed<AuthStatus>( () => {
    if (this._authStatus() === 'checking') return 'checking';

    if( this._user()) return 'authenticated';

    return 'no-authenticated';
  })
  user = computed<User | null>( () => this._user());
  token = computed<string | null>( () => this._token());

  // Methods
  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${ BASE_URL }/auth/login`, { email, password })
      .pipe(
        tap( resp => {
          this._user.set(resp.user)
          this._token.set(resp.token)
          this._authStatus.set('authenticated')
          localStorage.setItem('token', resp.token)
        }),
        map( () => true ),
        catchError( err => {
          this._user.set(null)
          this._token.set(null)
          this._authStatus.set('no-authenticated')
          localStorage.removeItem('token')

          return of(false)
        })
      )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return of(false);

    return this.http.get<AuthResponse>(`${ BASE_URL }/auth/check-status`, {
      headers: {
        'Authorization': `Bearer ${ token }`
      }
    }).pipe(
      tap( resp => {
          this._user.set(resp.user)
          this._token.set(resp.token)
          this._authStatus.set('authenticated')
          localStorage.setItem('token', resp.token)
        }),
        map( () => true ),
        catchError( err => {
          this._user.set(null)
          this._token.set(null)
          this._authStatus.set('no-authenticated')
          localStorage.removeItem('token')

          return of(false)
        })
    )

  }
}
