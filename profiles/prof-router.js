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

router.get('/:id', async (req, res, next) => {
  // get a profile by id
  try {
    const profile = await profModel.findById(req.params.id);
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: `Profile ${req.params.id} not found` });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
