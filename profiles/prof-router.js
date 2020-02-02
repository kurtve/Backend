const router = require('express').Router();
const profModel = require('./prof-model.js');

router.get('/', async (req, res, next) => {
  // get all profiles
  try {
    const profiles = await profModel.find();
    res.json(profiles);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
