const mysql = require('mysql');

const _connectionMYSQL = () => {
  const config = {
    host: 'localhost',
    user: 'root',
    password: ''
  };

  if (!process.env.NODE_ENV) {
    config.database = 'alura_payfast';
  }

  if (process.env.NOD_ENV === 'pro') {
    config.database = 'alura_payfast';
    config.password = 'root';
  }

  if (process.env.NODE_ENV === 'test') {
    config.database = 'alura_payfast_test';
  }


  if (process.env.NOD_ENV === 'test-pro') {
    config.database = 'alura_payfast_test';
    config.password = 'root';
  }

  // if (process.env.NODE_ENV === 'production') {   const urlDeConexao =
  // process.env.CLEARDB_DATABASE_URL;   //
  // mysql://b0b1f27be5870f:9cd4b731@us-cdbr-iron-east-03.cleardb.net/heroku_c165e
  // c 7ef5cd023?reconnect=true   const grupos =
  // urlDeConexao.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?reconnect=true/);
  // config.host = grupos[3];   config.user = grupos[1];   config.password =
  // grupos[2];   config.database = grupos[4]; }
  return mysql.createConnection(config);
}

module.exports = () => {
  return _connectionMYSQL;
};

// var mysql = require('mysql'); function createDBConnection() {   return
// mysql.createConnection({     host: 'localhost',     user: 'root', password:
// '',     database: 'alura_payfast'   }); } module.exports = function () {
// return createDBConnection; }
