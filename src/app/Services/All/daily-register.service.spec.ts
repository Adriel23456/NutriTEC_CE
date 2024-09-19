import { TestBed } from '@angular/core/testing';

import { DailyRegisterService } from './daily-register.service';

describe('DailyRegisterService', () => {
  let service: DailyRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
