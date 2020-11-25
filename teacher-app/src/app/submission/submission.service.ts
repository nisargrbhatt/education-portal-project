import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { SubmissionModel } from './submission.model';

const BACKEND_URL = environment.apiUrl + '/submission/';
@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  constructor(private http: HttpClient) {}
  createSubmission(subData: any) {
    this.http
      .post<{ message: string }>(BACKEND_URL + 'create', subData)
      .subscribe(
        (response) => {
          console.log(response.message);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  updateSubmission(
    subId: string,
    subData: {
      submission_name: string;
      context: string;
      start_date: Date;
      due_date: Date;
    }
  ) {
    this.http
      .put<{ message: string }>(BACKEND_URL + 'update/' + subId, subData)
      .subscribe(
        (response) => {
          console.log(response.message);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  deleteSubmission(subId: string) {
    this.http
      .delete<{ message: string }>(BACKEND_URL + 'delete/' + subId)
      .subscribe(
        (response) => {
          console.log(response.message);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getSubmission(subId: string) {
    return this.http.get<{
      message: string;
      submission: SubmissionModel;
    }>(BACKEND_URL + 'getsubmission/' + subId);
  }
  getFullSubmission(subId: string) {
    return this.http.get<{ message: string; submission: [any] }>(
      BACKEND_URL + 'getsubmissionf/' + subId
    );
  }
  getSubmissions(classId: string) {
    return this.http.get<{ message: string; submission: SubmissionModel[] }>(
      BACKEND_URL + 'getsubmissionids/' + classId
    );
  }
}
