module.exports = (sequelize, DataTypes) => {
  return sequelize.define('titulos_generos', {
    titulo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    genero_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, { timestamps: false });
};