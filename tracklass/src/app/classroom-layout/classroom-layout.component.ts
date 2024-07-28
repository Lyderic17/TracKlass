import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
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
import { MatIcon } from '@angular/material/icon';
import { StudentPointsPopoverComponent } from '../student-points-popover/student-points-popover.component';
import { PointsService } from '../services/points.service';




@Component({
  selector: 'app-classroom-layout',
  templateUrl: './classroom-layout.component.html',
  styleUrls: ['./classroom-layout.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatError, MatOption, MatFormFieldModule, CdkDrag, DragDropModule, MatInput, MatSelectModule, MatButton, MatOption, MatIcon],
})


export class ClassroomLayoutComponent implements OnInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  tables: Konva.Group[] = [];
  studentNodes: Konva.Group[] = [];
  students: Student[] = [];
  classes: Class[] = [];
  selectedClass: Class | null = null;
  newLayoutName: string = '';
  errorMessage: string | null = null;
  popoverRef: ComponentRef<StudentPointsPopoverComponent> | null = null;
  hoverNode: Konva.Group | null = null;
  popoverPadding: number = 10; // Padding to separate popover from student node
  isPopoverHovered: boolean = false;

  constructor(
    private layoutService: LayoutService,
    private studentService: StudentService,
    private classService: ClassService,
    private pointsService: PointsService,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
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
  }

  addTable(x: number = 100, y: number = 100) {
    const group = new Konva.Group({
      x,
      y,
      draggable: true,
    });
  
    const table = new Konva.Rect({
      width: 70,
      height: 50,
      fill: 'lightgray',
    });
  
    const deleteButton = new Konva.Circle({
      x: 70,
      y: 0,
      radius: 10,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 1
    });
  
    const crossSize = 4; // Size of the cross
    const deleteCross1 = new Konva.Line({
      points: [70 - crossSize, -crossSize, 70 + crossSize, crossSize],
      stroke: 'black',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    });
  
    const deleteCross2 = new Konva.Line({
      points: [70 + crossSize, -crossSize, 70 - crossSize, crossSize],
      stroke: 'black',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    });
  
    deleteButton.on('click', () => {
      group.destroy();
      this.tables = this.tables.filter(t => t !== group);
      this.layer.draw();
      this.saveLayout();
    });
  
    group.add(table);
    group.add(deleteButton);
    group.add(deleteCross1);
    group.add(deleteCross2);
    group.on('dragend', () => {
      this.saveLayout();
    });
  
    this.tables.push(group);
    this.layer.add(group);
    this.layer.draw();
  }

  addStudentNode(student: Student, x: number, y: number) {
    const group = new Konva.Group({
      x,
      y,
      draggable: true,
      id: student._id
    });
  
    const circle = new Konva.Circle({
      radius: 25,
      fill: 'lightblue',
    });
  
    const text = new Konva.Text({
      text: student.name,
      fontSize: 14,
      align: 'center',
      verticalAlign: 'middle',
      width: 50,
      height: 50,
      offsetX: 25,
      offsetY: 25,
    });
  
    const deleteButton = new Konva.Circle({
      x: 15,
      y: -20,
      radius: 10,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 1
    });
  
    const crossSize = 4; // Size of the cross
    const deleteCross1 = new Konva.Line({
      points: [15 - crossSize, -20 - crossSize, 15 + crossSize, -20 + crossSize],
      stroke: 'black',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    });
  
    const deleteCross2 = new Konva.Line({
      points: [15 + crossSize, -20 - crossSize, 15 - crossSize, -20 + crossSize],
      stroke: 'black',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    });
  
    deleteButton.on('click', () => {
      group.destroy();
      this.studentNodes = this.studentNodes.filter(t => t !== group);
      this.layer.draw();
      this.saveLayout();
    });
  
    group.add(circle);
    group.add(text);
    group.add(deleteButton);
    group.add(deleteCross1);
    group.add(deleteCross2);
  
    group.on('mouseover', () => {
      this.hoverNode = group;
      this.showPopover(student, group.x(), group.y());
    });
  
    group.on('mouseout', () => {
      if (!this.isPopoverHovered) {
        this.hoverNode = null;
        this.hidePopover();
      }
    });
  
    group.on('dragend', () => {
      this.saveLayout();
    });
  
    this.studentNodes.push(group);
    this.layer.add(group);
    this.layer.draw();
  }

  showPopover(student: Student, x: number, y: number) {
    if (this.popoverRef) {
      this.popoverRef.destroy();
    }

    const factory = this.componentFactoryResolver.resolveComponentFactory(StudentPointsPopoverComponent);
    this.popoverRef = this.viewContainerRef.createComponent(factory);
    this.popoverRef.instance.student = student;
    this.popoverRef.instance.pointsUpdated.subscribe(() => {
      this.loadStudents();
    });

    const popoverElement = this.popoverRef.location.nativeElement;
    popoverElement.style.position = 'absolute';
    popoverElement.style.top = `${y + this.stage.container().offsetTop + this.popoverPadding + 30}px`;
    popoverElement.style.left = `${x + this.stage.container().offsetLeft + this.popoverPadding + 30}px`;

    popoverElement.addEventListener('mouseenter', () => {
      this.isPopoverHovered = true;
    });

    popoverElement.addEventListener('mouseleave', () => {
      this.isPopoverHovered = false;
      this.hidePopover();
    });

    this.stage.on('mousemove', () => {
      if (this.hoverNode) {
        const nodePos = this.hoverNode.getClientRect();
        popoverElement.style.top = `${nodePos.y + this.stage.container().offsetTop + this.popoverPadding + 30}px`;
        popoverElement.style.left = `${nodePos.x + this.stage.container().offsetLeft + this.popoverPadding + 30}px`;
      }
    });
  }

  hidePopover() {
    if (this.popoverRef) {
      this.popoverRef.destroy();
      this.popoverRef = null;
    }
    this.stage.off('mousemove');
  }

  saveLayout() {
    if (!this.selectedClass) return;

    const tablesLayout = this.tables.map(group => ({
      x: group.x(),
      y: group.y(),
      type: 'table'
    }));

    const studentsLayout = this.studentNodes.map(group => ({
      x: group.x(),
      y: group.y(),
      studentId: group.id(),
      type: 'student'
    }));

    const layout = [...tablesLayout, ...studentsLayout];

    this.layoutService.saveLayout(this.selectedClass._id, this.selectedClass.name, layout).subscribe(() => {
      console.log('Layout saved successfully');
    });
  }

  loadStudents(): Promise<void> {
    if (!this.selectedClass) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.studentService.getStudentsByClass(this.selectedClass!._id).subscribe(
        students => {
          this.students = students;
          resolve();
        },
        error => {
          console.error('Error loading students:', error);
          reject(error);
        }
      );
    });
  }

  loadLayout(): Promise<void> {
    if (!this.selectedClass) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.layoutService.getLayout(this.selectedClass!._id).subscribe(
        layout => {
          this.tables = [];
          this.studentNodes = [];
          this.layer.destroyChildren();

          layout.forEach(item => {
            if (item.type === 'table') {
              this.addTable(item.x, item.y);
            } else if (item.type === 'student') {
              const student = this.students.find(s => s._id === item.studentId);
              if (student) {
                this.addStudentNode(student, item.x, item.y);
              }
            }
          });

          this.layer.draw();
          resolve();
        },
        error => {
          console.error('Error loading layout:', error);
          reject(error);
        }
      );
    });
  }

  loadClasses() {
    this.classService.getClasses().subscribe(classes => {
      this.classes = classes;
    });
  }

  async onClassChange() {
    if (!this.selectedClass) return;

    try {
      await this.loadStudents();
      await this.loadLayout();
    } catch (error) {
      console.error('Error loading class data:', error);
    }
  }

  onDrop(event: CdkDragDrop<any>) {
    const student = event.item.data;
    const pos = this.stage.getPointerPosition();
    if (pos) {
      this.addStudentNode(student, pos.x, pos.y);
      this.saveLayout();
    }
  }

  randomPlaceGenerator() {
    if (this.tables.length < this.students.length) {
      this.errorMessage = 'Not enough tables for each student.';
      return;
    }

    this.errorMessage = null;
    const shuffledStudents = this.shuffleArray([...this.students]);
    this.studentNodes.forEach(node => node.destroy());
    this.studentNodes = [];

    this.tables.forEach((table, index) => {
      if (index < shuffledStudents.length) {
        this.addStudentNode(shuffledStudents[index], table.x(), table.y() + 60);
      }
    });

    this.saveLayout();
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}