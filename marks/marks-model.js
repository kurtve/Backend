const db = require('../database/dbConfig.js');

// get a list of all marks
async function find() {
  return db('marks').select();
}

// get tje first mark matching a filter criteria
function findBy(filter) {
  return db('marks')
    .where(filter)
    .select()
    .first();
}

// get all marks matching a filter criteria
function findAllBy(filter) {
  return db('marks')
    .where(filter)
    .select();
}

// get a single mark with the given id
async function findById(id) {
  return db('marks')
    .where({ id })
    .select()
    .first();
}

// add a mark
// note: user_id is taken from tokenData that was inserted by middleware
async function add(mark) {
  const cleanMark = {
    user_id: mark.user_id,
    profile_id: mark.profile_id,
    posting_id: mark.posting_id,
    mark: mark.mark || 0,
  };

  const [id] = await db('marks').insert(cleanMark);
  return findById(id);
}

// update a mark
// note: user_id is taken from tokenData that was inserted by middleware
async function update(mark, id) {
  const cleanMark = {
    user_id: mark.user_id,
    profile_id: mark.profile_id,
    posting_id: mark.posting_id,
    mark: mark.mark || 0,
  };

  await db('marks')
    .update(cleanMark)
    .where({ id });
  return findById(id);
}

// delete a mark
async function del(id) {
  const count = await db('marks')
    .del()
    .where({ id });
  return count;
}

module.exports = {
  del,
  add,
  update,
  find,
  findBy,
  findAllBy,
  findById,
};
