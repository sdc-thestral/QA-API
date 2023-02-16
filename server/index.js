// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const logger = require('./logger');

const app = express();

app.use(cors());
app.use(logger);
app.use(express.json());

app.listen(process.env.PORT);
console.log(`Server listening at http://localhost:${process.env.PORT}`);
