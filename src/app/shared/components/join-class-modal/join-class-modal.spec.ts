import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinClassModal } from './join-class-modal';

describe('JoinClassModal', () => {
  let component: JoinClassModal;
  let fixture: ComponentFixture<JoinClassModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinClassModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinClassModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
