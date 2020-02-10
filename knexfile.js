require('dotenv').config();

// production environment - uses postgres

const localPg = {
  host: 'localhost',
  port: '5432',
  database: 'droom',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
};

const dbConnection = process.env.DATABASE_URL || localPg;

const production = {
  client: 'pg',
  connection: dbConnection,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './database/migrations',
    tableName: 'dbmigrations',
  },
  seeds: {
    directory: './database/seeds',
  },
};

// base sqlite3 configuration
const sqlite3 = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: {
    directory: './database/migrations',
    tableName: 'dbmigrations',
  },
  seeds: { directory: './database/seeds' },
  // needed when using foreign keys
  pool: {
    afterCreate: (conn, done) => {
      // runs after a connection is made to the sqlite engine
      conn.run('PRAGMA foreign_keys = ON', done); // turn on FK enforcement
    },
  },
};

// dev environment
const dev = {
  ...sqlite3,
  connection: {
    filename: './database/droom.db3',
  },
};

// test environment
const test = {
  ...sqlite3,
  connection: {
    filename: './database/droom_test.db3',
  },
};

// export configs for all our environments
module.exports = {
  production,
  dev,
  test,
};
