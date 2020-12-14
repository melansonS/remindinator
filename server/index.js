require('dotenv').config();
const { nanoid } = require('nanoid');
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
const db = require('./db');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.get("/", async (req, res) => {
  console.log("Cookie:", req.cookies.sid)
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

app.post('/login', async (req, res) => {
  console.log(`Login hit =============`);
  console.log("COOKIE??", req.cookies);
  try {
    const results = await db.query("select * from users WHERE (name = $1)", [req.body.username]);
    // If the username is not in the users TABLE, return out
    if(!results.rows[0]){
      return res.send({
        success: false,
        errorMessage: "Invalid Username",
      });
    }
    // If the password matches -> Success
    if (results.rows[0].password === req.body.password){
      console.log("Correct password ? ", results.rows[0].password === req.body.password)
      const sid = nanoid();
      const insert = await db.query("update cookies set sid = $1 where name = $2",[sid, req.body.username]);
      console.log("INSERT> _> ))))))))))))))))",insert);
      res.cookie("sid", sid);
      res.send({
        success: true,
      });
    } 
    // Else incorect password, return error message
    else {
      res.send({
        success: false,
        errorMessage: "Incorrect Password",
      })
    }
  }
  catch(err){
    console.log(err)
    res.status(500).send( {
      success: false,
      errorMessage: "Something went wrong",
    })
  }
});

app.post('/signup', (req, res) => {
  console.log(req.cookies.sid);
  res.send({
    success: true
  })
});

app.listen(8888, () => {
  console.log("listing on port 8888");
});
