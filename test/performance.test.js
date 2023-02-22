/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
require('dotenv').config();
const model = require('../server/dbFiles/dbRoutes');
const dbTest = require('../server/dbFiles/db');

const questionArgs = [1, 'Test Question Body', 'testquestionname123', 'test@email.com'];
const answerArgs = [1, 'Test Answer Body', 'test answer', 'test@email.com', ['https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80']];

let storage = [];

async function functionExecutionTime(func, ...args) {
  const start = performance.now();
  await func(...args);
  const end = performance.now();
  storage.push(end - start);
  console.log(`Execution time of ${func.name}: ${(end - start)} ms`);
}

async function executeTenTimes(func, args) {
  storage = [];
  for (let i = 0; i < 9; i++) {
    func.apply(this, args);
  }
  return storage;
}

function calculateAverageTime(arr, tableName) {
  let sum = 0;
  arr.forEach((num) => {
    sum += num;
  });
  console.log(`average time for ${tableName} is ${sum / 10}`);
  return sum / 10;
}

async function test() {
  try {
    Promise.all([functionExecutionTime(model.addQuestion, ...questionArgs),
      executeTenTimes(functionExecutionTime, [model.addQuestion, ...questionArgs])])
      .then((data) => calculateAverageTime(data[1], 'questions'))
      .then(() => Promise.all([functionExecutionTime(model.addAnswer, ...answerArgs),
        executeTenTimes(functionExecutionTime, [model.addAnswer, ...answerArgs])])
        .then((data) => calculateAverageTime(data[1], 'answers')))
      .then(() => Promise.all([functionExecutionTime(model.getAllQuestions, 1),
        executeTenTimes(functionExecutionTime, [model.getAllQuestions, 1])]))
      .then((data) => calculateAverageTime(data[1], 'questions'))
      .then(() => Promise.all([functionExecutionTime(model.getAllAnswers, 1),
        executeTenTimes(functionExecutionTime, [model.getAllAnswers, 1])]))
      .then((data) => calculateAverageTime(data[1], 'answers'));
  } catch (err) {
    console.log('ERROR', err);
  } finally {
    await dbTest.end();
  }
}

test();
