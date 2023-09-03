import { TestBed } from '@angular/core/testing';

import { SceneService } from './scene.service';

describe('ThreeService', () => {
  let service: SceneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SceneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
