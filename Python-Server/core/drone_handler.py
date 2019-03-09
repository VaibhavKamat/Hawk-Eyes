import pprint

import airsim
import cv2
import numpy as np
from airsim.types import Quaternionr
import numpy as np

from vehicle_detection_main import run_detection
import json


class Instance:
    """
    Drone Handler class
    """

    def __init__(self):
        """
        constructor
        """
        self.__initiate()
        self.__capturing_image = False

    def is_capturing_image(self):
        return self.__capturing_image

    def __initiate(self):
        """
        Initiate the drone client
        :return: None
        """
        self.client = airsim.MultirotorClient()
        self.client.confirmConnection()
        self.client.enableApiControl(True)

    def is_api_control_enabled(self):
        if self.client.isApiControlEnabled() is False:
            self.client.enableApiControl(True)

        return True

    def ping_and_confirm_connection(self):
        return self.client.ping()

    def enable(self):
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
        self.enable()
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
        print("in move")
        print(x, y, z, v)
        default_yaw_mode = airsim.YawMode(is_rate=False)
        self.client.moveToPositionAsync(x, y, z, v, yaw_mode=default_yaw_mode).join()

    def move_and_change_camera_orientation(self, x, y, z, v, orientation: Quaternionr):
        """
        move the drone
        :param x:
        :param y:
        :param z:
        :param v:
        :param orientation:
        :return:
        """
        print(x, y, z, v)
        default_yaw_mode = airsim.YawMode(is_rate=False)
        self.client.moveToPositionAsync(x, y, z, v, yaw_mode=default_yaw_mode).join()
        self.set_camera_orientation(orientation)

    def land(self):
        """
        Reset the drone state
        :return:
        """
        self.client.enableApiControl(True)
        self.client.landAsync().join()
        self.client.armDisarm(False)

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
        return json.dumps(state)
        #return pprint.pformat(state)

    def set_camera_orientation(self, orientation: Quaternionr):
        """
        Gets the state of the drone
        :return:
        """
        self.client.simSetCameraOrientation(airsim.ImageType.Scene, orientation)

    def get_camera_info(self):
        return json.dumps(self.client.getCameraInfo(airsim.ImageType.Scene))
        #return pprint.pformat(self.client.getCameraInfo(airsim.ImageType.Scene))

    def get_position(self):
        position = self.client.simGetGroundTruthKinematics().position
        pos = dict()
        pos['x'] = position.x_val
        pos['y'] = position.y_val
        pos['z'] = position.z_val
        return json.dumps(pos)

    def get_camera_info_and_position(self):
        response = dict()
        response["camera"] = self.get_camera_info()
        response["position"] = self.get_position()

    def frame_generator(self, camera_name, image_type):
        idx = 1
        decode_extension = '.jpg'
        while True:
            response_image = self.client.simGetImage(camera_name, image_type)

            if response_image is not None:
                # print(response_image)
                np_response_image = np.asarray(bytearray(response_image))
                decoded_frame = cv2.imdecode(np_response_image, cv2.IMREAD_COLOR)
                ret, encoded_jpeg = cv2.imencode(decode_extension, decoded_frame)
                frame = encoded_jpeg.tobytes()
                idx = idx + 1
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

    def ml_frame_generator(self, camera_name, image_type):
        idx = 1
        decode_extension = '.jpg'
        while True:
            frame = self.client.simGetImage(camera_name, image_type)

            if frame is not None:
                np_response_image = np.asarray(bytearray(frame), dtype="uint8")
                decoded_frame = cv2.imdecode(np_response_image, cv2.IMREAD_COLOR)
                # ret, encoded_jpeg = cv2.imencode(decode_extension, decoded_frame)
                output_frame = run_detection(decoded_frame)
                ret, encoded_jpeg = cv2.imencode(decode_extension, output_frame)
                frame = encoded_jpeg.tobytes()
                idx = idx + 1
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

    def get_frame(self):
        camera_name = '0'
        image_type = airsim.ImageType.Scene
        frame = self.client.simGetImage(camera_name, image_type)
        return frame
