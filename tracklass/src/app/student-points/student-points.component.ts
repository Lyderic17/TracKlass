import { Component, OnInit } from '@angular/core';
import { PointsService } from '../services/points.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-student-points',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDivider],
  templateUrl: './student-points.component.html',
  styleUrl: './student-points.component.css'
})
export class StudentPointsComponent {
  students: any[] = [];
  groupedStudents: Map<string, any[]> = new Map();
  classesMap: Map<string, string> = new Map();

  constructor(private pointsService: PointsService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.pointsService.getStudents().subscribe(students => {
      this.students = students;
      this.loadClasses(students);
    });
  }

  loadClasses(students: any[]) {
    const classIds = [...new Set(students.map(student => student.classId))];
    const classObservables = classIds.map(classId => this.pointsService.getClass(classId));

    forkJoin(classObservables).subscribe(classes => {
      classes.forEach(classData => {
        this.classesMap.set(classData._id, classData.name);
      });
      this.groupStudentsByClass();
    });
  }

  groupStudentsByClass() {
    this.groupedStudents.clear();
    this.students.forEach(student => {
      const className = this.getClassName(student.classId);
      if (!this.groupedStudents.has(className)) {
        this.groupedStudents.set(className, []);
      }
      this.groupedStudents.get(className)?.push(student);
    });
  }

  getClassName(classId: string): string {
    return this.classesMap.get(classId) || 'Unknown Class';
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