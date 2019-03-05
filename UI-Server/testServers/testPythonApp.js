let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);

io.on("connection", socket => {
  // Log whenever a user connects
  console.log("user connected");

  // Log whenever a client disconnects from our websocket server
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  // When we receive a 'message' event from our client, print out
  // the contents of that message and then echo it back to our client
  // using `io.emit()`
  const droneObj= {
    id: 1,
    name: 'Drone-1',
    battery: 50,
    locationName: 'Bus Stand',
    speed: 10,
    signalStrength: 'Good',
    timeLeft: 3,
    flightStatus: 'flying',
    upTime: 50,
    altitude: 25,
    position: {
        latitude: 100.1,
        longitude: 100.1,
    }
   };

      
    io.emit("highAlert", { type: "new-message",  'msg' :  "compromised" });
    
    socket.on("uiHighAlert", message => {
      console.log("Message Received: " + message);
      // io.emit("droneUpdate", { type: "new-message", text: "drone-1" });
    });
  });
      
  
 

  http.listen(2000, () => {
    console.log("started on port 2000");
  });