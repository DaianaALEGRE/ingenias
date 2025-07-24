const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Trailers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    categoria_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  genero_id: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    resumen: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    temporadas: {
        type:DataTypes.NUMBER
    },

  }, {
    tableName: 'trailers',
    timestamps: false,
  });
};
