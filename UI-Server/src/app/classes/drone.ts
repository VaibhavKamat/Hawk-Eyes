
interface LocationCoordinates {
    latitude: number;
    longitude: number;
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
}

