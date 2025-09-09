const express = require("express");
const cors = require("cors");
const hourmeterRoutes = require("./routes/hourmeter");
const workOrderSparePartsRoutes = require("./routes/workOrderSpareParts");
const workOrderTechnicians = require("./routes/workOrderTechnicians")
const typeChangeMaintenance = require("./routes/typeChangeMaintenance")
const areas = require("./routes/areas")
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/hourmeters", hourmeterRoutes);
app.use("/workOrderSpareParts", workOrderSparePartsRoutes);
app.use("/workOrderTechnicians", workOrderTechnicians);
app.use("/typeChangeMaintenance", typeChangeMaintenance);
app.use("/area", areas);

module.exports = app;
