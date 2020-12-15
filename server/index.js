require('dotenv').config();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const { nanoid } = require('nanoid');
const schedule = require('node-schedule');
const db = require('./db');
const sgMail = require('./sengrid');

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

const cronRule = new schedule.RecurrenceRule();
cronRule.hour = 5;
cronRule.minute = 45;
// TODO: update job to actually send the email
const dailyEmailReminder = schedule.scheduleJob(cronRule, () => {
  console.log('Running job');
});

app.get('/send-email', async (req, res) => {
  try {
    await sgMail.sendMail(process.env.RECIPIENT_EMAIL, 'What excellent email content!');
    return res.send({
      success: true,
    });
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
    return res.send({
      success: false,
    });
  }
});

app.get('/', async (req, res) => {
  console.log('Cookie:', req.cookies.sid);
  try {
    const results = await db.query('select * from users');
    return res.send({
      success: true,
      users: results.rows,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
    });
  }
});

app.post('/auto-login', async (req, res) => {
  // if there is user tied to this session, automatically log them in
  try {
    const results = await db.query('select * from users where email IN (select email from sessions where sid = $1)', [req.cookies.sid]);
    if (results.rows[0]) {
      return res.send({
        success: true,
        userId: results.rows[0].id,
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
  console.log('Login hit =============');
  const { email, password } = req.body;
  try {
    const results = await db.query('select * from users WHERE (email = $1)', [email]);
    console.log(results);
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
      const update = await db.query('update sessions set sid = $1 where email = $2', [sid, email]);
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
    const insert = await db.query('INSERT INTO sessions(sid, email) values($1, $2)', [sid, email]);
    res.cookie('sid', sid);
    return res.send({
      success: true,
      userId: results.rows[0].id,
    });
  } catch (err) {
    // There is a UNIQUE constraint on names in the users table
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

app.post('/reminders/', async (req, res) => {
  const { id } = req.body;
  // return all Reminders tied to a User's id
  try {
    const results = await db.query('SELECT * FROM reminders WHERE user_id = $1', [id]);
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
  const { reminder, userId } = req.body;
  // Add a single Reminder and return it
  try {
    const insert = await db.query('INSERT INTO reminders(user_id, reminder) VALUES($1, $2) RETURNING *', [userId, reminder]);
    console.log('INSERT', insert);
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
