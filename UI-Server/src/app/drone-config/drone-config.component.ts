import { Component, OnInit } from '@angular/core';
declare var $ :any;
@Component({
  selector: 'app-drone-config',
  templateUrl: './drone-config.component.html',
  styleUrls: ['./drone-config.component.scss']
})
export class DroneConfigComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
})