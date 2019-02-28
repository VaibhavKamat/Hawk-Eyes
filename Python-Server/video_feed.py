"""
Starting point of rest application
"""
from flask import Flask, json, request, Response
import airsim
import cv2
import numpy as np
from flask import Response


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

camera_map = {
    0: "Scene",
    1: "DepthPlanner",
    2: "DepthPerspective",
    3: "DepthVis",
    4: "DisparityNormalized",
    5: "Segmentation",
    6: "SurfaceNormals",
    7: "Infrared"
}

app = Flask(__name__)


@app.route('/video_feed')
def video_feed():
    drone2 = Instance()
    camera_name = '0'
    image_type = airsim.ImageType.Scene
    return Response(
        drone2.frame_generator(camera_name, image_type),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
