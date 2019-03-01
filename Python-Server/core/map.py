from core.drone_handler import Instance
def get_command_map(drone:Instance):
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
    }
    return command_map