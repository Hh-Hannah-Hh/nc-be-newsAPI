const {
  fetchTopics,
  fetchArticleIdComments,
  addCommentToArticleId,
  updateArticleVotes,
  deleteComment,
  fetchUsers,
  fetchArticles,
} = require("../model/model");
const endpoints = require("../endpoints.json");
// functions are required in from the model

// Request and response handling and error handling might look like...

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getApi = (req, res, next) => {
  res.status(200).send({ endpoints: endpoints });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleIdComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleIdComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentToArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  addCommentToArticleId(article_id, username, body)
    .then((comments) => {
      res.status(201).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const patchUpdateVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getArticleIdComments,
  postCommentToArticleId,
  patchUpdateVotesByArticleId,
  deleteCommentByCommentId,
  getUsers,
};
