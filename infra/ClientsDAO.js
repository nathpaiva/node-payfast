 function ClientsDao(connection) {
   this._connection = connection;
 }

 ClientsDao.prototype.salva = function (payment, callback) {
   this._connection.query('INSERT INTO payment SET ?', payment, callback);
 }

 ClientsDao.prototype.atualiza = function (payment, callback) {
   this._connection.query('UPDATE payment SET status = ? where id = ?', [payment.status, payment.id], callback);
 }

 ClientsDao.prototype.lista = function (callback) {
   this._connection.query('select * from payment', callback);
 }

 ClientsDao.prototype.buscaPorId = function (id, callback) {
   this._connection.query("select * from payment where id = ?", [id], callback);
 }

 module.exports = () => {
   return ClientsDao;
 };
