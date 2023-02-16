// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { dbServer } = require('./db');

const app = express();

app.use(express.json());

app.listen(process.env.PORT);
