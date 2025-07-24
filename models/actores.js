module.exports = (sequelize, DataTypes) => {
  return sequelize.define('actores', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombrecompleto: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'actores',
    timestamps: false,
  });
};
