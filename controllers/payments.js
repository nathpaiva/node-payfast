Payments = app => {

  function _openConnection() {
    const connection = app.infra.connectionFactory();

    return new app.infra.PaymentDAO(connection);
  }

  app.get('/payments/payment', (req, res) => {
    const paymentDao = _openConnection();

    paymentDao.lista((error, result) => {
      if (error) {
        res.status(500).json(result);
        return;
      }

      // console.log('Pagamentos carregados com sucesso');
      res.status(200).send(result);
    });
  });

  app.delete('/payments/payment/:id', (req, res) => {
    var payment = {};
    const id = req.params.id;

    payment.status = 'CANCELADO';
    payment.id = id;

    const paymentDao = _openConnection();

    paymentDao.atualiza(payment, (error, resuslt) => {
      if (error) {
        res.status(500).json(payment);
        return;
      }
      // console.log('pagamento cancelado');
      res.status(204).json(payment);
    });
  });

  app.put('/payments/payment/:id', (req, res) => {
    var payment = {};
    var id = req.params.id;

    payment.status = 'CONFIRMADO';
    payment.id = id;

    const paymentDao = _openConnection();

    paymentDao.atualiza(payment, (error, resuslt) => {
      if (error) {
        res.status(500).json(payment);
        return;
      }
      // console.log('pagamento confirmado');
      res.status(200).json(payment);
    });
  });

  app.post('/payments/payment', (req, res) => {
    var payment = req.body.payment;

    req.assert('payment.forma_de_pagamento', 'Forma de pagamento é obrigatória').notEmpty();
    req.assert('payment.valor', 'Valor é obrigatória e deve ser um decimal').notEmpty().isFloat();
    req.assert('payment.moeda', 'Moeda é obrigatória e deve ter três caracteres').notEmpty().len(3, 3);

    const errors = req.validationErrors();

    if (payment.forma_de_pagamento === 'card') {
      res.status(201).json(req.body.card);
      return;
    }

    if (errors) {
      // console.log('Erro de validação encontrado');
      res.status(400).send(errors);
      return;
    }

    const paymentDao = _openConnection();

    payment.status = 'CRIADO';
    payment.data = new Date;

    paymentDao.salva(payment, function (error, result) {
      if (error) {
        res.status(500).json(payment);
        return;
      }

      // console.log('pagamento criado');
      payment.id = result.insertId;

      resultPayment = {
        data: payment,
        links: [{
            href: 'http://localhost:3000/payments/payment/' + payment.id,
            method: 'PUT',
            rel: 'confimar'
          },
          {
            href: 'http://localhost:3000/payments/payment/' + payment.id,
            method: 'DELETE',
            rel: 'cancelar'
          }
        ]
      }

      res.location('/payments/payment/' + payment.id);
      res.status(201).json(resultPayment);
    });
  });

}

module.exports = Payments;
