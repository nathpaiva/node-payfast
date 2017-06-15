Correios = app => {
  app.post('/correios/delivery-time', (req, res) => {
    const deliveryDate = req.body;

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
