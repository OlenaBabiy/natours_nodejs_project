const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: '././config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log('DB connected successfully'));

const testTour = new Tour({
  name: 'Mountain resort',
  price: 1500,
});

testTour
  .save()
  .then((docs) => console.log(docs))
  .catch((err) => console.log('Error', err));

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App running');
});
