import { TestBed } from '@angular/core/testing';

import { AirsimAlertsService } from './airsim-alerts.service';

describe('AirsimAlertsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AirsimAlertsService = TestBed.get(AirsimAlertsService);
    expect(service).toBeTruthy();
  });
});
