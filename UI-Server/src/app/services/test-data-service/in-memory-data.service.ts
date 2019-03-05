import { Injectable } from '@angular/core';
import { InMemoryDbService } from '../../../../node_modules/angular-in-memory-web-api';
import { droneObjMock } from '../../classes/drone-mock';
import { Drone } from '../../classes/drone';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
createDb() {
  const drone: Drone = droneObjMock;
  return {drone};
}
  constructor() { }

}
