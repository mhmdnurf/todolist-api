const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("crack-db", "root", "crack_", {
  dialect: "mysql",
  host: "34.101.145.22",
});

module.exports = sequelize;
