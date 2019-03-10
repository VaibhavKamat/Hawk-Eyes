import csv
# Imports
import os

import cv2
import numpy as np
import socketio
import tensorflow as tf

from core import drone_handler
# Object detection imports
from utils import label_map_util
from utils import visualization_utils as vis_util

connectString = 'http://localhost:3000'
MODEL_NAME = 'ssd_mobilenet_v1_coco_2017_11_17'
MODEL_FILE = MODEL_NAME + '.tar.gz'
DOWNLOAD_BASE = \
    'http://download.tensorflow.org/models/object_detection/'

# Path to frozen detection graph. This is the actual model that is used for the object detection.
PATH_TO_CKPT = MODEL_NAME + '/frozen_inference_graph.pb'

# List of the strings that is used to add correct label for each box.
PATH_TO_LABELS = os.path.join('data', 'mscoco_label_map.pbtxt')

NUM_CLASSES = 90

threatObject = {}


class SocketClient:

    def __init__(self, message):
        self.message = message
        sio = socketio.Client()

        @sio.on('connect')
        def on_connect():
            sio.emit('threatAlert', self.message)
            sio.disconnect()

        sio.connect(connectString)


class Detector:

    def __init__(self):
        # ip = "10.244.25.16"
        # self.client_socket = SocketClient(socket.gethostname(), 5010)
        # file_util.delete_all_files(os.path.normpath("image_data"))
        self.video_feed_drone = drone_handler.Instance()
        self.detection_graph = tf.Graph()
        with self.detection_graph.as_default():
            self.od_graph_def = tf.GraphDef()
            with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
                self.serialized_graph = fid.read()
                self.od_graph_def.ParseFromString(self.serialized_graph)
                tf.import_graph_def(self.od_graph_def, name='')
        self.label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
        self.categories = label_map_util.convert_label_map_to_categories(self.label_map,
                                                                         max_num_classes=NUM_CLASSES,
                                                                         use_display_name=True)
        self.category_index = label_map_util.create_category_index(self.categories)

    def yield_run(self):
        total_passed_vehicle = 0
        speed = 'waiting...'
        direction = 'waiting...'
        size = 'waiting...'
        color = 'waiting...'
        msg: dict = dict()
        with self.detection_graph.as_default():
            with tf.Session(graph=self.detection_graph) as sess:

                # Definite input and output Tensors for detection_graph
                image_tensor = self.detection_graph.get_tensor_by_name('image_tensor:0')

                # Each box represents a part of the image where a particular object was detected.
                detection_boxes = self.detection_graph.get_tensor_by_name('detection_boxes:0')

                # Each score represent how level of confidence for each of the objects.
                # Score is shown on the result image, together with the class label.
                detection_scores = self.detection_graph.get_tensor_by_name('detection_scores:0')
                detection_classes = self.detection_graph.get_tensor_by_name('detection_classes:0')
                num_detections = self.detection_graph.get_tensor_by_name('num_detections:0')
                decode_extension = '.jpg'
                idx = 1
                var = True
                while True:
                    frame = self.video_feed_drone.get_frame()
                    np_response_image = np.asarray(bytearray(frame), dtype="uint8")
                    decoded_frame = cv2.imdecode(np_response_image, cv2.IMREAD_COLOR)
                    input_frame = decoded_frame
                    '''
                    (h, w) = input_frame.shape[:2]
                    center = (w / 2, h / 2)

                    M = cv2.getRotationMatrix2D(center, 270, 1.0)
                    input_frame = cv2.warpAffine(input_frame, M, (w, h))'''
                    ########################################
                    # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
                    image_np_expanded = np.expand_dims(input_frame, axis=0)

                    # Actual detection.
                    (boxes, scores, classes, num) = \
                        sess.run([detection_boxes, detection_scores,
                                  detection_classes, num_detections],
                                 feed_dict={image_tensor: image_np_expanded})

                    # Visualization of the results of a detection.
                    (counter, csv_line, predicted_speed) = \
                        vis_util.visualize_boxes_and_labels_on_image_array(
                            idx,
                            input_frame,
                            np.squeeze(boxes),
                            np.squeeze(classes).astype(np.int32),
                            np.squeeze(scores),
                            self.category_index,
                            use_normalized_coordinates=True,
                            line_thickness=4,
                        )

                    total_passed_vehicle = total_passed_vehicle + counter

                    # insert information text to video frame
                    font = cv2.FONT_HERSHEY_SIMPLEX
                    # cv2.putText(
                    #     input_frame,
                    #     'Detected Vehicles: ' + str(total_passed_vehicle),
                    #     (10, 35),
                    #     font,
                    #     0.8,
                    #     (0, 0xFF, 0xFF),
                    #     2,
                    #     cv2.FONT_HERSHEY_SIMPLEX,
                    # )

                    # when the vehicle passed over line and counted, make the color of ROI line green
                    if counter == 1:
                        cv2.line(input_frame, (0, 350), (640, 350), (0, 0xFF, 0), 5)
                    else:
                        cv2.line(input_frame, (0, 350), (640, 350), (0, 0, 0xFF), 5)

                    # insert information text to video frame
                    # cv2.rectangle(input_frame, (10, 275), (230, 337), (180, 132, 109), -1)
                    cv2.putText(
                        input_frame,
                        'ROI Line',
                        (545, 190),
                        font,
                        0.6,
                        (0, 0, 0xFF),
                        2,
                        cv2.LINE_AA,
                    )
                    # cv2.putText(
                    #     input_frame,
                    #     'LAST PASSED VEHICLE INFO',
                    #     (11, 290),
                    #     font,
                    #     0.5,
                    #     (0xFF, 0xFF, 0xFF),
                    #     1,
                    #     cv2.FONT_HERSHEY_SIMPLEX,
                    # )
                    # cv2.putText(
                    #     input_frame,
                    #     '-Movement Direction: ' + direction,
                    #     (14, 302),
                    #     font,
                    #     0.4,
                    #     (0xFF, 0xFF, 0xFF),
                    #     1,
                    #     cv2.FONT_HERSHEY_COMPLEX_SMALL,
                    # )
                    # cv2.putText(
                    #     input_frame,
                    #     '-Speed(km/h): ' + speed,
                    #     (14, 312),
                    #     font,
                    #     0.4,
                    #     (0xFF, 0xFF, 0xFF),
                    #     1,
                    #     cv2.FONT_HERSHEY_COMPLEX_SMALL,
                    # )
                    # '''cv2.putText(
                    #     input_frame,
                    #     '-Color: ' + color,
                    #     (14, 322),
                    #     font,
                    #     0.4,
                    #     (0xFF, 0xFF, 0xFF),
                    #     1,
                    #     cv2.FONT_HERSHEY_COMPLEX_SMALL,
                    # )'''
                    # cv2.putText(
                    #     input_frame,
                    #     '-Vehicle Size/Type: ' + size,
                    #     (14, 332),
                    #     font,
                    #     0.4,
                    #     (0xFF, 0xFF, 0xFF),
                    #     1,
                    #     cv2.FONT_HERSHEY_COMPLEX_SMALL,
                    # )

                    # cv2.imshow('vehicle detection', input_frame)

                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break

                    if csv_line != 'not_available':
                        with open('traffic_measurement.csv', 'a') as f:
                            writer = csv.writer(f)
                            (size, color, direction, speed) = \
                                csv_line.split(',')
                            writer.writerows([csv_line.split(',')])

                    ret, encoded_jpeg = cv2.imencode(decode_extension, input_frame)
                    output_frame = encoded_jpeg.tobytes()
                    if predicted_speed > 40 and predicted_speed < 100:
                        position = self.video_feed_drone.get_position()
                        msg["location"] = position
                        # msg["data"] = output_frame
                        threat = {
                            'message': "Threat detected",
                            'level': "High"
                        }
                        msg["threat"] = threat
                        print("Please write the code for Alarm in the UI", predicted_speed)

                        SocketClient(msg)

                    else:
                        msg["Threat"] = False
                    # self.client_socket.send(msg)
                    # file_util.write_file(os.path.normpath("image_data" + '/image%03d.png' % idx), output_frame)
                    idx = idx + 1
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + output_frame + b'\r\n\r\n')

# detector = Detector()
# detector.run()
