from core.drone_handler import Instance


def get_command_map(drone: Instance):
    command_map = {
        1: {
            "method": drone.take_off,
            "args": False,
            "response": {
                "code": 200,
                "value": drone.get_landing_state
            }
        },
        2: {
            "method": drone.move,
            "args": True,
            "response": {
                "code": 200,
                "value": drone.get_position
            }
        },
        3: {
            "method": drone.land,
            "args": None,
            "response": {
                "code": 200,
                "value": drone.get_landing_state
            }
        },
        4: {
            "method": drone.set_camera_orientation,
            "args": True,
            "response": {
                "code": 200,
                "value": drone.get_camera_info
            }
        },
        5: {
            "method": drone.move_and_change_camera_orientation,
            "args": True,
            "response": {
                "code": 200,
                "value": drone.get_camera_info_and_position
            }
        }

    }
    return command_map
