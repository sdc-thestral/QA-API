/* eslint-disable radix */
require('dotenv').config;
const { Client } = require('pg');

const db = new Client({
  user: 'ctunakan',
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432,
});

const modifySequences = (tableName) => {
  db.query(`SELECT MAX(id) FROM ${tableName};`)
    .then((data) => {
      const nextVal = Number.parseInt(data.rows[0].max) + 1;
      // console.log('nextVal: ', nextVal);
      return nextVal;
    })
    .then((value) => db.query(`DROP SEQUENCE IF EXISTS ${tableName}_id_seq CASCADE;`)
      .then(() => db.query(`CREATE SEQUENCE ${tableName}_id_seq MINVALUE ${value};`)))
    .then(() => {
      db.query(`ALTER TABLE ${tableName}
        ALTER id SET DEFAULT NEXTVAL('${tableName}_id_seq');`);
    });
};

db.connect()
  .then(() => Promise.all([modifySequences('questions'), modifySequences('answers'), modifySequences('answer_photos')]));

console.log('Connected to PostgreSQL, listening on port 5432');

module.exports = db;
