require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');

const db = require('./db');

app.use(cors({
  origin: 'http://localhost:3000'
}))

app.use("/", async (req, res) => {
  try {
    const results = await db.query("select * from users");
    res.send({
      success: true,
      users : results.rows
    });

  }
  catch(err){
    console.log(err)
    res.send({
      success: false
    })
  }
});

app.listen(8888, () => {
  console.log("listing on port 8888");
});
