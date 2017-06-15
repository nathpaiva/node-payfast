const express = require('../config/express')();
const request = require('supertest')(express);
const assert = require('better-assert');


describe('#Payment Controller', () => {

  let payment_create = {};
  beforeEach((done) => {
    var conn = express.infra.connectionFactory();
    conn.query('delete from payment', (ex, result) => {
      if (!ex) {
        done();
      }
    });

    payment_create = {
      payment: {
        forma_de_pagamento: 'payfast',
        valor: 20.87,
        moeda: 'BRL',
        descricao: 'descrição do pagamentinho'
      },
      card: {
        bandeira: "visa",
        cvv: 123,
        numero: 4444222211113333,
        mes_de_expiracao: 12,
        ano_de_expiracao: 2028
      }
    };
  });

  it('#List payments', (done) => {
    request.get('/payments/payment')
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  describe('#Create payment validation', () => {
    describe('#Create payment payfast', () => {
      it('#Create new payment empty "forma de pagamento"', (done) => {
        payment_create.payment.forma_de_pagamento = '';
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

      it('#Create new payment empty "valor"', (done) => {
        payment_create.payment.valor = null;
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

      it('#Create new payment with "moeda" more than 3 characters', (done) => {
        payment_create.payment.moeda = 'BRLL';
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

      it('#Create new payment empty "moeda"', (done) => {
        payment_create.payment.moeda = '';
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

      it('#Create new payment to payfast', (done) => {
        payment_create.payment.forma_de_pagamento = 'payfast';

        assert(payment_create.payment.forma_de_pagamento === 'payfast');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(201, done);
      });
    });
    describe('#Create payment card', () => {
      it('#Create new payment with card', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(201, done);
      });

      it('#Create new payment with card: wrong "número"', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.numero = 1234;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'Número é obrigatório e deve ter 16 caracteres.';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "bandeira"', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.bandeira = '';

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'Bandeira do cartão é obrigatória.';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "ano_de_expiracao" empyt', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.ano_de_expiracao = null;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'Ano de expiração é obrigatório e deve ter 4 caracteres.';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "ano_de_expiracao" less than 4 digits', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.ano_de_expiracao = 12;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'Ano de expiração é obrigatório e deve ter 4 caracteres.';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "ano_de_expiracao" more than 4 digits', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.ano_de_expiracao = 12123;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'Ano de expiração é obrigatório e deve ter 4 caracteres.';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "mes_de_expiracao" empty', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.mes_de_expiracao = null;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'Mês de expiração é obrigatório e deve ter 2 caracteres';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "mes_de_expiracao" less than 2 digits', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.mes_de_expiracao = 1;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'Mês de expiração é obrigatório e deve ter 2 caracteres';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "mes_de_expiracao" more than 2 digits', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.mes_de_expiracao = 123;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'Mês de expiração é obrigatório e deve ter 2 caracteres';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "cvv" empty', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.cvv = null;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'CVV é obrigatório e deve ter 3 caracteres';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "cvv" less than 3 digits', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.cvv = 12;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'CVV é obrigatório e deve ter 3 caracteres';
            assert(isTrue);
          })
          .then(done);
      });

      it('#Create new payment with card: wrong "cvv" more than 3 digits', (done) => {
        payment_create.payment.forma_de_pagamento = 'card';
        payment_create.card.cvv = 1223;

        assert(payment_create.payment.forma_de_pagamento === 'card');
        request.post('/payments/payment')
          .send(payment_create)
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(400)
          .then(response => {
            const isTrue = response.body[0].msg === 'CVV é obrigatório e deve ter 3 caracteres';
            assert(isTrue);
          })
          .then(done);
      });
    });
  });

  it('#Create new payment to confirm', (done) => {
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

  it('#Create new payment to cancel', (done) => {
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
