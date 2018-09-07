import { TestBed, inject } from '@angular/core/testing';

import { ImageBankService } from './image-bank.service';

describe('ImageBankService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageBankService]
    });
  });

  it('should be created', inject([ImageBankService], (service: ImageBankService) => {
    expect(service).toBeTruthy();
  }));
});
