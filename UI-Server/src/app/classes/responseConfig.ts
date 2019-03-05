export class ResposeConfigs {
    captureImage: {
        name: string,
        location: string,
        type: string,
        size: number};
    returnToBase: {
        status: boolean;
        src: {
            lat: number;
            long: number;
        };
        dest: {
            lat: number;
            long: number;
        };
    };
};

