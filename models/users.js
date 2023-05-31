const { Model, DataTypes } = require("sequelize");
const sequelize = require("../DatabaseConfig");

class User extends Model {}

User.init(
  {
    nama_lengkap: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    modelName: "users",
  }
);

module.exports = User;
