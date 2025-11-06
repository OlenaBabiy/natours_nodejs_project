const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./public/routes/tourRouter');
const userRouter = require('./public/routes/userRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./public/controllers/errorControler');

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

// if customer enter wrong path, we show this error
app.all('*', (req, res, next) => {
  //general handling

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//general place for all errors
app.use(globalErrorHandler);

module.exports = app;
