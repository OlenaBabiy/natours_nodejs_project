const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./models/tourModel');

process.on('uncaughtException', (err) => {
  console.log('uncaught exception!!!');
  console.log(err.name, err.message);
});

dotenv.config({ path: '././config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log('DB connected successfully'));

// const testTour = new Tour({
//   name: 'Mountain resort',
//   price: 1500,
// });

// testTour
//   .save()
//   .then((docs) => console.log(docs))
//   .catch((err) => console.log('Error', err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('App running');
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection!!!');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
