import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private apiUrl = 'http://localhost:3000/api/students';

  constructor(private http: HttpClient, private authService: AuthService) {}
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.authToken;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': token!
    });
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl, { headers: this.getAuthHeaders()});
  }

  addPoints(studentId: string, points: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${studentId}/addPoints`, { points, headers: this.getAuthHeaders() });
  }

  subtractPoints(studentId: string, points: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${studentId}/subtractPoints`, { points, headers: this.getAuthHeaders() });
  }
}