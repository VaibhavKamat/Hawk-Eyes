import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneNavMapComponent } from './drone-nav-map.component';

describe('DroneNavMapComponent', () => {
  let component: DroneNavMapComponent;
  let fixture: ComponentFixture<DroneNavMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneNavMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneNavMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
