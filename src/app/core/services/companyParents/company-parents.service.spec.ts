import { TestBed } from '@angular/core/testing';

import { CompanyParentsService } from './company-parents.service';

describe('CompanyParentsService', () => {
  let service: CompanyParentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyParentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
