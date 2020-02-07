// enable environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRouter = require('./auth/auth-router.js');
const profRouter = require('./profiles/prof-router.js');
const postRouter = require('./postings/post-router.js');
const marksRouter = require('./marks/marks-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/profiles', profRouter);
server.use('/api/postings', postRouter);
server.use('/api/marks', marksRouter);

// default proof-of-life endpoint
server.get('/', (req, res, next) => {
  res.json({ message: `Droom-4 backend is alive` });
});

// global error handler
server.use((err, req, res, next) => {
  console.log('Error:', err);

  res.status(500).json({
    message: 'Server error',
  });
});

module.exports = server;
