import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthModel } from 'src/app/auth/auth.model';
import { AuthService } from './../../auth/auth.service';
import { ProfileService } from './../../auth/profile.service';
import { StudentService } from './../student.service';

@Component({
  selector: 'app-student-class-enroll',
  templateUrl: './student-class-enroll.component.html',
  styleUrls: ['./student-class-enroll.component.css'],
})
export class StudentClassEnrollComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  isAuthenticated = false;
  isLoading = false;
  private userDataAll: AuthModel;
  private userId: string;
  classrooms: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private studentService: StudentService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isLoading = true;
    if (this.isAuthenticated) {
      this.getProfile();
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
        if (this.isAuthenticated) {
          this.getProfile();
        }
      });
    this.userId = this.authService.getUserId();

    this.isLoading = false;
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (response) => {
        console.log(response.message);
        this.userDataAll = response.userDetails;
        this.getClassroom();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getClassroom() {
    this.studentService
      .getClassroomByDS(this.userDataAll.department, this.userDataAll.semester)
      .subscribe((response) => {
        console.log(response.message);
        this.classrooms = response.classroom;
        this.isLoading = false;
      });
  }
  checkIT(classId: string) {
    if (!this.userDataAll.subjects) {
      return false;
    }
    if (this.userDataAll.subjects.includes(classId)) {
      return true;
    } else {
      return false;
    }
  }
  enrollClassroom(subject_name: string, subject_code: number) {
    const enrollData = {
      subject_name: subject_name,
      subject_code: subject_code,
      name: this.userDataAll.name,
      studentId: this.userId,
      enrollment_no: this.userDataAll.enrollment_no,
    };
    // console.log(enrollData);

    this.studentService.enrollClassroom(enrollData);
    this.openSnackBar('You have Enrolled Classroom Successfully!');
    this.getProfile();
  }
  unenrollClassroom(classId: string) {
    const studentData = {
      name: this.userDataAll.name,
      _id: this.userId,
      enrollment_no: this.userDataAll.enrollment_no,
    };

    this.studentService.unenrollClassroom(classId, studentData);
    this.openSnackBar('You have Unenrolled Classroom Successfully!');
    this.getProfile();
  }
  unenrollAllClassrooms() {
    const studentData = {
      name: this.userDataAll.name,
      _id: this.userId,
      enrollment_no: this.userDataAll.enrollment_no,
    };
    let subjects = this.userDataAll.subjects;
    subjects.forEach((subject) => {
      this.studentService.unenrollClassroom(subject, studentData);
    });
    this.openSnackBar('All Classes unenrolled Successfully!');
    this.getProfile();
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Okay', {
      duration: 2000,
    });
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
