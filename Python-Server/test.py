#!/usr/bin/env python
from flask import Flask, render_template,request,json, Response,send_file
# from camera import Camera

# import cv2
# cap = cv2.VideoCapture('android.mp4') 
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

def gen():
   while(cap.isOpened()):
        frame = cap.read()
        print(frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

@app.route('/video_feed')
def video_feed():
    return Response(gen(),
        mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/get_image')
def get_image():
    filename = 'flower3.jpg'
    return send_file(filename, mimetype='image/jpeg')


@app.route('/setCoordinates', methods=['POST', 'GET'])
def setCoordinates():
    request.json.update({"message" :"Recieved and Sent from Python"})
    requestBody = json.dumps(request.json)
    return Response(
        response= requestBody,
        status=200,
        mimetype='application/json'
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)