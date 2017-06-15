const soap = require('soap');
class correiosSOAPClient {
  constructor() {
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
  }

  calcDeliveryTime(args, callback) {
    soap.createClient(this._url, (error, client) => {
      // console.log('client soap criado');
      client.CalcPrazo(args, callback);
    });
  }
}

module.exports = () => {
  return correiosSOAPClient;
}
