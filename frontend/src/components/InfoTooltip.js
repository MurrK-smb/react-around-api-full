import React from "react";
import succsessIcon from "../images/success-icon.svg";
import errorIcon from "../images/close-icon.svg";
import closeImg from "../images/x-button.svg";

function InfoTooltip({ isOpen, onClose, status }) {
  return (
    <div className={`modal ${isOpen && "modal_open"}`}>
      <div className="modal__body modal__body_info">
        <button
          type="button"
          className="modal__close-button modal__close-button_info"
          onClick={onClose}
        >
          <img className="modal__close-button-image" src={closeImg} alt="" />
        </button>
        {status === "success" ? (
          <div className="modal__section">
            <img className="modal__icon" src={succsessIcon} alt="" />
            <p className="modal__status-message">
              Success! You have been registered.
            </p>
          </div>
        ) : (
          <div className="modal__section">
            <img className="modal__icon" src={errorIcon} alt="" />
            <p className="modal__status-message">
              Something went wrong. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InfoTooltip;
