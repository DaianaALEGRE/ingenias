const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const indexRoutes = require('./routes/index.routes');

const { sequelize } = require('./config/db');

const PORT = process.env.PORT || 3008;

mysql://root:dZuvqHnLucpYlvVHcJImXtfUMvsgXlaS@hopper.proxy.rlwy.net:16742/railway

//todas las url (catalogo,titulo,reparto,catergoria,id)
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/', indexRoutes);

app.use((req, res) => {
    res.status(404).render('404', { title: 'Error 404- Pagina no encontrada' })
});

app.listen(PORT, () => {
    console.log(`servidor escuchándose en el puerto: ${PORT}`);
});


