import React from "react";
import "../Modal.css";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                    <button className="delete-btn" onClick={onConfirm}>Yes, Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
