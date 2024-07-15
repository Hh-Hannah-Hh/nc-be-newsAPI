const { fetchTopics } = require("../model/model");
// functions are required in from the model

// Request and response handling and error handling might look like...

getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
