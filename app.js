const express = require("express");
const app = express();

app.use(express.json());

const {} = require("./controller/controller");

app.get("/api/topics", getTopics);
// This is where Express has access to the requests and responses objects and functions as middleware

// At the bottom of the app file...
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
});
// ... errors are handled

module.exports = app;
