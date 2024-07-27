import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '../models/login.model';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule,
     MatFormFieldModule, MatLabel, MatError, MatSpinner, MatCard, MatInput],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm!.invalid) {
      return;
    }
    this.authService.login(this.loginForm!.value).subscribe({
      next: (res: any) => {
        this.router.navigate(['/dashboard']); // Redirect to your desired route after login
      },
      error: (err) => {
        this.errorMessage = 'Invalid login credentials';
      }
    });
  }
}
