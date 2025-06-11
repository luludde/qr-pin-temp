import {
  AuthenticatedTemplate,
  useMsal,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import LandingPage from "./LandingPage";
import QRPinManagementPage from "./QRPinManagementPage";



export const AuthContentSelector = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount(); 
  console.log(activeAccount)

  return (
    <div className="App">
      <AuthenticatedTemplate>        
        <QRPinManagementPage activeAccount={activeAccount} />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LandingPage />
      </UnauthenticatedTemplate>
    </div>
  );
};
