import React from 'react';
import "../App.css";
import PropTypes from 'prop-types';
import "../Modal.css"

// This component is an example of a modal dialog.  The content can be swapped out for different uses, and
// should be passed in from the parent class.

const Modal = ({ onClose, show, children }) => {

  // Function to handle close event
  const handleClose = (e) => {
    onClose && onClose(e);
  };

  console.log("Modal Show is " + show);

  if (!show) {
    return null;
  }

  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <span className="close" onClick={onClose}>&times;</span>
              <div>{children}</div>
          </div>
      </div>
  );
};

// Prop types validation
Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default Modal;