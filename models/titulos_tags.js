module.exports = (sequelize, DataTypes) => {
  return sequelize.define('titulos_tags', {
    titulo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, { timestamps: false });
};