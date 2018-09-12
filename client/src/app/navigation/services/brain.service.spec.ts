import { TestBed, inject } from '@angular/core/testing';

import { BrainService } from './brain.service';

describe('BrainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrainService]
    });
  });

  it('should be created', inject([BrainService], (service: BrainService) => {
    expect(service).toBeTruthy();
  }));
});
