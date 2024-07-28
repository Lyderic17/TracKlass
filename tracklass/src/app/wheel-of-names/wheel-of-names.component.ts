import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { ClassService } from '../services/class.service';
import { Class } from '../models/class.model';
import { Student } from '../models/student.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wheel-of-names',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormField, MatLabel,MatSelect,MatOption],
  templateUrl: './wheel-of-names.component.html',
  styleUrl: './wheel-of-names.component.css'
})
export class WheelOfNamesComponent implements OnInit, AfterViewInit {
  @ViewChild('wheelCanvas', { static: true }) wheelCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('winnerDisplay', { static: true }) winnerDisplay!: ElementRef<HTMLDivElement>;
  classes: Class[] = [];
  students: Student[] = [];
  selectedClass: Class | null = null;
  angleCurrent: number = 0;
  angleDelta: number = 0;
  canvasContext: CanvasRenderingContext2D | null = null;
  colors: string[] = ['#FFDDC1', '#FCB69F', '#FE8A71', '#F76E61', '#E63946'];
  timerHandle: number | null = null;

  predeterminedWinner: Student | null = null;
  predeterminedAngle: number | null = null;

  constructor(
    private studentService: StudentService,
    private classService: ClassService
  ) {}

  ngOnInit() {
    this.loadClasses();
  }

  ngAfterViewInit() {
    this.canvasContext = this.wheelCanvas.nativeElement.getContext('2d');
    this.drawWheel();
  }

  loadClasses() {
    this.classService.getClasses().subscribe(classes => {
      this.classes = classes;
    });
  }

  onClassChange() {
    if (this.selectedClass) {
      this.loadStudents(this.selectedClass._id);
    }
  }

  loadStudents(classId: string) {
    this.studentService.getStudentsByClass(classId).subscribe(students => {
      this.students = students;
      this.drawWheel();
    });
  }

  drawWheel() {
    const ctx = this.canvasContext;
    if (!ctx) return;

    const canvas = this.wheelCanvas.nativeElement;
    const outsideRadius = canvas.width / 2 - 10;
    const textRadius = outsideRadius - 20;
    const insideRadius = 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    const numSegments = this.students.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((this.angleCurrent * Math.PI) / 180);

    for (let i = 0; i < numSegments; i++) {
      const angle = i * anglePerSegment;
      ctx.fillStyle = this.colors[i % this.colors.length];

      ctx.beginPath();
      ctx.arc(0, 0, outsideRadius, angle, angle + anglePerSegment, false);
      ctx.arc(0, 0, insideRadius, angle + anglePerSegment, angle, true);
      ctx.fill();

      ctx.save();
      ctx.fillStyle = 'black';
      ctx.font = 'bold 16px Arial'; // Increase font size
      ctx.translate(
        textRadius * Math.cos(angle + anglePerSegment / 2),
        textRadius * Math.sin(angle + anglePerSegment / 2)
      );
      ctx.rotate(angle + anglePerSegment / 2 + Math.PI / 2);
      const text = this.students[i].name;
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    ctx.restore();

    // Draw the pointer outside the wheel
    ctx.fillStyle = '#000000'; // Change pointer color to black
    ctx.beginPath();
    ctx.moveTo(canvas.width - 10, canvas.height / 2 - 20);
    ctx.lineTo(canvas.width - 10, canvas.height / 2 + 20);
    ctx.lineTo(canvas.width - 30, canvas.height / 2);
    ctx.closePath();
    ctx.fill();
  }

  spinWheel() {
    if (this.timerHandle === null) {
      this.angleDelta = Math.random() * 10 + 10;
      this.timerHandle = window.setInterval(() => this.rotateWheel(), 30);
      this.winnerDisplay.nativeElement.style.display = 'none'; // Hide the winner display when spinning starts
    }
  }

  rotateWheel() {
    const ctx = this.canvasContext;
    if (!ctx) return;

    this.angleCurrent += this.angleDelta;
    this.angleDelta *= 0.99; // Faster deceleration

    if (this.angleDelta < 0.2) { // Stop sooner
      clearInterval(this.timerHandle as number);
      this.timerHandle = null;
      this.angleDelta = 0;
      this.showResult();
    }

    this.angleCurrent = this.angleCurrent % 360;

    ctx.clearRect(0, 0, this.wheelCanvas.nativeElement.width, this.wheelCanvas.nativeElement.height);

    this.drawWheel();
  }

  showResult() {
    const numSegments = this.students.length;
    const segmentAngle = 360 / numSegments;
    const adjustedAngle = (360 - (this.angleCurrent % 360)) % 360;
    const winningIndex = Math.floor(adjustedAngle / segmentAngle) % numSegments;
    const winningStudent = this.students[winningIndex];
    this.winnerDisplay.nativeElement.innerText = `The winner is: ${winningStudent.name}`;
    this.winnerDisplay.nativeElement.style.display = 'block';
  }

/*   predetermineWinner(winningStudent: Student) {
    const winningIndex = this.students.indexOf(winningStudent);
    if (winningIndex !== -1) {
      const numSegments = this.students.length;
      const segmentAngle = 360 / numSegments;
      const targetAngle = winningIndex * segmentAngle + segmentAngle / 2;

      const rand = (min: number, max: number) => Math.random() * (max - min) + min;
      const extraTurns = Math.floor(rand(4, 6)) * 360;
      const currentAngle = this.angleCurrent % 360;
      const finalAngle = currentAngle + extraTurns + (targetAngle - currentAngle);

      this.angleDelta = Math.random() * 10 + 10; // Set an initial reasonable delta
      this.predeterminedAngle = finalAngle; // Set the predetermined angle

      this.timerHandle = window.setInterval(() => this.rotateWheelToStop(finalAngle), 30);
      this.winnerDisplay.nativeElement.style.display = 'none'; // Hide the winner display when spinning starts
    }
  }

  rotateWheelToStop(targetAngle: number) {
    const ctx = this.canvasContext;
    if (!ctx) return;

    this.angleCurrent += this.angleDelta;
    this.angleDelta *= 0.97; // Decelerate

    if (this.angleDelta < 0.1) { // Stop when the speed is very low
      clearInterval(this.timerHandle as number);
      this.timerHandle = null;
      this.angleDelta = 0;
      this.angleCurrent = targetAngle % 360;
      this.showResult();
    }

    ctx.clearRect(0, 0, this.wheelCanvas.nativeElement.width, this.wheelCanvas.nativeElement.height);
    this.drawWheel();
  } */
}