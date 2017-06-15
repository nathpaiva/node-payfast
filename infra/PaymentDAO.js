 class PaymentDao {
   constructor(connection) {
     this._connection = connection;
   }
   salva(payment, callback) {
     this._connection.query('INSERT INTO payment SET ?', payment, callback);
   }
   atualiza(payment, callback) {
     this._connection.query('UPDATE payment SET status = ? where id = ?', [payment.status, payment.id], callback);
   }
   lista(callback) {
     this._connection.query('select * from payment', callback);
   }
   buscaPorId(id, callback) {
     this._connection.query("select * from payment where id = ?", [id], callback);
   }
 }

 module.exports = () => {
   return PaymentDao;
 };
