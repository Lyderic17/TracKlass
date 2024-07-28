import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClassroomLayoutComponent } from './classroom-layout/classroom-layout.component';
import { ManageClassComponent } from './manage-class/manage-class.component';
import { StudentPointsComponent } from './student-points/student-points.component';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { WheelOfNamesComponent } from './wheel-of-names/wheel-of-names.component';


export const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'classroom-layout', component: ClassroomLayoutComponent },
  { path: 'manage-classes', component: ManageClassComponent },
  { path: 'student-points', component: StudentPointsComponent },
  { path: 'manage-students', component: ManageStudentsComponent },
  { path: 'wheel-of-names', component: WheelOfNamesComponent },



];
