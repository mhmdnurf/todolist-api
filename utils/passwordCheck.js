const bcrypt = require("bcrypt");
const UsersModel = require("../models/users");

const passwordCheck = async (username, password) => {
  const userData = await UsersModel.findOne({ where: { username: username } });
  const compare = await bcrypt.compare(password, userData.password);
  return { compare, userData };
};

module.exports = passwordCheck;
