const db = require("../db/connection");

fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return result.rows[0];
    });
};

fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBys = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];

  const validOrders = ["ASC", "DESC"];

  let sqlStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryValues = [];

  const validTopics = [];

  if (!validSortBys.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (topic) {
    return db
      .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
      .then((result) => {
        if (result.rows.length === 1) {
          sqlStr += ` WHERE topic = $1`;
          queryValues.push(topic);
        } else {
          return Promise.reject({
            status: 404,
            msg: "Not found",
          });
        }
        sqlStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
        return db.query(sqlStr, queryValues).then((articles) => {
          return articles.rows;
        });
      });
  } else {
    sqlStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
    return db.query(sqlStr).then((articles) => {
      return articles.rows;
    });
  }
};

fetchArticleIdComments = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return db.query(
        `SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY comments.created_at DESC;`,
        [article_id]
      );
    })
    .then((result) => {
      return result.rows;
    });
};

addCommentToArticleId = (article_id, username, body) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return db
        .query(
          `INSERT INTO comments (body, author, article_id)
          VALUES($1, $2, $3)
          RETURNING *;`,
          [body, username, article_id]
        )
        .then((comment) => {
          return comment.rows[0];
        });
    });
};

updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return db
        .query(
          `UPDATE articles
      SET votes = votes + $1
      RETURNING *;`,
          [inc_votes]
        )
        .then((article) => {
          return article.rows[0];
        });
    });
};

deleteComment = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return db
        .query(
          `DELETE FROM comments
  WHERE comment_id = $1`,
          [comment_id]
        )
        .then((comment) => {
          return comment.rows[0];
        });
    });
};

fetchUsers = () => {
  return db
    .query(`SELECT users.username, users.name, users.avatar_url FROM users;`)
    .then((body) => {
      return body.rows;
    });
};

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleIdComments,
  addCommentToArticleId,
  updateArticleVotes,
  deleteComment,
  fetchUsers,
};
