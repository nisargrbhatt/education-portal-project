import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TestModel } from './../test.model';
import { TestService } from './../test.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProfileService } from 'src/app/auth/profile.service';
import { AuthModel } from './../../auth/auth.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-test-attempt',
  templateUrl: './test-attempt.component.html',
  styleUrls: ['./test-attempt.component.css'],
})
export class TestAttemptComponent implements OnInit {
  private authStatusSub: Subscription;
  private isAuthenticated = false;
  isLoading = false;
  testId: string;
  private userId: string;
  private test: TestModel;
  testQuestion: any;
  private userDataAll: AuthModel;
  answer: string[] = [];
  index: number;
  myData: any;
  constructor(
    private testService: TestService,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
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
    this.isLoading = false;
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (response) => {
        console.log(response.message);
        this.userDataAll = response.userDetails;
        this.getTest();
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  getTest() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('testId')) {
        this.testId = paramMap.get('testId');
        this.testService.getTest(this.testId).subscribe(
          (response) => {
            console.log(response.message);
            this.test = response.test;
            this.testQuestion = this.test.test_questions;
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
  checkAttempt() {
    if (!this.test.test_responses) {
      return false;
    }
    let responseData = this.test.test_responses;
    let newResponses = responseData.map((data) => {
      return {
        s_id: data.s_id,
        name: data.name,
        enrollment_no: data.enrollment_no,
      };
    });
    let checkData = {
      s_id: this.userId,
      name: this.userDataAll.name,
      enrollment_no: this.userDataAll.enrollment_no,
    };
    this.index = newResponses.findIndex((data) => {
      return JSON.stringify(data) === JSON.stringify(checkData);
    });
    if (this.index > -1) {
      this.myData = this.test.test_responses[this.index];
      return true;
    } else {
      return false;
    }
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Okay', {
      duration: 2000,
    });
  }
  attemptTest(form: NgForm) {
    for (let i = 0; i < this.test.test_questions.length; i++) {
      let q = 'q' + i;
      this.answer.push(form.value[q]);
    }
    let testData = {
      s_id: this.userId,
      name: this.userDataAll.name,
      enrollment_no: this.userDataAll.enrollment_no,
      answers: this.answer,
    };
    this.testService.attempTest(this.testId, testData);
    this.openSnackBar('Test Attempted Successfully!');
    this.router.navigate(['/']);
  }
}
