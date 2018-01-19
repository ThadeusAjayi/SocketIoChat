var mongoose = require('mongoose');

const MONGODB_URI = "mongodb://iochatsocket:palleter1@ds153577.mlab.com:53577/io-chat-socket";

mongoose.connect(MONGODB_URI);

var db = mongoose.connection;

db.on("error", (err) => {
    console.error("connection error:", err);
});

db.once("open", () => {
    console.log("db connection successfull");
});
