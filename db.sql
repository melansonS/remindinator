CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  hash TEXT NOT NULL
);

CREATE TABLE sessions(
  sid TEXT UNIQUE,
  user_id INTEGER REFERENCES users(id) NOT NULL
);

CREATE TABLE reminders(
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  reminder TEXT NOT NULL
);