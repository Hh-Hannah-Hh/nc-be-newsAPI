const db = require("../db/connection");

fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      }
      return result.rows[0];
    });
};

fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`
    )
    .then((body) => {
      return body.rows;
    });
};

fetchArticleIdComments = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments to return. Article does not exist",
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

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleIdComments,
};
