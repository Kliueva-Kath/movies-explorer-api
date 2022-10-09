require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const NotFoundError = require('./errors/not-found-err');

const { auth } = require('./middlewares/auth');
const { error } = require('./middlewares/error');
const { urlRegExp } = require('./utils/regExp');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000, MONGODB_URL, NODE_ENV } = process.env;

const app = express();

async function main() {
  try {
    await mongoose.connect(NODE_ENV === 'production' ? MONGODB_URL : 'mongodb://localhost:27017/moviesdb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });

    await app.listen(PORT);
  } catch (err) {
    console.log(err);
  }
}

main();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});



app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use(error);
