module.exports = (sequelize, DataTypes) => {
  const Generos = sequelize.define('generos', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'generos'
  });

  Generos.associate = (models) => {
    Generos.belongsToMany(models.Cartelera, {
      through: 'titulos_generos',
      foreignKey: 'genero_id',
      otherKey: 'titulo_id'
    });
  };

  return Generos;
};
