import { TestBed } from '@angular/core/testing';

import { ArtworkFramesService } from './artwork-frames.service';

describe('ArtworkFramesService', () => {
  let service: ArtworkFramesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtworkFramesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
