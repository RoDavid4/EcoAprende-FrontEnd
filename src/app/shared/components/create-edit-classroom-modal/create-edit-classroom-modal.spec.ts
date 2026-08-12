import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditClassroomModal } from './create-edit-classroom-modal';

describe('CreateEditClassroomModal', () => {
  let component: CreateEditClassroomModal;
  let fixture: ComponentFixture<CreateEditClassroomModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditClassroomModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditClassroomModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
