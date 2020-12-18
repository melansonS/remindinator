require('dotenv').config();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const { nanoid } = require('nanoid');
const schedule = require('node-schedule');
const db = require('./db');
const sendgrid = require('./sendgrid');
const scheduler = require('./scheduler');

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));
app.use(express.json());

const dailyEmailReminder = schedule.scheduleJob(scheduler.cronRule, async () => {
  try {
    const email = await sendgrid.sendEmails();
    console.log('EMAILS SENT!', email);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
});

app.post('/auto-login', async (req, res) => {
  const { sid } = req.cookies;
  // if there is user tied to this session, automatically log them in
  try {
    const results = await db.query('SELECT * FROM users WHERE id IN (SELECT user_id FROM sessions WHERE sid = $1)', [sid]);
    if (results.rows[0]) {
      return res.send({
        success: true,
      });
    }
    return res.send({
      success: false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      errorMessage: 'Something went wrong',
    });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const results = await db.query('SELECT * FROM users WHERE (email = $1)', [email]);
    // If the email is not in the users TABLE, return out
    if (!results.rows[0]) {
      return res.send({
        success: false,
        errorMessage: 'Invalid email',
      });
    }
    const validPassword = await bcrypt.compare(password, results.rows[0].hash);
    // If bcrypt validates the password when compared to the hash, log them in
    if (validPassword) {
      const sid = nanoid();
      // update the current user's session id
      const update = await db.query('UPDATE sessions SET sid = $1 WHERE user_id IN (SELECT id FROM users WHERE email = $2)', [sid, email]);
      res.cookie('sid', sid);
      return res.send({
        success: true,
        userId: results.rows[0].id,
      });
    }
    // Else incorect password, return error message
    return res.send({
      success: false,
      errorMessage: 'Incorrect Password',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      errorMessage: 'Something went wrong',
    });
  }
});

app.post('/logout', async (req, res) => {
  const { sid } = req.cookies;
  // set the session id for the current user to null
  try {
    const results = await db.query('UPDATE sessions SET sid = $1 WHERE sid = $2', [null, sid]);
    return res.send({
      success: true,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      errorMessage: 'Something went wrong',
    });
  }
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const sid = nanoid();
  try {
    // hash given password
    const hash = await bcrypt.hash(password, 10);
    const results = await db.query('INSERT INTO users (email, hash) values($1, $2) RETURNING id', [email, hash]);
    const insert = await db.query('INSERT INTO sessions(sid, user_id) values($1, $2)', [sid, results.rows[0].id]);
    res.cookie('sid', sid);
    return res.send({
      success: true,
    });
  } catch (err) {
    // There is a UNIQUE constraint on emails in the users table
    // if email already exists in the users Table, error code 23505
    if (err.code === '23505') {
      return res.send({
        success: false,
        errorMessage: 'Email already in use',
      });
    }
    console.log('ERROR', err);
    return res.status(500).send({
      success: false,
      errorMessage: 'Something went wrong',
    });
  }
});

app.post('/reminders', async (req, res) => {
  const { sid } = req.cookies;
  // return all Reminders tied to a User's id
  try {
    const results = await db.query('SELECT * FROM reminders WHERE user_id IN (SELECT user_id FROM sessions WHERE sid = $1) ORDER BY id ASC', [sid]);
    return res.send({
      success: true,
      reminders: results.rows,
    });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({
      success: false,
      errorMessage: 'Something went wrong',
    });
  }
});

app.post('/add-reminder', async (req, res) => {
  const { sid } = req.cookies;
  const { reminder } = req.body;
  // Add a single Reminder and return it
  try {
    const results = await db.query('SELECT user_id FROM sessions WHERE sid = $1', [sid]);
    const userId = results.rows[0].user_id;
    const insert = await db.query('INSERT INTO reminders(user_id, reminder) VALUES($1, $2) RETURNING *', [userId, reminder]);
    return res.send({
      success: true,
      reminder: insert.rows[0],
    });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({
      success: false,
      errorMessage: 'Something went wrong',
    });
  }
});

app.post('/delete-reminder', async (req, res) => {
  const { id } = req.body;
  // delete a single reminder
  try {
    const del = await db.query('DELETE FROM reminders WHERE id = $1', [id]);
    return res.send({
      success: true,
    });
  } catch (err) {
    console.log('ERROR', err);
    return res.status(500).send({
      success: false,
      errorMessage: 'Something went wrong',
    });
  }
});

app.listen(8888, () => {
  console.log('listing on port 8888');
});
