import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { StudentClassEnrollComponent } from './student/student-class-enroll/student-class-enroll.component';
import { Page404notfoundComponent } from './page404notfound/page404notfound.component';
import { ProfileSetupComponent } from './auth/profile/profile-setup/profile-setup.component';
import { ProfileShowComponent } from './auth/profile/profile-show/profile-show.component';
import { SubmissionsComponent } from './submission/submissions/submissions.component';
import { SubmissionUploadComponent } from './submission/submission-upload/submission-upload.component';
import { TestsComponent } from './test/tests/tests.component';
import { TestAttemptComponent } from './test/test-attempt/test-attempt.component';

const routes: Routes = [
  { path: '', component: StudentDashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile',
    component: ProfileShowComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/create',
    component: ProfileSetupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/edit/:userId',
    component: ProfileSetupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'studentsubjects',
    component: StudentClassEnrollComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'submissions',
    component: SubmissionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'submission/:subId',
    component: SubmissionUploadComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tests',
    component: TestsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'test/:testId',
    component: TestAttemptComponent,
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
