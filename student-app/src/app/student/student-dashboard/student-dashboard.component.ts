import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { StudentService } from './../student.service';
import { AuthService } from './../../auth/auth.service';
import { AuthModel } from './../../auth/auth.model';
import { ProfileService } from './../../auth/profile.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  private isAuthenticated = false;
  isLoading = false;
  private userDataAll: AuthModel;
  lectures: Array<any> = [];

  constructor(
    private studentService: StudentService,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
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
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (response) => {
        console.log(response.message);
        this.userDataAll = response.userDetails;

        this.getLectures();
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  getLectures() {
    this.isLoading = true;
    if (this.userDataAll.subjects) {
      this.userDataAll.subjects.forEach((subject) => {
        this.studentService.getLecture(subject).subscribe(
          (response) => {
            if (response.lecture.timing) {
              this.lectures.push(response.lecture);
            }
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
          }
        );
      });
      this.isLoading = false;
    }
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
