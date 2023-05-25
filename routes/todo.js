const express = require("express");
const router = express.Router();
const TodoModel = require("../models/todo");
const UserModel = require("../models/users");
const { Op, Sequelize } = require("sequelize");

// routing endpoint utama
router.get("/:nim", async (req, res) => {
  const { nim } = req.params;

  const todo = await TodoModel.findAll({ where: { users_nim: nim } });
  res.status(200).json({
    data: todo,
    metadata: "Data Todo Keseluruhan",
  });
});

router.get("/detail/:id", async (req, res) => {
  const { id } = req.params;

  const todo = await TodoModel.findOne({ where: { id: id } });
  res.status(200).json({
    data: todo,
    metadata: "Data Todo Keseluruhan",
  });
});

router.post("/tambah", async (req, res) => {
  try {
    const { nim, nama, tanggal, isi } = req.body;
    // Check if user exists
    const user = await UserModel.findOne({
      where: { nama: nama, nim: nim },
    });

    if (!user) {
      return res.status(400).json({ error: "User tidak ditemukan!" });
    }

    // Create todo
    const todo = await TodoModel.create({
      users_nim: nim,
      users_nama: nama,
      isi: isi,
      tanggal: tanggal,
      status: "Belum selesai",
    });

    return res.json({ status: 200, data: todo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Data Gagal ditambah!" });
  }
});

router.put("/", async (req, res) => {
  const { id, tanggal, isi } = req.body;

  const count = await TodoModel.update(
    { isi, tanggal },
    {
      where: {
        id: id,
      },
    }
  );

  if (count[0] === 1) {
    res.status(200).json({
      status: 200,
      list: { updated: count[0] },
      metadata: "Edit berhasil",
    });
  } else {
    res.status(404).json({
      error: "List tidak ditemukan",
    });
  }
});

// mengubah status menjadi checked
router.put("/check/:id", async (req, res) => {
  const id = req.params.id;

  const count = await TodoModel.update(
    { status: "Selesai" },
    {
      where: {
        id: id,
      },
    }
  );

  if (count === 0) {
    return res.status(404).json({ error: "Todo tidak ditemukan!" });
  }

  return res.json({ message: "Data berhasil diselesaikan!" });
});

router.put("/uncheck/:id", async (req, res) => {
  const id = req.params.id;

  const count = await TodoModel.update(
    { status: "Belum selesai" },
    {
      where: {
        id: id,
      },
    }
  );

  if (count === 0) {
    return res.status(404).json({ error: "Todo tidak ditemukan!" });
  }

  return res.json({ message: "Data berhasil diselesaikan!" });
});

// mengubah data todo secara keseluruhan berdasarkan nama dan id data
router.put("/ubah/:id", async (req, res) => {
  const id = req.params.id;
  const nim = req.body.nim;
  const nama = req.body.nama;
  const { isi, status } = req.body;
  const todo = await TodoModel.findOne({
    where: {
      id: id,
      users_nim: nim,
      users_nama: nama,
    },
  });
  if (!todo) {
    return res.status(404).json({ error: "Todo tidak ditemukan!" });
  }

  const count = await TodoModel.update(
    { status: status, isi: isi },
    {
      where: {
        id: id,
        users_nim: nim,
        users_nama: nama,
      },
    }
  );

  if (count === 0) {
    return res.status(404).json({ error: "Todo tidak ditemukan!" });
  }

  return res.json({ message: "Data berhasil diubah" });
});

// menghapus data sesuai nama dan id data
router.delete("/hapus/:id", async (req, res) => {
  const id = req.params.id;

  const count = await TodoModel.destroy({
    where: {
      id: id,
    },
  });

  if (count === 0) {
    return res.status(404).json({ error: "Todo tidak ditemukan!" });
  }

  return res.json({ status: 200, message: "Data berhasil dihapus!" });
});

router.get("/find/", async (req, res) => {
  const { field } = req.params;
  const { isi } = req.body;

  const Op = Sequelize.Op;
  let searchQuery = {};

  if (field) {
    searchQuery[field] = req.query[field];
  }

  if (isi) {
    searchQuery.isi = { [Op.like]: `%$isi%` };
  }

  try {
    const todos = await TodoModel.findAll({
      where: { searchQuery },
    });
    res.send(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Data gagal ditemukan!" });
  }
});

router.get("/cari", async (req, res) => {
  const { nama, nim } = req.query;
  const { isi } = req.body;
  try {
    const todos = await TodoModel.findAll({
      where: {
        [Op.or]: [
          {
            users_nim: {
              [Op.like]: `%${nim}%`,
            },
            isi: {
              [Op.like]: `%${isi}%`,
            },
          },
          {
            users_nama: {
              [Op.like]: `%${nama}%`,
            },
            isi: {
              [Op.like]: `%${isi}%`,
            },
          },
        ],
      },
    });
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Data gagal ditemukan!" });
  }
});

router.get("/cari/all", async (req, res) => {
  const { nim, isi } = req.query;
  try {
    const todos = await TodoModel.findAll({
      where: {
        [Op.and]: [
          { users_nim: nim },
          {
            isi: {
              [Op.like]: `%${isi}%`,
            },
          },
        ],
      },
    });
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Data gagal ditemukan!" });
  }
});

module.exports = router;
