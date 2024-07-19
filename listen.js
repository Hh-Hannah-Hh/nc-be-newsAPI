const app = require("./app.js");
const [PORT = 9090] = process.env;

app.listen(PORT, () => console.log("Listening on port 9090"));

const express = require("express");
const app = express();

app.use(express.json());
