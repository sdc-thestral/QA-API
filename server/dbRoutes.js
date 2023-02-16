const db = require('./db');

// assuming what we need to get question is in req.body, what would we pass to getQuestions
const getAllQuestions = (productId, count, page) => {
  const numCount = count || 5;
  //   const numPage = page || 1;
  return db.query(`SELECT * FROM questions WHERE product_id = ${productId} LIMIT ${numCount}`)
    .then((response) => response.rows)
    .catch((err) => console.log('this is error in dbRoutes:', err));
};

module.exports.getAllQuestions = getAllQuestions;
