import { TestBed } from '@angular/core/testing';

import { storageOrderUpdateService } from './storage-order-update.service';

describe('storageOrderUpdateService', () => {
  let service: storageOrderUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(storageOrderUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
