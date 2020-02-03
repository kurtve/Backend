const router = require('express').Router();
const postModel = require('./post-model.js');

router.get('/', async (req, res, next) => {
  // get all postings
  try {
    const postings = await postModel.find();
    res.json(postings);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  // get a posting by id
  try {
    const posting = await postModel.findById(req.params.id);
    if (posting) {
      res.json(posting);
    } else {
      res.status(404).json({ message: `posting ${req.params.id} not found` });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  // add a posting
  try {
    // job_title is required, make sure it is present
    if (!req.body.job_title) {
      res.status(400).json({
        message: 'You must supply a job_title field',
      });
      return;
    }
    // attempt the add posting
    const post = { ...req.body, user_id: req.tokenData.id };
    const posting = await postModel.add(post);

    if (posting) {
      res.json(posting);
      return;
    }
    // add operation failed
    res.status(401).json({ message: `add posting failed` });
    return;
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  // update a posting
  const id = Number.parseInt(req.params.id);
  try {
    // job_title is required, make sure it is present
    if (!req.body.job_title) {
      res.status(400).json({
        message: 'You must supply a job_title field',
      });
      return;
    }
    // make sure a posting with that id already exists
    const oldPost = await postModel.findById(id);
    if (!oldPost) {
      res.status(400).json({
        message: `posting ${id} not found`,
      });
      return;
    }
    // okay, attempt the update
    const post = { ...req.body, user_id: req.tokenData.id };
    const posting = await postModel.update(post, id);

    if (posting) {
      res.json(posting);
      return;
    }
    // update did not work
    res.status(401).json({ message: `update posting failed` });
    return;
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  // delete a posting
  const id = Number.parseInt(req.params.id);
  try {
    // attempt the delete
    const count = await postModel.del(id);

    if (count) {
      res.sendStatus(204);
    } else {
      // delete did not work
      res.status(404).json({ message: ` posting ${id} not found` });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
