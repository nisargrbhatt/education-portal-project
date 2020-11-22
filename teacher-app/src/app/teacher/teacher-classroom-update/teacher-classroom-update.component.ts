import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-teacher-classroom-update',
  templateUrl: './teacher-classroom-update.component.html',
  styleUrls: ['./teacher-classroom-update.component.css'],
})
export class TeacherClassroomUpdateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isAuthenticated = false;
  isLoading = false;
  private authStatusSub: Subscription;
  classId: string;
  departments = [
    'Computer Engineering',
    'Information Technology',
    'Civil Engineering',
    'Mechanical Engineering',
    'Chemical Engineering',
    'Aeronotical Engineering',
  ];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  classroom: any;

  constructor(
    private authService: AuthService,
    private teacherService: TeacherService,
    private router: Router,
    private route: ActivatedRoute
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
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('classId')) {
        this.classId = paramMap.get('classId');
        this.teacherService.getClassroomById(this.classId).subscribe(
          (response) => {
            console.log(response.message);
            this.classroom = response.classroom;
            this.form.setValue({
              subject_name: this.classroom.subject_name,
              subject_code: this.classroom.subject_code,
              department: this.classroom.department,
              semester: this.classroom.semester,
            });
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log('Param Id not found');
      }
    });
    this.isLoading = false;
  }
  onUpdateClassroom() {
    if (this.form.invalid) {
      return;
    }
    let classData = {
      subject_name: this.form.value.subject_name,
      subject_code: this.form.value.subject_code,
      department: this.form.value.department,
      semester: this.form.value.semester,
    };
    this.teacherService.updateClassroom(this.classId, classData);
    this.router.navigate(['/']);
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
