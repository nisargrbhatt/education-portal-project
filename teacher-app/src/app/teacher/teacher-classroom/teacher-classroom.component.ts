import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { AuthService } from 'src/app/auth/auth.service';
import { TeacherService } from '../teacher.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-teacher-classroom',
  templateUrl: './teacher-classroom.component.html',
  styleUrls: ['./teacher-classroom.component.css'],
})
export class TeacherClassroomComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isLoading = false;
  private authStatusSub: Subscription;
  displayedColumns = ['name', 'enrollment_no'];
  dataSource: any;
  classId: string;
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
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('classId')) {
        this.classId = paramMap.get('classId');
        this.teacherService.getClassroomById(this.classId).subscribe(
          (response) => {
            console.log(response.message);
            this.classroom = response.classroom;
            this.dataSource = new MatTableDataSource(
              this.classroom.student_enrolled
            );
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log('Param Id not found');
      }
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
      });
    this.isLoading = false;
  }
  scheduleLecture(date: Date, time: any) {
    const lecData = {
      classId: this.classId,
      subject_code: this.classroom.subject_code,
      scheduled_lecture: {
        date: date,
        time: time,
      },
    };
    this.teacherService.scheduleLecture(lecData);
    this.ngOnInit();
  }
  addNotification(date: Date, content: string) {
    const notificationData = {
      subject_code: this.classroom.subject_code,
      date: date,
      content: content,
    };
    this.teacherService.addNotification(this.classId, notificationData);
  }
  unscheduleLecture() {
    const lecData = {
      classId: this.classId,
      subject_code: this.classroom.subject_code,
    };
    this.teacherService.unscheduleLecture(lecData);
    this.ngOnInit();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
