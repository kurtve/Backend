// delete all records from initial set of tables
// delete in reverse order of how tables are populated

exports.seed = async knex => {
  await knex('postings').del();
  await knex('profiles').del();
  await knex('users').del();
};
