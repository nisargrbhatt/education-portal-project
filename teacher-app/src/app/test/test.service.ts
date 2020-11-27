import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TestModel } from './test.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/test/';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private http: HttpClient) {}

  createTest(testData: any, classId: string) {
    this.http
      .post<{ message: string; testId: string }>(
        BACKEND_URL + 'create',
        testData
      )
      .subscribe(
        (response) => {
          console.log(response.message);
          let data = {
            test_id: response.testId,
          };
          this.http
            .put<{ message: string }>(
              environment.apiUrl + '/classroom/' + 'addtest/' + classId,
              data
            )
            .subscribe(
              (response1) => {
                console.log(response1.message);
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
  updateTest(testData: any, testId: string) {
    this.http
      .put<{ message: string }>(BACKEND_URL + 'update/' + testId, testData)
      .subscribe(
        (response) => {
          console.log(response.message);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  deleteTest(testId: string, classId: string) {
    this.http
      .delete<{ message: string }>(BACKEND_URL + 'delete/' + testId)
      .subscribe(
        (response) => {
          console.log(response.message);
          let data = {
            test_id: testId,
          };
          this.http
            .put<{ message: string }>(
              environment.apiUrl + '/classroom/' + 'cleartest/' + classId,
              data
            )
            .subscribe(
              (response1) => {
                console.log(response1.message);
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
  getTest(testId: string) {
    return this.http.get<{ message: string; test: TestModel }>(
      BACKEND_URL + 'gettest/' + testId
    );
  }
  getTestClassid(classId: string) {
    return this.http.get<{ message: string; test: TestModel[] }>(
      BACKEND_URL + 'gettestids/' + classId
    );
  }
}
