const restify = require('restify');

class ClientCards {
  constructor() {
    this._client = restify.createJsonClient({
      url: 'http://localhost:3001'
    });
  }

  authorize(card, callback) {
    this._client.post('/cartoes/autoriza', card, callback);
  }
}

module.exports = () => {
  return ClientCards;
};
