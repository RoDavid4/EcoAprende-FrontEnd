import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomRoster } from './classroom-roster';

describe('ClassroomRoster', () => {
  let component: ClassroomRoster;
  let fixture: ComponentFixture<ClassroomRoster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomRoster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomRoster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
