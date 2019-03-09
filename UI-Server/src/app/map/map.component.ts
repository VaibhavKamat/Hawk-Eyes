import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  constructor() { }
  canvas: any;
  ctx: any;
  path: any;
  bagroundPosition: number;
  marker: any;
  t:any;
  vertices = [
    {x:400,y:736},
    {x:360,y:720},
    {x:330,y:700},
    {x:295,y:640},
    {x:290,y:600},  
    {x:278,y:516},
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
    this.path = this.canvas.getContext('2d');
    this.marker = {
      x: 4,
      y: 77,
      r: 8
    };
    this.canvas.width = 800;
    this.canvas.height = 800;

    this.redraw();
    this.move(410,740);

  }


  redraw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath(); // draw the object marker
    this.ctx.arc(this.marker.x, this.marker.y, this.marker.r, 0, Math.PI * 2);
    this.ctx.fillStyle = 'blue';
    this.ctx.fill();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
    this.ctx.closePath();




  //   setInterval(() =>{
  //     amount += 0.01;        
  //     this.path.moveTo(startX, startY);
  //     this.path.lineTo(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
  //     this.path.stroke();
  // }, 30);

    // setInterval(() =>{
    //     amount += 0.01;  
    //     this.ctx.beginPath();      
    //     this.path.strokeStyle = "blue";
    //     this.path.moveTo(startX, startY);
    //     this.path.lineTo(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
    //     this.path.stroke();
    // }, 30);
  }

  move(x, y): void {
    var radius = 9 + Math.floor(Math.random() * Math.floor(2))
    this.marker.x = x;
    this.marker.y = y;
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

  // calc waypoints traveling along vertices
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
  
  
  var i= 1;
  var points = this.calcWaypoints(this.vertices);
  console.log({points });
  for (i = 1; i < points.length - 1; i++) {
    var ctx = this.ctx;;
  
    (function (i) {      
      setTimeout(() => {
        console.log("wudfajsghsjhdgajshdjhasjj",i);
        ctx.beginPath();  
        ctx.strokeStyle = "#6382f2";
        ctx.lineWidth = 8;     
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
      }, i*2)
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
