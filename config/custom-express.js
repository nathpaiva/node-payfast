const express = require('express');
const consign = require('consign')();
const bodyParse = require('body-parser');
const expressValidator = require('express-validator');

module.exports = () => {
  const app = express();

  app.use(bodyParse.urlencoded({
    extended: true
  }));
  app.use(bodyParse.json());

  app.use(expressValidator());

  consign
    .include('controllers')
    .then('infra')
    .into(app);

  return app;
}
