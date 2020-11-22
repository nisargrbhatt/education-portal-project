import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { AdminService } from './../admin.service';

@Component({
  selector: 'app-admin-classroom',
  templateUrl: './admin-classroom.component.html',
  styleUrls: ['./admin-classroom.component.css'],
})
export class AdminClassroomComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isLoading = false;
  form: FormGroup;
  departments = [
    'Computer Engineering',
    'Information Technology',
    'Civil Engineering',
    'Mechanical Engineering',
    'Chemical Engineering',
    'Aeronotical Engineering',
  ];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isLoading = true;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
      });
    this.form = new FormGroup({
      subject_name: new FormControl(null, {
        validators: [Validators.required],
      }),
      subject_code: new FormControl(null, {
        validators: [Validators.required],
      }),
      department: new FormControl(null, {
        validators: [Validators.required],
      }),
      semester: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
  }
  onCreateClassroom() {
    if (this.form.invalid) {
      return;
    }
    let classData = {
      subject_name: this.form.value.subject_name,
      subject_code: this.form.value.subject_code,
      department: this.form.value.department,
      semester: this.form.value.semester,
    };
    this.adminService.createClassroom(classData);
    this.router.navigate(['/admin']);
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
