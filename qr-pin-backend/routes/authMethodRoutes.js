const express = require("express");
const router = express.Router();
const authMethodController = require("../controllers/authMethodController");

// GET all auth methods (can also be used to check if QR+PIN exists, potentially removing an API call)
router.get("/:userId/methods", authMethodController.getAllAuthMethods);

// PUT create QR+PIN MFA
router.put("/create", authMethodController.createAuthMethod);

// DELETE QR+PIN MFA
router.delete("/:userId", authMethodController.deleteAuthMethod);

// RESET QR+PIN MFA
router.post('/reset-auth-method', authMethodController.resetAuthMethod);

module.exports = router;