var io = require('socket.io')();

io.on('connection', function (socket) {

    socket.emit('news', { hello: 'world' });
  
    socket.on('my other event', function (data) {
      console.log(data);
    });
  
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    });
  
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

module.exports = io;