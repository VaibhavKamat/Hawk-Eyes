import { TestBed } from '@angular/core/testing';

import { DroneRequestErrorHandlersService } from './drone-request-error-handlers.service';

describe('DroneRequestErrorHandlersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DroneRequestErrorHandlersService = TestBed.get(DroneRequestErrorHandlersService);
    expect(service).toBeTruthy();
  });
});
