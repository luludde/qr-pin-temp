const axios = require("axios");

// GET QR+PIN full data for a user (UPN)
exports.getUserQrData = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { upn } = req.params;

  if (!token || !upn) {
    return res.status(400).json({ error: "Missing token or UPN" });
  }

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/beta/users/${upn}/authentication/qrCodePinMethod`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Graph API error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET standard QR code for a user *****NOT CURRENTLY USED******
exports.getStandardQrData = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = req.params;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethod/standardQRCode`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Graph API error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET QR/PIN method by ID *****NOT CURRENTLY USED******
exports.getById = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, qrCodePinId } = req.query;

  if (!token || !userId || !qrCodePinId) {
    return res.status(400).json({ error: "Missing token, userId, or qrCodePinId" });
  }

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethods/${qrCodePinId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Graph API error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

// Optional temp QR creator 
exports.createTempQr = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  try {
    const now = new Date();
    const expireDateTime = new Date(now.getTime() + 6 * 60 * 1000); // 6 minutes from now

    const response = await axios.patch(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethod/temporaryQRCode`,
      {
        startDateTime: now.toISOString(),
        expireDateTime: expireDateTime.toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      qrCode: response.data.image.binaryValue,
    });
  } catch (error) {
    console.error("Graph API error [createTempQr]:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create temporary QR code", details: error.message });
  }
};
