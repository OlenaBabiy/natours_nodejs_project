const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./public/routes/tourRouter');
const userRouter = require('./public/routes/userRouter');
const reviewRouter = require('./public/routes/reviewRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./public/controllers/errorControler');
const path = require('path');
const viewRouter = require('./public/routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limits requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSql query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Serving static files
// app.use(express.static(`${__dirname}/../public`));

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toDateString();
  next();
});

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// app.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Hellen',
//   });
// });

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

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
