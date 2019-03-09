import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsGraphsComponent } from './analytics-graphs.component';

describe('AnalyticsGraphsComponent', () => {
  let component: AnalyticsGraphsComponent;
  let fixture: ComponentFixture<AnalyticsGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsGraphsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
