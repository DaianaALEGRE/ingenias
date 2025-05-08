
const express = require('express');
const app = express();
const PORT= process.env.PORT || 3008;
const fs= require('fs');
const dotenv=require('dotenv');
dotenv.config();
//path concatena las direcciones,como variable global en el sitio
const path = require('path');
const { json } = require('stream/consumers');

const filepath = path.join(__dirname, 'dataBase', process.env.DATA_FILE);
//tomo mi path con fs para transformar en objeto como la consigna pide
const dataBase = fs.readFileSync(filepath, 'utf-8');
// base de objetos solo parseados
const dataObj = JSON.parse(dataBase);
// base de objetos para trabajarlos 
const trailerflix = dataObj.map(({ titulo, reparto, categoria, ...rest }) => ({
    ...rest,
    titulo: titulo?.toLowerCase().trim(),
    reparto: reparto?.toLowerCase().trim(),
    categoria: categoria?.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
}));
//todas las url (catalogo,titulo,reparto,catergoria,id)
app.get('/', (req, res) => {

    res.send('Bienvenida de la plataforma');
    res.status(200)

});
//catalogo

app.get('/catalogo', (req, res) => {

    res.json(trailerflix);

//titulo
}); app.get('/titulo/:title', (req, res) => {
    const tituloSolicitado = req.params.title.toLowerCase();
    const resultadoT = trailerflix.filter(p => p.titulo.includes(tituloSolicitado))
        ;
    if (resultadoT.length === 0) {
        return res.status(404).json({ message: 'No se encontro coincidencias' });
    }
    else {
        res.json(resultadoT);
    }
});//catergoria

app.get('/categoria/:cat', (req, res) => {
    //filter
     const categoria = req.params.cat.toLowerCase().trim();
    const resultadoC = trailerflix.filter(c => c.categoria.includes(categoria));
    if (resultadoC.length === 0) {
        return res.status(404).json({ message: 'No hay resultados para tu busqueda' });
    } else { res.json(resultadoC); }

    //Reparto
//validaciones cuando no encuentra q no tire error por lowcase

}); app.get('/reparto/:act', (req, res) => {
    const reparto = req.params.act.toLowerCase().trim();
    const resultado = trailerflix.filter(r => r.reparto && r.reparto.includes(reparto));


    if (resultado.length === 0) {
        return res.status(404).json({ message: 'no se encontro coincidencias' })
    } else {
        const mapeado = resultado.map(({ titulo, reparto }) => ({
            titulo, reparto
        }))


        res.json(mapeado)
    };

// trailer
}); app.get('/trailer/:id', (req, res) => {
    const trailers = Number(req.params.id); 

    if (isNaN(trailers)) 
        return res.status(400).json({ message: 'ID inválido. Debe ser un número.' });
  

    const trailerId = trailerflix.find(p => p.id === trailers); 

    if (!trailerId) {
        return res.status(404).json({ message: 'no se encontro coincidencias' });
    }
//trailer por id y mapeado para q solo devuelva titulo y trailer(despues lo voy a desestructurar)
res.json({
    id: trailerId.id,
    titulo: trailerId.titulo,
    trailer: trailerId?.trailer || "No hay trailer disponible para esta película o serie."
});

});

app.use((req, res) => {
    res.status(404).send('la pagina que buscas no existe');
});


app.listen(PORT, () => {
    console.log(`servidor escuchándose en el puerto: ${PORT}`);
});


console.log('DATA_FILE =', process.env.DATA_FILE);
console.log(typeof dataObj[0].id);