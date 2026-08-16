import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomStudents } from './classroom-students';

describe('ClassroomStudents', () => {
  let component: ClassroomStudents;
  let fixture: ComponentFixture<ClassroomStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomStudents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomStudents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
