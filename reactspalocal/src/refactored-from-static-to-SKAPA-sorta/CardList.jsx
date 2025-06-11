import { ContentCard } from "@ingka/card";
import React from "react";
import { Button } from "@ingka/button";
import {
  MsalProvider,
  AuthenticatedTemplate,
  useMsal,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { ContentTextBox } from "./ContentTextBox";

export const CardList = () => {
  const { instance } = useMsal();
  //const activeAccount = instance.getActiveAccount();

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
    <div className="card-list">
      <ContentCard
        id="card-1"
        title="Set a new password using a Passcode"
        body="If you need to set a new password using a Passcode provided by
            Manager or Service Desk, whether you are a new co-worker or
            existing, this is the place for you."
        buttonProps={{ text: "Get started" }}
        buttonType="primary"
        className="no-underline-card"
      />

      <div className="card-1">
        <h2 id="card__title" data-translate-key="card1__title">
          Set a new password using a Passcode
        </h2>
        <div id="debug"></div>
        <p id="card__body" data-translate-key="card1__body">
          If you need to set a new password using a Passcode provided by Manager
          or Service Desk, whether you are a new co-worker or existing, this is
          the place for you.
        </p>
        <a
          href="https://mypassword.apps.ikea.com/PasswordPortal/page.axd?RuntimeFormID=c83bc061-98b2-4e67-84f7-1a9d3b9fe5c9&aeweb_handler=p&aeweb_rp=&wproj=0&ContextID=QER_PasswordWeb_Session"
          target="_blank"
        >
          <button className="btn btn--primary" type="button">
            <span className="btn__inner">
              <span className="btn__label" data-translate-key="btn__label">
                Get started
              </span>
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
        </a>
      </div>
      <div className="card-2">
        <h2 id="card__title" data-translate-key="card2__title">
          Forgot my password or Unlock account
        </h2>
        <p id="card__body" data-translate-key="card2__body">
          If you can’t remember your password try resetting your password and
          create a new one, or if you know your password but your account is
          locked, get back into your account here.
        </p>
        <a href="https://passwordreset.microsoftonline.com/" target="_blank">
          <button className="btn btn--primary">
            <div className="trailing-icon btn__inner">
              <div className="btn__label" data-translate-key="btn__label">
                Get started
              </div>
              <svg
                focusable="false"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="svg-icon btn__icon"
                aria-hidden="true"
                style={{ color: "white" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="m20.0008 12.0001-8-8.001-1.4143 1.414L16.1727 11H4v2h12.1723l-5.5868 5.5866 1.4141 1.4142 8.0012-8.0007z"
                />
              </svg>
            </div>
          </button>
        </a>
      </div>
      <div className="card-3">
        <h2 id="card__title" data-translate-key="card3__title">
          Change my password
        </h2>
        <p id="card__body" data-translate-key="card3__body">
          Keep your IKEA co-worker account secure by updating your password
          regularly with self-service.
        </p>
        <a
          href="https://mysignins.microsoft.com/security-info/password/change"
          target="_blank"
        >
          <button className="btn btn--primary">
            <div className="trailing-icon btn__inner">
              <div className="btn__label" data-translate-key="btn__label">
                Get started
              </div>
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
            </div>
          </button>
        </a>
      </div>
      <div className="card-4">
        <h2 id="card__title" data-translate-key="card4__title">
          QR code and PIN management
          <span className="tooltip">
            <svg
              focusable="false"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              className="svg-icon"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              />
            </svg>
            <span className="tooltiptext">
              Placeholder text for additional info
            </span>
          </span>
        </h2>
        <p id="card__body" data-translate-key="card4__body">
          If you need to set a new QR code and/or PIN or you need to manage the
          existing ones.
        </p>
        <button className="btn btn--primary" onClick={handleRedirect}>
          <div className="trailing-icon btn__inner">
            <div className="btn__label" data-translate-key="btn__label">
              Get started
            </div>
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
          </div>
        </button>
        <a href="#" target="_blank">
          <button className="btn btn--primary">
            <div className="trailing-icon btn__inner">
              <div className="btn__label" data-translate-key="btn__label">
                Placeholder
              </div>
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
            </div>
          </button>
        </a>
      </div>
    </div>
  );
};

export default CardList;