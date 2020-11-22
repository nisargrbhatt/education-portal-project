import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const BACKEND_URL1 = environment.apiUrl + '/classroom/';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}
  createClassroom(classData: {
    subject_name: string;
    subject_code: number;
    department: string;
    semester: number;
  }) {
    this.http
      .post<{ message: string }>(BACKEND_URL1 + 'create', classData)
      .subscribe(
        (response) => {
          console.log(response.message);
          return;
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
