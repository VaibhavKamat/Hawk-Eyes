import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as io from 'socket.io-client';
import { catchError, map } from 'rxjs/operators';
import { Drone } from './../../classes/drone';
import {ResposeConfigs } from './../../classes/responseConfig';

import { DroneRequestErrorHandlersService } from './../error-handlers/drone-request-error-handlers.service';

@Injectable({
  providedIn: 'root'
})
export class DroneService {

  private nodeSocket;
 private url='http://10.244.46.21';

  private requestUri = {
    webnodeSocket: this.url+':3000',
    getData: this.url+':5000/data',
    captureImg: this.url+':5000/capture',
    updateSettings: this.url+':5000/update',
    returnToBase: this.url+':5000/return',
    takeOff:this.url+':3000/takeoff',
    initiate:this.url+':3000/initiateDroneMovement'
};

 private headersOptions = {
   headers: new HttpHeaders({
  'Content-Type':  'application/json',
})
 };

  constructor(private http: HttpClient) { }


  // Access 1 : accessing http client to fetchData
  getDroneData(): Observable<Drone> {
    return this.http.get<Drone>(this.requestUri.getData, this.headersOptions).pipe(
      catchError(DroneRequestErrorHandlersService.
        getDroneError)
    );
}

  // Access 2 : take/save picture of current view
  captureImage(): Observable<ResposeConfigs['captureImage']> {
    return this.http.get<ResposeConfigs['captureImage']>(this.requestUri.captureImg, this.headersOptions).pipe(
      catchError(DroneRequestErrorHandlersService.
        capturePictureError));
}

 // Access 3 : return to base
 returnToBase(): Observable<ResposeConfigs['returnToBase']> {
   return this.http.get<ResposeConfigs['returnToBase']>(this.requestUri.returnToBase).pipe(
     catchError(DroneRequestErrorHandlersService.
      returnToBaseError));
 }
 takeOff(): Observable<any> {
  return this.http.get<any>(this.requestUri.takeOff).pipe(
    catchError(DroneRequestErrorHandlersService.
      getDroneError));
}

initiateMovement(): Observable<any> {
  return this.http.get<any>(this.requestUri.initiate).pipe(
    catchError(DroneRequestErrorHandlersService.
      getDroneError));
}

 // Access 4 : update settings
 updateSettings(altitude, speed): Observable<Drone> {
   return this.http.post<Drone>(this.requestUri.updateSettings, {speed, altitude}).
   pipe(catchError(DroneRequestErrorHandlersService.
  updateSettingsError));
 }






// creating a subject to communicate with initial droneData webnodeSocket
connect(): Subject<MessageEvent> {
  this.nodeSocket = io(this.requestUri.webnodeSocket);

  const droneObservable = new Observable(observerD => {
    this.nodeSocket.on('droneUpdate', (data) => {
      observerD.next(data);
    });
    return () => this.nodeSocket.disconnect();
  });

  const observer = {
    next: (data: object) => {
        this.nodeSocket.emit('visionUpdate', JSON.stringify(data));
    },
};
  return Subject.create(observer, droneObservable);
}

  // Access 2: accessing mock data
  // getDroneData(): Observable<Drone[]>{
  //     return of(droneList);
  // }


}
