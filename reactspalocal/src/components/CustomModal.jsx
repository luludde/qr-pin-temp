import React from "react";
import { useEffect } from "react";


const CustomModal = ({ isOpen, onClose, title, children, loading, error, qrCodeSrc }) => {

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <h2>{title}</h2>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {qrCodeSrc && !loading && !error && <img src={qrCodeSrc} alt="QR Code" />}
        {children}
      </div>
    </div>
  );
};

export default CustomModal;