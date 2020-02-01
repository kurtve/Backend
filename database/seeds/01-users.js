// initial users

exports.seed = async knex => {
  await knex('users').insert([
    { id: 1, username: 'kurt', role: 'admin', password: 'x' },
    { id: 2, username: 'jdoe', role: 'employee', password: 'x' },
    { id: 3, username: 'asmith', role: 'employer', password: 'x' },
  ]);
};
