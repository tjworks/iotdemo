const child_process = require('child_process');
const ServerSocket =require('socket.io-client');

var max = 1000;
for(var i=1;i<=max;i++){
    var socket = ServerSocket('http://localhost:80', {forceNew:true});
    socket.cid = 100+ i;
    //console.log(socket)
    socket.on('connect', createHandler( socket ));      
    socket.on('winner', function(data){
        console.log("Winner is", data)
    })
}

function createHandler(sock){
  return function(){      
      console.log("socket conneted " + sock.cid);
      
      setInterval(function(){
        var light_no = Math.round(Math.random() * 100) % 9 
        var state =  Math.random() > 0.5? 1 :0;  
        sock.emit('data', {light_no: light_no, state: state , cid: sock.cid});                                  
      }, 1000)      
  }
}




 
