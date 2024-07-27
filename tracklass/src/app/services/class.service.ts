import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from '../models/class.model';
import { AuthService } from './auth.service'; // Assuming you have an auth service to get the token

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = 'http://localhost:3000/api/classes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.authToken!;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': token
    });
  }

  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createClass(newClass: Class): Observable<Class> {
    return this.http.post<Class>(this.apiUrl, newClass, { headers: this.getAuthHeaders() });
  }
}
