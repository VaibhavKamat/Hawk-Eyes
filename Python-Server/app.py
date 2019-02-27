"""
Starting point of rest application
"""
from flask import Flask, json, request

import pprint

import airsim
import cv2
import numpy as np


class Instance:
    """
    Drone Handler class
    """

    def __init__(self):
        """
        constructor
        """
        self.__initiate()

    def __initiate(self):
        """
        Initiate the drone client
        :return: None
        """
        self.client = airsim.MultirotorClient()
        self.client.confirmConnection()
        self.client.enableApiControl(True)

    def start(self):
        """
        Start the drone
        :return:
        """
        self.client.enableApiControl(True)
        self.client.armDisarm(True)

    def take_off(self):
        """
        Calls the takeoffAsync method.
        :return:
        """
        print("in take_off method")
        self.start()
        self.client.takeoffAsync().join()

    def move(self, x, y, z, v):
        """
        move the drone
        :param x:
        :param y:
        :param z:
        :param v:
        :return:
        """
        print(x, y, z, v)
        self.client.moveToPositionAsync(x, y, z, v).join()

    def reset(self):
        """
        Reset the drone state
        :return:
        """
        self.client.enableApiControl(True)
        self.client.armDisarm(False)
        self.client.reset()

    def get_landing_state(self):
        """
        get landing state of the drone
        :return:
        """
        return self.client.getMultirotorState().landed_state

    def is_flying(self):
        """
        Checks if the drone is flying
        :return:
        """
        return self.get_landing_state() == 1

    def get_stats(self):
        """
        Gets the state of the drone
        :return:
        """
        state = self.client.getMultirotorState()
        return pprint.pformat(state)

    def frame_generator(self, camera_name, image_type):
        decode_extension = '.jpg'
        while True:
            response_image = self.client.simGetImage(camera_name, image_type)
            np_response_image = np.asarray(bytearray(response_image), dtype="uint8")
            decoded_frame = cv2.imdecode(np_response_image, cv2.IMREAD_COLOR)
            ret, encoded_jpeg = cv2.imencode(decode_extension, decoded_frame)
            frame = encoded_jpeg.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


drone = Instance()

command_map = {
    1: {
        "method": drone.take_off,
        "args": False,
        "response": {
            "code": 200,
            "value": drone.get_landing_state
        }
    },
    2: {
        "method": drone.move,
        "args": True,
        "response": {
            "code": 200,
            "value": drone.get_stats
        }
    },
    3: {
        "method": drone.reset,
        "args": None,
        "response": {
            "code": 200,
            "value": drone.get_landing_state
        }
    },
}


def _execute(command_request):
    command_code = command_request["id"]
    method_detail = command_map[command_code]
    exec_method = method_detail["method"]
    if method_detail["args"] is True:
        method_args = command_request["args"]
        print(method_args)
        exec_method(**method_args)
    else:
        exec_method()
    response_code = method_detail["response"]["code"]
    response_value_method = method_detail["response"]["value"]
    value = response_value_method()
    return response_code, value


app = Flask(__name__)


# app.register_blueprint(command_api)


@app.route("/")
def hello():
    return "Hello User!"


@app.route("/command", methods=['POST', 'GET'])
def process_command():
    if request.method == 'POST':
        command_request = request.json
        code, value = _execute(command_request)
        response = app.response_class(
            response=json.dumps(value),
            status=code,
            mimetype='application/json'
        )
    else:
        response = app.response_class(
            response=json.dumps(command_map),
            status=200,
            mimetype='application/json'
        )
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
