const express = require("express");
const app = express();

app.use(express.json());

const { getTopics, getApi } = require("./controller/controller");

// This is where Express has access to the requests and responses objects and functions as middleware
app.get("/api/topics", getTopics);

app.get("/api", getApi);

// At the bottom of the app file...
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
});
// ... errors are handled

module.exports = app;
