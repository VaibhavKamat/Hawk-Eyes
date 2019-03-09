import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneConfigComponent } from './drone-config.component';

describe('DroneConfigComponent', () => {
  let component: DroneConfigComponent;
  let fixture: ComponentFixture<DroneConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
