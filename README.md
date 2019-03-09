
var originsWhitelist = [
  'http://localhost:4200'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
}
app.use(cors(corsOptions));




sio = socketio.AsyClient()


@sio.on('connect')
def on_connect():
    print('I\'m connected!')
    sio.emit('threatAlert',{"threat":{"level": "danger","message": "threat detected!!!!"},"location":{"x": 15,"y": 0,"z": 1,"v": 1}})
    sio.disconnect()

# sioAsync = socketio.AsyncClient()
# await sioAsync.connect('http://localhost:3000')
sio.connect('http://localhost:3000')
