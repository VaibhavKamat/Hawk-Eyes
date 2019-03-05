import {Component, AfterViewInit, Input} from '@angular/core';
import {Drone} from './../classes/drone';

@Component({
  selector: 'app-drone-nav-map',
  templateUrl: './drone-nav-map.component.html',
  styleUrls: ['./drone-nav-map.component.css']
})
export class DroneNavMapComponent implements AfterViewInit {

  @Input()
  drone: Drone;
  
  constructor() {}
  canvas: any;
  ctx: any;
  baground_position: number;
  marker: any;


  ngAfterViewInit() {
    this.canvas = document.getElementById("mapCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.marker = {
      x: 4,
      y: 77,
      r: 8 
    }
    this.canvas.width = 300;
    this.canvas.height = 300;

    this.redraw();
    this.move(55, 58);


    // stimulate mock position
    var self = this;
    setInterval(function () {
      self.mockMove(self);
    }, 1000)

  }

  redraw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
    this.ctx.beginPath(); //draw the object marker
    this.ctx.arc(this.marker.x, this.marker.y, this.marker.r, 0, Math.PI * 2);
    this.ctx.fillStyle = "blue";
    this.ctx.fill();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();
    this.ctx.closePath();
  }

  move(x, y): void {
    var radius = 6 + Math.floor(Math.random() * Math.floor(3))
    this.marker.x = x;
    this.marker.r = radius;
    this.redraw();
  }

  mockMove(self): void { 
    var decimal = Math.random();
    var radius = 6 + Math.floor(Math.random() * Math.floor(3));
    self.marker.x = decimal * .7 * self.canvas.width; 
    self.marker.y = decimal * self.canvas.height;
    self.marker.r = radius;
    self.redraw();
  }



}
