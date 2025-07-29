const { ranking } = require("./index.models");

module.exports = (sequelize, DataTypes) => {
  const ranking = sequelize.define('ranking', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_titulo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'ranking'
  });

  ranking.associate = (models) => {
    ranking.belongsTo(models.Cartelera, {
      foreignKey: 'id_titulo'
    });
  };

  return ranking;
};
