const router = require('express').Router();
const authModel = require('./auth-model.js');

router.post('/register', async (req, res, next) => {
  // register a new user
  try {
    if (!req.body.username || !req.body.role || !req.body.password) {
      res.status(400).json({
        message: 'You must supply a username, role, and password',
      });
    } else if (
      req.body.role !== 'employee' &&
      req.body.role !== 'employer' &&
      req.body.role !== 'admin'
    ) {
      res.status(400).json({
        message: `role must be either 'employee' or 'employer'`,
      });
    } else {
      // if username already exists, return a 401 status
      const chkUser = await authModel.findBy({ username: req.body.username });
      if (chkUser !== undefined) {
        res.status(401).json({
          message: `username ${req.body.username} is unavailable`,
        });
      } else {
        const dbUser = await authModel.add({
          username: req.body.username,
          role: req.body.role,
          password: req.body.password,
        });
        const token = authModel.makeToken(dbUser);
        res.status(201).json({
          id: dbUser.id,
          username: dbUser.username,
          role: dbUser.role,
          token,
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  // login as an existing user
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({
        message: 'You must supply a username and a password',
      });
    } else {
      const user = { username: req.body.username, password: req.body.password };
      const isValid = await authModel.isValidUser(user);

      if (isValid) {
        const dbUser = await authModel
          .findBy({ username: user.username })
          .first();
        const token = authModel.makeToken(dbUser);

        res.status(200).json({
          id: dbUser.id,
          username: dbUser.username,
          role: dbUser.role,
          token,
        });
      } else {
        res.status(401).json({
          message: 'Invalid Credentials',
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
