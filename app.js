const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const usersRouter = require('./routes/usersRoute');
const tourRouter = require("./routes/tourRoute");

const app = express();
// app.use(bodyParser.urlencoded({ extended:false}))
// app.use(bodyParser.json())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res,next)=>{
    res.status(404).json({
        status: 'fail',
        message: `unable to find url ${req.originalUrl}`
    })
})
module.exports = app;
