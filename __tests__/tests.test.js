const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeAll(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("/api", () => {
  test("GET 200: Responds with a json representation of all the available endpoints of the api.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: sends a single article object to the client with the following properties, author, title, article_id, body, topic, created_at, votes, article_img_url, when given an article id", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET 404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get(`/api/articles/36`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(`Not found`);
      });
  });
  test("GET 400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get(`/api/articles/not-an-id`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(`Bad request`);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: Returns an array of article objects with the following properties, author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET 200: Returns an array of article objects with the following properties, author, title, article_id, topic, created_at, votes, article_img_url, comment_count, sorted by date in decending order", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET 200: Returns an array of all comments for the given article id, with each comment containing the properties, comment_id, votes, created_at, author, body, article_id", () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: Returns an array of all comments for the given article id, with each comment containing the properties, comment_id, votes, created_at, author, body, article_id, sorted by created_at and ordered by most recent", () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: Returns an empty array when the article passed has no comments", () => {
    return request(app)
      .get(`/api/articles/4/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET 404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get(`/api/articles/36/comments`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(`Not found`);
      });
  });
  test("GET 400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get(`/api/articles/not-an-id/comments`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(`Bad request`);
      });
  });
});
