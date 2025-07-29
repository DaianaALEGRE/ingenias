const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('categorias', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    tableName: 'categorias',
    timestamps: false,
  });
};
