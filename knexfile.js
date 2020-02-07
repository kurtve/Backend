// base configuration
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
  dev,
  test,
};
