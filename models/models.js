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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fecha_publicacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    }
  }, {
    tableName: 'trailers',
    timestamps: false,
  });
};
