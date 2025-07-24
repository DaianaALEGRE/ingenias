
const express = require('express');
const router = express.Router();
const PORT= process.env.PORT || 3008;
const dotenv=require('dotenv');
dotenv.config();
//path concatena las direcciones,como variable global en el sitio
const path = require('path');
//conec
const { Op } = require('sequelize');
const db = require('../models/index.models');

const { sequelize, actores, categorias, generos, reparto, tags, trailers } = db;

router.get('/', async (req, res) => {
  try {
    const cartelera = await trailers.findAll({ limit: 6 });
    res.render('index', {
      title: 'Bienvenidas a nuestro sitio',
      msj: 'Algunas de nuestras recomendaciones',
      cartelera,
      carteleraURL: '/catalogo',
      coincidencia: false,
    });
  } catch (error) {
    console.error('Error en GET /:', error);  // Esto va a mostrar el error en la consola
    res.status(500).send('Error al cargar la vista');
  }
});

//catalogocc

router.get('/catalogo',async (req, res) => {
  try {
    const resultados = await trailers.findAll();
    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno al obtener la cartelera' });
  }
});
//titulo


 router.get('/titulo/:title', async (req, res) => {
    const tituloSolicitado = req.params.title.toLowerCase();
    try{
    const resultadoT =  await trailers.findAll({
         where: {
        titulo: { [Op.like]: `%${tituloSolicitado}%` }
      }
    });
    if (resultadoT.length === 0) {
        return res.status(404).json({ message: 'No se encontro coincidencias' });
    }

        res.json(resultadoT);
      }   catch (error) {
    res.status(500).json({ message: 'Error interno' });
  }
     
});//catergoria

router.get('/categoria/:cat', async (req, res) => {
  const categoria = req.params.cat.toLowerCase();

  try {
    const resultadoC = await trailers.findAll({
      include: [{
        model: categorias,
        where: { nombre: { [Op.like]: `%${categoria}%` } }
      }]
    });

    if (resultadoC.length === 0) {
      return res.status(404).json({ message: 'No hay resultados para tu búsqueda' });
    }

    res.json(resultadoC);

  } catch (error) {
    console.error('Error en GET /categoria/:cat:', error);
    res.status(500).json({ message: 'Error interno' });
  }
});

    //Reparto
router.get('/reparto/:act', async (req, res) => {
  const actorNombre = req.params.act.toLowerCase();

  try {
    const resultados = await actores.findAll({
      where: {
        nombrecompleto: { [Op.like]: `%${actorNombre}%` }
      },
      include: [{
        model: trailers,
        through: { attributes: [] }  // para no traer datos de la tabla puente
      }]
    });

    if (resultados.length === 0) {
      return res.status(404).json({ message: 'No se encontraron actores con ese nombre' });
    }

    res.json(resultados);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno' });
  }
});
//id
router.get('/trailer/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

  try {
    const resultado = await trailers.findByPk(id);

    if (!resultado) {
      return res.status(404).json({ message: 'No se encontró el trailer' });
    }

    res.json({
      id: resultado.id,
      titulo: resultado.titulo,
      trailer: resultado.trailer || 'No hay trailer disponible'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno' });
  }
});
//generos
router.get('/generos', async (req, res) => {
  try {
    const listaGeneros = await generos.findAll(); // renombrada la variable local
    res.json(listaGeneros);
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    res.status(500).json({ error: 'Error al obtener los géneros' });
  }
});


router.get("/actores", async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const { nombre } = req.query;

    const listaActores = await actores.findAll({
      where: nombre ? {
        nombrecompleto: {
          [Op.like]: `%${nombre}%`
        }
      } : undefined,
      attributes: ['id', 'nombrecompleto']
    });

    res.json(listaActores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener actores" });
  }
});

router.get('/tags/:nombre', async (req, res) => {
  const nombre = req.params.nombre.toLowerCase();

  try {
    const resultados = await tags.findAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      }
    });

    if (resultados.length === 0) {
      return res.status(404).json({ message: 'No se encontraron tags' });
    }

    res.json(resultados);
  } catch (error) {
    console.error('Error al buscar tags por nombre:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


module.exports = router;