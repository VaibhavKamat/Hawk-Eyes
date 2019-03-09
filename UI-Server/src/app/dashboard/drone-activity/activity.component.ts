import { Component, OnInit, Input, SimpleChanges, SimpleChange, setTestabilityGetter, OnChanges } from '@angular/core';
import { Drone } from './../../classes/drone';
import { droneObjMock } from 'src/app/classes/drone-mock';

@Component({
  selectothreatObj !== null'{
  console.log("threat detected");
  },
  templatethreatObj !== null.{
  console.log("threat detected");
  }component.html',
  styleUrthreatObj !== null.{
  console.log("threat detected");
  }component.scss']
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
    if(this.drone.threatObj !== null){
    console.log("threat detected");
    }
  }

  updateActivityList(droneObj): void {
    console.log('updated');
    let tempList2: any[] = [];
    this.tempList.push({
    locationInfo: droneObj.locationName,
    timeData: this.tempList.length-1
    })
    
    if(this.tempList.length > 5)
    tempList2 = this.tempList.slice(this.tempList.length-5);
    //this.tempList = this.tempList.reverse();

    this.activityList = tempList2.reverse();
}






 

  }

