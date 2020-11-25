import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material.module';
import { ErrorComponent } from './error/error.component';
import { Page404notfoundComponent } from './page404notfound/page404notfound.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ProfileSetupComponent } from './auth/profile/profile-setup/profile-setup.component';
import { ProfileShowComponent } from './auth/profile/profile-show/profile-show.component';
import { LoginComponent } from './auth/login/login.component';
import { TeacherClassroomComponent } from './teacher/teacher-classroom/teacher-classroom.component';
import { TeacherClassroomSelectComponent } from './teacher/teacher-classroom-select/teacher-classroom-select.component';
import { TeacherClassroomUpdateComponent } from './teacher/teacher-classroom-update/teacher-classroom-update.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SubmissionsComponent } from './submission/submissions/submissions.component';
import { SubmissionCreateComponent } from './submission/submission-create/submission-create.component';
import { SubmissionShowComponent } from './submission/submission-show/submission-show.component';

@NgModule({
  declarations: [
    AppComponent,
    Page404notfoundComponent,
    LoginComponent,
    ProfileSetupComponent,
    ProfileShowComponent,
    TeacherClassroomComponent,
    TeacherClassroomSelectComponent,
    TeacherClassroomUpdateComponent,
    TeacherDashboardComponent,
    HeaderComponent,
    SubmissionsComponent,
    SubmissionCreateComponent,
    SubmissionShowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
