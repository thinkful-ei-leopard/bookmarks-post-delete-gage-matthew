require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const app = express();
const errorHandler = require('./error-handler');
const bookmarksRouter = require('./bookmarks-router');
const validateBearerToken = require('./vaidate-bearer-token');
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(validateBearerToken);

app.use(bookmarksRouter);
app.use(errorHandler);


module.exports = app;