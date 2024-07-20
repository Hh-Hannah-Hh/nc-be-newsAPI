const express = require("express");
const app = express();

const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getArticleIdComments,
  postCommentToArticleId,
  patchUpdateVotesByArticleId,
} = require("./controller/controller");

app.use(express.json());

// This is where Express has access to the requests and responses objects and functions as middleware
app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleIdComments);

app.post("/api/articles/:article_id/comments", postCommentToArticleId);

app.patch("/api/articles/:article_id", patchUpdateVotesByArticleId);

// At the bottom of the app file...
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "No comments posted. Username not found." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});
// ... errors are handled

module.exports = app;
