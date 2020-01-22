const Sequelize = require('sequelize');

const sequelize = new Sequelize('fillycoder', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
