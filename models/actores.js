module.exports = (sequelize, DataTypes) => {
  const Actores = sequelize.define('actores', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'actores'
  });

  Actores.associate = (models) => {
   Actores.belongsToMany(models.Cartelera, {
      through: 'reparto',
      foreignKey: 'actor_id',
      otherKey: 'titulo_id',
      as: 'titulos'
    });
  };

  return Actores;
};
