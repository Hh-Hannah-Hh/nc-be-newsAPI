const { fetchTopics } = require("../model/model");
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

module.exports = { getTopics, getApi };
