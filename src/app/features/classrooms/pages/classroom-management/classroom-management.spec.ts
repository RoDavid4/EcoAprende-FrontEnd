import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomManagement } from './classroom-management';

describe('ClassroomManagement', () => {
  let component: ClassroomManagement;
  let fixture: ComponentFixture<ClassroomManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
