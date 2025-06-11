import React from "react";
import "./LandingPage.css";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import CustomCard from "./CustomCard";

const LandingPage = () => {
  const { instance } = useMsal();

  const handleRedirect = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        prompt: "login",
      })
      .catch((error) => console.log(error));
    console.log(instance);
  };

  return (
    <div className="main-container">
      {/* Left Side: Blue Panel */}
      <div className="left-panel">
        <img src="../../ikeawhite.png" alt="IKEA logo" className="ikea-logo" />
        <img src="../logo.svg" alt="logo" className="logo" />

        <div className="text-content">
          <h1>Manage my IKEA co-worker password</h1>
          <p>
            Whether you just joined IKEA (Ingka Group), you can't remember your
            password, have a need to unlock your account, or you want to change
            your password – we got you covered.
          </p>
          <p>
            Select one of the options and start using your IKEA account again.
          </p>
        </div>

        <p className="footer-text">
          If you are experiencing issues, please contact your Manager or{" "}
          <a href="#">IT Service Desk</a> for further assistance.
        </p>
      </div>

      {/* Right Side: Gray Panel */}
      <div className="right-panel">
        <CustomCard
          title="Set a new password using a Passcode"
          text="If you need to set a new password using a Passcode provided by
            Manager or Service Desk, whether you are a new co-worker or
            existing, this is the place for you."
          buttonText="Get started →"
          buttonAction="https://mypassword.apps.ikea.com/PasswordPortal/page.axd?RuntimeFormID=c83bc061-98b2-4e67-84f7-1a9d3b9fe5c9&aeweb_handler=p&aeweb_rp=&wproj=0&ContextID=QER_PasswordWeb_Session"
          isExternal={true}
        />
        <CustomCard
          title="Forgot my password or Unlock account"
          text="If you can’t remember your password try resetting your password and create a new one, or if you know your password but your account is locked, get back into your account here."
          buttonText="Get started →"
          buttonAction="https://passwordreset.microsoftonline.com/"
          isExternal={true}
        />
        <CustomCard
          title="Change my password"
          text="Keep your IKEA co-worker account secure by updating your password
            regularly with self-service."
          buttonText="Get started →"
          buttonAction="https://mysignins.microsoft.com/security-info/password/change"
          isExternal={true}
        />        
        <CustomCard
          title="QR code and PIN management"
          text="If you need to set a new QR code and/or PIN or you need to manage the existing ones."
          buttonText="Get started →"
          buttonAction={handleRedirect}
          isExternal={false}
        />
      </div>
    </div>
  );
};

export default LandingPage;