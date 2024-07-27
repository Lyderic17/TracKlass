import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import { LayoutService } from '../services/layout.service';
import { StudentService } from '../services/student.service';
import { Student } from '../models/student.model';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { Class } from '../models/class.model';
import { ClassService } from '../services/class.service';
import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-classroom-layout',
  templateUrl: './classroom-layout.component.html',
  styleUrls: ['./classroom-layout.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatError, MatOption, MatFormFieldModule, CdkDrag, DragDropModule, MatInput, MatSelectModule, MatButton, MatOption],
})


export class ClassroomLayoutComponent implements OnInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  tables: Konva.Rect[] = [];
  students: Student[] = [];
  classes: Class[] = [];
  selectedClass: string = '';
  newLayoutName: string = '';

  constructor(
    private layoutService: LayoutService,
    private studentService: StudentService,
    private classService: ClassService
  ) {}

  ngOnInit() {
    this.initStage();
    this.loadClasses();
  }

  initStage() {
    this.stage = new Konva.Stage({
      container: 'container',
      width: 800,
      height: 600,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.stage.on('click', (event) => {
      if (event.target === this.stage) {
        this.addTable(event.evt.layerX, event.evt.layerY, null);
      }
    });
  }

  addTable(x: number, y: number, studentId: string | null) {
    const table = new Konva.Rect({
      x,
      y,
      width: 50,
      height: 50,
      fill: studentId ? 'green' : 'blue',
      draggable: true,
      id: studentId || undefined
    });

    table.on('dragend', () => {
      this.saveLayout();
    });

    this.tables.push(table);
    this.layer.add(table);
    this.layer.draw();
  }

  saveLayout() {
    const layout = this.tables.map(table => ({
      x: table.x(),
      y: table.y(),
      studentId: table.id() || null
    }));

    this.layoutService.saveLayout(this.selectedClass, layout).subscribe(() => {
      console.log('Layout saved successfully');
    });
  }

  loadLayout() {
    this.layoutService.getLayout(this.selectedClass).subscribe(tables => {
      this.tables = [];
      this.layer.destroyChildren();
      tables.forEach(table => {
        this.addTable(table.x, table.y, table.studentId);
      });
      this.layer.draw();
    });
  }

  loadStudents() {
    if (this.selectedClass) {
      this.studentService.getStudentsByClass(this.selectedClass).subscribe(students => {
        this.students = students;
      });
    }
  }

  loadClasses() {
    this.classService.getClasses().subscribe(classes => {
      this.classes = classes;
    });
  }

  onClassChange() {
    this.loadLayout();
    this.loadStudents();
  }

  onDrop(event: CdkDragDrop<Student[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const student = event.previousContainer.data[event.previousIndex];
      this.addTable(100, 100, student._id); // Place student at a default position
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}