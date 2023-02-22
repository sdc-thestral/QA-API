/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/index');

describe('Test qa/questions path', () => {
  test('it should have a status code of 200 with get question request', () => request(app)
    .get('/qa/questions/?product_id=1')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));

  test('is should respond with at least one question on get question', () => request(app)
    .get('/qa/questions/?product_id=1')
    .then((response) => {
      const resultArr = JSON.parse(response.text).results;
      expect(resultArr.length).toBeGreaterThanOrEqual(1);
    }));
});

describe('Test qa/question/:question_id/answers path', () => {
  test('it should have a status code of 200 with a get answers request', () => request(app)
    .get('/qa/questions/1/answers/')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});

describe('Add a question', () => {
  test('it should have a status code of 200', () => request(app)
    .post('/qa/questions')
    .set('Content-Type', 'application/json')
    .send('{ "product_id": 1, "question_body": "Testing adding a question", "asker_name": "testQuestionUser", "asker_email": "testquestion@email.com" }')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});

describe('Add an answer', () => {
  test('it should have a status code of 200', () => request(app)
    .post('/qa/questions/1/answers')
    .set('Content-Type', 'application/json')
    .send('{ "question_id": 1, "answer_body": "Test Answer Body", "answerer_name": "test answer", "answerer_email": "test@email.com", "photoArr": ["https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"] }')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});

describe('mark question helpful', () => {
  test('it should have a status code of 200 after marked helpful', () => request(app)
    .put('/qa/questions/5/helpful')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});

describe('mark answer helpful', () => {
  test('it should have a status code of 200 after marked helpful', () => request(app)
    .put('/qa/answers/5/helpful')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});

describe('mark question reported', () => {
  test('it should have a status code of 200 after reported', () => request(app)
    .put('/qa/questions/3518968/report')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});

describe('mark answer reported', () => {
  test('it should have a status code of 200 after reported', () => request(app)
    .put('/qa/answers/6879308/report')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});
