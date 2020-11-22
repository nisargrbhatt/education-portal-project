import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassEnrollComponent } from './student-class-enroll.component';

describe('StudentClassEnrollComponent', () => {
  let component: StudentClassEnrollComponent;
  let fixture: ComponentFixture<StudentClassEnrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentClassEnrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentClassEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
