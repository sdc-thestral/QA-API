const csvtojson = require('csvtojson');
const { MongoClient } = require('mongodb');

var dbConn;
const connectionURL = 'mongodb://localhost:27017/questionanswer';
MongoClient.connect(connectionURL, {useUnifiedTopology: true})
    .then(client => {
        console.log('DB Connected!')
        dbConn = client.db();
    })
    .catch(err => console.log(`DB connection error ${err.message}`));


const csvFilePathQuestions = "/Users/ctunakan/SDC/questions.csv";
const csvFilePathAnswers = "/Users/ctunakan/SDC/answers.csv";
const csvFilePathPhotos = "/Users/ctunakan/SDC/answers_photos.csv";

const questionArrInsert = [];

csvtojson()
    .fromFile(csvFilePathQuestions)
    .then(source => {
        for (let i = 0; i < source.length; i++) {
            let singleRow = {
                _id: source[i].id,
                questionId: Number.parseInt(source[i].id),
                productId: Number.parseInt(source[i]['product_id']),
                questionBody: source[i].body,
                questionDate:Number.parseInt(source[i]['date_written']),
                askerName: source[i]['asker_name'],
                askerEmail: source[i]['asker_email'],
                questionReported: Number.parseInt(source[i].reported),
                questionHelpfulness: Number.parseInt(source[i].helpful )  
            }; 
            questionArrInsert.push(singleRow);
        }

        console.log('finished compiling arr');
        const collectionName = 'questions';
        const collection = dbConn.collection(collectionName);
        collection.insertMany(questionArrInsert, (err, result)=> {
            if (err) {
                console.log(err)
            }
            if (result) {
                console.log('questions csv imported successfully')
            }  
        });
       
        // return questionArrInsert;
    });




// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/questionanswer');

// const questionSchema = mongoose.Schema({
//     _id: String,
//     questionId: Number,
//     productId: Number,
//     questionBody: String,
//     questionDate: Number,
//     askerName: String,
//     askerEmail: String,
//     questionReported: Boolean,
//     questionHelpfulness: Number
// });

// const photoSchema = mongoose.Schema({
//     _id: String,
//     photoId: Number,
//     answerId: Number,
//     photoURL: String
// });

// const answerSchema = mongoose.Schema({
//     _id: String,
//     answerId: Number,
//     questionId: Number,
//     answerBody: String,
//     answerDate: Number,
//     answererName: String,
//     answererEmail: String,
//     answerReported: Boolean,
//     answerHelpfulness: Number
// });


// let Questions = mongoose.model('questions', questionSchema);
// let Answers = mongoose.model('answers', answerSchema);
// let Photos = mongoose.model('answer_photos', photoSchema);

// const csvFilePathQuestions = "/Users/ctunakan/SDC/questions.csv";
// const csvFilePathAnswers = "/Users/ctunakan/SDC/answers.csv";
// const csvFilePathPhotos = "/Users/ctunakan/SDC/answers_photos.csv";


// csvtojson()
//     .fromFile(csvFilePathQuestions)
//     .then(source => {
//         for (let i = 0; i < source.length; i++) {
//             let singleRow = {
//                 _id: source[i].id,
//                 questionId: Number.parseInt(source[i].id),
//                 productId: Number.parseInt(source[i]['product_id']),
//                 questionBody: source[i].body,
//                 questionDate:Number.parseInt(source[i]['date_written']),
//                 askerName: source[i]['asker_name'],
//                 askerEmail: source[i]['asker_email'],
//                 questionReported: Number.parseInt(source[i].reported),
//                 questionHelpfulness: Number.parseInt(source[i].helpful )  
//             }; 

//             // console.log(singleRow)
//             Questions.create(singleRow)
//                 .then(result => console.log('questions added'))
//         }
//         // return questionArrInsert;
//     })
//     .catch(err => console.log(err));

// csvtojson()
//     .fromFile(csvFilePathPhotos)
//     .then(source => {
//         for (let i = 0; i <source.length; i++) {
//             let singleRow = {
//                 _id: source[i].id,
//                 photoId: Number.parseInt(source[i].id),
//                 answerId: Number.parseInt(source[i]['answer_id']),
//                 photoURL: source[i].url
//             }

//             Photos.create(singleRow)
//                 .then(result => console.log('photos added'))
//         }
//     })
//     .catch(err => console.log(err));

// csvtojson()
//     .fromFile(csvFilePathAnswers)
//     .then(source => {
//         for (let i = 0; i < source.length; i++) {
//             let singleRow = {
//                 _id: source[i].id,
//                 answerId: Number.parseInt(source[i].id),
//                 questionId: Number.parseInt(source[i]['question_id']),
//                 answerBody: source[i].body,
//                 answerDate: Number.parseInt(source[i]['date_written']),
//                 answererName: source[i]['answerer_name'],
//                 answererEmail: source[i]['answerer_email'],
//                 answerReported: Number.parseInt(source[i].reported),
//                 answerHelpfulness: Number.parseInt(source[i].helpful )  
//             }; 

//             // console.log(singleRow)
//             Answers.create(singleRow)
//                 .then(result => console.log('answers added'))
//         }
//     })