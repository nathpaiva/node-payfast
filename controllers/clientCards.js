const restify = require('restify');

const client = restify.createJsonClient({
  url: 'http://localhost:3001'
});

client.post('/cartoes/autoriza', (error, req, res, result) => {
  console.log('consumindo serviço de cartões');
  console.log(result);
});
