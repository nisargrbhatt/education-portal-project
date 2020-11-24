import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionUploadComponent } from './submission-upload.component';

describe('SubmissionUploadComponent', () => {
  let component: SubmissionUploadComponent;
  let fixture: ComponentFixture<SubmissionUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
