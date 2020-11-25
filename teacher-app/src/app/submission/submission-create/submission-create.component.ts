import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SubmissionService } from './../submission.service';
import { SubmissionModel } from './../submission.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-submission-create',
  templateUrl: './submission-create.component.html',
  styleUrls: ['./submission-create.component.css'],
})
export class SubmissionCreateComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private subId: string;
  private classId: string;
  private className: string;
  private isAuthenticated = false;
  private submission: SubmissionModel;
  private authStatusSub: Subscription;
  isLoading = false;

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmissionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isLoading = true;
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
      });
    this.form = new FormGroup({
      submission_name: new FormControl(null, {
        validators: [Validators.required],
      }),
      context: new FormControl(null, {
        validators: [Validators.required],
      }),
      start_date: new FormControl(null, {
        validators: [Validators.required],
      }),
      due_date: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('classId') && paramMap.has('className')) {
        this.mode = 'create';
        this.classId = paramMap.get('classId');
        this.className = paramMap.get('className');
      } else if (paramMap.has('subId')) {
        this.mode = 'edit';
        this.subId = paramMap.get('subId');
        this.submissionService.getSubmission(this.subId).subscribe(
          (response) => {
            console.log(response.message);
            this.submission = response.submission;
            this.form.setValue({
              submission_name: this.submission.submission_name,
              context: this.submission.context,
              start_date: this.submission.start_date,
              due_date: this.submission.due_date,
            });
            this.isLoading = false;
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
          }
        );
      } else {
        console.log('No Params');
        this.isLoading = false;
      }
    });
  }
  onSaveSubmission() {
    let submissionData;
    if (this.form.invalid) {
      return;
    }
    if (this.mode == 'create') {
      submissionData = {
        submission_name: this.form.value.submission_name,
        context: this.form.value.context,
        start_date: this.form.value.start_date,
        due_date: this.form.value.due_date,
        classroom_name: this.className,
        classroom_id: this.classId,
      };
      this.submissionService.createSubmission(submissionData);
      this.router.navigate(['/']);
    } else if (this.mode == 'edit') {
      submissionData = {
        submission_name: this.form.value.submission_name,
        context: this.form.value.context,
        start_date: this.form.value.start_date,
        due_date: this.form.value.due_date,
      };
      this.submissionService.updateSubmission(this.subId, submissionData);
      this.router.navigate(['/']);
    }
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
