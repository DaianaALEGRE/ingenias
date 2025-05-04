
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3080;
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
//path concatena las direcciones,como variable global en el sitio
const path = require('path');
const { title } = require('process');

const filepath = path.join(__dirname, 'ingenias', process.env.DATA_FILE);
const trailerflix = require('./dataBase/trailerflix.json');

app.set('view engine', 'ejs') //selecciono el motor de plantilla, en este caso ejs
app.use(express.static('Public')); //para acceder a los archivos dentro de la carpeta public

//todas las url
app.get('/', (req, res) => {
    res.statusCode = 202;
    const data = {
        title: 'Bienvenidas a nuestro sitio', //titulo de la pagina
        msj: 'Algunas de nuestras recomendaciones ',
        cartelera: trailerflix,//envio el archivo
        carteleraURL: '/catalogo', //url para cuando haga clic en ver todo
        coincidencia: false,
    }
    res.render('index', data); //envio el archivo ejs que debe renderizar
});

app.get('/catalogo', (req, res) => {
    res.statusCode = 202;
    const data = {
        title: 'Cartelera', //titulo de la pagina
        cartelera: trailerflix,//envio el archivo
        coincidencia: false
    }
    res.render('pelicula', data); //envio el archivo ejs que debe renderizar
});

app.get('/titulo/:title', (req, res) => {
    const titSolic = req.params.title.toLowerCase(); // guardo el parámetro y lo convierto a minúsculas
    const peliFiltrada = trailerflix.filter(peli => peli.titulo.toLowerCase().includes(titSolic) //.includes(titSolic)  busca una coincidenc min no total
    );

    const data = {
        title: `Resultados para: ${titSolic}`,
        cartelera: peliFiltrada, // envio el res filtrado
        coincidencia: peliFiltrada.length === 0,
    }

    res.statusCode = 202;
    res.render('pelicula', data);
});

app.get('/categoria/:cat', (req, res) => {

    const catSol = req.params.cat.toLowerCase(); // guardo el parámetro y lo convierto a minúsculas
    const catFiltrada = trailerflix.filter(peli => peli.categoria.toLowerCase().includes(catSol) //.includes(titSolic)  busca una coincidenc min no total
    );

    const data = {
        title: `Resultados para la categoria: ${catSol}`,
        cartelera: catFiltrada, // envio el res filtrado
        coincidencia: catFiltrada.length === 0,
    }

    res.statusCode = 202;
    res.render('pelicula', data)
});

app.get('/reparto/:act', (req, res) => {

    res.statusCode = 202;
    res.send('Busqueda por actor');
});

app.get('/trailer/:id', (req, res) => {

    res.statusCode = 202;
    res.send('Busqueda por id el trailes, si tiene devuelvo o configurar un mensaje de que no hay trailers');
});

app.use((req, res) => {
    res.status(404).render('404', { title: 'Error 404- Pagina no encontrada' })
});


app.listen(PORT, () => {
    console.log(`servidor escuchándose en el puerto: ${PORT}`);
});


console.log('DATA_FILE =', process.env.DATA_FILE);