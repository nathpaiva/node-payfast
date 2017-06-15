// var express = require('../config/custom-express')();
// var request = require('supertest')(express);

// describe('#Payment Controller', function () {

//   // beforeEach(function (done) {
//   //   var conn = express.infra.connectionFactory();
//   //   conn.query('delete from payment', function (ex, result) {
//   //     if (!ex) {
//   //       done();
//   //     }
//   //   });
//   // });
//   beforeEach(function () {
//     express.infra.connectionFactory();
//     // conn.query('delete from livros', function (ex, result) {
//     //   if (!ex) {
//     //     done();
//     //   }
//     // });
//   });

//   it('#List payments', function () {
// request.get('/payments/payment')
//       .set('Accept', 'application/json')
//       .expect('Content-type', 'application/json')
//       .expect(200);
//   });

//   it('#Create new payment', function () {
//     request.post('/payments/pajijioyment')
//       .send({
//         forma_de_pagamento: 'payfast',
//         valor: '20.87',
//         moeda: 'BRL',
//         descricao: 'descrição do pagamentinho'
//       })
//       .set('Accept', 'application/json')
//       .expect('Content-type', /json/)
//       .expect(201);
//   });

// });


var express = require('../config/express')();
var request = require('supertest')(express);

describe('#Produtos Controller', function () {

  beforeEach(function (done) {
    var conn = express.infra.connectionFactory();
    conn.query('delete from payment', function (ex, result) {
      if (!ex) {
        done();
      }
    });
  });

  it('#List payments', function (done) {
    request.get('/payments/payment')
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('#Create new payment', function (done) {
    const payment_create = {
      forma_de_pagamento: 'payfast',
      valor: '20.87',
      moeda: 'BRL',
      descricao: 'descrição do pagamentinho'
    };

    request.post('/payments/payment')
      .send(payment_create)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(201, done);
  });

});
