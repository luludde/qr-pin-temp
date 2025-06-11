export const fetchAuthMethods = async (userId, token) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/auth-methods/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch QR code data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching QR code details:", error);
    throw error; 
  }
};

export const fetchQrDetails = async (userEmail, token) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/all-qr-data/${userEmail}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch QR code data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching QR code details:", error);
    throw error; 
  }
};

export const deletePermanentQRCode = async (userId, token) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/delete-qr-pin-mfa/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete QR code: ${response.statusText}`);
    }

    return await response.json(); 
  } catch (error) {
    console.error("Error deleting QR code:", error);
    throw error; 
  }
};

export const createStandardQrCode = async (userInfo, token) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/create-qr-pin-mfa",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create QR code: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating QR code:", error);
    throw error;
  }
};

export const createTempQRCode = async (userId, token) => {
  try {
    const now = new Date();
    const expireDateTime = new Date(now.getTime() + 0.1 * 60 * 60 * 1000); // 6 minutes
    const response = await fetch(
      `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethod/temporaryQRCode`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDateTime: now.toISOString(),
          expireDateTime: expireDateTime.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to create temporary QR code: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(data);
    return {
      qrCodeSrc: `data:image/svg+xml;base64,${data.image.binaryValue}`,
      pin: 12345678
    };
  } catch (error) {
    console.error("Error creating temporary QR code:", error);
    throw error;
  }
};
