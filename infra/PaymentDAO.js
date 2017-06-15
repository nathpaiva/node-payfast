 function PaymentDao(connection) {
   this._connection = connection;
 }

 PaymentDao.prototype.salva = function (payment, callback) {
   this._connection.query('INSERT INTO payment SET ?', payment, callback);
 }

 PaymentDao.prototype.atualiza = function (payment, callback) {
   this._connection.query('UPDATE payment SET status = ? where id = ?', [payment.status, payment.id], callback);
 }

 PaymentDao.prototype.lista = function (callback) {
   this._connection.query('select * from payment', callback);
 }

 PaymentDao.prototype.buscaPorId = function (id, callback) {
   this._connection.query("select * from payment where id = ?", [id], callback);
 }

 module.exports = () => {
   return PaymentDao;
 };
