const router = require('express').Router();
const profModel = require('./prof-model.js');
const authenticate = require('../auth/auth-middleware.js');

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

router.get('/users/:user_id', async (req, res, next) => {
  // get a profile by user_id
  try {
    const profiles = await profModel.findAllBy({ user_id: req.params.user_id });
    res.json(profiles);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  // add a profile
  try {
    // name is required, make sure it is present
    if (!req.body.name) {
      res.status(400).json({
        message: 'You must supply a name',
      });
      return;
    }
    // attempt the add profile
    const prof = { ...req.body, user_id: req.tokenData.id };
    const profile = await profModel.add(prof);

    if (profile) {
      res.json(profile);
      return;
    }
    // add operation failed
    res.status(401).json({ message: `add profile failed` });
    return;
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  // update a profile
  const id = Number.parseInt(req.params.id);
  try {
    // name is required, make sure it is present
    if (!req.body.name) {
      res.status(400).json({
        message: 'You must supply a name',
      });
      return;
    }
    // make sure a profile with that id already exists
    const oldProf = await profModel.findById(id);
    if (!oldProf) {
      res.status(400).json({
        message: `Profile ${id} not found`,
      });
      return;
    }
    // okay, attempt the update
    const prof = { ...req.body, user_id: req.tokenData.id };
    const profile = await profModel.update(prof, id);

    if (profile) {
      res.json(profile);
      return;
    }
    // update did not work
    res.status(401).json({ message: `update profile failed` });
    return;
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  // delete a profile
  const id = Number.parseInt(req.params.id);
  try {
    // attempt the delete
    const count = await profModel.del(id);

    if (count) {
      res.sendStatus(204);
    } else {
      // delete did not work
      res.status(404).json({ message: ` profile ${id} not found` });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
