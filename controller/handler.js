const UsersModel = require('../models/users');
const bcrypt = require('bcrypt');
const passwordCheck = require('../utils/passwordCheck');

const usersHandler = async (request, h) => {
  try {
    const users = await UsersModel.findAll();
    return {
      registered: users,
      metadata: 'Welcome to Dashboard!',
    };
  } catch (error) {
    return h.response({ error: 'Register gagal' }).code(400);
  }
};

const registerHandler = async (request, h) => {
  const { nama_lengkap, email, password } = request.payload;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const users = await UsersModel.create({
      nama_lengkap,
      email,
      password: encryptedPassword
    });

    return {
      status: 200,
      registered: users,
      metadata: 'Register berhasil',
    };
  } catch (error) {
    return h.response({ error: 'Register gagal' }).code(400);
  }
};

const loginHandler = async (request, h) => {
  const { username, password } = request.payload;

  try {
    const check = await passwordCheck(username, password);

    if (check.compare === true) {
      return {
        status: 200,
        users: check.userData,
        metadata: 'Login berhasil',
      };
    }
  } catch (error) {
    return h.response({ error: 'Login gagal' }).code(400);
  }
};

module.exports = {
  usersHandler, registerHandler, loginHandler
};
