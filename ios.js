var mongoose = require('mongoose');
var User = require('./user_model');
var ios = require('socket.io')(3001);


//Get all chats related to a user
ios.on('connection', function (socket) {
    var currentChatId;
    var currentUserEmail;
    var connectedUsers = [];
    socket.emit("userConnected", "Connected to server");

    
    socket.on("setLoggedUserEmail", (data) => {
        console.log(data + " Connected");
        currentUserEmail = data;
        //Get all connected users whenever the join and update a list of users online
        connectedUsers.push(currentUserEmail);
        Shoot.find({}, { createdby: data, chatwith: data }, (err, chats) => {
            if (err) return err;
            ios.emit('returnAllChats', chats);
        });
    });
    /* Shoot creation is done from where all the mentors are listed somewhere different */

    socket.on('chatMessage', (data) => {
        var newChat = addDateToChat(data);
        console.log(newChat);
        Shoot.update({ _id: currentChatId }, { $addToSet: { "chatmessages": newChat } }, (err, cm) => {
            if (err) console.log(err.message);
            ios.emit('chatMessage', newChat);
        });
    });

    socket.on("CreateChat", (newChat) => {
        console.log(newChat);
        var shoot = new Shoot(newChat);
        Shoot.create(shoot, (err, chat) => {
            if(err) return err.message;
            ios.emit("CreateChat", chat);
            currentChatId = chat._id;
        });
        
    });

    socket.on('getChat', (chatId) => {
        Shoot.find({_id : chatId}, (err, chatObj) => {
            if (err) return err;
            ios.emit('getChat', chatObj);
            currentChatId =  chatId;
        });
    });

    socket.on('disconnect', function () {
        connectedUsers.pop(currentUserEmail);
        console.log('user disconnected');
    });
});

function addDateToChat (chat) {
  var newChat = {};
  newChat.message = chat.message;
  newChat.sender = chat.sender;
  newChat.createdAt = new Date();

  return newChat;
}



var ShootSchema = new mongoose.Schema({
  chatmessages: [],
  chatwith: String, //use email for uniqueness
  createdby: String //use email for uniqueness
});

var Shoot = mongoose.model('Shoot', ShootSchema);

module.exports.ios = ios;