import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DroneInfoComponent } from './dashboard/drone-info/drone-info.component';
import { DroneDetailComponent } from './dashboard/drone-detail/drone-detail.component';
import { DroneActionsComponent } from './dashboard/drone-actions/drone-actions.component';
import { DroneNavMapComponent } from './dashboard/drone-nav-map/drone-nav-map.component';
import { ActivityComponent } from './dashboard/drone-activity/activity.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { DroneConfigComponent } from './drone-config/drone-config.component';
import { HeaderComponent } from './header/header.component';
import { SummaryComponent } from './analytics/summary/summary.component';
import { MapComponent } from './map/map.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; 
import { AnalyticsGraphsComponent } from './analytics/analytics-graphs/analytics-graphs.component';

@NgModule({
  declarations: [
    AppComponent,
    DroneInfoComponent,
    DroneDetailComponent,
    DroneActionsComponent,
    DroneNavMapComponent,
    ActivityComponent,
    HomeComponent,
    DroneConfigComponent,
    HeaderComponent, 
    SummaryComponent,
    MapComponent,
	AnalyticsGraphsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
	NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
