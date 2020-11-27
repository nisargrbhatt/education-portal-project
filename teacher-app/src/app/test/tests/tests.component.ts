import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { TestModel } from './../test.model';
import { TestService } from './../test.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit, OnDestroy {
  private isAuthenticated = false;
  private authStatusSub: Subscription;
  private classId: string;

  tests: TestModel[];
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
      this.getTests();
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
        if (this.isAuthenticated) {
          this.getTests();
        }
      });
    this.isLoading = false;
  }
  getTests() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('classId')) {
        this.classId = paramMap.get('classId');
        this.testService.getTestClassid(this.classId).subscribe(
          (response) => {
            console.log(response.message);
            this.tests = response.test;
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
