import { TestBed } from '@angular/core/testing';

import { TypeOfMaterialService } from './type-of-material.service';

describe('TypeOfMaterialService', () => {
  let service: TypeOfMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeOfMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
