import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DroneInfoComponent } from './dashboard/drone-info/drone-info.component';
import { DroneConfigComponent } from './drone-config/drone-config.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'drone-config', component: DroneConfigComponent },
  { path: 'dashboard', component: DroneInfoComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}