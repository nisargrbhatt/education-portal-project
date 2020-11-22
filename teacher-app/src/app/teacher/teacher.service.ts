import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/classroom/';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private http: HttpClient) {}

  updateClassroom(
    classId: string,
    classData: {
      subject_name: string;
      subject_code: number;
      department: string;
      semester: number;
    }
  ) {
    this.http
      .put<{ message: string }>(BACKEND_URL + '/update/' + classId, classData)
      .subscribe((response) => {
        console.log(response.message);
        return;
      });
  }
  assignFacultyClassroom(data: { classId: string; assignId: string }) {
    this.http
      .put<{ message: string }>(BACKEND_URL + 'assignfaculty', data)
      .subscribe((response) => {
        console.log(response.message);
        let sData = { subject: data.classId };
        this.http
          .put<{ message: string }>(
            environment.apiUrl + '/user/addsubject/' + data.assignId,
            sData
          )
          .subscribe((responseA) => {
            console.log(responseA.message);
            return;
          });
      });
  }
  unassignFacultyClassroom(data: { classId: string }, userId: string) {
    this.http
      .put<{ message: string }>(BACKEND_URL + 'unassignfaculty', data)
      .subscribe((response) => {
        console.log(response.message);
        let sData = { subject: data.classId };
        this.http
          .put<{ message: string }>(
            environment.apiUrl + '/user/clearsubject' + userId,
            sData
          )
          .subscribe((responseA) => {
            console.log(responseA.message);
            return;
          });
      });
  }
  addAttendance(
    subject_name: string,
    subject_code: number,
    date: Date,
    attendee: any
  ) {
    const attenData = {
      subject_name: subject_name,
      subject_code: subject_code,
      date: date,
      attendee: attendee,
    };
    this.http
      .put<{ message: string }>(BACKEND_URL + 'addattendance', attenData)
      .subscribe((response) => {
        console.log(response.message);
        return;
      });
  }
  scheduleLecture(lecData: {
    classId: string;
    subject_code: number;
    scheduled_lecture: {
      date: Date;
      time: any;
    };
  }) {
    this.http
      .put<{ message: string }>(BACKEND_URL + 'schedulelecture', lecData)
      .subscribe((response) => {
        console.log(response.message);
        return;
      });
  }
  unscheduleLecture(lecData: { classId: string; subject_code: number }) {
    this.http
      .put<{ message: string }>(BACKEND_URL + 'unschedulelecture', lecData)
      .subscribe((response) => {
        console.log(response.message);
        return;
      });
  }
  addNotification(
    classId: string,
    notificationData: {
      subject_code: string;
      date: Date;
      content: string;
    }
  ) {
    this.http
      .put<{ message: string }>(
        BACKEND_URL + 'addnotification/' + classId,
        notificationData
      )
      .subscribe((response) => {
        console.log(response.message);
        return;
      });
  }
  deleteNotification(classId: string, notification: any) {
    this.http
      .put<{ message: string }>(
        BACKEND_URL + 'deletenotification/' + classId,
        notification
      )
      .subscribe((response) => {
        console.log(response.message);
        return;
      });
  }
  getClassroomUU(userId: string) {
    return this.http.get<{ message: string; classroom: any }>(
      BACKEND_URL + 'classroomfaculty/' + userId
    );
  }
  getClassroomById(classId: string) {
    return this.http.get<{ message: string; classroom: any }>(
      BACKEND_URL + '/getclassroom/' + classId
    );
  }
  getClassroomByDS(department: string, semester: number) {
    return this.http.get<{ message: string; classroom: any }>(
      BACKEND_URL + '/classroomstudent/' + department + '/' + semester
    );
  }
  getNotification(classId: string) {
    return this.http.get<{
      message: string;
      subject_name: string;
      notification: [{ date: Date; content: string }];
      faculty: string;
    }>(BACKEND_URL + 'getnotification/' + classId);
  }
  getLecture(classId: string) {
    return this.http.get<{ message: string; notification: any }>(
      BACKEND_URL + 'getlecture/' + classId
    );
  }
}
