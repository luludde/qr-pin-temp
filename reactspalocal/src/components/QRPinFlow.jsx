import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import CustomModal from "./CustomModal";

const QRPinFlow = ({ onComplete, onCloseCallback }) => {
  const { instance, accounts } = useMsal();
  const activeAccount = accounts[0];
  const [modalStack, setModalStack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrCodeSrc, setQrCodeSrc] = useState(null);
  const [error, setError] = useState(null);
  const [pin, setPin] = useState(null);

  useEffect(() => {
    if (modalStack.length === 0 && !qrCodeSrc) createTempQRCode();
  }, [modalStack, qrCodeSrc]);

  const createTempQRCode = async () => {
    try {
      setLoading(true);
      setModalStack(["qr"]);
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      });
      const token = tokenResponse.accessToken;
      const userId = activeAccount?.localAccountId || activeAccount?.username;
      const now = new Date();
      const expireDateTime = new Date(now.getTime() + 0.1 * 60 * 60 * 1000);
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
        throw new Error(`Failed: ${tempResponse.statusText}`);
      const tempData = await tempResponse.json();
      const binaryValue = tempData.image.binaryValue;
      setQrCodeSrc(`data:image/svg+xml;base64,${binaryValue}`);
      setPin("835930");
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const nextStep = () => {
    const next =
      modalStack.length === 1
        ? "pin"
        : modalStack.length === 2
        ? "confirm"
        : null;
    if (next) setModalStack([...modalStack, next]);
  };

  const prevStep = () => {
    const newStack = [...modalStack];
    newStack.pop();
    setModalStack(newStack.length ? newStack : []);
  };

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeSrc;
    link.download = `qrcode_${new Date().toISOString()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQRCode = () => {
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.write(`
      <html><head><title>Print QR Code</title></head>
      <body><img src="${qrCodeSrc}" onload="window.print();window.close()"/></body></html>
    `);
    printWindow.document.close();
  };

  const copyPinToClipboard = () => {
    navigator.clipboard.writeText(pin).then(() => console.log("PIN copied"));
  };

  const currentModal = modalStack[modalStack.length - 1];

  const onClose = () => {
    setModalStack([]);
    if (onCloseCallback) onCloseCallback(); // Call parent callback to reset showFlow
  };

  return (
    <>
      {currentModal === "qr" && (
        <CustomModal
          isOpen={true}
          onClose={onClose}
          title="QR Code"
          loading={loading}
          error={error}
          qrCodeSrc={qrCodeSrc}
        >
          <br></br>
          <button onClick={downloadQRCode}>Download QR Code</button>
          <button onClick={printQRCode}>Print</button>
          <br></br>
          <button onClick={nextStep}>Next</button>
        </CustomModal>
      )}
      {currentModal === "pin" && (
        <CustomModal
          isOpen={true}
          onClose={onClose}
          title="Copy your PIN"
          loading={loading}
          error={error}
          qrCodeSrc={null}
        >
          <p>{pin}</p>
          <button onClick={copyPinToClipboard}>Copy PIN to clipboard</button>
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </CustomModal>
      )}
      {currentModal === "confirm" && (
        <CustomModal
          isOpen={true}
          onClose={onClose}
          title="Did you save your QR Code and PIN?"
          loading={loading}
          error={error}
          qrCodeSrc={null}
        >
          <p>Make sure you’ve saved them somewhere safe.</p>
          <button onClick={prevStep}>No, show them again</button>
          <button
            onClick={() => {
              setModalStack([]);
              onComplete();
            }}
          >
            Yes, I’ve saved them
          </button>
        </CustomModal>
      )}
    </>
  );
};

export default QRPinFlow;
