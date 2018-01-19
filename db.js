var mongoose = require('mongoose');

const MONGODB_URI = "mongodb://learn_by_olango:olango_learn@ds119476.mlab.com:19476/olango";

mongoose.connect(MONGODB_URI);

var db = mongoose.connection;

db.on("error", (err) => {
    console.error("connection error:", err);
});

db.once("open", () => {
    console.log("db connection successfull");
});
