import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthModel } from './../../auth/auth.model';
import { TestModel } from '../test.model';
import { AuthService } from './../../auth/auth.service';
import { TestService } from './../test.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/auth/profile.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  private isAuthenticated = false;
  isLoading = false;
  private userDataAll: AuthModel;
  tests: Array<TestModel[]> = [];
  tests1: Array<TestModel[]> = [];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private testService: TestService
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
    // this.isLoading = false;
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (response) => {
        console.log(response.message);
        this.userDataAll = response.userDetails;
        this.getTests();
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  getTests() {
    this.isLoading = true;
    if (this.userDataAll.subjects) {
      this.userDataAll.subjects.forEach((data) => {
        this.testService.getTestClassid(data).subscribe(
          (response) => {
            console.log(response.message);
            if (response.test.length) {
              // console.log(response.test);
              let testData = response.test;
              let validTest = testData.map((data) => {
                if (this.validShow(data.due_date)) {
                  return data;
                } else {
                  return null;
                }
              });
              let validTest1 = validTest.filter((data) => {
                return data != null;
              });
              let invalidTest = testData.map((data) => {
                if (!this.validShow(data.due_date)) {
                  return data;
                } else {
                  return null;
                }
              });
              let invalidTest1 = invalidTest.filter((data) => {
                return data != null;
              });
              // console.log(validTest1);
              // console.log(invalidTest1);
              if (validTest1) {
                // console.log('true');
                this.tests.push(validTest1);
              }
              if (invalidTest1) {
                this.tests1.push(invalidTest1);
              }
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
  validShow(due_date: Date) {
    const now = new Date();
    const due = new Date(due_date);
    if (now <= due) {
      return true;
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
