import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../../auth.service';
import { ProfileService } from './../../profile.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.css'],
})
export class ProfileSetupComponent implements OnInit, OnDestroy {
  departments = [
    'Computer Engineering',
    'Information Technology',
    'Civil Engineering',
    'Mechanical Engineering',
    'Chemical Engineering',
    'Aeronotical Engineering',
  ];

  profileData: any;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  imagePath: string;

  private mode = 'create';
  private userId: string;
  private authStatusSub: Subscription;
  private isAuthenticated = false;

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }
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
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      department: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      contact_no: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.mode = 'edit';
        this.userId = paramMap.get('userId');
        this.isLoading = true;
        this.profileService.getProfile().subscribe((profileData) => {
          this.isLoading = false;
          this.profileData = profileData.userDetails;
          this.imagePath = this.profileData.photo;
          this.form.setValue({
            name: this.profileData.name,
            department: this.profileData.department,
            image: this.profileData.photo,
            contact_no: this.profileData.contact_no,
          });
        });
      } else {
        this.mode = 'create';
      }
    });
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onSavePost() {
    let profileDatas: FormData | any;
    if (this.form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      profileDatas = new FormData();
      profileDatas.append('name', this.form.value.name);
      profileDatas.append('department', this.form.value.department);
      profileDatas.append('photo', this.form.value.image, this.form.value.name);
      profileDatas.append('contact_no', this.form.value.contact_no);
      this.profileService.setupProfile(this.userId, profileDatas);
    } else {
      if (typeof this.form.value.image === 'object') {
        profileDatas = new FormData();
        profileDatas.append('name', this.form.value.name);
        profileDatas.append('department', this.form.value.department);
        profileDatas.append(
          'photo',
          this.form.value.image,
          this.form.value.name
        );
        profileDatas.append('contact_no', this.form.value.contact_no);
      } else {
        profileDatas = {
          name: this.form.value.name,
          department: this.form.value.department,
          photo: this.imagePath,
          contact_no: this.form.value.contact_no,
        };
      }
      this.profileService.updateProfile(this.userId, profileDatas);
    }

    this.form.reset();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
