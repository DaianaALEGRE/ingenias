if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a la base de datos SQL');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
})();

module.exports = sequelize;
