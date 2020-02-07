const knex = require('knex');
const knexConfig = require('../knexfile.js');

const environment = process.env.NODE_ENV || 'dev';

// grab the configuration for the environment we are running in
module.exports = knex(knexConfig[environment]);
