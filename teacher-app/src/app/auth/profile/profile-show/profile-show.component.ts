import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './../../auth.service';
import { ProfileService } from './../../profile.service';
import { AuthModel } from './../../auth.model';

@Component({
  selector: 'app-profile-show',
  templateUrl: './profile-show.component.html',
  styleUrls: ['./profile-show.component.css'],
})
export class ProfileShowComponent implements OnInit, OnDestroy {
  isLoading = false;
  userDataAll: AuthModel;
  isAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        this.isLoading = false;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
      });
    this.userId = this.authService.getUserId();
    this.profileService.getProfile().subscribe((response) => {
      this.userDataAll = response.userDetails;
      console.log(response.message);
    });
    this.isLoading = false;
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
