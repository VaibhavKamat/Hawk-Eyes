let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
let cors = require("cors");

io.on("connection", socket => {
  // Log whenever a user connects
  console.log("user connected");

  // Log whenever a client disconnects from our websocket server
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  app.use(cors());

  app.get('/capture',function(req,res){
   res.send({name :'file1',
  size: 5,
  type: 'jpg',
location : '/documents/file1.jpg'});
  })

  app.get('/return',function(req,res){
    res.send({status :'returned'});
  
   })

   app.get('/data',function(req,res){
    const mockData= {
      id: 0,
      name: 'Drone-0',
      battery: 0,
      locationName: 'Base',
      speed: 0,
      signalStrength: 'Good',
      timeLeft: 5,
      flightStatus: 'none',
      upTime: 0,
      altitude: 0,
      position: {
          latitude: 100,
          longitude: 100,
      }
     };
    res.send(mockData);
   })

   app.post('/update',function(req,res){
    res.send("captured");
   })
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
    },
    threat:{
      message: "Message",
      level: "zero"
  }  
   };

      
   
    
    socket.on("visionUpdate", message => {
      console.log("Message Received: " + message);
        io.emit("droneUpdate", { type: "new-message",  'droneObj' :  droneObj });
    });
  });
      
  
 

  http.listen(5000, () => {
    console.log("started on port 5000");
  });