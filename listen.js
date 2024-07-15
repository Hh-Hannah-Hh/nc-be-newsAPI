const express = require("express");
const app = express();

app.use(express.json());

app.listen(8888, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on port 8899");
  }
});
