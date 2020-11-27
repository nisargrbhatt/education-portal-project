import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { TestService } from './../test.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { TestModel } from './../test.model';

@Component({
  selector: 'app-test-create',
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.css'],
})
export class TestCreateComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private testId: string;
  private classId: string;
  private className: string;
  private authStatusSub: Subscription;
  private isAuthenticated = false;
  private test: TestModel;
  isLoading = false;
  form: FormGroup;
  questions: Array<{
    question: string;
    options: string[];
    answer: string;
  }> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
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
      test_name: new FormControl(null, {
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
      } else if (paramMap.has('testId')) {
        this.mode = 'edit';
        this.testId = paramMap.get('testId');
        this.testService.getTest(this.testId).subscribe(
          (response) => {
            console.log(response.message);
            this.test = response.test;
            this.form.setValue({
              test_name: this.test.test_name,
              start_date: this.test.start_date,
              due_date: this.test.due_date,
            });
            this.questions = this.test.test_questions;
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

    this.isLoading = false;
  }
  addQuestion(form: NgForm) {
    let ops = [];
    ops.push(form.value.op1);
    ops.push(form.value.op2);
    ops.push(form.value.op3);
    ops.push(form.value.op4);
    let questionData = {
      question: form.value.question,
      options: ops,
      answer: ops[Number(form.value.answer)],
    };
    this.questions.push(questionData);
    form.reset();
  }
  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }
  checkInvalid() {
    if (this.form.invalid || this.questions.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  saveTest() {
    let testData;
    if (this.form.invalid || this.questions.length == 0) {
      return;
    }
    if (this.mode == 'create') {
      testData = {
        test_name: this.form.value.test_name,
        start_date: this.form.value.start_date,
        due_date: this.form.value.due_date,
        classroom_name: this.className,
        classroom_id: this.classId,
        test_question: this.questions,
      };
      this.testService.createTest(testData, this.classId);
      this.router.navigate(['/']);
    } else if (this.mode == 'edit') {
      testData = {
        test_name: this.form.value.test_name,
        start_date: this.form.value.start_date,
        due_date: this.form.value.due_date,
        test_question: this.questions,
      };
      this.testService.updateTest(testData, this.testId);
      this.router.navigate(['/']);
    } else {
      console.log('What is this?');
    }
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
