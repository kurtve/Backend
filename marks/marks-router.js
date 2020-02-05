const router = require('express').Router();
const marksModel = require('./marks-model.js');
const authenticate = require('../auth/auth-middleware.js');

router.get('/', async (req, res, next) => {
  // get all marks
  try {
    const marks = await marksModel.find();
    res.json(marks);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  // get a mark by id
  try {
    const mark = await marksModel.findById(req.params.id);
    if (mark) {
      res.json(mark);
    } else {
      res.status(404).json({ message: `mark ${req.params.id} not found` });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users/:user_id', async (req, res, next) => {
  // get marks by user_id
  try {
    const marks = await marksModel.findAllBy({ user_id: req.params.user_id });
    res.json(marks);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  // add a mark
  try {
    // all fields are required
    if (!req.body.profile_id || !req.body.posting_id || !req.body.mark) {
      res.status(400).json({
        message: 'You must supply profile_id, posting_id, and mark',
      });
      return;
    }
    // attempt the add mark
    const cleanMark = { ...req.body, user_id: req.tokenData.id };
    const mark = await marksModel.add(cleanMark);

    if (mark) {
      res.json(mark);
      return;
    }
    // add operation failed
    res.status(401).json({ message: `add mark operation failed` });
    return;
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  // update a mark
  const id = Number.parseInt(req.params.id);
  try {
    // all fields are required
    if (!req.body.profile_id || !req.body.posting_id || !req.body.mark) {
      res.status(400).json({
        message: 'You must supply profile_id, posting_id, and mark',
      });
      return;
    }
    // make sure a mark with that id already exists
    const oldMark = await marksModel.findById(id);
    if (!oldMark) {
      res.status(400).json({
        message: `mark ${id} not found`,
      });
      return;
    }
    // okay, attempt the update
    const cleanMark = { ...req.body, user_id: req.tokenData.id };
    const mark = await marksModel.update(cleanMark, id);

    if (mark) {
      res.json(mark);
      return;
    }
    // update did not work
    res.status(401).json({ message: `update mark failed` });
    return;
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  // delete a mark
  const id = Number.parseInt(req.params.id);
  try {
    // attempt the delete
    const count = await marksModel.del(id);

    if (count) {
      res.sendStatus(204);
    } else {
      // delete did not work
      res.status(404).json({ message: `mark ${id} not found` });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
