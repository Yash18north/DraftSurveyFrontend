import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useError } from "./context/ErrorContext";

const ErrorPopup = () => {
  const { error, clearError } = useError();

  useEffect(() => {
    if (error) {
      // You can auto-clear after a few seconds if you want
      // setTimeout(() => clearError(), 5000);
    }
  }, [error]);

  const handleClose = () => {
    // clearError();
    window.location.reload();
  };

  if (!error) return null;

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={!!error}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>System Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>{"Something went wrong!"}</Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorPopup;
