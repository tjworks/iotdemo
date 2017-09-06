var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');


app.listen(80);
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {  
    res.writeHead(200);
    res.end(data);
  });
}

var MongoClient = require('mongodb').MongoClient,  co = require('co');
var mydb;
MongoClient.connect('mongodb://localhost:27017/demo', function(err, db){
  	mydb = db;
  	console.log("Connected  to mongodb");	
    
    create_streaming_process(mydb);
});

// handling incoming data
io.on('connection', function (socket) {
  console.log("Client connection:", socket.id)

	socket.on('data', function (data) {
    	//console.log("App received", data);
      data.socket_id = socket.id;
    	mydb.collection('events').insertOne(data, function(err, res){
    		//console.log("Inserted into Mongo: ", res && res.insertedId);	
    	});      	
  	});	
});


// processing streaming data
buffer = { }
function create_streaming_process(db){   
  var cursor = db.collection('events').aggregate([{$changeStream:{}}, {$match:{operationType:"insert"}}]);
  cursor.on("data", function(d){
    //console.log("Notification received:", d && d.fullDocument); 
    data = d.fullDocument;
    var states = buffer[ data.socket_id] || [0,0,0,0,0,0,0,0,0];
    states[ data['light_no'] ] = data['state'];
    buffer[data.socket_id] = states;
    checkWinner(states, data);    
  })    
}
// talk points about change stream:  
// based on Oplog, up to 1000 clients receiving 
// any time length

winner = [0,0,1,0,0,1,0,0,1]
function checkWinner(states, d){
  var winning = true;
  //console.log("states", states)
  for(var i=0;i<9;i++){
    if(winner[i] != states[i])  winning=false;
  }
  if(winning){
    console.log("############ Got winner!!! #########", d);
    var soket =  io.sockets.sockets[d.socket_id];
    d.message = "You are winner! "+ d.socket_id
    soket.emit("winner", d);
    winner[0] = d; // no more winner
    throw "Winner " + d.socket_id
  }    
}





