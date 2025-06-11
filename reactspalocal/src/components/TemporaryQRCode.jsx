import { loginRequest } from "../authConfig";
import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";

export const TemporaryQRCode = ({ activeAccount }) => {
  const { instance } = useMsal();
  //const [mfaInfo, setMfaInfo] = useState(null);
  //const [tempQrCodeImageUrl, setTempQrCodeImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [qrCodeSrc, setQrCodeSrc] = useState("");

  useEffect(() => {
      const fetchTempQRCodeDetails = async () => {
        try {
          const tokenResponse = await instance.acquireTokenSilent({
            ...loginRequest,
            account: activeAccount,
          });
          const token = tokenResponse.accessToken;
          const userId = activeAccount?.localAccountId || activeAccount?.username;
  
          // Step 1: Get QR code metadata
          const getResponse = await fetch(
            `https://graph.microsoft.com/beta/users/${userId}/authentication/qrCodePinMethod/temporaryQRCode`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
  
          if (!getResponse.ok) throw new Error(`Failed to fetch QR code metadata: ${getResponse.statusText}`);
  
          const data = await getResponse.json();
          console.log("Response data:", data);
  
         
        } catch (err) {
          setError(err.message);
          console.error("Error fetching QR code:", err);
        }
      };
  
      if (activeAccount) fetchTempQRCodeDetails();
    }, [instance, activeAccount]);
   

  //if (!mfaInfo) return <div>Loading...</div>;

  console.log(activeAccount);

  const createTempQRCode = async () => {
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      });
      const token = tokenResponse.accessToken;
      const userId = activeAccount?.localAccountId || activeAccount?.username;

      // Generate a temporary QR code using the correct PATCH endpoint
      const now = new Date(); // Current time: 04:25 PM CEST, May 28, 2025
      const expireDateTime = new Date(now.getTime() + 0.1 * 60 * 60 * 1000); // 8 hours from now: 12:25 AM CEST, May 29, 2025
      console.log("now: ", now)
      console.log("expiry: ", expireDateTime)
      const tempResponse = await fetch(
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

      if (!tempResponse.ok)
        throw new Error(
          `Failed to create temporary QR code: ${tempResponse.statusText}`
        );

      const tempData = await tempResponse.json();
      console.log("Temporary QR code response:", tempData);

      const binaryValue = tempData.image.binaryValue; //  binaryValue
      // Set Base64 string as image source
      setQrCodeSrc(`data:image/svg+xml;base64,${binaryValue}`);    
      
    } catch (error) {
      console.error("Error creating temporary QR code:", error);
      setError(error.message);
    }
  };

  const deleteTempQRCode = async () => {
    // https://graph.microsoft.com/beta/users/flokreg@contoso.com/authentication/qrCodePinMethod/temporaryQRCode`
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      });
      const token = tokenResponse.accessToken;
      const userId = activeAccount?.localAccountId || activeAccount?.username;
      // Step 2: Generate a temporary QR code to get the image
      const now = new Date().toISOString(); // Current time: 12:56 PM CEST, May 28, 2025
      const tempResponse = await fetch(
        `https://graph.microsoft.com/v1.0/users/${userId}/authentication/methods/qrCode/temporary`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lifetimeInHours: 8,
            activationDateTime: now,
          }),
        }
      );

      if (!tempResponse.ok)
        throw new Error(
          `Failed to fetch temporary QR code: ${tempResponse.statusText}`
        );

      const tempData = await tempResponse.json();
      console.log(tempData);
      const imageUrl = tempData.qrCodeImageUrl; // Adjust based on actual response
      if (!imageUrl) throw new Error("Temporary QR code image URL not found");
      //setTempQrCodeImageUrl(imageUrl);
    } catch (error) {
      console.error("Error sending token:", error);
    }
  };

  //console.log(qrCodeSrc)

  return (
    <>
      <div className="card-1">
        <h2 id="card__title" data-translate-key="card1__title">
          Temporary QR Code
        </h2>
        <div id="debug"></div>
        <p id="card__body" data-translate-key="card1__body">
          For short-term use or one-time access
        </p>
        <div id="debug">
          {error && <p>Error: {error}</p>}
          
        </div>

        <div>
          <button
            className="btn btn--primary"
            onClick={createTempQRCode}
            type="button"
          >
            <span className="btn__inner">
              <span className="btn__label">Create temporary QR Code</span>
              <svg
                focusable="false"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="svg-icon btn__icon"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="m20.0008 12.0001-8-8.001-1.4143 1.414L16.1727 11H4v2h12.1723l-5.5868 5.5866 1.4141 1.4142 8.0012-8.0007z"
                />
              </svg>
            </span>
          </button>
          <br></br>
          {/* {qrCodeSrc && <p>{qrCodeSrc}</p>} */}
          {qrCodeSrc && <img src={qrCodeSrc} alt="QR Code" />}
          <br>
          </br>
          <p>
            line break for delete temporary qr code for test purposes button
          </p>
          <button
            className="btn btn--primary"
            onClick={deleteTempQRCode}
            type="button"
          >
            <span className="btn__inner">
              <span className="btn__label">Delete temp QR Code</span>
              <svg
                focusable="false"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="svg-icon btn__icon"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="m20.0008 12.0001-8-8.001-1.4143 1.414L16.1727 11H4v2h12.1723l-5.5868 5.5866 1.4141 1.4142 8.0012-8.0007z"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <br></br>
    </>
  );
};

export default TemporaryQRCode;
