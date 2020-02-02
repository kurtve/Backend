const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/dbConfig.js');
const secrets = require('../config/secrets.js');

console.log(secrets.HASH_ROUNDS);
console.log(secrets.JWT_SECRET);

// get a list of all users
async function find() {
  return db('users').select('id', 'username', 'role');
}

// get the first user matching a filter criteria
function findBy(filter) {
  return db('users')
    .where(filter)
    .select('id', 'username', 'role', 'password')
    .first();
}

// get a single user with the given id
async function findById(id) {
  return db('users')
    .where({ id })
    .select('id', 'username', 'role', 'password')
    .first();
}

// add a user after hashing the user password
async function add(user) {
  user.password = await bcrypt.hash(
    user.password,
    Number.parseInt(secrets.HASH_ROUNDS)
  );
  const [id] = await db('users').insert(user);
  return findById(id);
}

// check if a user is valid based on username and password
async function isValidUser(user) {
  try {
    let isValid = false;

    if (user.username && user.password) {
      const dbUser = await findBy({ username: user.username }).first();
      isValid = await bcrypt.compare(user.password, dbUser.password);
    }

    return isValid;
  } catch (err) {
    return false;
  }
}

// check if a token is valid
function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, secrets.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

// generate a new token for a user
function makeToken(user) {
  const payload = {
    subject: 'user-credentials',
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const options = {
    expiresIn: '7d',
  };

  return jwt.sign(payload, secrets.JWT_SECRET, options);
}

module.exports = {
  add,
  find,
  findBy,
  findById,
  isValidUser,
  makeToken,
  decodeToken,
};
