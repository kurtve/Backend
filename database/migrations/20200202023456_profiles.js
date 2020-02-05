exports.up = function(knex) {
  return knex.schema.createTable('profiles', profiles => {
    profiles.increments('id');
    profiles
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    profiles.string('name', 255).notNullable();
    profiles.string('phone', 20);
    profiles.string('email', 255);
    profiles.string('description', 5000);
    profiles.string('skills', 500);
    profiles.string('education1', 500);
    profiles.string('education2', 500);
    profiles.string('education3', 500);
    profiles.string('job_history1', 500);
    profiles.string('job_history2', 500);
    profiles.string('job_history3', 500);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('profiles');
};
