const express = require('../config/express')();
const request = require('supertest')(express);
const fs = require('fs');

describe('#Upload Controller', () => {

  let image = '';
  beforeEach((done) => {
    image = 'test/MMs.jpg';
    done()
  });

  it('#Upload image', (done) => {
    request.post('/upload/photo')
      .set('Content-Type', 'application/octet-stream')
      .set('filename', 'new-foto.jpg')
      .write(fs.readFileSync(image), done)
  });

});
