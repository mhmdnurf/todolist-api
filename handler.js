const UsersModel = require('./models/users');
const bcrypt = require('bcrypt');
const passwordCheck = require('./utils/passwordCheck');

const usersHandler = async (request, h) => {
  try {
    const users = await UsersModel.findAll();
    return {
      registered: users,
      metadata: 'Data User Keseluruhan',
    };
  } catch (error) {
    return h.response({ error: 'Register gagal' }).code(400);
  }
};

const registerHandler = async (request, h) => {
  const { nama_lengkap, username, password, alamat } = request.payload;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const users = await UsersModel.create({
      nama_lengkap,
      username,
      password: encryptedPassword,
      alamat
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
