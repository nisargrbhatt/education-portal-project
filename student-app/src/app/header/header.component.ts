import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../auth/profile.service';
import { StudentService } from '../student/student.service';
import { AuthModel } from './../auth/auth.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  isAuthenticated = false;
  isLoading = false;
  userId: string;
  userDataAll: AuthModel;
  userData: any;
  notifications: Array<any> = [];

  constructor(
    private studentService: StudentService,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userData = this.authService.getUserData();
    if (this.isAuthenticated) {
      this.getProfile();
    }
    if (!this.isAuthenticated) {
      this.isLoading = false;
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
  checks() {
    if (this.router.url == '/profile/create') {
      return false;
    } else {
      return true;
    }
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (response) => {
        console.log(response.message);
        this.userDataAll = response.userDetails;
        this.getNotifications();
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  getNotifications() {
    this.isLoading = true;
    if (this.userDataAll.subjects) {
      this.userDataAll.subjects.forEach((subject) => {
        this.studentService.getNotification(subject).subscribe(
          (response) => {
            console.log(response.message);
            if (response.notification.length) {
              this.notifications.push({
                subName: response.subject_name,
                notifi: response.notification,
                faculty: response.faculty,
                classId: subject,
              });
            }
          },
          (error) => {
            console.log(error);
          }
        );
      });
      this.isLoading = false;
    }
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
