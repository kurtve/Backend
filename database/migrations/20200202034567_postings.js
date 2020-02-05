exports.up = function(knex) {
  return knex.schema.createTable('postings', postings => {
    postings.increments('id');
    postings
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    postings.string('job_title', 255).notNullable();
    postings.string('company', 255);
    postings.string('phone', 20);
    postings.string('email', 255);
    postings.string('company_url', 255);
    postings.string('job_desc', 5000);
    postings.string('skills', 500);
    postings.string('level', 500);
    postings.string('pay', 500);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('postings');
};
