const supertest = require('supertest');
const server = require('./server');
const db = require('./database/dbConfig.js');

// initialize database before running tests
beforeAll(async () => {
  await db.seed.run();
});

// sanity check for testing environment
test('we are in test environment', async () => {
  expect(process.env.NODE_ENV).toBe('test');
});

// '/' endpoint returns 'proof-of-life' message
test(`'/' returns proof-of-life message`, async () => {
  // try the endpoint
  const res = await supertest(server).get('/');

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // body has 'is alive' message
  expect(res.body.message).toMatch(/is alive/i);
});

// auth endpoints

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

// try to get profiles
test('GET all profiles', async () => {
  // try the endpoint
  const res = await supertest(server).get('/api/profiles');

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // should get 2 profiles
  expect(res.body.length).toBe(2);

  // first element is an object with a name
  expect(res.body[0]).toHaveProperty('id');
  expect(res.body[0]).toHaveProperty('name');
});

// try to post a profile without a JWT
test('POST a profile without a JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/profiles')
    .send({ name: 'Joe McArthy', email: 'joe@mcarthy.com' });

  // should get a 401 return code
  expect(res.status).toBe(401);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // with an 'invalid' message
  expect(res.body.message).toMatch(/invalid/i);
});

// we will need this for later tests
let saveProfileId;

// try to post a profile with a JWT
test('POST a profile with a valid JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/profiles')
    .send({ name: 'Joe McArthy', email: 'joe@mcarthy.com' })
    .set('Authorization', saveToken);

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // and return the profile
  expect(res.body.name).toBe('Joe McArthy');
  expect(res.body.email).toBe('joe@mcarthy.com');
  expect(res.body.id).toBeDefined();
  saveProfileId = res.body.id;
});

// try to update the profile we just created
test('PUT a profile with a valid JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .put(`/api/profiles/${saveProfileId}`)
    .send({ name: 'Jane Adams', email: 'jane@adams.com' })
    .set('Authorization', saveToken);

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // and return the updated profile
  expect(res.body.name).toBe('Jane Adams');
  expect(res.body.email).toBe('jane@adams.com');
  expect(res.body.id).toBe(saveProfileId);
});

// try to delete the profile we just updated
test('DELETE a profile with a valid JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .del(`/api/profiles/${saveProfileId}`)
    .set('Authorization', saveToken);

  // should get a 200 return code
  expect(res.status).toBe(204);
});

// the profile we just deleted should no longer exist
test('GET a non-existent profile', async () => {
  // try the endpoint
  const res = await supertest(server).get(`/api/profiles/${saveProfileId}`);

  // should get a 404 return code
  expect(res.status).toBe(404);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // should return a 'not found' message
  expect(res.body.message).toMatch(/not found/i);
});
