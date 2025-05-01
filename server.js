
console.log('lola')

const express = require('express');
const app = express();
const PORT= process.env.PORT || 3080;
const fs= require('fs');
const dotenv=require('dotenv');
dotenv.config();
//path concatena las direcciones,como variable global en el sitio
const path= require('path');

const filepath=path.join(__dirname,'dataBase',process.env.DATA_FILE );

//todas las url
app.get('/', (req, res) => {
    res.send('Bienvenida de la plataforma');
  });

   
   app.get('/catalogo',(req,res)=>{

        res.statusCode = 202;
        res.send('Muestra el catalogo de peliculas');

    }); app.get('/titulo/:title',(req,res)=> {

        res.statusCode = 202;
        res.send('Busqueda por titulo');

    }); app.get('/categoria/:cat',(req,res)=> {

        res.statusCode = 202;
        res.send('Busqueda por categoria');

    }); app.get('/reparto/:act',(req,res)=> {

        res.statusCode = 202;
        res.send('Busqueda por actor');

    }); app.get('/trailer/:id',(req,res) =>{

        res.statusCode = 202;
        res.send('Busqueda por id el trailes, si tiene devuelvo o configurar un mensaje de que no hay trailers');

    });

    app.use((req,res)=>{
        res.status(404).send('la pagina que buscas no existe');
    });
    

app.listen(PORT, () => {
    console.log(`servidor escuchándose en el puerto: ${PORT}`);
});




console.log('DATA_FILE =', process.env.DATA_FILE);