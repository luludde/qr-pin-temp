import { NavigationBar } from "./NavigationBar";
import { loginRequest } from "../authConfig";
import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import CustomCard from "./CustomCard";
import "./QRPinManagementPage.css";
import QRPinFlow from "./QRPinFlow";
import {
  fetchQrDetails,
  deletePermanentQRCode,
  createStandardQrCode,
  fetchAuthMethods,
  resetAuthMethod,
} from "../services/apiService";

const QRPinManagementPage = ({ activeAccount }) => {
  const { instance } = useMsal();
  const [showFlow, setShowFlow] = useState(false);
  const [token, setToken] = useState(null);
  const [qrPinData, setQrPinData] = useState({
    pinExpiration: null,
    standardQrId: null,
    tempQrId: null,
    standardQrExpiration: null,
    tempQrExpiration: null,
  });
  const [userId, setUserId] = useState(null);
  const [userUpn, setUserUpn] = useState(null);
  const [asyncStatus, setAsyncStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [tempQrBin, setTempQrBin] = useState(null);

  const startFlow = () => setShowFlow(true);

  // Fetch token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Step 1: Get access token
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ["https://graph.microsoft.com/.default"],
          account: activeAccount,
        });

        setToken(tokenResponse.accessToken);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    setUserId(activeAccount.localAccountId);
    setUserUpn(activeAccount.username);
    setAsyncStatus({
      loading: false,
      error: null,
      success: false,
    });

    fetchToken();
  }, [instance, activeAccount]);

  // Fetch auth methods and QR code details
  useEffect(() => {
    const loadQrDetails = async () => {
      if (!userUpn || !token) return; // Early return if dependencies are missing

      setAsyncStatus({
        loading: true,
        error: null,
        success: false,
      });
      try {
        const data = await fetchQrDetails(userUpn, token);

        // Update state based on API response
        setQrPinData({
          pinUpdatedDateTime: data.pin?.updatedDateTime,
          standardQrId: data.standardQRCode?.id,
          tempQrId: null,
          standardQrExpiration: data.standardQRCode?.expireDateTime,
          tempQrExpiration: null,
        });
        console.log("QR code data fetched successfully:", data);
      } catch (error) {
        setAsyncStatus({
          loading: true,
          error: error.message,
          success: false,
        });
      } finally {
        setAsyncStatus({
          loading: false,
          error: null,
          success: true,
        });
      }
    };

    const determineQrMethod = async () => {
      fetchAuthMethods(userId, token);
      hasQr = true;
    };

    let hasQr = false;
    if (userId && token) {
      console.log("determine plez");
      determineQrMethod();
    }

    if (hasQr) {
      loadQrDetails();
    }
  }, [userId, userUpn, token]);

  // Render logic
  if (asyncStatus.loading) return <div>Loading...</div>;
  if (asyncStatus.error) return <div>Error: {asyncStatus.error}</div>;

  const handleCreateQrCode = async () => {
    const previousQrData = qrPinData;

    try {
      const userInfo = {
        userId,
        displayName: activeAccount?.name || "Unknown User",
      };
      const data = await createStandardQrCode(userInfo, token);
      setQrPinData({
        pin: data?.pin ?? "",
        id: data?.id ?? null,
        expiration: data?.expiration ?? null,
        isTemporary: data?.isTemporary ?? false,
      });
      console.log(data);
      setAsyncStatus({ loading: false, error: null, success: true });
    } catch (error) {
      setQrPinData(previousQrData); // Rollback
      setAsyncStatus({ loading: false, error: error.message, success: false });
    }
  };

  const handleDeleteQrCode = async () => {
    /* if (!window.confirm("Are you sure you want to delete the QR code?")) {
      return;
    } */
    console.log("tetet");

    setAsyncStatus({ loading: true, error: null, success: false });
    try {
      const response = await deletePermanentQRCode(userId, token);
      // Reset QR-related state after deletion
      setQrPinData({
        pinExpiration: null,
        standardQrId: null,
        tempQrId: null,
        standardQrExpiration: null,
        tempQrExpiration: null,
      });
      setAsyncStatus({ loading: false, error: null, success: true });
      console.log("Permanent QR code deleted successfully", response);
    } catch (error) {
      setAsyncStatus({ loading: false, error: error.message, success: false });
    }
  };

  const extendCurrentQR = async () => {
    // logic to be continued
  };

  const handleResetAuthMethod = async () => {
  try {
    const userInfo = {
      userId,
      displayName: activeAccount?.name || "Unknown User",
    };

    const data = await resetAuthMethod(userInfo, token);
    console.log("Reset Auth Method Response:", data);
  } catch (error) {
    console.error("Error resetting auth method:", error);
  }
};


  return (
    <>
      <NavigationBar />
      {qrPinData && (qrPinData.standardQrId || qrPinData.tempQrId) ? (
        <>
          
          {/* Extend existing QR code */}
          <CustomCard
            title="Standard QR Code"
            text="Extend current QR code"
            buttonText="Extend current QR code →"
            buttonAction={extendCurrentQR}
            isExternal={false}
          />
          {/* Create new permanent QR */}
          <CustomCard
            title="Standard QR Code 2"
            text="Create a new permanent QR code"
            buttonText="Replace current QR code →"
            buttonAction={extendCurrentQR}
            isExternal={false}
          />
          {/* Reset PIN and QR */}
          <CustomCard
            title="Reset PIN and QR Code"
            text="RESET"
            buttonText="Reset →"
            buttonAction={handleResetAuthMethod}
            isExternal={false}
          />
          {/* Create temporary QR */}
          <CustomCard
            title="Create temporary QR + PIN"
            text="Create a new temp QR + PIN for dev test purposes"
            buttonText="Create Temp QR →"
            buttonAction={startFlow}
            isExternal={false}
          />
          {showFlow && (
            <QRPinFlow
              onComplete={() => setShowFlow(false)}
              onCloseCallback={() => setShowFlow(false)}
            />
          )}
          {/* Permanently Delete QR Code + PIN */}
          <CustomCard
            title="Delete Current QR and PIN"
            text="Deletes QR Code and PIN"
            buttonText="Delete QR and PIN →"
            buttonAction={handleDeleteQrCode}
            isExternal={false}
          />
          {asyncStatus.success && <p>QR code deleted successfully!</p>}
          {asyncStatus.error && <p>Error: {asyncStatus.error}</p>}
        </>
      ) : (
        /* Create a new QR and PIN */
        <CustomCard
          title="Create a new QR + PIN"
          text="Create a new QR + PIN"
          buttonText="Create QR Code and PIN →"
          buttonAction={handleCreateQrCode}
          isExternal={false}
        />
      )}
    </>
  );
};

export default QRPinManagementPage;
