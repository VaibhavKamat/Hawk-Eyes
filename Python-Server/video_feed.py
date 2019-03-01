"""
Starting point of rest application
"""
import airsim
from flask import Flask, Response

from core import drone_handler

video_feed_drone = drone_handler.Instance()

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
    camera_name = '0'
    image_type = airsim.ImageType.Scene
    return Response(
        video_feed_drone.frame_generator(camera_name, image_type),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
