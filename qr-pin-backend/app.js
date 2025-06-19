const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authMethodRoutes = require("./routes/authMethodRoutes");
const qrRoutes = require("./routes/qrRoutes");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route registration
app.use("/api/auth-methods", authMethodRoutes);
app.use("/api/qr", qrRoutes);
// app.use("/api/pin", pinRoutes);

module.exports = app;