import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from './../../auth/auth.service';
import { TeacherService } from './../teacher.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isLoading = false;
  private authStatusSub: Subscription;
  private userId: string;
  classrooms: [any];

  constructor(
    private authService: AuthService,
    private teacherService: TeacherService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.isLoading = true;
    if (this.isAuthenticated) {
      this.getClassroom();
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
        if (this.isAuthenticated) {
          this.getClassroom();
        }
      });
    this.isLoading = false;
  }
  getClassroom() {
    this.isLoading = true;
    this.teacherService.getClassroomUU(this.userId).subscribe(
      (response) => {
        console.log(response.message);
        this.classrooms = response.classroom;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
