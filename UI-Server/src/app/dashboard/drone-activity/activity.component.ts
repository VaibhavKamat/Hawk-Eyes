import { Component, OnInit, Input, SimpleChanges, SimpleChange, setTestabilityGetter, OnChanges } from '@angular/core';
import { Drone } from './../../classes/drone';
import { droneObjMock } from 'src/app/classes/drone-mock';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnChanges {
private drone: Drone;
  @Input()
  set setDrone(val: Drone){
  this.drone = val;
  }

  tempList: any[] = [];
  activityList: any[] = [];
  activitySize = 5;
  activityCount = 0;



  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
    const changeData: SimpleChange = changes.item;
    console.log("yeyeye");
    this.updateActivityList(this.drone);
    if(Object(this.drone.threatObj).keys.length !== -1)
    {
      console.log("threat");
    }
  }

  updateActivityList(droneObj): void {
    console.log('updated');
    this.tempList.push({
    locationInfo: droneObj.locationName,
    timeData: new Date()
  });

    this.tempList = this.tempList.slice(this.activityList.length - 5);
    this.tempList = this.tempList.reverse();
    this.activityList = this.tempList;
}


 

  }

