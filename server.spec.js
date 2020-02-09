// tests for server.js
const supertest = require('supertest');
const server = require('./server');
const db = require('./database/dbConfig.js');

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
