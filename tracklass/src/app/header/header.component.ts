import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  


  isLoggedIn: boolean = false;
  currentUser: string | null = null;
  @Output() sidenavToggle = new EventEmitter<void>();
  constructor(private authService: AuthService) { }

  ngOnInit() {
    // S'abonner aux changements de l'état d'authentification
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      console.log(this.isLoggedIn," islgoed");
    });

    // S'abonner aux changements du nom d'utilisateur
    this.authService.username.subscribe((username) => {
      console.log(username, "username");
      this.currentUser = username;
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleSidenav() {
    this.sidenavToggle.emit();
  }
}