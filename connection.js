
const mongoose = require('mongoose');
// colocamos la url de conexión local y el nombre de la base de datos
mongoose.connect('mongodb://localhost:27017/users_fafago_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
// enlaza el track de error a la consola (proceso actual)
db.once('open', () => {
  console.log('Connected'); // si esta todo ok, imprime esto
});
