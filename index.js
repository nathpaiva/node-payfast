const app = require('./config/custom-express')();
// const app = express();

app.listen(3000, () => {
  console.log('====================================');
  console.log('Servidor rodando na :3000');
  console.log('====================================');
});
