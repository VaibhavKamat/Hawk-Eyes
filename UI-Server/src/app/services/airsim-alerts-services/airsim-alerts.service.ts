import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as io from 'socket.io-client';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AirsimAlertsService {

  private airsimSocket;


  private requestUri = {
    websocketAirsim: 'http://localhost:2000/',
};
  constructor(private http: HttpClient) { }

  connect(): Subject<MessageEvent> {
    this.airsimSocket = io(this.requestUri.websocketAirsim);
    const droneObservable = new Observable(observerD => {
      this.airsimSocket.on('highAlert', (data) => {
        observerD.next(data);
      });
      return () => this.airsimSocket.disconnect();
    });
    const observer = {
      next: (data: object) => {
          this.airsimSocket.emit('uiHighAlert', JSON.stringify(data));
      },
  };
    return Subject.create(observer, droneObservable);
  }

 }
