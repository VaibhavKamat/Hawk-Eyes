import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Drone } from './../../classes/drone';
import { DroneService } from './../../services/drone-services/drone.service';
import { AirsimAlertsService } from './../../services/airsim-alerts-services/airsim-alerts.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { droneObjMock } from './../../classes/drone-mock';
import { extendsDirectlyFromObject } from '../../../../node_modules/@angular/core/src/render3/jit/directive';

@Component({
  selector: 'app-drone-info',
  templateUrl: './drone-info.component.html',
  styleUrls: ['./drone-info.component.scss']
})
export class DroneInfoComponent implements OnInit {


  constructor(private droneService: DroneService, private airsimAlertsService: AirsimAlertsService) { }

  droneObj: Drone;
  nodeSocketData: Subject<any>;
  airsimSocketData: Subject<any>;


  selectedDrone: Drone;


  ngOnInit() {
    // this.getDroneData();
    this.getDroneStreamData();
    this.nodeSocketData.subscribe(
      data => {
        console.log(data);
        this.droneObj = data.droneObj;
        this.nodeSocketData.next(data.droneObj.name);
      },
      err => {
        console.error('socket error' + err);
        // this.droneObj = droneObjMock;
      },
      () => {
      this.selectedDrone = this.droneObj;
        console.log('done');
      });

    // this.createAirsimAlertSocket();
    // this.airsimSocketData.subscribe(
    //   data => {
    //     console.log(data);
    //     this.airsimSocketData.next('you are compromised too');
    //   },
    //   err => console.error('socket error' + err),
    //   () => { console.log('alert complete '); }
    // );



   
  }



  getDroneStreamData(): void {
    this.nodeSocketData = this.droneService.connect()
      .pipe(map((response: any): any => response)) as Subject<any>;
  }

  // createAirsimAlertSocket(): void {
  //   // this.airsimSocketData = this.airsimAlertsService.connect()
  //   //          .pipe(map( (response: any): any => response )) as Subject<any>;
  // }


}
