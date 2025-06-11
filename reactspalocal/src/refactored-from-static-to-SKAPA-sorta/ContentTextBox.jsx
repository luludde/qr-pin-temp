import React from 'react';

export const ContentTextBox = () => {
  return (
    <main id="main-content">
      <section id="left-container">
        <header id="header">
          <a
            href="https://iweof.sharepoint.com/sites/sharedextranet/ss/at/mq/SitePages/Password-Management.aspx?_ga=2.257376139.1872791490.1716960750-485601351.1670228158"
            target="_blank"
            rel="noopener noreferrer" // Added for security
          >
            <img
              src="../../ikeawhite.png"
              alt="IKEA logo"
              className="ikea-icon" // Changed 'class' to 'className'
            />
          </a>
        </header>

        <div className="textbox">
          <h1 data-translate-key="Title">
            Manage my IKEA <br /> co-worker password
          </h1>
          <p data-translate-key="Info">
            Whether you just joined IKEA (Ingka Group), you can't remember your
            password, have a need to unlock your account, or you want to change
            your password - we got you covered.
          </p>
          <p data-translate-key="Options">
            Select one of the options and start using your IKEA account again.
          </p>
        </div>

        <div className="footer">
          <p className="custom-paragraph" data-translate-key="Support">
            If you are experiencing issues, please contact your Manager or{' '}
            <a href="https://now.ingka.com/sp" target="_blank" rel="noopener noreferrer">
              IT Service Desk
            </a>{' '}
            for further assistance.
          </p>
        </div>
      </section>
    </main>
  );
};