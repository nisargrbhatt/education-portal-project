import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminClassroomComponent } from './admin/admin-classroom/admin-classroom.component';
import { Page404notfoundComponent } from './page404notfound/page404notfound.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'classroom-create',
    component: AdminClassroomComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-create',
    component: SignupComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: Page404notfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
