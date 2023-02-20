/* eslint-disable radix */
const db = require('./db');

// questionResponse.rows is an array of question objects
// need to query each question_id to answers table
// const responseArr = questionResponse.rows.map((qObject) => {
//   db.query(`SELECT * FROM answers WHERE question_id = ${qObject.question_id};`)
//     .then((answerResponse) => {
//       answerResponse.rows.
//     });
// });
// return responseArr;

// assuming what we need to get question is in req.body, what would we pass to getQuestions
// const getAllQuestions = (productId, count) => {
//   const numCount = count || 5;
//   return db.query(`SELECT * FROM questions WHERE product_id = ${productId} LIMIT ${numCount}`)
//     .then((questionResponse) => {
//       const formattedRes = {};
//       formattedRes.product_id = productId;
//       formattedRes.results = questionResponse.rows.map((questionObj) => {
//         const currentQ = {};
//         currentQ.question_id = questionObj.question_id;
//         currentQ.question_body = questionObj.question_body;
//         currentQ.question_date = new Date(JSON.parse(questionObj.question_date)).toString();
//         currentQ.asker_name = questionObj.asker_name;
//         currentQ.question_helpfulness = questionObj.question_helpfulness;
//         currentQ.reported = questionObj.question_reported;
//         currentQ.answers = getAllAnswers(questionObj.question_id)
//         return currentQ;
//       });
//     })
//     .catch((err) => console.log('this is error in dbRoutes:', err));
// };

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
    // console.log(response.rows);
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
      // console.log(obj);
    });
    // console.log(answerObj);
    return answerObj;
  })
  .catch((err) => console.log(err));

const getAllQuestions = (productId, count) => {
  const numCount = count || 5;
  return db.query(`SELECT *,
  json_build_object('id', answers.answer_id, 'body', answer_body, 'date', answer_date,
  'answerer_name', answerer_name, 'helpfulness', answer_helpfulness,
  'reported', answer_reported) as answer
  from questions
  inner join answers on answers.question_id = questions.question_id
  inner join answer_photos on answer_photos.answer_id = answers.answer_id
  WHERE product_id = ${productId}`)
    .then((questionResponse) => {
      console.log(questionResponse.rows);
      const formattedRes = {};
      formattedRes.product_id = productId;
      formattedRes.results = [];
      questionResponse.rows.forEach((questionObj) => {
        const currentQ = {};
        currentQ.question_id = questionObj.question_id;
        currentQ.question_body = questionObj.question_body;
        currentQ.question_date = new Date(JSON.parse(questionObj.question_date)).toString();
        currentQ.asker_name = questionObj.asker_name;
        currentQ.question_helpfulness = questionObj.question_helpfulness;
        currentQ.reported = questionObj.question_reported;
        currentQ.answers = {};
        currentQ.answers[`${questionObj.answer_id}`] = questionObj.answer;

        formattedRes.results.push(currentQ);
        // }
      });
      return formattedRes;
    })
    // .then((responseObj) => {
    //   const response = {};
    //   response.product_id = productId;
    //   response.results = responseObj.results.map((question) => getAllAnswers(question.question_id)
    //     .then((data) => console.log(data)))
    //   // getAllAnswers(questionObj.question_id)
    //   //     .then((data) => data);
    //   return response;
    // })
    .catch((err) => console.log('this is error in dbRoutes:', err));
};

// const getAnswerPhotos = (answerId) => db.query(`SELECT * FROM answer_photos WHERE answer_id = ${answerId}`)
//   .then((response) => {
//     const photoArr = response.rows.map((object) => object.photo_url);
//     return photoArr;
//   })
//   .catch((err) => console.log(err));

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
