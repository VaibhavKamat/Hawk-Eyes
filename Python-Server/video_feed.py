"""
Starting point of rest application
"""
import airsim
from flask import Flask, Response

from core import drone_handler

video_feed_drone = drone_handler.Instance()
#video_feed_ml_drone = drone_handler.Instance()
default_camera_type = "scene"
cameraTypeMap = {
    "depth": airsim.ImageType.DepthVis,
    "segmentation": airsim.ImageType.Segmentation,
    "seg": airsim.ImageType.Segmentation,
    "scene": airsim.ImageType.Scene,
    "disparity": airsim.ImageType.DisparityNormalized,
    "normals": airsim.ImageType.SurfaceNormals
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


@app.route('/video_feed_ml')
def video_feed_ml():
    camera_name = '0'
    image_type = airsim.ImageType.Scene

    return Response(
        video_feed_drone.ml_frame_generator(camera_name, image_type),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)

