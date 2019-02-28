import * as config from 'config';
import { Request, Response } from 'express'
import * as dbUtils from './utils/db-utils';
import * as server from './server'
import * as net from 'net'

let http = require('http').Server(server);
let io = require('socket.io')(http);
let coordinates : {};
let geoCoordinatesOffset : { "x" : number , "y" : number , "z" : number };
var geoStartCoordinates = { "x" : 120 , "y" : 110 , "z" : 100 };
let dronePort : Number = config.get('dronePort') as Number;
let droneHost : Function = config.get('droneHost') as Function;
let locationCounter = 0;

export function intiateSocketFlow(){
    io.on('connection', function(socket){

        io.emit('locationChanged', coordinates);
        
    });
    
    net.createServer(function(sock) {
        console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
        sock.on('data', function(data) {
            console.log('DATA ' + sock.remoteAddress + ': ' + data);
            var coordinatesObj = data;

            sock.write('Data recived from drone : "' + data + '"');
            
        });
    
        sock.on('close', function(data) {
            console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
        });
        
    }).listen(dronePort, droneHost);


    console.log('Server listening for drone on ' + droneHost +':'+ dronePort);
}

function sendCoordinatesToUI(coordinates){
    io.emit('locationChanged', coordinates);

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