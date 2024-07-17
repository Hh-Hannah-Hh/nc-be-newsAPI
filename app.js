const express = require("express");
const app = express();

const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
} = require("./controller/controller");

// This is where Express has access to the requests and responses objects and functions as middleware
app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

// At the bottom of the app file...
app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
// ... errors are handled

module.exports = app;
