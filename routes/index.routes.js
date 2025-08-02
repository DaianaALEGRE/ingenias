const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const { Op } = require('sequelize');
const db = require('../models/index.models');
const categorias = require('../models/categorias');

const { 
  sequelize, 
  Actores, 
  Categorias, 
 Generos, 
  Reparto, 
  Tags, 
  Cartelera,
  Titulos_generos,
  Titulos_tags,
  Ranking
} = db;

// Ruta raíz - muestra 4 títulos aleatorios
router.get('/', async (req, res) => {
  try {
    const carteleraRandom = await Cartelera.findAll({
      order: sequelize.literal('RAND()'),
      limit: 4,
      include: [Categorias, Generos]
    });

    const carteleraJSON = carteleraRandom.map(titulo => titulo.toJSON());

    res.render('index', {
      title: 'Bienvenidas a nuestro sitio',
      msj: 'Algunas de nuestras recomendaciones',
      cartelera: carteleraJSON,
      carteleraURL: '/catalogo',
      coincidencia: false,
    });
  } catch (error) {
    console.error('Error en GET /:', error);
    res.status(500).send('Error al cargar la vista');
  }
});

// Listado completo de cartelera con datos relacionados
router.get('/catalogo', async (req, res) => {
  try {
    const resultados = await Cartelera.findAll({
      include: [
        Categorias,
        Generos,
        {
          model: Tags,
          through: { attributes: [] }
        },
        {
          model: Actores,
          as: 'actores',
          through: { attributes: [] }
        }
      ]
    });
    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno al obtener la cartelera' });
  }
});

// Buscar por título (like) con datos relacionados
router.get('/titulo/:title', async (req, res) => {
  const tituloSolicitado = req.params.title.toLowerCase();

  try {
    const resultados = await Cartelera.findAll({
      where: {
        titulo: { [Op.like]: `%${tituloSolicitado}%` }
      },
      include: [
        Categorias,
        Generos,
        {
          model: Tags,
          through: { attributes: [] }
        },
        {
          model: Actores,
          through: { attributes: [] }
        }
      ]
    });

    if (resultados.length === 0) {
      return res.status(404).json({ message: 'No se encontraron coincidencias' });
    }

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Buscar por categoría (like) con datos relacionados
router.get('/categoria/:cat', async (req, res) => {
  const categoria = req.params.cat.toLowerCase();

  try {
    const resultados = await Cartelera.findAll({
      include: [
        {
          model: Categorias,
          where: { nombre: { [Op.like]: `%${categoria}%` } }
        },
        Generos,
        {
          model: Tags,
          through: { attributes: [] }
        },
        {
          model: Actores,
          as :'actores',
          through: { attributes: [] }
        }
      ]
    });

    if (resultados.length === 0) {
      return res.status(404).json({ message: 'No hay resultados para tu búsqueda' });
    }

    res.json(resultados);
  } catch (error) {
    console.error('Error en GET /categoria/:cat:', error);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Buscar actor y listar títulos en los que participó
router.get('/reparto/:act', async (req, res) => {
  const actorNombre = req.params.act.toLowerCase();

  try {
    const actores = await Actores.findAll({
      where: {
        nombre: { [Op.like]: `%${actorNombre}%` }
      },
      include: [{
        model: Cartelera,
        as: 'titulos',
        through: { attributes: [] },
        include: [
          Categorias,
          Generos,
          { model: Tags, through: { attributes: [] } },
          { model: Actores, as: 'actores', through: { attributes: [] } }
        ]
      }]
    });

    if (actores.length === 0) {
      return res.status(404).json({ message: 'No se encontraron actores con ese nombre' });
    }

    res.json(actores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno' });
  }
});

// solo los que tienen trailer
router.get('/trailers', async (req, res) => {
  try {
    const trailers = await Cartelera.findAll({
      attributes: ['id', 'titulo', 'trailer'], // solo estos campos
      where: {
        trailer: {
          [Op.ne]: null, // solo los que tienen trailer
        },
      },
    });

    res.json(trailers);
  } catch (error) {
    console.error('Error al obtener los trailers:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// Buscar trailer por ID
router.get('/trailer/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Cartelera.findByPk(id);

    if (!resultado) {
      return res.status(404).json({ mensaje: 'No se encontró el título' });
    }

    res.json({
      titulo: resultado.titulo,
      trailer: resultado.trailer || 'No hay trailer disponible'
    });
  } catch (error) {
    console.error('Error al obtener trailer:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});
// Listar géneros
router.get('/generos', async (req, res) => {
  try {
    const listaGeneros = await Generos.findAll();
    res.json(listaGeneros);
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    res.status(500).json({ error: 'Error al obtener los géneros' });
  }
});

// Buscar tags por nombre (like)
router.get('/tags/:nombre', async (req, res) => {
  const nombre = req.params.nombre.toLowerCase();

  try {
    const resultados = await Tags.findAll({
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

// Buscar actores con query param (ej: ?nombre=...)
router.get('/actores', async (req, res) => {
  try {
    const { nombre } = req.query;

    const listaActores = await Actores.findAll({
      where: nombre ? {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      } : undefined,
      attributes: ['id', 'nombre']
    });

    res.json(listaActores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener actores" });
  }
});

module.exports = router;
