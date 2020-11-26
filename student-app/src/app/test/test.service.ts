import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TestModel } from './test.model';

const BACKEND_URL = environment.apiUrl + '/test/';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private http: HttpClient) {}

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
  attempTest(testId: string, testData: any) {
    this.http
      .put<{ message: string }>(
        BACKEND_URL + 'adduserresponse/' + testId,
        testData
      )
      .subscribe(
        (response) => {
          console.log(response.message);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
