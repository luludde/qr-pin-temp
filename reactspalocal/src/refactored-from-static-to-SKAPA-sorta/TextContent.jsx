import React from "react";
import Text from "@ingka/text";

export const TextContent = () => {
  return (
    <>
      <Text tagName="h1" textStyle="Heading.S">
        Manage my IKEA co-worker password
      </Text>
      <Text textStyle="Heading.S">
        Whether you just joined IKEA (Ingka Group), you can't remember your
        password, have a need to unlock your account, or you want to change your
        password - we got you covered. 
        <br></br>
        Select one of the options and start using
        your IKEA account again.
      </Text>
      <div className="footer">
          <p className="custom-paragraph" data-translate-key="Support">
            If you are experiencing issues, please contact your Manager or{' '}
            <a href="https://now.ingka.com/sp" target="_blank" rel="noopener noreferrer">
              IT Service Desk
            </a>{' '}
            for further assistance.
          </p>
        </div>
    </>
  );
};

export default TextContent;
