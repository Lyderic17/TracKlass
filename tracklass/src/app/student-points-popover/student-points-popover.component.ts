import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PointsService } from '../services/points.service';

@Component({
  selector: 'app-student-points-popover',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './student-points-popover.component.html',
  styleUrl: './student-points-popover.component.css'
})
export class StudentPointsPopoverComponent {
  @Input() student: any;
  @Output() pointsUpdated = new EventEmitter<void>();

  constructor(private pointsService: PointsService) {}
  
  addPoints(points: number) {
    this.pointsService.addPoints(this.student._id, points).subscribe({
      next: () => {
        this.student.points += points; // Update local points
        this.pointsUpdated.emit();
      },
      error: (err) => {
        if (err.status === 401) {
          console.error('Unauthorized request. Please login again.');
        } else {
          console.error('Error adding points:', err);
        }
      }
    });
  }

  subtractPoints(points: number) {
    this.pointsService.subtractPoints(this.student._id, points).subscribe({
      next: () => {
        this.student.points -= points; // Update local points
        this.pointsUpdated.emit();
      },
      error: (err) => {
        if (err.status === 401) {
          console.error('Unauthorized request. Please login again.');
        } else {
          console.error('Error subtracting points:', err);
        }
      }
    });
  }
}
