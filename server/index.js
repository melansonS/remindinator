const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'
}))

app.use("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(8888, () => {
  console.log("listing on port 8888");
});
