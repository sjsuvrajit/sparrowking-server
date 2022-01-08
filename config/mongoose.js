const mongoose = require("mongoose");

//connect to mongodb
mongoose.connect(
    process.env.DATABASE_URL_MONGODB || "mongodb://localhost/sparrowking"
);

const db = mongoose.connection;

//for error
db.on("error", console.error.bind(console, "ERROR IN CONNECTING TO DATABASE!!"));

//on success
db.once("open", () => {
    console.log("CONNECTED TO DATABASE: MONGODB");
});

module.exports = db;