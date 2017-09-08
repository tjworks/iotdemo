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

var MongoClient = require('mongodb').MongoClient;
var mydb;
mydb = MongoClient.connect('mongodb://localhost:27017/demo', function(err, db){
  	mydb = db;
  	console.log("Connected  to mongodb");	    
    create_streaming_process(mydb);
});

// handling incoming data
io.on('connection', function (socket) {
  //console.log("Client connection:", socket.id)

	socket.on('data', function (data) {    	
      data.device_id = socket.id;    	
      // perform some validation against data
      mydb.collection('events').insertOne(data, function(err, res){
    		//console.log("Inserted into Mongo: ", res && res.insertedId);	
    	});      	
  	});	
});

// processing real time data
buffer = { }
function create_streaming_process(db){   
  var cursor = db.collection('events').aggregate([
                {$changeStream:{}}, 

                {$match:{operationType:"insert"}}
  ]);

  cursor.on("data", function(d){
    data = d.fullDocument;

    // step 1, update shadow device
    var update_spec= {};
    update_spec["states."+ data.light_no] =  data.state; 
    var updated_doc =  db.collection('shadow').findAndModify(

      {device_id: data.device_id}, // query
      {}, // sort order      
      {$set: update_spec }, // replacement, 
      {new:true, upsert: true}, // options
      function(err, object) { 
          if(err) consolel.log(err);
          
          // step 2, check today's winner
          var isWinner = checkWinner( object.value);
          if(isWinner){
              // update winner's screen
              console.log("####### Winner", object.value)              
          }
      });
    });
}


winner = '101001001'
count = 0;
function checkWinner(obj){
  var str= ""; count++;
  for(var i=0;i<9;i++){  str+= obj.states[i] || "0"    }
  
  if(str == winner ){    
    console.log("event count", count);
    count=0;
    var soket =  io.sockets.sockets[obj.device_id];
    if(!soket) return false;
    obj.message = "恭喜你，中奖了! "+ obj.device_id
    soket.emit("winner", obj);
    winner = ""; // no more winner    
    return true;
  }    
  return false
}






// talk points about change stream:  
// based on Oplog, up to 1000 clients receiving 
// any time length
