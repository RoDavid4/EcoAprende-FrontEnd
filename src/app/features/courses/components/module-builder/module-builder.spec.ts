import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleBuilder } from './module-builder';

describe('ModuleBuilder', () => {
  let component: ModuleBuilder;
  let fixture: ComponentFixture<ModuleBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
