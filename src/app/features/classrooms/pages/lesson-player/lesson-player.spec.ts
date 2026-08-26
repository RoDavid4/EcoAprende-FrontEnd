import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlayer } from './lesson-player';

describe('LessonPlayer', () => {
  let component: LessonPlayer;
  let fixture: ComponentFixture<LessonPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
