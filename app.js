const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//helpers
require('./api/helpers/init_mongo_db')


const userRoutes = require('./api/routes/user');
const postRoutes = require('./api/routes/post')

const { Mongoose } = require('mongoose');



app.use(morgan('dev')); 
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
     "Origin X-Requested-with, content-Type, Accept, Authorization");

     if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


 //Routes which should handle resquests

 app.use('/user', userRoutes);
 app.use('/post', postRoutes);

 app.use ((req, res, next) => {
     const error = new Error('Not found')
     error.status = 400;
     next(error);
 })
 app.use((error,req, res, next) => {
     res.status(error.status || 500);
     res.json({
         error: {
             message: error.message
         }
     });
 });
module.exports = app;