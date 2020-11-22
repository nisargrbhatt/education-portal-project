import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private authStatusSub: Subscription;
  isLoading = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
        if (authStatus) {
          this.router.navigate(['/']);
        }
      });
    this.isLoading = false;
  }
  onSaveData() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const authData = {
      email: this.form.value.email,
      password: this.form.value.password,
    };
    this.authService.login(authData);
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
