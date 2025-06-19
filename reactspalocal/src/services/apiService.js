export const fetchAuthMethods = async (userId, token) => {
  try {
    const response = await fetch(      
      //`http://localhost:3001/api/auth-methods/${userId}`,
      `http://localhost:3001/api/auth-methods/${userId}/methods`,
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

export const fetchQrDetails = async (upn, token) => {
  try {
    const response = await fetch(
      //`http://localhost:3001/api/all-qr-data/${upn}`,
       `http://localhost:3001/api/qr/user-all/${upn}`,
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
      //`http://localhost:3001/api/delete-qr-pin-mfa/${userId}`,
      `http://localhost:3001/api/auth-methods/${userId}`,
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
      "http://localhost:3001/api/auth-methods/create",
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
    const response = await fetch(
      "http://localhost:3001/api/qr/temp",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to create temporary QR code: ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      qrCodeSrc: `data:image/svg+xml;base64,${data.qrCode}`,
      pin: data.pin, // or placeholder if not provided
    };
  } catch (error) {
    console.error("Error creating temporary QR code:", error);
    throw error;
  }
};

export const resetAuthMethod = async (userInfo, token) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/auth-methods/reset-auth-method",
      {
        method: "POST", 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reset auth method: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error resetting auth method:", error);
    throw error;
  }
};
