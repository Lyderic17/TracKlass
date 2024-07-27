import { Component, OnInit } from '@angular/core';
import { PointsService } from '../services/points.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-points',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './student-points.component.html',
  styleUrl: './student-points.component.css'
})
export class StudentPointsComponent {
  students: any[] = [];

  constructor(private pointsService: PointsService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.pointsService.getStudents().subscribe(students => {
      this.students = students;
    });
  }

  addPoints(studentId: string, points: number) {
    this.pointsService.addPoints(studentId, points).subscribe(() => {
      this.loadStudents();
    });
  }

  subtractPoints(studentId: string, points: number) {
    this.pointsService.subtractPoints(studentId, points).subscribe(() => {
      this.loadStudents();
    });
  }
}