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
    timeData: 50 - this.tempList.length
    })
    
    if(this.tempList.length > 5)
    tempList2 = this.tempList.slice(this.tempList.length-5);
    //this.tempList = this.tempList.reverse();

    this.activityList = tempList2.reverse();
}






 

  }

