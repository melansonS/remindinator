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

app.post("/auto-login", async (req, res) => {
  console.log("Cookie:", req.cookies.sid)
  try {
    const results = await db.query("select * from cookies where sid = $1", [req.cookies.sid]);
    if(results.rows[0]){
      res.send({
        success: true,
      });
    } else {
      res.send({
        success: false,
      })
    }
  }
  catch(err){
    console.log(err)
    res.send({
      success: false,
      errorMessage: "Something went wrong",
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
      const update = await db.query("update cookies set sid = $1 where name = $2",[sid, req.body.username]);
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

app.post('/logout', async (req, res) => {
  const sid = req.cookies.sid;
  //set the session id for the current user to null
  try {
    const results = await db.query("UPDATE cookies SET sid = $1 WHERE sid = $2", [null, sid]);
    console.log(results);
    res.send({
      success: true
    });
  }
  catch(err){
    res.status(500).send( {
      success: false,
      errorMessage: "Something went wrong",
    });
  }
})

app.post('/signup', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const sid = nanoid();
  try {
    const results = await db.query("INSERT INTO users (name, password) values($1, $2)", [username, password]);
    const insert = await db.query("INSERT INTO cookies(sid, name) values($1, $2)",[sid, username]);
    res.cookie("sid", sid);
    res.send({
      success: true
    });
  }
  catch(err){
    // There is a UNIQUE constraint on names in the users table
    // if username already exists in the users Table, error code 23505
    if(err.code === '23505'){
      return res.send({
        success: false,
        errorMessage: "Username already in use",
      })
    }
    console.log("ERROR", err)
    res.status(500).send( {
      success: false,
      errorMessage: "Something went wrong",
    });
  }
});

app.listen(8888, () => {
  console.log("listing on port 8888");
});
