const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./public/routes/tourRouter');
const userRouter = require('./public/routes/userRouter');

const app = express();

app.use(express.static(`${__dirname}/../public`));

app.use(express.json());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;
