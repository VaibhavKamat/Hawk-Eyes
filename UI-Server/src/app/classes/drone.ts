
interface LocationCoordinates {
    latitude: number;
    longitude: number;
}
interface Threat {
 message: string;
 level: string;
 
}
export class Drone {
    id: number;
    name: string;
    battery: number;
    locationName: string;
    position: LocationCoordinates;
    flightStatus: string;
    speed: number;
    altitude: number;
    upTime: number;
    timeLeft: number;
    signalStrength: string;
    threat: Threat;

}


// drone = {
//     id: "A0123G",
//     name: "Drone AR",
//     battery: 78,
//     locationName: "",
//     position: {
//           latitude: coordinates.x_val,
//       longitude: coordinates.y_val
//         },
//     flightStatus: "Online",
//     speed: 17,
//     altitude: 173,
//     upTime: 67,
//     timeLeft: 278,
//         signalStrength: "Good",
//         threat:{
//           message: "",
//           level: ""
//         }
//       }