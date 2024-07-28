import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private apiUrl = 'http://localhost:3000/api/layout';

  constructor(private http: HttpClient) {}



  saveLayout(classId: string, className: string, layout: any[]): Observable<any> {
    return this.http.post(this.apiUrl, { classId, className, layout });
  }

  getLayout(classId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${classId}`);
  }
}