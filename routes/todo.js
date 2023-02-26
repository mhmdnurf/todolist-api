const express = require("express");
const router = express.Router();
const TodoModel = require("../models/todo");
const UserModel = require("../models/users");
const { Op } = require("sequelize");

// routing endpoint utama
router.get("/", async (req, res) => {
  const todo = await TodoModel.findAll();
  res.status(200).json({
    todo,
    metadata: "testing todo endpoint",
  });
});

router.post("/tambah", async (req, res) => {
  try {
    const { nama, isi } = req.body;
    // Check if user exists
    const user = await UserModel.findOne({
      where: { nama: nama },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Create todo
    const todo = await TodoModel.create({
      users_nama: nama,
      isi: isi,
      status: "Not Checked",
    });

    return res.json(todo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// mengubah status menjadi checked
router.put("/check/:id", async (req, res) => {
  const id = req.params.id;
  const nama = req.body.nama;
  const todo = await TodoModel.findOne({
    where: {
      id: id,
      users_nama: nama,
    },
  });
  if (!todo) {
    return res.status(404).json({ error: "Todo list not found" });
  }

  const count = await TodoModel.update(
    { status: "Checked" },
    {
      where: {
        id: id,
        users_nama: nama,
      },
    }
  );

  if (count === 0) {
    return res.status(404).json({ error: "Todo list not found" });
  }

  return res.json({ message: "Todo list updated successfully" });
});

// mengubah data todo secara keseluruhan berdasarkan nama dan id data
router.put("/ubah/:id", async (req, res) => {
  const id = req.params.id;
  const nama = req.body.nama;
  const { isi, status } = req.body;
  const todo = await TodoModel.findOne({
    where: {
      id: id,
      users_nama: nama,
    },
  });
  if (!todo) {
    return res.status(404).json({ error: "Todo list not found" });
  }

  const count = await TodoModel.update(
    { status: status, isi: isi },
    {
      where: {
        id: id,
        users_nama: nama,
      },
    }
  );

  if (count === 0) {
    return res.status(404).json({ error: "Todo list not found" });
  }

  return res.json({ message: "Todo list updated successfully" });
});

// menghapus data sesuai nama dan id data
router.delete("/hapus/:id", async (req, res) => {
  const id = req.params.id;
  const nama = req.body.nama;

  const count = await TodoModel.destroy({
    where: {
      id: id,
      users_nama: nama,
    },
  });

  if (count === 0) {
    return res.status(404).json({ error: "Todo list not found" });
  }

  return res.json({ message: "Todo list deleted successfully" });
});

router.get("/find/:nama", async (req, res) => {
  try {
    const todos = await TodoModel.findAll({
      where: {
        users_nama: {
          [Op.like]: `%${req.params.nama}%`,
        },
      },
    });

    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
