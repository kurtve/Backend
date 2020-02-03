const db = require('../database/dbConfig.js');

// get a list of all profiles
async function find() {
  return db('profiles').select();
}

// get the first profile matching a filter criteria
function findBy(filter) {
  return db('profiles')
    .where(filter)
    .select()
    .first();
}

// get all profiles matching a filter criteria
function findAllBy(filter) {
  return db('profiles')
    .where(filter)
    .select();
}

// get a single profile with the given id
async function findById(id) {
  return db('profiles')
    .where({ id })
    .select()
    .first();
}

// add a profile
// note: user_id is taken from tokenData that was inserted by middleware
async function add(profile) {
  const cleanProfile = {
    user_id: profile.user_id,
    name: profile.name || '',
    phone: profile.phone || '',
    email: profile.email || '',
    description: profile.description || '',
    skills: profile.skills || '',
    education1: profile.education1 || '',
    education2: profile.education2 || '',
    education3: profile.education3 || '',
    job_history1: profile.job_history1 || '',
    job_history2: profile.job_history2 || '',
    job_history3: profile.job_history3 || '',
  };

  const [id] = await db('profiles').insert(cleanProfile);
  return findById(id);
}

// update a profile
// note: user_id is taken from tokenData that was inserted by middleware
// if any fields are undefined, they will be unchanged in the database
async function update(profile, id) {
  const cleanProfile = {
    user_id: profile.user_id,
    name: profile.name || '',
    phone: profile.phone || '',
    email: profile.email || '',
    description: profile.description || '',
    skills: profile.skills || '',
    education1: profile.education1 || '',
    education2: profile.education2 || '',
    education3: profile.education3 || '',
    job_history1: profile.job_history1 || '',
    job_history2: profile.job_history2 || '',
    job_history3: profile.job_history3 || '',
  };

  await db('profiles')
    .update(cleanProfile)
    .where({ id });
  return findById(id);
}

// delete a profile
async function del(id) {
  const count = await db('profiles')
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
