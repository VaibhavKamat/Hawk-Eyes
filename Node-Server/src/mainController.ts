import * as config from 'config';
import { Request, Response } from 'express'
import * as dbUtils from './utils/db-utils';
import * as server from './server'
import * as net from 'net'
var fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch = Bluebird.promisifyAll(fetch);
var http = require('http').Server(server.server);
let io = require('socket.io')(http);
let coordinates: {};
let geoCoordinatesOffset: { "x": number, "y": number, "z": number };
var geoStartCoordinates = { "x": 120, "y": 110, "z": 100 };
let dronePort: Number = config.get('dronePort') as Number;
let droneHost: Function = config.get('droneHost') as Function;
let videoFeedPort: Number = config.get('videoFeedPort') as Number;
let locationCounter = 0;
let coordinatesArray = [
	{
		"id": 2,
		"args": {
			"x": 0,
			"y": 0,
			"z": 1,
			"v": 1
		}
	},
	{
		"id": 4,
		"args": {
			"orientation": {
				"w_val": 1,
				"x_val": 0,
				"y_val": 0,
				"z_val": -0.12
			}
		}
	},
	{
		"id": 2,
		"args": {
			"x": 6,
			"y": 0,
			"z": 1,
			"v": 1
		}
	},
	{
		"id": 4,
		"args": {
			"orientation": {
				"w_val": 1,
				"x_val": 0,
				"y_val": 0,
				"z_val": 0.19
			}
		}
	},
	{
		"id": 2,
		"args": {
			"x": 15,
			"y": 0,
			"z": 1,
			"v": 1
		}
	},
	{
		"id": 4,
		"args": {
			"orientation": {
				"w_val": 1,
				"x_val": 0,
				"y_val": 0,
				"z_val": 0.21
			}
		}
	},
	{
		"id": 2,
		"args": {
			"x": 20,
			"y": 0,
			"z": 1,
			"v": 1
		}
	},
	{
		"id": 4,
		"args": {
			"orientation": {
				"w_val": 1,
				"x_val": 0,
				"y_val": 0,
				"z_val": 0.29
			}
		}
	},
	{
		"id": 2,
		"args": {
			"x": 25,
			"y": 0,
			"z": 1,
			"v": 1
		}
	},
	{
		"id": 4,
		"args": {
			"orientation": {
				"w_val": 1,
				"x_val": 0,
				"y_val": 0,
				"z_val": 0.30
			}
		}
	},
	{
		"id": 2,
		"args": {
			"x": 68,
			"y": 48,
			"z": 1,
			"v": 1
		}
	},
	{
		"id": 4,
		"args": {
			"orientation": {
				"w_val": 1,
				"x_val": 0,
				"y_val": 0,
				"z_val": 0.7
			}
		}
	},
	{
		"id": 2,
		"args": {
			"x": 75,
			"y": 68,
			"z": 1,
			"v": 1
		}
	}
];
export function intiateSocketFlow() {
	io.on('connection', function (socket) {
		console.log("client connected")
		socket.on('uievent', (data) => {
			console.log('socketData: ' + JSON.stringify(data));
		});
		io.emit('coordinates', coordinates);

	});
	var client = new net.Socket();

	// client.connect(50000,"localhost",function(){
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
	// console.log('Server listening for drone on ' + droneHost +':'+ dronePort);

}

export function initiateDroneMovement() {
	startEmittingLocations(coordinatesArray);
}

export function takeOff() {
	drone_takeOff(function (response) {
		console.log(response)
	})
}

export function getVideoFeedData() {
	getVideoFeed(function (data) {
		console.log("video feed Data")
		console.log(data);
	})
}
async function startEmittingLocations(coordinatesArray) {
	runner(sendCoordinatesDrone);
}


function* sendCoordinatesDrone() {
	coordinates = coordinatesArray;
	var url = "http://" + droneHost + ":" + dronePort + "/command"
	// coordinates.forEach( coordinateObj => {
	for (var obj in coordinates) {
		const options = {
			method: 'POST',
			body: JSON.stringify(coordinates[obj]),
			headers: {
				'Content-Type': 'application/json'
			}
		};
		console.log(url)
		console.log(options)
		const response = yield fetch(url, options);
		const data = yield response.json();
		const user = data
		console.log(user);
		sendCoordinatesToUI(user);
	}
	// });

}

function runner(genFun) {
	const itr = genFun();
	function run(arg) {
		const result = itr.next(arg);
		if (result.done) {
			return result.value;
		} else {
			return Promise.resolve(result.value).then(run);
		}
	}
	return run(undefined);
}


function sendCoordinatesToUI(coordinates) {
	io.emit('coordinates', coordinates);

}

function drone_takeOff(callback) {
	var data = {
		'id': 1
	};
	performPostRequest(data, function (response) {
		callback(response);
	});
}

function move(coordinates, callback) {
	performPostRequest(coordinates, function (response) {
		callback(response);
	});
}

function getVideoFeed(callback) {
	var options = {
		port: config.get('videoFeedPort') as Number,
		path: "/video_feed"
	}
	performGetRequest({}, options, function (data) {
		callback(data)
	});

}

function performPostRequest(data, callback) {

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


	var req = http.request(options, function (res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			callback(chunk);
		});
	});

	req.on('error', function (e) {
		callback(500);
	});

	// write data to request body
	req.write(post_data);
	req.end();

}


function performGetRequest(data, newOptions, callback) {

	var options = {
		host: 'localhost',
		port: 5000,
		encoding: null,
		path: '/command',
		method: 'GET'
	};

	if (newOptions) {
		options.port = newOptions.port;
		options.path = newOptions.path
	}

	console.log(options)
	var req = http.request(options, function (res) {
		res.on('data', function (chunk) {
			callback(chunk);
		});
	});

	req.on('error', function (e) {
		callback(500);
	});

	req.end();

}

//algorithm for new coordinates
function convertLocationCoordinates(newGeoCoordinates, index, simulatedCoordinates) {
	var newSimulatedCoordinates;
	if (index != 0) {
		newSimulatedCoordinates.x = newGeoCoordinates.x - geoCoordinatesOffset.x
		newSimulatedCoordinates.y = newGeoCoordinates.y - geoCoordinatesOffset.y
		newSimulatedCoordinates.z = newGeoCoordinates.z
	}
	else {
		calculateOffset(simulatedCoordinates);
		return simulatedCoordinates;
	}

	return newSimulatedCoordinates;
}



function calculateOffset(simulatedCoordinates) {
	geoCoordinatesOffset.x = geoStartCoordinates.x - simulatedCoordinates.x
	geoCoordinatesOffset.y = geoStartCoordinates.y - simulatedCoordinates.y
	geoCoordinatesOffset.z = geoStartCoordinates.z - simulatedCoordinates.z
}

//refrences
/*

*/









