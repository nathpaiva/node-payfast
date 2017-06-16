Payments = app => {

  function _openConnection() {
    const connection = app.infra.connectionFactory();

    return {
      connection: connection,
      DAO: new app.infra.PaymentDAO(connection)
    }
  }

  function _createResult(payment, card) {
    return {
      data: payment,
      card: card || {},
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
  }

  app.get('/payments/payment', (req, res) => {
    const openConnection = _openConnection();
    const paymentDao = openConnection.DAO;

    paymentDao.lista((error, result) => {
      if (error) {
        res.status(500).json(result);
        return;
      }
      console.log('Pagamentos carregados com sucesso');
      res.json(result);
    });

    openConnection.connection.end();
  });

  app.get('/payments/payment/:id', (req, res) => {
    const id = req.params.id;

    var cache = app.services.memcachedClient();
    cache.get(`payment-${id}`, function (err, retorno) {
      if (err || !retorno) {
        const openConnection = _openConnection();
        const paymentDao = openConnection.DAO;

        paymentDao.buscaPorId(id, (error, result) => {
          if (error) {
            res.status(500).json(result);
            return;
          }

          res.json(result);
        });

        openConnection.connection.end();
        console.log('MISS - chave nao encontrada');
      } else {
        console.log('HIT - valor: ' + JSON.stringify(retorno));
        res.json(retorno);
      }
    });


  });

  app.delete('/payments/payment/:id', (req, res) => {
    var payment = {};
    const id = req.params.id;

    payment.status = 'CANCELADO';
    payment.id = id;

    const openConnection = _openConnection();
    const paymentDao = openConnection.DAO;

    paymentDao.atualiza(payment, (error, resuslt) => {
      if (error) {
        res.status(500).json(payment);
        return;
      }
      // console.log('pagamento cancelado');
      res.status(204).json(payment);
    });
    openConnection.connection.end();
  });

  app.put('/payments/payment/:id', (req, res) => {
    var payment = {};
    var id = req.params.id;

    payment.status = 'CONFIRMADO';
    payment.id = id;

    const openConnection = _openConnection();
    const paymentDao = openConnection.DAO;

    paymentDao.atualiza(payment, (error, resuslt) => {
      if (error) {
        res.status(500).json(payment);
        return;
      }
      res.status(200).json(payment);
    });
    openConnection.connection.end();
  });

  app.post('/payments/payment', (req, res) => {
    var payment = req.body.payment;

    req.assert('payment.forma_de_pagamento', 'Forma de pagamento é obrigatória').notEmpty();
    req.assert('payment.valor', 'Valor é obrigatória e deve ser um decimal').notEmpty().isFloat();
    req.assert('payment.moeda', 'Moeda é obrigatória e deve ter três caracteres').notEmpty().len(3, 3);

    const errors = req.validationErrors();

    if (errors) {
      // console.log('Erro de validação encontrado');
      res.status(400).send(errors);
      return;
    }

    if (payment.forma_de_pagamento === 'card') {
      const card = req.body.card;
      const clientCards = new app.services.clientCards();

      clientCards.authorize(card, (error, reqq, ress, result) => {
        if (error) {
          res.status(400).json(result);
          return;
        }

        res.status(201).json(_createResult(payment, result));
        return;
      });

    } else {
      const openConnection = _openConnection();
      const paymentDao = openConnection.DAO;

      payment.status = 'CRIADO';
      payment.data = new Date;

      paymentDao.salva(payment, function (error, result) {
        if (error) {
          res.status(500).json(payment);
          return;
        }

        payment.id = result.insertId;
        if (!req.body.getFromBase) {
          const cache = app.services.memcachedClient();
          cache.set(`payment-${payment.id}`, result, 60000, function (err) {
            console.log('nova chave: payment-' + payment.id);
          });
        }

        res.location('/payments/payment/' + payment.id);
        res.status(201).json(_createResult(payment));
      });

      openConnection.connection.end();
    }
  });

}

module.exports = Payments;
