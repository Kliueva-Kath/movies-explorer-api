require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const routers = require('./routes/index');
const { error } = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rateLimit');
const { MONGODB_DEV } = require('./utils/devConfig');

const { PORT = 3000, MONGODB_URL, NODE_ENV } = process.env;

const app = express();
app.use(helmet());

async function main() {
  try {
    await mongoose.connect(NODE_ENV === 'production' ? MONGODB_URL : MONGODB_DEV, {
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
app.use(limiter);
app.use(cors);

app.use('/', routers);

app.use(errorLogger);
app.use(errors());
app.use(error);
