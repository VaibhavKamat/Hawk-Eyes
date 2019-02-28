import { Request, Response } from 'express'
import * as dbUtils from './utils/db-utils';
import * as server from './server'
import * as net from 'net'

var http = require('http').Server(server);
var io = require('socket.io')(http);
var coordinates = {};

const dronePort=0,droneHost=0;

io.on('connection', function(socket){

    io.emit('locationChanged', coordinates);
	
});




//refrences
/*
https://www.hacksparrow.com/tcp-socket-programming-in-node-js.html
*/