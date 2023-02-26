const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("todolist_app", "root", "", {
  dialect: "mysql",
  host: "localhost",
}); //namaDb, userName, password

module.exports = sequelize;
