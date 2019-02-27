import * as mongoose from 'mongoose';
import { Request, Response } from 'express'
const uri: string = 'mongodb://127.0.0.1:27017/test';
const uri2 = "mongodb+srv://hawkEye:nopassword@hawkeyes-hhhrr.mongodb.net/test?retryWrites=true"
mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Succesfully Connected!")
    }
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;

export interface Coordinates extends mongoose.Document {
    droneLocation:{
        velocity: number;
        coordinates:{
            x:number;
            y:number;
            z:number;
        }
    },
    droneId : string;
    imageData : any;

};

export const droneSchema = mongoose.Schema({
    droneId: {type:String, required: true},
    droneLocation: {type:Object, required: true},
    imageData: {type:Object, required: false},
});
  

var coordinates  = mongoose.model('coordinates', droneSchema);

export let getCoordinates = (req: Request, res: Response) => {
    coordinates.find({}, function (err, coord) {
        if (err) return console.log(err)
        res.send(coord);
      });
}

export let setCoordinates = (req: Request, res: Response) => {
    var requestBody = req.body.locationData;
    coordinates.collection.insert(requestBody, function (err, response) {
        if (err) {console.log(err) ;return res.send(err);}
        res.send(response);
      });
}

