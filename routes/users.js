const express = require("express");
const router = express.Router();
const UsersModel = require("../models/users");
const bcrypt = require("bcrypt");
const passwordCheck = require("../utils/passwordCheck");

// routing endpoint utama
router.get("/", async (req, res) => {
  const users = await UsersModel.findAll();
  res.status(200).json({
    registered: users,
    metadata: "Data User Keseluruhan",
  });
});

router.post("/", async (req, res) => {
  const { nim, username, nama, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const users = await UsersModel.create({
      nim,
      username,
      nama,
      password: encryptedPassword,
    });
    res.status(200).json({
      status: 200,
      registered: users,
      metadata: "Register berhasil",
    });
  } catch (error) {
    res.status(400).json({
      error: "Register gagal",
    });
  }
});

router.put("/", async (req, res) => {
  const { nim, nama, password, newPassword } = req.body;

  try {
    const check = await passwordCheck(nim, password);

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    if (check.compare === true) {
      const users = await UsersModel.update(
        {
          nama,
          password: encryptedPassword,
        },
        { where: { nim: nim } }
      );
      res.status(200).json({
        status: 200,
        users: { updated: users[0] },
        metadata: "Data user berhasil diubah",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Data user gagal diubah",
    });
  }
});

router.post("/login", async (req, res) => {
  const { nim, password } = req.body;

  try {
    const check = await passwordCheck(nim, password);

    if (check.compare === true) {
      res.status(200).json({
        status: 200,
        users: check.userData,
        metadata: "Login berhasil",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Login gagal",
    });
  }
});

module.exports = router;
