import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthModel } from 'src/app/auth/auth.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from 'src/app/auth/profile.service';
import { SubmissionService } from '../submission.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type-pdf.validator';
import { SubmissionModel } from './../submission.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submission-upload',
  templateUrl: './submission-upload.component.html',
  styleUrls: ['./submission-upload.component.css'],
})
export class SubmissionUploadComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  private isAuthenticated = false;
  isLoading = false;
  private userDataAll: AuthModel;
  form: FormGroup;
  subId: string;
  index: number;
  private userId: string;
  submission: SubmissionModel;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private submissionService: SubmissionService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isLoading = true;
    this.userId = this.authService.getUserId();
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
    this.form = new FormGroup({
      file: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.isLoading = false;
  }
  getSubmission() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('subId')) {
        this.subId = paramMap.get('subId');
        this.submissionService.getSubmission(this.subId).subscribe(
          (response) => {
            console.log(response.message);
            this.submission = response.submission;
            this.isLoading = false;
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
          }
        );
      } else {
        console.log('No SubId in routes');
      }
    });
  }
  checkSubmit() {
    if (!this.submission.uploaded) {
      return false;
    }
    let uploadData = this.submission.uploaded;
    let newData = uploadData.map((data) => {
      return {
        id: data.id,
        name: data.name,
        enrollment_no: data.enrollment_no,
      };
    });
    let checkData = {
      id: this.userId,
      name: this.userDataAll.name,
      enrollment_no: this.userDataAll.enrollment_no,
    };
    if (newData.includes(checkData)) {
      this.index = newData.findIndex((data) => {
        return JSON.stringify(data) === JSON.stringify(checkData);
      });
      return true;
    } else {
      return false;
    }
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (response) => {
        console.log(response.message);
        this.userDataAll = response.userDetails;
        this.getSubmission();
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  uploadSubmission() {
    if (this.form.invalid) {
      return;
    }
    let subData = new FormData();
    subData.append('name', this.userDataAll.name);
    subData.append('enrollment_no', String(this.userDataAll.enrollment_no));
    subData.append('pdf', this.form.value.file, this.userDataAll.name);
    this.submissionService.uploadSubmission(subData, this.subId);
    this.openSnackBar('Submission Uploaded Successfully!');
    this.router.navigate(['/']);
  }
  deleteSubmission(data: any) {
    let subData = {
      id: this.userId,
      name: data.name,
      enrollment_no: data.enrollment_no,
      file: data.file,
      upload_time: data.upload_time,
    };
    this.submissionService.deleteUpload(this.subId, subData);
    this.openSnackBar('Submission Deleted Successfully!');
    this.router.navigate(['/']);
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
