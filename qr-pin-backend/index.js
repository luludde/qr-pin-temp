require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.put("/api/create-qr-pin-mfa", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, displayName } = req.body;

  console.log(userId)
  console.log(displayName)

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  try {
    // Generate a random 8-digit PIN (adjust length based on policy)
    const pin = Math.floor(10000000 + Math.random() * 90000000).toString();

    // Set QR code validity (e.g., 365 days from now)
    const expireDateTime = new Date();
    expireDateTime.setDate(expireDateTime.getDate() + 365);
    const startDateTime = new Date();

    const response = await axios.put(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethod`,
      {
        standardQRCode: {
          expireDateTime: expireDateTime.toISOString(),
          startDateTime: startDateTime.toISOString(),
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

    res.json({
      qrCode: response.data.standardQRCode.image.binaryValue, // Base64-encoded QR code SVG
      pin: pin,
      displayName: displayName || "QR Auth",
    });
    console.log("QR+PIN API call to Entra:", response.data);
  } catch (error) {
    console.error("Graph API error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auth-methods/:userId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = req.params;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  // Get authentication methods
  try {
    const methodsResponse = await axios.get(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/methods`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    // Search authentication methods for QR and Pin MFA
    const hasQrMethod = !!methodsResponse.data.value.find(
      (m) =>
        m["@odata.type"] === "#microsoft.graph.qrCodePinAuthenticationMethod"
    );

    res.json(hasQrMethod);
  } catch (error) {
    console.error("Graph API error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/all-qr-data/:upn", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { upn } = req.params;
  console.log(upn);

  if (!token || !upn) {
    return res.status(400).json({ error: "Missing token or upn" });
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
});

// Unclear use
app.get("/api/standard-qr-data/:userId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = req.params;
  console.log(userId);

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  // Get authentication methods
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
});

// Unclear use
app.get("/api/get-qr-pin-data", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, displayName } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  // Fetch specific QR/PIN data
  try {
    const qrPinResponse = await axios.get(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethods/${qrCodePinId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!qrPinResponse.ok) {
      throw new Error(
        `Failed to fetch QR/PIN data: ${qrPinResponse.statusText}`
      );
    }

    res.json(qrPinResponse);
  } catch (error) {
    console.error("Graph API error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/create-temp-qr", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, displayName } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  // Fetch specific QR/PIN data
  try {
    const qrPinResponse = await axios.get(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethods/${qrCodePinId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!qrPinResponse.ok) {
      throw new Error(
        `Failed to fetch QR/PIN data: ${qrPinResponse.statusText}`
      );
    }

    res.json(qrPinResponse);
  } catch (error) {
    console.error("Graph API error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

/* app.delete("/api/delete-qr-pin-mfa", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, displayName } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  try {
    const response = await axios.delete(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethod`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch QR/PIN data: ${response.statusText}`);
    }

    console.log(response);
    console.log("Permanent QR code deleted successfully");
    res.json(response);
  } catch (error) {
    console.error("Graph API error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
}); */

app.delete("/api/delete-qr-pin-mfa/:userId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = req.params;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing token or userId" });
  }

  try {
    const response = await axios.delete(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethod`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Permanent QR code deleted successfully");
    res.json({ message: "QR code deleted successfully", data: response.data });
  } catch (error) {
    console.error("Graph API error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Failed to delete QR code", details: error.message });
  }
});

app.get("/api/bs-test", async (req, res) => {
  console.log("shits working yo");
  res.json("shits working yo");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/* const deleteSelfQRCode = async () => {
    try {
      const response = await fetch(
        `https://graph.microsoft.com/beta/me/authentication/qrCodePinMethods/${qrCodePinId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to delete QR code: ${response.statusText}`);
      }

      console.log("QR code deleted successfully");
    } catch (error) {
      console.error("Error deleting QR code:", error);
    }
  }; */