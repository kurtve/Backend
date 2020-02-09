// tests for auth-router.js
const supertest = require('supertest');
const server = require('../server');
const db = require('../database/dbConfig.js');

// initialize database before running tests
beforeAll(async () => {
  await db.seed.run();
});

// get all users
test('GET all users', async () => {
  // try the endpoint
  const res = await supertest(server).get('/api/auth/users');

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // should get 5 users
  expect(res.body.length).toBe(5);

  // first element is an object with a username and role
  expect(res.body[0]).toHaveProperty('id');
  expect(res.body[0]).toHaveProperty('username');
  expect(res.body[0]).toHaveProperty('role');
});

// invalid login
test(`'/api/auth/login' attempt invalid login`, async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/auth/login')
    .send({ username: 'joe', password: 'joe' });

  // should get a 401 return code
  expect(res.status).toBe(401);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // body has 'invalid' message
  expect(res.body.message).toMatch(/invalid/i);
});

// we will need this for later tests
let saveToken;

// valid register
test(`'/api/auth/register' attempt valid register`, async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/auth/register')
    .send({ username: 'joe', role: 'employer', password: 'joe' });

  // should get a 201 return code
  expect(res.status).toBe(201);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // returns user info
  expect(res.body.username).toBe('joe');

  // returns a token
  expect(res.body.token).toBeDefined();
  saveToken = res.body.token;
});

// attempt to register again with same user
test('attempt register with an existing username', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/auth/register')
    .send({ username: 'joe', role: 'employer', password: 'joe' });

  // should get a 400 return code
  expect(res.status).toBe(401);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // body has 'unavailable' message
  expect(res.body.message).toMatch(/unavailable/i);
});

// valid login
test(`'/api/auth/login' attempt valid login`, async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/auth/login')
    .send({ username: 'joe', password: 'joe' });

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // returns user info
  expect(res.body.username).toBe('joe');

  // returns a token
  expect(res.body.token).toBeDefined();
});
