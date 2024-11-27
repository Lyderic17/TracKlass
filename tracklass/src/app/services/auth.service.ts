import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Login } from '../models/login.model';
import { Signup } from '../models/signup.model';
import { environment } from '../../environments/environment'; // Import environment file

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string | null>(null);
  private userIdSubject = new BehaviorSubject<string | null>(null);

  private tokenKey = 'currentUser';

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthState();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  get username(): Observable<string | null> {
    console.log(this.usernameSubject.asObservable(), "username");
    return this.usernameSubject.asObservable();
  }

  get userId(): Observable<string | null> {
    return this.userIdSubject.asObservable();
  }

  get authToken(): string | null {
    return this.tokenSubject.value;
  }

  login(loginData: Login): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response) => {
        const token = response.token;
        if (token) {
          this.updateAuthStateFromToken(token);
          this.storeTokenInLocalStorage(token);
        }
      })
    );
  }

  signup(signupData: Signup): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, signupData).pipe(
      tap((response) => {
        const token = response.token;
        if (token) {
          this.updateAuthStateFromToken(token);
          this.storeTokenInLocalStorage(token);
        }
      })
    );
  }

  logout(): void {
    this.clearAuthState();
    this.removeTokenFromLocalStorage();
    this.router.navigate(['/login']);
  }

  private initializeAuthState(): void {
    const storedToken = localStorage.getItem(this.tokenKey);
    if (storedToken) {
      this.updateAuthStateFromToken(storedToken);
    }
  }

  private updateAuthStateFromToken(token: string): void {
    const decodedToken: any = this.decodeToken(token);
    const username = decodedToken?.user?.username || null;
    console.log('Decoded token:', decodedToken);
    const userId = decodedToken?.user?.id || null;
    this.updateAuthState(token, username, userId);
  }

  private updateAuthState(token: string, username: string | null, userId: string | null): void {
    console.log('Updating auth state:', { token, username, userId });
    this.tokenSubject.next(token);
    this.loggedInSubject.next(true);
    this.usernameSubject.next(username);
    this.userIdSubject.next(userId);
  }

  private clearAuthState(): void {
    this.tokenSubject.next(null);
    this.loggedInSubject.next(false);
    this.usernameSubject.next(null);
    this.userIdSubject.next(null);
  }

  private storeTokenInLocalStorage(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeTokenFromLocalStorage(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    console.log('Decoded token:', JSON.parse(atob(base64)));
    return JSON.parse(atob(base64));
  }
}