# QA-API
API for questions & answers portion of Atelier backend


## Postgres ETL
Please run node ETLpostgres.js to import csv files

## MongoDB ETLs
MongoETLs folder contains inidividual files to run for questions, answers, and answer_photos
To run each file... sh <fileName>


## Routes
| Routes | HTTP method | description | params needed | params options|
|---|---|---|---|---|
| /qa/questions | GET | gets all questions for a given product_id | product_id(integer) | count(integer, default '5'), page(integer, default 1)|
| /qa/questions/:question_id/answers | GET | gets all answers for a given question_id | question_id(integer) | count(integer, default '5'), page(integer, default '1')|
| /qa/questions | POST | adds a question for a given product_id | product_id(integer), body(text), name(text), email(text)| |
| /qa/questions/:question_id/answers | POST | adds an answer for a given question_id | question_id(integer), body(text), name(text), email(text), photos(array of text) | |
| /qa/questions/:question_id/helpful | PUT | updates question helpful count | question_id(integer) | |
| /qa/questions/:question_id/report | PUT | updates question to reported | question_id(integer) | |
| /qa/answers/:answer_id/helpful | PUT | updates answer helpful count | answer_id(integer) | |
| /qa/answers/:answer_id/report | PUT | updates answer to reported | answer_id(integer) | |
