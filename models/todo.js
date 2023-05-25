const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db.config");

class Todo extends Model {}

Todo.init(
  {
    users_nim: {
      type: DataTypes.INTEGER,
    },
    users_nama: {
      type: DataTypes.STRING,
    },
    isi: {
      type: DataTypes.STRING,
    },
    tanggal: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Todo",
  }
);

module.exports = Todo;
