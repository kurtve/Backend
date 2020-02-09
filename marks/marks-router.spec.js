// tests for marks-router.js
const supertest = require('supertest');
const server = require('../server');
const db = require('../database/dbConfig.js');

// initialize database before running tests
beforeAll(async () => {
  await db.seed.run();
});

// we will need this for later tests
let saveToken;

// register and save the token
test(`register and receive a token`, async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/auth/register')
    .send({ username: 'joe', role: 'employer', password: 'joe' });

  saveToken = res.body.token;
});

//  get all marks
test('GET all marks', async () => {
  // try the endpoint
  const res = await supertest(server).get('/api/marks');

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // should get 2 marks
  expect(res.body.length).toBe(4);

  // first element is an object with user_id, profile_id, posting_id, and mark
  expect(res.body[0]).toHaveProperty('id');
  expect(res.body[0]).toHaveProperty('user_id');
  expect(res.body[0]).toHaveProperty('profile_id');
  expect(res.body[0]).toHaveProperty('posting_id');
  expect(res.body[0]).toHaveProperty('mark');
});

// try to post a mark without a JWT
test('POST a mark without a JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/marks')
    .send({ profile_id: 1, posting_id: 2, mark: 1 });

  // should get a 401 return code
  expect(res.status).toBe(401);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // with an 'invalid' message
  expect(res.body.message).toMatch(/invalid/i);
});

// we will need this for later tests
let savemarkId;

// try to post a mark with a JWT
test('POST a mark with a valid JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/marks')
    .send({ profile_id: 1, posting_id: 2, mark: 1 })
    .set('Authorization', saveToken);

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // and return the mark
  expect(res.body.profile_id).toBe(1);
  expect(res.body.posting_id).toBe(2);
  expect(res.body.mark).toBe(1);
  expect(res.body.id).toBeDefined();
  savemarkId = res.body.id;
});

// try to update the mark we just created
test('PUT a mark with a valid JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .put(`/api/marks/${savemarkId}`)
    .send({ profile_id: 1, posting_id: 2, mark: -1 })
    .set('Authorization', saveToken);

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // and return the updated mark
  expect(res.body.profile_id).toBe(1);
  expect(res.body.posting_id).toBe(2);
  expect(res.body.mark).toBe(-1);
  expect(res.body.id).toBe(savemarkId);
});

// try to delete the mark we just updated
test('DELETE a mark with a valid JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .del(`/api/marks/${savemarkId}`)
    .set('Authorization', saveToken);

  // should get a 200 return code
  expect(res.status).toBe(204);
});

// the mark we just deleted should no longer exist
test('GET a non-existent mark', async () => {
  // try the endpoint
  const res = await supertest(server).get(`/api/marks/${savemarkId}`);

  // should get a 404 return code
  expect(res.status).toBe(404);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // should return a 'not found' message
  expect(res.body.message).toMatch(/not found/i);
});
