const express = require("express");
const cors = require("cors");
const hourmeterRoutes = require("./routes/hourmeter");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/hourmeters", hourmeterRoutes);

module.exports = app;
