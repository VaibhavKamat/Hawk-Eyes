"""
Starting point of rest application
"""
import airsim
from flask import Flask, json, request, Response

from core import drone_handler, map

command_drone = drone_handler.Instance()

command_map = map.get_command_map(command_drone)

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


@app.route("/connection_stat", methods=['GET'])
def connection_stat():
    code = 200
    value = command_drone.ping_and_confirm_connection()
    response = app.response_class(
        response=json.dumps(value),
        status=code,
        mimetype='application/json'
    )

    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
