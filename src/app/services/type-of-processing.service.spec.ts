import { TestBed } from '@angular/core/testing';

import { TypeOfProcessingService } from './type-of-processing.service';

describe('TypeOfProcessingService', () => {
  let service: TypeOfProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeOfProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
