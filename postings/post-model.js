const db = require('../database/dbConfig.js');

// get a list of all postings
async function find() {
  return db('postings').select();
}

// get the first posting matching a filter criteria
function findBy(filter) {
  return db('postings')
    .where(filter)
    .select()
    .first();
}

// get all postings matching a filter criteria
function findAllBy(filter) {
  return db('postings')
    .where(filter)
    .select();
}

// get a single posting with the given id
async function findById(id) {
  return db('postings')
    .where({ id })
    .select()
    .first();
}

// add a posting
// note: user_id is taken from tokenData that was inserted by middleware
async function add(posting) {
  const cleanPosting = {
    user_id: posting.user_id,
    job_title: posting.job_title || '',
    company: posting.company || '',
    phone: posting.phone || '',
    email: posting.email || '',
    company_url: posting.company_url || '',
    job_desc: posting.job_desc || '',
    skills: posting.skills || '',
    level: posting.level || '',
    pay: posting.pay || '',
  };

  const [id] = await db('postings').insert(cleanPosting);
  return findById(id);
}

// update a posting
// note: user_id is taken from tokenData that was inserted by middleware
async function update(posting, id) {
  const cleanPosting = {
    user_id: posting.user_id,
    job_title: posting.job_title || '',
    company: posting.company || '',
    phone: posting.phone || '',
    email: posting.email || '',
    company_url: posting.company_url || '',
    job_desc: posting.job_desc || '',
    skills: posting.skills || '',
    level: posting.level || '',
    pay: posting.pay || '',
  };

  await db('postings')
    .update(cleanPosting)
    .where({ id });
  return findById(id);
}

// delete a posting
async function del(id) {
  const count = await db('postings')
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
