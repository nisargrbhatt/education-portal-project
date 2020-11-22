import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherClassroomSelectComponent } from './teacher-classroom-select.component';

describe('TeacherClassroomSelectComponent', () => {
  let component: TeacherClassroomSelectComponent;
  let fixture: ComponentFixture<TeacherClassroomSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherClassroomSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherClassroomSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
