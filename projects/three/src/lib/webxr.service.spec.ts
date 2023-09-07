import { TestBed } from '@angular/core/testing';

import { WebXRService } from './webxr.service';

describe('WebxrService', () => {
  let service: WebXRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebXRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
