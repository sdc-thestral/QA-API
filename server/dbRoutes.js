/* eslint-disable radix */
const db = require('./db');

// assuming what we need to get question is in req.body, what would we pass to getQuestions
const getAllQuestions = (productId, count, page) => {
  const numCount = count || 5;
  const numPage = page || 1;
  return db.query(`SELECT * FROM questions WHERE product_id = ${productId} LIMIT ${numCount}`)
    .then((response) => response.rows)
    .catch((err) => console.log('this is error in dbRoutes:', err));
};

const getAllAnswers = (questionId, count, page) => {
  const numCount = count || 5;
  const numPage = page || 1;
  return db.query(`SELECT * FROM answers WHERE question_id = ${questionId} LIMIT ${numCount}`)
    .then((response) => response.rows)
    .catch((err) => console.log(err));
};

const addQuestion = (productId, body, name, email) => {
  const postTime = new Date();
  const formattedTime = postTime.valueOf();

  return db.query(`INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email) 
          VALUES (${productId}, '${body}', ${formattedTime}, '${name}', '${email}');`)
    .then((response) => response)
    .catch((err) => console.log(err));
};

const addAnswer = (questionId, body, name, email, photoArr) => {
  const postTime = new Date();
  const formattedTime = postTime.valueOf();

  return db.query(`INSERT INTO answers (question_id, answer_body, answer_date, answerer_name, answerer_email) 
        VALUES (${questionId}, '${body}', ${formattedTime}, '${name}', '${email}');`)
    .then(() => db.query('SELECT MAX(id) FROM answers'))
    .then((data) => {
      const ansId = Number.parseInt(data.rows[0].max);
      if (photoArr) {
        photoArr.forEach((photo) => {
          db.query(`INSERT INTO answer_photos (answer_id, photo_url) VALUES (${ansId}, '${photo}');`);
        });
      }
    })
    .then((response) => response)
    .catch((err) => console.log(err));
};

const markQuestionHelpful = (id) => db.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${id};`)
  .then((response) => response)
  .catch((err) => console.log(err));

const markAnswerHelpful = (id) => db.query(`UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE answer_id = ${id};`)
  .then((response) => response)
  .catch((err) => console.log(err));

const reportQuestion = (id) => db.query(`UPDATE questions SET question_reported = false WHERE question_id = ${id};`)
  .then((response) => response)
  .catch((err) => console.log(err));

const reportAnswer = (id) => db.query(`UPDATE answers SET answer_reported = false WHERE answer_id = ${id};`)
  .then((response) => response)
  .catch((err) => console.log(err));

module.exports.getAllQuestions = getAllQuestions;
module.exports.getAllAnswers = getAllAnswers;
module.exports.addQuestion = addQuestion;
module.exports.addAnswer = addAnswer;
module.exports.markQuestionHelpful = markQuestionHelpful;
module.exports.markAnswerHelpful = markAnswerHelpful;
module.exports.reportQuestion = reportQuestion;
module.exports.reportAnswer = reportAnswer;
