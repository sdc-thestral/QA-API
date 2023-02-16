require('dotenv').config;
const { Client } = require('pg');

const dbServer = new Client({
  user: 'ctunakan',
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432,
});

dbServer.connect();
console.log('Connected to PostgreSQL, listening on port 5432');

module.exports = dbServer;
