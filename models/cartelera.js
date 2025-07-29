const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cartelera = sequelize.define('cartelera', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    poster: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    temporadas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    resumen: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    trailer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    timestamps: false
  });
//asociasiones Categorias, Tags,Generos,Actores,Ranking.
  Cartelera.associate = (models) => {
    Cartelera.belongsTo(models.Categorias, {
      foreignKey: 'categoria_id'
    });

    Cartelera.belongsToMany(models.Tags, {
      through: 'titulos_tags',
      foreignKey: 'titulo_id',
      otherKey: 'tag_id'
    });

    Cartelera.belongsToMany(models.Generos, {
      through: 'titulos_generos',
      foreignKey: 'titulo_id',
      otherKey: 'genero_id'
    });

    Cartelera.belongsToMany(models.Actores, {
      through: 'reparto',
      foreignKey: 'titulo_id',
      otherKey: 'actor_id'
    });

    Cartelera.hasOne(models.Ranking, {
      foreignKey: 'id_titulo'
    });
  };

  return Cartelera;
};
