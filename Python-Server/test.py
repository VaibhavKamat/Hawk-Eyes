#!/usr/bin/env python
from flask import Flask, render_template,request,json, Response,send_file
# from camera import Camera
import time
import socketio

# import cv2
# cap = cv2.VideoCapture('android.mp4') 
app = Flask(__name__)

sio = socketio.Client()


@sio.on('connect')
def on_connect():
    sio.emit('threatAlert',{"threat":{"level": "danger","message": "threat detected!!!!"},"location":{"x": 15,"y": 0,"z": 1,"v": 1}})
    sio.disconnect()

sio.connect('http://localhost:3000')


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

@app.route('/takeoff')
def takeoff():
    print("request Came")
    print(request.json)
    time.sleep(10)
    request.json.update({"message" :"Recieved and Sent from Python"})
    requestBody = json.dumps(request.json)
    return Response(
        response= requestBody,
        status=200,
        mimetype='application/json'
    )


@app.route('/get_image')
def get_image():
    filename = 'flower3.jpg'
    return send_file(filename, mimetype='image/jpeg')


@app.route('/command', methods=['POST', 'GET'])
def setCoordinates():
    print("request Came")
    print(request.json)
    time.sleep(5)
    requestBody = json.dumps(request.json)
    return Response(
        response= requestBody,
        status=200,
        mimetype='application/json'
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)