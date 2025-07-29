const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tags = sequelize.define('Tags', {
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
    tableName: 'tags',
    timestamps: false,
  });

  Tags.associate = (models) => {
    Tags.belongsToMany(models.Cartelera, {
      through: 'titulos_tags',
      foreignKey: 'tag_id',
      otherKey: 'titulo_id'
    });
  };

  return Tags;
};
