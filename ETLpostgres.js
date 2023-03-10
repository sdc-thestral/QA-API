/* eslint-disable no-console */
const { Client } = require('pg');

const client = new Client({
  user: 'ctunakan',
  host: 'localhost',
  database: 'questionsanswers',
  port: 5432,
});

const executeQuery = async (query) => {
  try {
    const response = await client.query(query);

    if (response) {
      const queryArr = query.split(' ');

      if (queryArr[0] === 'DROP') {
        console.log(`TABLE ${queryArr[4]} DROPPED`);
      } else if (queryArr[0] === 'CREATE') {
        console.log(`TABLE ${queryArr[2]} CREATED`);
      } else {
        console.log(`${response.rowCount} ROWS INSERTED INTO ${queryArr[5]}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const createQuestionsTable = `
    CREATE TABLE questions (
        question_id INT PRIMARY KEY,
        product_id INT,
        question_body VARCHAR,
        question_date BIGINT,
        asker_name VARCHAR,
        asker_email VARCHAR,
        question_reported BOOL DEFAULT false,
        question_helpfulness INT DEFAULT 0
    );`;

const createAnswersTable = `
    CREATE TABLE answers (
        answer_id INT PRIMARY KEY,
        question_id INT REFERENCES questions(question_id),
        answer_body VARCHAR,
        answer_date BIGINT,
        answerer_name VARCHAR,
        answerer_email VARCHAR,
        answer_reported BOOL DEFAULT false,
        answer_helpfulness INT DEFAULT 0
    );`;

const createPhotosTable = `
    CREATE TABLE answer_photos (
        photo_id INT PRIMARY KEY,
        answer_id INT REFERENCES answers(answer_id),
        photo_url VARCHAR
    );`;

const createAllTables = async () => Promise.all([executeQuery(createQuestionsTable),
  executeQuery(createAnswersTable),
  executeQuery(createPhotosTable)]);

const deleteQuery = (tableName) => `DROP TABLE IF EXISTS "${tableName}" CASCADE`;

const deleteAllTables = async () => executeQuery(deleteQuery('answer_photos'))
  .then(() => executeQuery(deleteQuery('answers')))
  .then(() => executeQuery(deleteQuery('questions')));

// real csv: '/Users/ctunakan/SDC/questions.csv'
// sample csv: '/Users/ctunakan/SDC/questionsSample.csv'
const loadQuestions = `
    COPY questions 
    FROM '/Users/ctunakan/SDC/questions.csv'
    DELIMITER ','
    CSV HEADER;
`;
// real csv: '/Users/ctunakan/SDC/answers.csv'
// sample csv: '/Users/ctunakan/SDC/answerSample.csv'
const loadAnswers = `
    COPY answers 
    FROM '/Users/ctunakan/SDC/answers.csv'
    DELIMITER ','
    CSV HEADER;
`;
// real csv: '/Users/ctunakan/SDC/answers_photos.csv'
// sample csv: '/Users/ctunakan/SDC/answers_photosSample.csv'
const loadPhotos = `
    COPY answer_photos 
    FROM '/Users/ctunakan/SDC/answers_photos.csv'
    DELIMITER ','
    CSV HEADER;
`;

const loadAll = async () => Promise.all([executeQuery(loadQuestions),
  executeQuery(loadAnswers),
  executeQuery(loadPhotos),
]);

const QA = async () => {
  try {
    await client.connect();
    await deleteAllTables();
    await createAllTables();
    await loadAll();
  } catch (error) {
    console.log('there was an error:', error);
  } finally {
    await client.end();
  }
};

QA();
