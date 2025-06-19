const axios = require("axios");

// Helper to construct Graph API URL
const getGraphUrl = (userId, path = "") =>
  `https://graph.microsoft.com/beta/users/${userId}/authentication/${path}`;

// Create QR Code + PIN MFA for a user
exports.createAuthMethod = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, displayName } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  try {
    const pin = Math.floor(10000000 + Math.random() * 90000000).toString();

    const now = new Date();
    const expireDateTime = new Date(now);
    expireDateTime.setDate(now.getDate() + 365);

    const response = await axios.put(
      getGraphUrl(userId, "qrCodePinMethod"),
      {
        standardQRCode: {
          startDateTime: now.toISOString(),
          expireDateTime: expireDateTime.toISOString(),
        },
        pin: {
          code: pin,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Created QR+PIN MFA for user:", userId);

    res.json({
      qrCode: response.data.standardQRCode.image.binaryValue,
      pin,
      displayName: displayName || "QR Auth",
    });
  } catch (error) {
    console.error("Graph API error [create]:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete QR Code + PIN MFA for a user
exports.deleteAuthMethod = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = req.params;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  try {
    const response = await axios.delete(
      getGraphUrl(userId, "qrCodePinMethod"),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Deleted QR+PIN MFA for user:", userId);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Graph API error [delete]:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to delete QR code",
      details: error.message,
    });
  }
};

// Check if QR+PIN method exists for user
exports.getAllAuthMethods = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = req.params;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  try {
    const response = await axios.get(getGraphUrl(userId, "methods"), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const hasQrMethod = !!response.data.value.find(
      (method) =>
        method["@odata.type"] === "#microsoft.graph.qrCodePinAuthenticationMethod"
    );

    console.log("Checked QR method for user:", userId, "→", hasQrMethod);
    res.json(hasQrMethod);
  } catch (error) {
    console.error("Graph API error [getAll]:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

// Reset QR Code + PIN MFA for a user
exports.resetAuthMethod = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, displayName } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  try {
    // Step 1: Delete existing QR+PIN MFA
    await axios.delete(getGraphUrl(userId, "qrCodePinMethod"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Deleted QR+PIN MFA for user:", userId);

    // Step 2: Wait for consistency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 3: Generate new PIN and expiration
    const pin = Math.floor(10000000 + Math.random() * 90000000).toString();
    const now = new Date();
    const expireDateTime = new Date(now);
    expireDateTime.setDate(now.getDate() + 365);

    // Step 4: Create new QR+PIN MFA
    const response = await axios.put(
      getGraphUrl(userId, "qrCodePinMethod"),
      {
        standardQRCode: {
          startDateTime: now.toISOString(),
          expireDateTime: expireDateTime.toISOString(),
        },
        pin: {
          code: pin,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Created QR+PIN MFA for user:", userId);

    // Step 5: Return result
    res.json({
      message: "QR code and PIN reset",
      qrCode: response.data.standardQRCode.image.binaryValue,
      pin,
      displayName: displayName || "QR Auth",
    });
  } catch (error) {
    console.error("Graph API error [reset]:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to reset QR code",
      details: error.message,
    });
  }
};