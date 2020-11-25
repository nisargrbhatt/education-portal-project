import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { AuthService } from 'src/app/auth/auth.service';
import { SubmissionService } from '../submission.service';
import { SubmissionModel } from './../submission.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
})
export class SubmissionsComponent implements OnInit, OnDestroy {
  private isAuthenticated = false;
  private authStatusSub: Subscription;
  private classId: string;

  submissions: SubmissionModel[];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmissionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isLoading = true;
    if (this.isAuthenticated) {
      this.getSubmission();
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
        if (this.isAuthenticated) {
          this.getSubmission();
        }
      });
    this.isLoading = false;
  }
  getSubmission() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('classId')) {
        this.classId = paramMap.get('classId');
        // console.log(this.classId);

        this.submissionService.getSubmissions(this.classId).subscribe(
          (response) => {
            console.log(response.message);
            this.submissions = response.submission;
            // console.log(this.submissions);

            this.isLoading = false;
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
          }
        );
      } else {
        console.log('No params');
      }
    });
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
