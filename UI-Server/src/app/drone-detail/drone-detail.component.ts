import { Component, OnInit, Input } from '@angular/core';
import {Drone} from './../classes/drone';
@Component({
  selector: 'app-drone-detail',
  templateUrl: './drone-detail.component.html',
  styleUrls: ['./drone-detail.component.scss']
})
export class DroneDetailComponent implements OnInit {

  @Input() drone: Drone;
  constructor() { }

  ngOnInit() {
  }

}
