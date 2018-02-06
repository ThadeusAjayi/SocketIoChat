var mongoose = require('mongoose');
var User = require('./user_model');
var io = require('socket.io')();


//Get all chats related to a user
io.on('connection', function (socket) {
    var currentChatId;
    var currentUserEmail;
    var connectedUsers = [];
    socket.emit("userConnected", "Connected to server");

    
    socket.on("setLoggedUserEmail", (data) => {
        console.log(data + " Connected");
        currentUserEmail = data;
        //Get all connected users whenever the join and update a list of users online
        connectedUsers.push(currentUserEmail);
        Chat.find({}, { createdby: data, chatwith: data }, (err, chats) => {
            if (err) return err;
            io.emit('returnAllChats', chats);
        });
    });
    /* Chat creation is done from where all the mentors are listed somewhere different */

    socket.on('chatMessage', (data) => {
        var newChat = addDateToChat(data);
        console.log(newChat);
        Chat.update({ _id: currentChatId }, { $addToSet: { "chatmessages": newChat } }, (err, cm) => {
            if (err) console.log(err.message);
            io.emit('chatMessage', newChat);
        });
    });

    socket.on("CreateChat", (newChat) => {
        console.log(newChat);
        var chat = new Chat(newChat);
        Chat.create(chat, (err, chat) => {
            if(err) return err.message;
            io.emit("CreateChat", chat);
            currentChatId = chat._id;
        });
        
    });

    socket.on('getChat', (chatId) => {
        Chat.find({_id : chatId}, (err, chatObj) => {
            if (err) return err;
            io.emit('getChat', chatObj);
            currentChatId =  chatId;
        });
    });

    socket.on('disconnect', function () {
        connectedUsers.pop(currentUserEmail);
        console.log('user disconnected');
    });
});

function addDateToChat (chat) {
    console.log(chat);
  var newChat = {};
  newChat.message = chat.message;
  newChat.sender = chat.sender;
  newChat.createdAt = new Date();

  return newChat;
}



var ChatSchema = new mongoose.Schema({
  chatmessages: [],
  chatwith: String, //use email for uniqueness
  createdby: String //use email for uniqueness
});

var Chat = mongoose.model('Chat', ChatSchema);

module.exports.io = io;