import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = environment.apiUrl + '/classroom/';
@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

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
    return this.http.get<{
      message: string;
      lecture: { subject_name: string; timing: any; join: string };
    }>(BACKEND_URL + 'getlecture/' + classId);
  }
  enrollClassroom(enrollData: {
    subject_name: string;
    subject_code: number;
    name: string;
    studentId: string;
    enrollment_no: number;
  }) {
    this.http
      .put<{ message: string; classId: string }>(
        BACKEND_URL + 'enrollstudent',
        enrollData
      )
      .subscribe(
        (response) => {
          console.log(response.message);
          let sData = { subject: response.classId };
          this.http
            .put<{ message: string }>(
              environment.apiUrl + '/user/addsubject/' + enrollData.studentId,
              sData
            )
            .subscribe(
              (responseA) => {
                console.log(responseA.message);
                return;
              },
              (error) => {
                console.log(error);
              }
            );
        },
        (error) => {
          console.log(error);
        }
      );
  }
  unenrollClassroom(
    classId: string,
    studentData: { name: string; _id: string; enrollment_no: number }
  ) {
    this.http
      .put<{ message: string; classId: string }>(
        BACKEND_URL + 'unenrollstudent/' + classId,
        studentData
      )
      .subscribe((response) => {
        console.log(response.message);
        let sData = { subject: response.classId };
        this.http
          .put<{ message: string }>(
            environment.apiUrl + '/user/clearsubject/' + studentData._id,
            sData
          )
          .subscribe((responseA) => {
            console.log(responseA.message);
            return;
          });
      });
  }
  unenrollAllClassrooms(userId: string) {
    this.http
      .put<{ message: string }>(
        environment.apiUrl + '/user/clearallsubject/' + userId,
        null
      )
      .subscribe((response) => {
        console.log(response.message);
        return;
      });
  }
}
