const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Hi There! Welcome to ZenithLodge");
})

app.listen(PORT, () => {
    console.log("Server is working on the PORT:", PORT);
})