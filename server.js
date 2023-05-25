const express = require("express");
const cors = require("cors");
const port = 3001;

const sequelize = require("./db.config");
sequelize.sync().then(() => console.log("Program siap digunakan!"));

const userEndpoint = require("./routes/users");
const absensiEndpoint = require("./routes/todo");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userEndpoint);
app.use("/todo", absensiEndpoint);

app.listen(port, () => console.log(`running server on port ${port}`));
