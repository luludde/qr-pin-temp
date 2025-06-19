const express = require("express");
const router = express.Router();
const qrController = require("../controllers/qrController");

// GET all QR data (from UPN)
router.get("/user-all/:upn", qrController.getUserQrData);

// GET standard QR data
router.get("/standard/:userId", qrController.getStandardQrData);

// GET QR method by ID (query params: userId + qrCodePinId)
router.get("/by-id", qrController.getById);

// GET temp QR (same logic, from req.body)
router.post("/temp", qrController.createTempQr);

module.exports = router;