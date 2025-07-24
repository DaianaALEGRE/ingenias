const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const actores = require('./actores')(sequelize, DataTypes);
const categorias = require('./categorias')(sequelize, DataTypes);
const generos = require('./generos')(sequelize, DataTypes);
const reparto = require('./reparto')(sequelize, DataTypes);
const tags = require('./tags')(sequelize, DataTypes);
const trailers = require('./trailers')(sequelize, DataTypes);

// Acá irán las relaciones si hacés asociaciones

actores.belongsToMany(trailers, {
  through: 'traileractor',  // nombre exacto de la tabla puente en la BD
  foreignKey: 'actor_id',
  otherKey: 'trailer_id'
});

trailers.belongsToMany(actores, {
  through: 'traileractor',
  foreignKey: 'trailer_id',
  otherKey: 'actor_id'
});

// Relación entre trailers y categorias (uno a muchos)
categorias.hasMany(trailers, { foreignKey: 'categoria_id' });
trailers.belongsTo(categorias, { foreignKey: 'categoria_id' });

// Relación entre trailers y generos (uno a muchos)
generos.hasMany(trailers, { foreignKey: 'genero_id' });
trailers.belongsTo(generos, { foreignKey: 'genero_id' });





const db = {
  sequelize,
  actores,
  categorias,
  generos,
  reparto,
  tags,
  trailers,
};

module.exports = db;
