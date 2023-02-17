/* eslint-disable radix */
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
  const productId = Number.parseInt(req.query.product_id);
  const count = req.query.count ? req.query.count : null;
  const page = req.query.page ? req.query.page : null;

  dbQuery.getAllQuestions(productId, count, page)
    .then((data) => {
    //   console.log(data);
      res.send(data);
    });
});
app.get('/answers', (req, res) => {
  const questionId = Number.parseInt(req.query.question_id);
  const count = req.query.count ? req.query.count : null;
  const page = req.query.page ? req.query.page : null;

  dbQuery.getAllAnswers(questionId, count, page)
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

app.put('/markQuestionHelpful', (req, res) => {
  const questionId = req.query.question_id;

  dbQuery.markQuestionHelpful(questionId)
    .then(() => res.send('question marked helpful!'));
});

app.put('/markAnswerHelpful', (req, res) => {
  const answerId = req.query.answer_id;

  dbQuery.markAnswerHelpful(answerId)
    .then(() => res.send('answer marked helpful!'));
});

app.put('/reportQuestion', (req, res) => {
  const questionId = req.query.question_id;

  dbQuery.reportQuestion(questionId)
    .then(() => res.send('question reported!'));
});

app.put('/reportAnswer', (req, res) => {
  const questionId = req.query.question_id;

  dbQuery.reportAnswer(questionId)
    .then(() => res.send('answer reported!'));
});

app.listen(process.env.PORT);
console.log(`Server listening at http://localhost:${process.env.PORT}`);
