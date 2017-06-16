Correios = app => {
  app.post('/correios/delivery-time', (req, res) => {
    const deliveryDate = req.body;

    req.assert('nCdServico', 'É necessário enserir uma dada ta servico').notEmpty();
    req.assert('sCepOrigem', 'É necessário enserir CEP de origem').notEmpty();
    req.assert('sCepDestino', 'É necessário enserir CEP de destino').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      // console.log('Erro de validação encontrado');
      res.status(400).send(errors);
      return;
    }

    const correiosSOAPClient = new app.services.correiosSOAPClient();

    correiosSOAPClient.calcDeliveryTime(deliveryDate, (error, result) => {
      if (error) {
        console.log('veio aqui dentro');
        res.status(500).send(error);
        return;
      }
      res.status(200).json(result);
    })
  });
}

module.exports = Correios;
