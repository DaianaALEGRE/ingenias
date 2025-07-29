module.exports = (sequelize, DataTypes) => {
  return sequelize.define('reparto', {
    titulo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    actor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, { timestamps: false,
      tableName: 'reparto'
   });
};
