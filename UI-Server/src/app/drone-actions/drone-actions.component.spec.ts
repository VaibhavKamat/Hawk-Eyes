import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneActionsComponent } from './drone-actions.component';

describe('DroneActionsComponent', () => {
  let component: DroneActionsComponent;
  let fixture: ComponentFixture<DroneActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
