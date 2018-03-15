var mongoose = require('mongoose');

// const MONGODB_URI = "mongodb://iochatsocket:palleter1@ds153577.mlab.com:53577/io-chat-socket";

// mongoose.connect(MONGODB_URI);

// var db = mongoose.connection;

// db.on("error", (err) => {
//     console.error("connection error:", err);
// });

// db.once("open", () => {
//     console.log("db connection successfull");
// });

const MONGODB_URI = "mongodb://naca-db.documents.azure.com:10255/naca?ssl=true";
mongoose.connect(MONGODB_URI, {

auth: {
      user: 'naca-db',
      password: 'nWAI57ukZHod0BwiQvoIgzcVyUkKaLvaAKZaFodLUeSrkUVeiHhU6y3QSPRozTXZ90pzvaHOQCTpQOd6McSZdQ'
    }
})
.then(() => console.log('connection successful'))
  .catch((err) => console.error(err));