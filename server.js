const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const indexRoutes = require('./routes/index.routes');

const { sequelize } = require('./config/db');

const PORT = process.env.PORT || 3008;

// Configuraciones

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/', indexRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Error 404 - Página no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchándose en el puerto: ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Puerto usado: ${PORT}`);
});
