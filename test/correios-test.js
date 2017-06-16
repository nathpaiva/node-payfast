const express = require('../config/express')();
const request = require('supertest')(express);
const assert = require('better-assert');


describe('#Correios Controller', () => {

  let dataCorreios = {};
  beforeEach((done) => {
    dataCorreios = {
      nCdServico: "40010",
      sCepOrigem: "05303030",
      sCepDestino: "65066635"
    };
    done();
  });

  it('#Check delivery date success with all fields', (done) => {
    request.post('/correios/delivery-time')
      .send(dataCorreios)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200).then(response => {
        const isTrue = response.body.CalcPrazoResult.Servicos.cServico[0].Erro === '';
        assert(isTrue);
      })
      .then(done);
  });

  it('#Check delivery date erro "nCdServico" empty', (done) => {
    dataCorreios.nCdServico = '';

    request.post('/correios/delivery-time')
      .send(dataCorreios)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(400)
      .then(response => {
        const isTrue = response.body[0].msg === 'É necessário enserir uma dada ta servico';
        assert(isTrue);
      })
      .then(done);
  });

  it('#Check delivery date erro "sCepOrigem" empty', (done) => {
    dataCorreios.sCepOrigem = '';

    request.post('/correios/delivery-time')
      .send(dataCorreios)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(400)
      .then(response => {
        const isTrue = response.body[0].msg === 'É necessário enserir CEP de origem';
        assert(isTrue);
      })
      .then(done);
  });

  it('#Check delivery date erro "sCepDestino" empty', (done) => {
    dataCorreios.sCepDestino = '';

    request.post('/correios/delivery-time')
      .send(dataCorreios)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(400)
      .then(response => {
        const isTrue = response.body[0].msg === 'É necessário enserir CEP de destino';
        assert(isTrue);
      })
      .then(done);
  });
});
