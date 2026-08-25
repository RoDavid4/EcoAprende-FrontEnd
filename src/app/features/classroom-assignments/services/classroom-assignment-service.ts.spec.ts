import { TestBed } from '@angular/core/testing';

import { ClassroomAssignmentService } from './classroom-assignment-service.ts';

describe('ClassroomAssignmentService', () => {
  let service: ClassroomAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassroomAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
