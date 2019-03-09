import { Component, OnInit } from '@angular/core';

import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DroneService } from './../services/drone-services/drone.service';
import { AirsimAlertsService } from './../services/airsim-alerts-services/airsim-alerts.service';
import * as io from 'socket.io-client';
import { catchError, map } from 'rxjs/operators';
import { droneObjMock } from './../classes/drone-mock';
import { extendsDirectlyFromObject } from '../../../node_modules/@angular/core/src/render3/jit/directive';
import {Drone} from './../classes/drone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  droneObj: Drone;
nodeSocketData: Subject<any>;
airsimSocketData: Subject<any>;
nodeSocket:any;

selectedDrone: Drone;
constructor(private droneService: DroneService, private airsimAlertsService: AirsimAlertsService) { }

  ngOnInit() {
  this.connect();


  this.getDroneStreamData();
  this.nodeSocketData.subscribe(
    data => {
    console.log(data);
    this.droneObj = data.droneObj;
    this.nodeSocketData.next(data.droneObj.name);
    },
    err => { console.error('socket error' + err);
             this.droneObj = droneObjMock;
           },
  () => {this.selectedDrone = this.droneObj;
         console.log('done'); });

  this.airsimSocketData.subscribe(
    data => {
      console.log(data);
      this.airsimSocketData.next('you are compromised too');
    },
    err => console.error('socket error' + err),
    () => { console.log('alert complete '); }
  );
  }

  connect(): Subject<MessageEvent> {
    this.nodeSocket = io("http://localhost:5000");
  
    const droneObservable = new Observable(observerD => {
      this.nodeSocket.on('droneUpdate', (data) => {
        observerD.next(data);
      });
      return () => this.nodeSocket.disconnect();
    });
  
    const observer = {
      next: (data: object) => {
          this.nodeSocket.emit('droneUpdate', JSON.stringify(data));
      },
  };
    return Subject.create(observer, droneObservable);
  }
  
  getDroneStreamData(): void {
    this.nodeSocketData = this.droneService.connect()
             .pipe(map( (response: any): any => response )) as Subject<any>;
  }

  // const observer = {
  //   next: (data: object) => {
  //       this.nodeSocket.emit('visionUpdate', JSON.stringify(data));
  //   },
}
