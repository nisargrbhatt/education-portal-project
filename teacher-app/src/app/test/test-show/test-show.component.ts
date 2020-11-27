import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { TestModel } from './../test.model';
import { TestService } from './../test.service';

@Component({
  selector: 'app-test-show',
  templateUrl: './test-show.component.html',
  styleUrls: ['./test-show.component.css'],
})
export class TestShowComponent implements OnInit, OnDestroy {
  private isAuthenticated = false;
  private authStatusSub: Subscription;
  testId: string;
  displayedColumns = ['name', 'enrollment_no', 'marks', 'submit_time'];
  dataSource: any;
  test: TestModel;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isLoading = true;
    if (this.isAuthenticated) {
      this.getTest();
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
        if (this.isAuthenticated) {
          this.getTest();
        }
      });

    this.isLoading = false;
  }
  getTest() {
    this.isLoading = true;
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('testId')) {
          this.testId = paramMap.get('testId');

          this.testService.getTest(this.testId).subscribe(
            (response) => {
              console.log(response.message);
              this.test = response.test;
              if (this.test.test_responses.length) {
                this.dataSource = new MatTableDataSource(
                  this.test.test_responses
                );
              }
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
      },
      (error) => {
        console.log(error);
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteTest(classId: string) {
    this.testService.deleteTest(this.testId, classId);
    this.router.navigate(['/']);
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
