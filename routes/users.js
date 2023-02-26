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
    metadata: "endpoint user",
  });
});

router.post("/", async (req, res) => {
  const { username, nama, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const users = await UsersModel.create({
      username,
      nama,
      password: encryptedPassword,
    });
    res.status(200).json({
      registered: users,
      metadata: "register berhasil",
    });
  } catch (error) {
    res.status(400).json({
      error: "data invalid",
    });
  }
});

router.put("/", async (req, res) => {
  const { username, nama, password, newPassword } = req.body;

  try {
    const check = await passwordCheck(username, password);

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    if (check.compare === true) {
      const users = await UsersModel.update(
        {
          nama,
          password: encryptedPassword,
        },
        { where: { username: username } }
      );
      res.status(200).json({
        users: { updated: users[0] },
        metadata: "User updated....",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "data invalid",
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const check = await passwordCheck(username, password);

    if (check.compare === true) {
      res.status(200).json({
        users: check.userData,
        metadata: "login berhasil",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "data invalid",
    });
  }
});

module.exports = router;
