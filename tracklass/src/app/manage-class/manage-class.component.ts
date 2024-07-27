import { Component, OnInit  } from '@angular/core';
import { ClassService } from '../services/class.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Class } from '../models/class.model';
import { CommonModule } from '@angular/common';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-manage-class',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatError, MatInput],
  templateUrl: './manage-class.component.html',
  styleUrl: './manage-class.component.css'
})
export class ManageClassComponent implements OnInit {
  classes: Class[] = [];
  classForm: FormGroup;

  constructor(private classService: ClassService, private fb: FormBuilder) {
    this.classForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classService.getClasses().subscribe(classes => {
      this.classes = classes;
    });
  }

  createClass() {
    if (this.classForm.invalid) {
      return;
    }
    const newClass: Partial<Class> = {
      name: this.classForm.value.name
    };
    this.classService.createClass(newClass as Class).subscribe(createdClass => {
      this.classes.push(createdClass);
      this.classForm.reset();
    });
  }
}
