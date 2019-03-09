import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as io from 'socket.io-client';
import { catchError, map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { Coordinates } from './../coordinates'


@Injectable({
  providedIn: 'root'
})
export class AirsimAlertsService {

  private airsimSocket;
  private socketNew;
  currentDocument = this.socket.fromEvent<Coordinates>('coordinates');
  documents = this.socket.fromEvent<string[]>('coordinates');

  private requestUri = {
    websocketAirsim: 'http://localhost:3000/',
};
  constructor(private http: HttpClient,private socket: Socket) { }

  // connect(): Subject<MessageEvent> {
  //   this.airsimSocket = io(this.requestUri.websocketAirsim);
  //   const droneObservable = new Observable(observerD => {
  //     this.airsimSocket.on('highAlert', (data) => {
  //       observerD.next(data);
  //     });
  //     return () => this.airsimSocket.disconnect();
  //   });

  //   const observer = {
  //     next: (data: object) => {
  //         this.airsimSocket.emit('uiHighAlert', JSON.stringify(data));
  //     },
      
  // };
  //   return Subject.create(observer, droneObservable);
  // }
  ngOnInit(): void {
    this.socketNew = io.connect(this.requestUri.websocketAirsim)

    this.socketNew.on('coordinates', (data) => {
      console.log('coordinates: '+JSON.stringify(data));
    });
  }

 }
