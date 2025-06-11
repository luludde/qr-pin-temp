import React from "react";
import ReactGA from "react-ga";

const CustomCard = ({ title, text, buttonText, buttonAction, isExternal }) => {
    const handleClick = () => {
        // Track GA event for button click
        ReactGA.event({
          category: "Card Interaction",
          action: `Clicked ${title} Button`,
          label: buttonText,
        });
    
        // Handle button action
        if (isExternal) {
          window.open(buttonAction, "_blank", "noopener,noreferrer");
        } else if (typeof buttonAction === "function") {
          buttonAction();
        }
      };
    
      return (
        <div className="card">
          <h2>{title}</h2>
          <p>{text}</p>
          <button onClick={handleClick} className="card-button">
            {buttonText}
          </button>
        </div>
      );
};

export default CustomCard;