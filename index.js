const express = require("express");
const port = process.env.PORT || 8000;
const mongodb = require("./config/mongoose");

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to Sparrow King");
});

app.listen(port, (err) => {
    if(err) {
        console.log("Error in Running the Server", err);
    }
    console.log("Sparrow King server is up at Port:", port);
})