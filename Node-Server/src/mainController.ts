import * as config from 'config';
import { Request, Response } from 'express'
import * as dbUtils from './utils/db-utils';
import * as server from './server'
import * as net from 'net'
var http = require('http');
let http2 = require('http').Server(server);
let io = require('socket.io')(http2);
let coordinates : {};
let geoCoordinatesOffset : { "x" : number , "y" : number , "z" : number };
var geoStartCoordinates = { "x" : 120 , "y" : 110 , "z" : 100 };
let dronePort : Number = config.get('dronePort') as Number;
let droneHost : Function = config.get('droneHost') as Function;
let locationCounter = 0;
let coordinatesArray = [
    {  "x": 100,
       "y": 400,
       "z": 100
     },
      {  "x": 200,
       "y": 500,
       "z": 100
     },
      {  "x": 300,
       "y": 600,
       "z": 100
     }];
export function intiateSocketFlow(){
    io.on('connection', function(socket){

        io.emit('locationChanged', coordinates);
        
    });
    // var client = new net.Socket();
    // client.connect(dronePort,droneHost,function(){
    //     console.log("connected to python")
    //     client.write("commandReceived")
    // });

    // net.createServer(function(sock) {
    //     console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    //     sock.on('data', function(data) {
    //         console.log('DATA ' + sock.remoteAddress + ': ' + data);
    //         var coordinatesObj = data;

    //         sock.write('Data recived from drone : "' + data + '"');
            
    //     });
    
    //     sock.on('close', function(data) {
    //         console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    //     });
        
    // }).listen(dronePort, droneHost);


    startEmittingLocations(coordinatesArray)
    // console.log('Server listening for drone on ' + droneHost +':'+ dronePort);
    getVideoFeed({},function(data){
      console.log("video feed Data")
      console.log(data);
    })
}

async function startEmittingLocations(elements) {
    for (const element of elements) {
        await delay(400);
        console.log(element);
    }
}

async function delay(milliseconds: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function logUsers (userIds) {
  userIds.forEach(async userId => {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
  });

 
}

function sendCoordinatesToUI(coordinates){
    io.emit('locationChanged', coordinates);

}

function drone_takeOff(callback){
  var data = {
    'id': 1
  };
 performPostRequest(data,function(response){
    callback(response);
 });
}

function move(coordinates,callback){
     performPostRequest(coordinates,function(response){
         callback(response);
     });
}

function getVideoFeed(inputData,callback){
  var options = {
    port : config.get('videoFeedPort') as Number,
    path : "/get_image"
  }
  performGetRequest(inputData,options,function(data){
    callback(data)
  });
  
}

function performPostRequest(data,callback){

  let post_data = JSON.stringify(data);

  var options = {
    host: 'localhost',
    port: 5000,
    path: '/command',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(post_data),
      'Postman-Token': '52b3a298-7520-4592-b50c-9a499ad1e3ae',
      'cache-control': 'no-cache'
  }
  };


  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      callback(chunk);
    });
  });

  req.on('error', function(e) {
    callback(500);
  });

  // write data to request body
  req.write(post_data);
  req.end();

}


function performGetRequest(data,newOptions,callback){

  var options = {
    host: 'localhost',
    port: 5000,
    encoding: null,
    path: '/command',
    method: 'GET'
  };

  if(newOptions){
    options.port = newOptions.port;
    options.path = newOptions.path
  }

  console.log(options)
  var req = http.request(options, function(res) {
    res.on('data', function (chunk) {
      callback(chunk);
    });
  });

  req.on('error', function(e) {
    callback(500);
  });

  req.end();

}

//algorithm for new coordinates
function convertLocationCoordinates(newGeoCoordinates,index,simulatedCoordinates){
    var newSimulatedCoordinates;
    if(index != 0){
        newSimulatedCoordinates.x = newGeoCoordinates.x - geoCoordinatesOffset.x
        newSimulatedCoordinates.y = newGeoCoordinates.y - geoCoordinatesOffset.y
        newSimulatedCoordinates.z = newGeoCoordinates.z
    }
    else{
        calculateOffset(simulatedCoordinates);
        return simulatedCoordinates;
    }

    return newSimulatedCoordinates;
}



function calculateOffset(simulatedCoordinates){
    geoCoordinatesOffset.x = geoStartCoordinates.x - simulatedCoordinates.x
    geoCoordinatesOffset.y = geoStartCoordinates.y - simulatedCoordinates.y
    geoCoordinatesOffset.z = geoStartCoordinates.z - simulatedCoordinates.z
}

//refrences
/*

*/