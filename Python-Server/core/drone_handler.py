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
        print(x, y, z, v)
        default_yaw_mode = airsim.YawMode(is_rate=False)
        self.client.moveToPositionAsync(x, y, z, v, yaw_mode=default_yaw_mode).join()

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
        return pprint.pformat(state)

    def get_position(self):
        position = self.client.simGetGroundTruthKinematics().position
        return pprint.pformat(position)

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
