const express = require('express');
const consign = require('consign')();
const bodyParse = require('body-parser');
const expressValidator = require('express-validator');
const morgan = require('morgan');
const logger = require('../services/logger');

module.exports = () => {
  const app = express();

  app.use(morgan('common', {
    stream: {
      write: (msg) => {
        logger.info(msg);
      }
    }
  }));

  app.use(bodyParse.urlencoded({
    extended: true
  }));
  app.use(bodyParse.json());

  app.use(expressValidator());

  consign
    .include('controllers')
    .then('infra')
    .then('services')
    .into(app);

  return app;
}
