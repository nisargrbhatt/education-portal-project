import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthModel } from 'src/app/auth/auth.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from './../../auth/profile.service';
import { SubmissionService } from './../submission.service';
import { SubmissionModel } from './../submission.model';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
})
export class SubmissionsComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  private isAuthenticated = false;
  isLoading = false;
  private userDataAll: AuthModel;
  submissions: [SubmissionModel[]];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private submissionService: SubmissionService
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
    this.isLoading = false;
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (response) => {
        console.log(response.message);
        this.userDataAll = response.userDetails;
        this.getSubmissions();
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  getSubmissions() {
    this.isLoading = true;
    this.userDataAll.subjects.forEach((data) => {
      this.submissionService.getSubmissions(data).subscribe(
        (response) => {
          console.log(response.message);
          this.submissions.push(response.submission);
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
    });
    this.isLoading = false;
  }
  validShow(due_date: Date) {
    const now = new Date();
    const due = new Date(due_date);
    if (now < due) {
      return true;
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
