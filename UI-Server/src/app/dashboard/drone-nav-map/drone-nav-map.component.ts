import {Component, AfterViewInit, Input, OnChanges, SimpleChange} from '@angular/core';
import {Drone} from './../../classes/drone';
import { DroneService } from './../../services/drone-services/drone.service';

@Component({
  selector: 'app-drone-nav-map',
  templateUrl: './drone-nav-map.component.html',
  styleUrls: ['./drone-nav-map.component.scss']
})
export class DroneNavMapComponent implements AfterViewInit, OnChanges {

  @Input()
  drone: Drone;

  

  constructor(private droneService: DroneService) { }
  canvas: any;
  ctx: any;
  bagroundPosition: number;
  marker: any;
  vertices = [
    {x:400,y:736},
    {x:360,y:720},
    {x:330,y:700},
    {x:295,y:640},
    {x:290,y:600},  
    {x:278,y:516},
    {x:262,y:394},
    {x:255,y:340},
    {x:255,y:330},
    {x:255,y:320},
    {x:255,y:280},
    {x:260,y:260},
    {x:270,y:240},
    {x:290,y:200},
    {x:300,y:190},
    {x:340,y:160},
    {x:380,y:140},
    {x:440,y:100},
  ];



  ngAfterViewInit() {

    this.canvas = document.getElementById('mapCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.marker = {
      x: 4,
      y: 77,
      r: 8
    };
    this.canvas.width = 350;
    this.canvas.height = 350;
    this.redraw();
    this.move(180, 320);   
    this.droneService.takeOff()
      .subscribe(
        response => {
          console.log("teetteteteteteetet",response);
          if (response.status === true) {
              this.showPath();
          } else {
            console.log('command failed');
          }
        },
        err => console.log('command error' + err));
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {

    const x = this.drone.position.latitude % 100;
    const y = this.drone.position.longitude % 100;
    if (this.marker)
    this.move(280, 335);
    console.log("gyfggkahkh",this.drone.position);
  }

  redraw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath(); // draw the object marker
    this.ctx.arc(this.marker.x, this.marker.y, this.marker.r, 0, Math.PI * 2);
    this.ctx.fillStyle = 'blue';
    this.ctx.fill();
    var radius = 1;
    this.ctx.lineWidth = radius;
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
    this.ctx.closePath();
  }


  alert(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath(); // draw the object marker
    this.ctx.arc(this.marker.x, this.marker.y, this.marker.r, 0, Math.PI * 2);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    var radius = 1;
    this.ctx.lineWidth = radius;
    this.ctx.strokeStyle = 'red';
    this.ctx.stroke();
    this.ctx.closePath();
  }

  move(x, y): void {
    var radius = 6 + Math.floor(Math.random() * Math.floor(3))
    this.marker.x = x;
    this.marker.y = y;
    this.marker.r = radius;
    this.redraw();
  }


  moveDrone(self,x,y): void { 
    var decimal = Math.random();
    var radius = 6 + Math.floor(Math.random() * Math.floor(2));
    self.marker.x = x; 
    self.marker.y = y;
    self.marker.r = radius;
    self.redraw();
  }

  mockMove(self): void { 
    var decimal = Math.random();
    var radius = 6 + Math.floor(Math.random() * Math.floor(3));
    self.marker.x = decimal * .7 * self.canvas.width; 
    self.marker.y = decimal * self.canvas.height;
    self.marker.r = radius;
    self.redraw();
  }



  calcWaypoints(vertices) {
    var waypoints = [];
    for (var i = 1; i < vertices.length; i++) {
        var pt0 = vertices[i - 1];
        var pt1 = vertices[i];
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        for (var j = 0; j < 100; j++) {
            var x = pt0.x + dx * j / 100;
            var y = pt0.y + dy * j / 100;
            waypoints.push({
                x: x,
                y: y
            });
        }
    }
    return (waypoints);
  }



  showPath() {  
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    var moveDrone= this.moveDrone;    
    var i= 1;
    for (var i = 0; i < this.vertices.length; i++) {
      this.vertices[i].x=  this.vertices[i].x /2.22;
      this.vertices[i].y= this.vertices[i].y / 2.3;
    }

    var points = this.calcWaypoints(this.vertices);
    console.log({points });
    for (i = 1; i < points.length - 1; i++) {
      var ctx = this.ctx;;
      var self =this;
      (function (i) {      
        setTimeout(() => {        
          ctx.beginPath();  
          ctx.strokeStyle = "#6382f2";
          ctx.lineWidth = 8;     
          //ctx.moveTo( (points[i - 1].x /7) , points[i - 1].y/7);
          moveDrone(self,points[i].x, (points[i].y));
          ctx.stroke();
        },i*60)
      })(i);
    } 
    this.ctx.closePath();
    this.ctx.beginPath(); // draw the object marker
    this.ctx.arc(points[i].x+10, points[i].y-5, this.marker.r, 0, Math.PI * 2);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
    this.ctx.closePath();
   
  }



}
