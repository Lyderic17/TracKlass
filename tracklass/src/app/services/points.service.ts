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
  private apiUrlClass = 'http://localhost:3000/api';
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
    const url = `${this.apiUrl}/${studentId}/addPoints`;
    const headers = this.getAuthHeaders();
    return this.http.put(url, { points }, { headers });
  }

  subtractPoints(studentId: string, points: number): Observable<any> {
    const url = `${this.apiUrl}/${studentId}/subtractPoints`;
    const headers = this.getAuthHeaders();
    return this.http.put(url, { points }, { headers });
  }

  getClass(classId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlClass}/classes/${classId}`);
  }
}
