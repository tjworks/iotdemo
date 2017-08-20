var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');


app.listen(8001);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    // if (err) {
    //   res.writeHead(500);
    //   return res.end('Error loading index.html');
    // }
    res.writeHead(200);
    res.end(data);
  });
}

var MongoClient = require('mongodb').MongoClient,  co = require('co');
var mydb;
co(function*() {
  // Connection URL
  MongoClient.connect('mongodb://localhost:27017/demo', function(err, db){
  	mydb = db;
  	console.log("Connected correctly to server");	
  });
  
  // Insert a single document
  //var r = yield db.collection('events').insertOne({a:1});  
  // Insert multiple documents  
}).catch(function(err) {
  console.log(err.stack);
});

io.on('connection', function (socket) {
	socket.on('data', function (data) {
    	console.log("Received", data);
    	mydb.collection('events').insertOne(data, function(err, res){
    		console.log("insert restult", res);	
    	});      	
  	});	
	socket.emit('news', { hello: 'world' });
});





