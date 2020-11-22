import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherClassroomUpdateComponent } from './teacher-classroom-update.component';

describe('TeacherClassroomUpdateComponent', () => {
  let component: TeacherClassroomUpdateComponent;
  let fixture: ComponentFixture<TeacherClassroomUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherClassroomUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherClassroomUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
