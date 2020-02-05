exports.up = function(knex) {
  return knex.schema.createTable('marks', marks => {
    marks.increments('id');

    marks
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    marks
      .integer('profile_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('profiles')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    marks
      .integer('posting_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('postings')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    marks.integer('mark').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('marks');
};
