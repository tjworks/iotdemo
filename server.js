var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');


app.listen(8001);
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
    	console.log("Received", data);
    	mydb.collection('events').insertOne(data, function(err, res){
    		console.log("insert restult: ", res && res.insertedId);	
    	});      	
  	});	
});



function create_streaming_process(db){
   
  var streaming_cursor = db.events.aggregate([{$changeStream:{}}]);
    while(true){
      if(streaming_cursor.hasNext()){
        printjson(cursor.next()); 
      }
      sleep(100);
    }
}