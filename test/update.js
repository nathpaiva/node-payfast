const express = require('../config/express')();
const request = require('supertest')(express);
const assert = require('better-assert');
const fs = require('fs');

describe('#Upload Controller', () => {

  let image = '';
  beforeEach((done) => {
    image = 'test/MMs.jpg';
    done()
  });
  // .parse('data-binary', image)
  it('#Upload image', (done) => {
    // const writableStream = fs.createWriteStream("files/minha-oi-foi.jpg");

    // const req = request.post('/upload/photo')
    //   .set('Content-Type', 'application/octet-stream')
    //   .set('filename', 'minha-i-foi.jpg')
    //   .write(fs.readFileSync(image))

    const req = request.post('/upload/photo')
      .field('Content-Type', 'application/octet-stream')
      .field('filename', 'minha-hdhdhdhdh-foi.jpg')
      .attach('file', image)
      .write(fs.readFileSync(image))
      .end(function (err, res) {
        console.log('res', res);
        // res.status;
        // res.should.have.status(200) // 'success' status
        done()
      });
    // require('fs').createReadStream(image).pipe(req);
  });

});
