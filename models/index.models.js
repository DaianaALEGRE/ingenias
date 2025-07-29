const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Actores = require('./actores')(sequelize, DataTypes);
const Categorias = require('./categorias')(sequelize, DataTypes);
const Generos = require('./generos')(sequelize, DataTypes);
const Reparto = require('./reparto')(sequelize, DataTypes);
const Tags = require('./tags')(sequelize, DataTypes);
const Titulos_tags = require('./titulos_tags')(sequelize, DataTypes);
const Titulos_generos = require('./titulos_generos')(sequelize, DataTypes);
const Cartelera = require('./cartelera')(sequelize, DataTypes);
const Ranking =require('./ranking')(sequelize,DataTypes);


const db = {
  sequelize,
  Actores,
  Categorias,
 Generos,
  Reparto,
  Tags,
  Titulos_tags,
  Titulos_generos,
  Cartelera,
  Ranking,
};

//asociaciones 
Object.values(db).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});


module.exports = db;
