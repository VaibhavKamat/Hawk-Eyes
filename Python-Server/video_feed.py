"""
Starting point of rest application
"""
import os
from threat_detection import Detector
import cv2
import numpy as np
from flask import Flask, Response

detector = Detector()


def image_processor():
    DECODE_EXTENSION = '.jpg'
    idx = 1
    print("Image_processing started")

    while True:

        path = os.path.normpath("image_data" + '/image%03d.png' % idx)
        with open(path, 'rb') as response_image:
            try:

                np_response_image = np.asarray(bytearray(response_image.read()))
                decoded_frame = cv2.imdecode(np_response_image, cv2.IMREAD_COLOR)
                ret, encoded_jpeg = cv2.imencode(DECODE_EXTENSION, decoded_frame)
                frame = encoded_jpeg.tobytes()
                idx = idx + 1

                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

            except FileNotFoundError:
                print('not found :image%03d.png' % idx)
                break


app = Flask(__name__)


@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(detector.yield_run(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
