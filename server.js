const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('./auth/auth-middleware.js');
const authRouter = require('./auth/auth-router.js');
const profRouter = require('./profiles/prof-router.js');
const postRouter = require('./postings/post-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/profiles', authenticate, profRouter);
// server.use('/api/postings', authenticate, postRouter);

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
