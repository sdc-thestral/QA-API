/* eslint-disable radix */
const db = require('./db');

const getAnswerPhotos = async (answerId) => db.query(`SELECT * FROM answer_photos WHERE answer_id = ${answerId}`)
  .then((response) => {
    const photoArr = response.rows.map((object) => object.photo_url);
    return photoArr;
  })
  .catch((err) => console.log(err));

const getAllAnswers = (questionId) => db.query(`SELECT *, ARRAY_AGG(photo_url) photos FROM answers
  left outer join answer_photos using (answer_id)
  WHERE question_id = ${questionId}
  group by answer_id, photo_id`)
  .then((response) => {
    const answerObj = {};
    response.rows.forEach((obj) => {
      if (answerObj[`${obj.answer_id}`] !== undefined) {
        answerObj[`${obj.answer_id}`].photos.push(obj.photo_url);
      } else {
        const answer = {};
        answer.id = obj.answer_id;
        answer.body = obj.answer_body;
        answer.date = new Date(JSON.parse(obj.answer_date)).toString();
        answer.answerer_name = obj.answerer_name;
        answer.helpfulness = obj.answer_helpfulness;
        answer.reported = obj.answer_reported;
        answer.photos = obj.photo_url ? obj.photos : [];
        answerObj[`${answer.id}`] = answer;
      }
    });
    return answerObj;
  })
  .catch((err) => console.log(err));

const getAllQuestions = (productId) => db.query(`SELECT *,
  json_build_object('id', answers.answer_id, 'body', answer_body, 'date', answer_date,
  'answerer_name', answerer_name, 'helpfulness', answer_helpfulness,
  'reported', answer_reported, 'photos', answer_photos.photo_url) as answer
  from questions
  inner join answers on answers.question_id = questions.question_id
  full outer join answer_photos on answer_photos.answer_id = answers.answer_id
  WHERE product_id = ${productId}`)
  .then((questionResponse) => {
    const formattedRes = {};
    formattedRes.product_id = productId;
    const massObj = {};
    questionResponse.rows.forEach((questionObj) => {
      if (massObj[questionObj.question_id] !== undefined) {
        if (massObj[questionObj.question_id].answers[questionObj.answer.id] !== undefined) {
          const url = questionObj.photo_url;
          massObj[questionObj.question_id].answers[questionObj.answer.id].photos.push(url);
        } else {
          massObj[questionObj.question_id].answers[questionObj.answer.id] = questionObj.answer;
          massObj[questionObj.question_id].answers[questionObj.answer.id].photos = [];
        }
      } else {
        const currentQ = {};
        currentQ.question_id = questionObj.question_id;
        currentQ.question_body = questionObj.question_body;
        currentQ.question_date = new Date(JSON.parse(questionObj.question_date)).toString();
        currentQ.asker_name = questionObj.asker_name;
        currentQ.question_helpfulness = questionObj.question_helpfulness;
        currentQ.reported = questionObj.question_reported;
        currentQ.answers = {};
        currentQ.answers[questionObj.answer.id] = questionObj.answer;

        const photoArr = [];
        if (questionObj.photo_id) {
          photoArr.push(currentQ.answers[questionObj.answer.id].photos);
          currentQ.answers[questionObj.answer.id].photos = photoArr;
        } else {
          currentQ.answers[questionObj.answer.id].photos = photoArr;
        }
        massObj[questionObj.question_id] = currentQ;
      }
    });
    const results = Object.values(massObj);
    formattedRes.results = results;
    return formattedRes;
  })
  .catch((err) => console.log('this is error in dbRoutes:', err));

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

const markQuestionHelpful = (id) => db.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE id = ${id};`)
  .then((response) => response)
  .catch((err) => console.log(err));

const markAnswerHelpful = (id) => db.query(`UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE id = ${id};`)
  .then((response) => response)
  .catch((err) => console.log(err));

const reportQuestion = (id) => db.query(`UPDATE questions SET question_reported = false WHERE id = ${id};`)
  .then((response) => response)
  .catch((err) => console.log(err));

const reportAnswer = (id) => db.query(`UPDATE answers SET answer_reported = false WHERE id = ${id};`)
  .then((response) => response)
  .catch((err) => console.log(err));

module.exports.getAllQuestions = getAllQuestions;
module.exports.getAllAnswers = getAllAnswers;
module.exports.getAnswerPhotos = getAnswerPhotos;
module.exports.addQuestion = addQuestion;
module.exports.addAnswer = addAnswer;
module.exports.markQuestionHelpful = markQuestionHelpful;
module.exports.markAnswerHelpful = markAnswerHelpful;
module.exports.reportQuestion = reportQuestion;
module.exports.reportAnswer = reportAnswer;
