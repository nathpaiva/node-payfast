const express = require('../config/express')();
const request = require('supertest')(express);
const assert = require('better-assert');


describe('#Produtos Controller', function () {

  let payment_create = {};
  beforeEach(function (done) {
    var conn = express.infra.connectionFactory();
    conn.query('delete from payment', function (ex, result) {
      if (!ex) {
        done();
      }
    });

    payment_create = {
      forma_de_pagamento: 'payfast',
      valor: '20.87',
      moeda: 'BRL',
      descricao: 'descrição do pagamentinho'
    };

  });

  it('#List payments', function (done) {
    request.get('/payments/payment')
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  describe('#Create payment validation', function () {
    it('#Create new payment', function (done) {
      request.post('/payments/payment')
        .send(payment_create)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(201, done);
    });

    it('#Create new payment empty "forma de pagamento"', function (done) {
      payment_create.forma_de_pagamento = '';
      request.post('/payments/payment')
        .send(payment_create)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(400)
        .then(response => {
          const isTrue = response.body[0].msg === 'Forma de pagamento é obrigatória';
          assert(isTrue);
        })
        .then(done);
    });

    it('#Create new payment empty "valor"', function (done) {
      payment_create.valor = '';
      request.post('/payments/payment')
        .send(payment_create)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(400)
        .then(response => {
          const isTrue = response.body[0].msg === 'Valor é obrigatória e deve ser um decimal';
          assert(isTrue);
        })
        .then(done);
    });

    it('#Create new payment with "moeda" more than 3 characters', function (done) {
      payment_create.moeda = 'BRLL';
      request.post('/payments/payment')
        .send(payment_create)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(400)
        .then(response => {
          const isTrue = response.body[0].msg === 'Moeda é obrigatória e deve ter três caracteres';
          assert(isTrue);
        })
        .then(done);
    });

    it('#Create new payment empty "moeda"', function (done) {
      payment_create.moeda = '';
      request.post('/payments/payment')
        .send(payment_create)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(400)
        .then(response => {
          const isTrue = response.body[0].msg === 'Moeda é obrigatória e deve ter três caracteres';
          assert(isTrue);
        })
        .then(done);
    });
  });

  it('#Create new payment to confirm', function (done) {
    request.post('/payments/payment')
      .send(payment_create)
      .set('Accept', 'application/json')
      .then(response => {
        confimPayment(response.body.data.id);
      });

    const confimPayment = id => {
      request.put(`/payments/payment/${id}`)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200, done);
    }
  });

  it('#Create new payment to cancel', function (done) {
    request.post('/payments/payment')
      .send(payment_create)
      .set('Accept', 'application/json')
      .then(response => {
        cancelPayment(response.body.data.id);
      });

    const cancelPayment = id => {
      request.delete(`/payments/payment/${id}`)
        .set('Accept', 'application/json')
        .expect(204, done);
    }
  });

});
