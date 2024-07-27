import { Component } from '@angular/core';
import { Student } from '../models/student.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassService } from '../services/class.service';
import { StudentService } from '../services/student.service';
import { Class } from '../models/class.model';
import { CommonModule } from '@angular/common';
import { MatError, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatError, MatOption, MatInput, MatSelectModule, MatButton],
  templateUrl: './manage-students.component.html',
  styleUrl: './manage-students.component.css'
})
export class ManageStudentsComponent {

  students: Student[] = [];
  classes: Class[] = [];
  selectedClass: string = '';
  studentForm!: FormGroup;

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      classId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classService.getClasses().subscribe((classes: Class[]) => {
      this.classes = classes;
      console.log('Loaded classes:', this.classes);
    });
  }

  loadStudents() {
    if (this.selectedClass) {
      this.studentService.getStudentsByClass(this.selectedClass).subscribe((students: Student[]) => {
        this.students = students;
        console.log('Loaded students:', this.students);
      });
    }
  }

  createStudent() {
    if (this.studentForm.invalid) {
      return;
    }
    const newStudent: Student = {
      _id: '',
      name: this.studentForm.value.name,
      classId: this.studentForm.value.classId,
      points: 0
    };
    this.studentService.createStudent(newStudent).subscribe(createdStudent => {
      this.students.push(createdStudent);
      this.studentForm.reset();
      this.loadStudents();
    });
  }

  onClassChange() {
    this.loadStudents();
  }

  deleteStudent(studentId: string) {
    this.studentService.deleteStudent(studentId).subscribe(() => {
      this.students = this.students.filter(student => student._id !== studentId);
    });
  }
}