import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCreateComponent } from './test-create.component';

describe('TestCreateComponent', () => {
  let component: TestCreateComponent;
  let fixture: ComponentFixture<TestCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
