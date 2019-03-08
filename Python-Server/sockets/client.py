import socket
import time


class SocketClient:
    def __init__(self, hostname, port):
        self.start = True
        self.host = hostname  # socket.gethostname()  # as both code is running on same pc
        self.port = port  # 5000  # socket server port number
        self.client_socket = socket.socket()  # instantiate
        self.client_socket.connect((self.host, self.port))  # connect to the server

    def send(self, message=""):
        self.client_socket.send(message.encode())

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
