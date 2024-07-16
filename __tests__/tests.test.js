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
        expect(response.body.msg).toBe(`Article does not exist`);
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
