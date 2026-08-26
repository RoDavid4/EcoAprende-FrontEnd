import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomAssignmentsPage } from './classroom-assignments-page';

describe('ClassroomAssignmentsPage', () => {
  let component: ClassroomAssignmentsPage;
  let fixture: ComponentFixture<ClassroomAssignmentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomAssignmentsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomAssignmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
