import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSubmissions } from './teacher-submissions';

describe('TeacherSubmissions', () => {
  let component: TeacherSubmissions;
  let fixture: ComponentFixture<TeacherSubmissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherSubmissions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherSubmissions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
