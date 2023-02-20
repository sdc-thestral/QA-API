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

// get questions
app.get('/qa/questions', (req, res) => {
  console.time('Execution Time Get Questions');
  const productId = Number.parseInt(req.query.product_id);
  const count = req.query.count ? req.query.count : null;

  dbQuery.getAllQuestions(productId, count)
    .then((data) => {
      // console.log(data);
      res.send(data);
    // .then((resultObj) => {
    //   const newResultObj = {};
    //   newResultObj.product_id = req.query.product_id;
    //   const addAnswer = resultObj.results.map((question) => {
    //     const questionId = question.question_id;
    //     const formattted = question;
    //     return dbQuery.getAllAnswers(questionId)
    //       .then((answerObj) => {
    //         formattted.answers = answerObj;
    //         return formattted;
    //       })
    //       .then((obj) => {
    //         const arrayResults = Object.values(obj);
    //         return arrayResults;
    //       });
    //   });
    //   newResultObj.results = addAnswer;
    //   console.log(newResultObj);
    //   return newResultObj;
    })
    // .then((result) => res.send(result))
    .then(() => console.timeEnd('Execution Time Get Questions'));
});

app.get('/qa/answers/:answer_id/photos', (req, res) => {
  const answerId = Number.parseInt(req.params.answer_id);

  dbQuery.getAnswerPhotos(answerId)
    .then((data) => res.send(data));
});

// get answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  console.time('Execution Time Get Answers');
  const questionId = Number.parseInt(req.params.question_id);

  dbQuery.getAllAnswers(questionId)
    .then((data) => {
      res.send(data);
    })
    .then(() => console.timeEnd('Execution Time Get Answers'));
});

// add question
app.post('/qa/questions', (req, res) => {
  const productId = Number.parseInt(req.body.product_id);
  const body = req.body.question_body;
  const name = req.body.asker_name;
  const email = req.body.asker_email;

  dbQuery.addQuestion(productId, body, name, email)
    .then(() => res.send('question added!'));
});

// add answer
app.post('/qa/questions/:question_id/answers', (req, res) => {
  const questionId = req.body.question_id;
  const body = req.body.answer_body;
  const name = req.body.answerer_name;
  const email = req.body.answerer_email;
  const { photoArr } = req.body;

  dbQuery.addAnswer(questionId, body, name, email, photoArr)
    .then(() => res.send('answer added!'));
});

// mark question helpful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  const questionId = req.params.question_id;

  dbQuery.markQuestionHelpful(questionId)
    .then(() => res.send('question marked helpful!'));
});

// mark answer helpful
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  const answerId = Number.parseInt(req.params.answer_id);

  dbQuery.markAnswerHelpful(answerId)
    .then(() => res.send('answer marked helpful!'));
});

// reports question
app.put('/qa/questions/:question_id/report', (req, res) => {
  const questionId = req.params.question_id;

  dbQuery.reportQuestion(questionId)
    .then(() => res.send('question reported!'));
});

// reports answer
app.put('/qa/answers/:answer_id/report', (req, res) => {
  const questionId = req.params.question_id;

  dbQuery.reportAnswer(questionId)
    .then(() => res.send('answer reported!'));
});

app.listen(process.env.PORT);
console.log(`Server listening at http://localhost:${process.env.PORT}`);
