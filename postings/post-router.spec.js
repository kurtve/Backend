// tests for post-router.js
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

// get all postings
test('GET all postings', async () => {
  // try the endpoint
  const res = await supertest(server).get('/api/postings');

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // should get 2 profiles
  expect(res.body.length).toBe(2);

  // first element is an object with a job_title
  expect(res.body[0]).toHaveProperty('id');
  expect(res.body[0]).toHaveProperty('job_title');
});

// try to post a profile without a JWT
test('POST a posting without a JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/postings')
    .send({ job_title: 'Web Dev', company: 'ACME Widgets' });

  // should get a 401 return code
  expect(res.status).toBe(401);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // with an 'invalid' message
  expect(res.body.message).toMatch(/invalid/i);
});

// we will need this for later tests
let savePostingId;

// try to post a posting with a JWT
test('POST a posting with a valid JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/postings')
    .send({ job_title: 'Web Dev', company: 'ACME Widgets' })
    .set('Authorization', saveToken);

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // and return the profile
  expect(res.body.job_title).toBe('Web Dev');
  expect(res.body.company).toBe('ACME Widgets');
  expect(res.body.id).toBeDefined();
  savePostingId = res.body.id;
});

// try to update the posting we just created
test('PUT a posting with a valid JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .put(`/api/postings/${savePostingId}`)
    .send({ job_title: 'Data Analyst', company: 'ACME Innovations' })
    .set('Authorization', saveToken);

  // should get a 200 return code
  expect(res.status).toBe(200);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // and return the updated profile
  expect(res.body.job_title).toBe('Data Analyst');
  expect(res.body.company).toBe('ACME Innovations');
  expect(res.body.id).toBe(savePostingId);
});

// try to delete the posting we just updated
test('DELETE a posting with a valid JWT', async () => {
  // try the endpoint
  const res = await supertest(server)
    .del(`/api/postings/${savePostingId}`)
    .set('Authorization', saveToken);

  // should get a 200 return code
  expect(res.status).toBe(204);
});

// the posting we just deleted should no longer exist
test('GET a non-existent posting', async () => {
  // try the endpoint
  const res = await supertest(server).get(`/api/postings/${savePostingId}`);

  // should get a 404 return code
  expect(res.status).toBe(404);

  // with a json message
  expect(res.type).toMatch(/json/i);

  // should return a 'not found' message
  expect(res.body.message).toMatch(/not found/i);
});
