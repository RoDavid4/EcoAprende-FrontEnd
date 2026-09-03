import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionReview } from './submission-review';

describe('SubmissionReview', () => {
  let component: SubmissionReview;
  let fixture: ComponentFixture<SubmissionReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
