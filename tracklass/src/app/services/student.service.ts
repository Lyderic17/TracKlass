import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
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
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudentsByClass(classId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/class/${classId}`,  { headers: this.getAuthHeaders() });
  }

  createStudent(newStudent: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, newStudent,  { headers: this.getAuthHeaders() });
  }
  deleteStudent(studentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${studentId}`, { headers: this.getAuthHeaders() });
  }
}