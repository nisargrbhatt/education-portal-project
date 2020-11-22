import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthModel } from './auth.model';

const BACKEND_URL = environment.apiUrl + '/user/';
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient, private router: Router) {}
  getProfile() {
    return this.http.get<{ message: string; userDetails: AuthModel }>(
      BACKEND_URL + 'getprofile'
    );
  }
  setupProfile(userId: string, profileData: FormData | any) {
    this.http
      .put<{ message: string }>(
        BACKEND_URL + 'setupuser/' + userId,
        profileData
      )
      .subscribe(
        (response) => {
          console.log(response.message);
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/login']);
        }
      );
  }
  updateProfile(userId: string, profileData: FormData | any) {
    this.http
      .put<{ message: string }>(
        BACKEND_URL + 'changeprofile/' + userId,
        profileData
      )
      .subscribe(
        (response) => {
          console.log(response.message);
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/login']);
        }
      );
  }
}
