import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.gard';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './header/header.component';
import {MatFormField, MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { ClassroomLayoutComponent } from './classroom-layout/classroom-layout.component';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { ManageClassComponent } from './manage-class/manage-class.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
  ],
  imports: [
    MatSelectModule,
    RouterModule.forRoot(routes),
    ManageClassComponent,
    ManageStudentsComponent,
    HeaderComponent,
    AppComponent,
    BrowserModule,
    RegisterComponent,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: ['http://localhost:3000/api/auth/login']
      }
    }),
    // Angular Material Modules
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatSelectionList,
    MatOptionModule
    
  ],
  exports: [
    AppComponent,
  ],
  providers: [AuthGuard, AuthService],
  bootstrap: []
})
export class AppModule { }
