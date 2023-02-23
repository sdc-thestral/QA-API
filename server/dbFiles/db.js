/* eslint-disable radix */
require('dotenv').config;
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  databasGe: process.env.PGDATABSE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const modifySequences = (tableName) => {
  let tableId = '';
  if (tableName === 'answer_photos') {
    tableId = 'photo';
  } else {
    tableId = tableName.slice(0, tableName.length - 1);
  }

  let foreignKey = '';
  if (tableName === 'questions') {
    foreignKey = 'product_id';
  } else if (tableName === 'answers') {
    foreignKey = 'question_id';
  } else if (tableName === 'answer_photos') {
    foreignKey = 'answer_id';
  }

  db.query(`SELECT MAX(${tableId}_id) FROM ${tableName};`)
    .then((data) => {
      const nextVal = Number.parseInt(data.rows[0].max) + 1;
      return nextVal;
    })
    .then((value) => db.query(`DROP SEQUENCE IF EXISTS ${tableId}_id_seq CASCADE;`)
      .then(() => db.query(`CREATE SEQUENCE ${tableId}_id_seq MINVALUE ${value};`)))
    .then(() => {
      db.query(`ALTER TABLE ${tableName}
        ALTER ${tableId}_id SET DEFAULT NEXTVAL('${tableId}_id_seq');`);
    })
    .then(() => {
      db.query(`CREATE INDEX IF NOT EXISTS idx_${tableName}_${foreignKey} ON ${tableName}(${foreignKey});`);
    });
};

db.connect()
  .then(() => Promise.all([modifySequences('questions'), modifySequences('answers'), modifySequences('answer_photos')]));

console.log('Connected to PostgreSQL, listening on port 5432');

module.exports = db;
