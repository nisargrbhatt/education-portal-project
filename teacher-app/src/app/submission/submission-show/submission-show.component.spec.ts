import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionShowComponent } from './submission-show.component';

describe('SubmissionShowComponent', () => {
  let component: SubmissionShowComponent;
  let fixture: ComponentFixture<SubmissionShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
