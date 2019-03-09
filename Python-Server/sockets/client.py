import socket
import time
import socketio


    def send(self, message=""):
        # self.client_socket.send(message.encode())
        sio.emit('threatAlert',{"threat":{"level": "danger","message": "threat detected!!!!"},"location":{"x": 15,"y": 0,"z": 1,"v": 1}})
        sio.disconnect()


    def close_socket(self):
        self.start = False
        self.client_socket.close()


if __name__ == '__main__':
    client = SocketClient(socket.gethostname(), 5000)
    client.send("Hi")
    time.sleep(2)
    client.send("again Hi")
    time.sleep(2)
    client.send("again Hi")
    time.sleep(2)
    client.send("again Hi")
    time.sleep(2)
    client.send("again Hi")
    client.close_socket()
