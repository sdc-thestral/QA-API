// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
// const path = require('path');
const cors = require('cors');
// const db = require('./db');
const logger = require('./logger');
const dbQuery = require('./dbRoutes');

const app = express();

app.use(cors());
app.use(logger);
app.use(express.json());

app.get('/questions', (req, res) => {
  dbQuery.getAllQuestions(1 /** add count and page params too */)
    .then((data) => {
    //   console.log(data);
      res.send(data);
    });
});
app.get('/answers', (req, res) => {
  dbQuery.getAllAnswers(1 /** add count and page params too */)
    .then((data) => {
    //   console.log(data);
      res.send(data);
    });
});

app.post('/addQuestion', (req, res) => {
  const productId = req.body.product_id;
  const body = req.body.question_body;
  const name = req.body.asker_name;
  const email = req.body.asker_email;

  dbQuery.addQuestion(productId, body, name, email)
    .then(() => res.send('question added!'));
});

app.post('/addAnswer', (req, res) => {
  const questionId = req.body.question_id;
  const body = req.body.answer_body;
  const name = req.body.answerer_name;
  const email = req.body.answerer_email;
  const { photoArr } = req.body;

  dbQuery.addAnswer(questionId, body, name, email, photoArr)
    .then(() => res.send('answer added!'));
});

app.listen(process.env.PORT);
console.log(`Server listening at http://localhost:${process.env.PORT}`);
