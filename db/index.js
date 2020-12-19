const { Pool } = require('pg');

const devConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
};

const proConfig = {
  connectionString: process.env.DATABASE_URL, // from heroku
};

const pool = new Pool(process.env.NODE_ENV === 'production' ? proConfig : devConfig);

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
