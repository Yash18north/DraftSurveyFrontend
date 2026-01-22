import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import OverlayLoading from "./OverlayLoading";
import { useEffect } from "react";
function DeleteConfirmation({
  isOpen,
  handleClose,
  handleConfirm,
  popupMessage,
  popupHeading,
  saveClicked,
  isOverlayLoader,
  actionType,
  moduleType,
  formData
}) {
  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      document.getElementById('confirmsubmitButton').click(); // Trigger button programmatically
    }
  };

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener('keydown', handleEnterPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, []);
  let isMounted = true;
  useEffect(() => {
    if (isOpen && isMounted && actionType.toLowerCase() !== "delete") {
      // document.getElementById('confirmsubmitButton').click();
      // handleConfirm()
      if (!checkValidationFormodule()) {
        handleConfirm()
      }
    }
    isMounted = false;
  }, [isOpen]);
  let isShow = false;
  const checkValidationFormodule = () => {
    let chkisShow = false
    chkisShow = actionType.toLowerCase() === "delete"
    if (['invoice', 'internalcertificate'].includes(moduleType)) {
      switch (moduleType) {
        case "internalcertificate":
          if (['save', 'post'].includes(actionType.toLowerCase())) {
            chkisShow = true
            if (formData[0]?.ic_id || formData[0].nonScopeData || formData[0]?.ic_ulrno) {
              chkisShow = false
            }
          }
          break;
        case "invoice":
          if (['post'].includes(actionType.toLowerCase())) {
            chkisShow = true
          }
          break;
      }
    }
    return chkisShow
  }
  isShow = checkValidationFormodule()
  return (
    <span>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={isOpen && isShow}
        onHide={() => handleClose(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{popupHeading}</Modal.Title>
        </Modal.Header>
        <Modal.Body><> {isOverlayLoader && <OverlayLoading />}{popupMessage}</></Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-primary"
            variant="primary"
            onClick={() => handleClose(false)}
            type="button"
          >
            No
          </Button>
          <Button type="button" className="btn btn-danger" onClick={handleConfirm} disabled={saveClicked} id="confirmsubmitButton">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </span>
  );
}

DeleteConfirmation.propTypes = {
  isOpen: PropTypes.bool, // Boolean indicating if the popup is open
  handleClose: PropTypes.func, // Function to handle closing the popup
  handleConfirm: PropTypes.func, // Function to handle confirmation
  popupMessage: PropTypes.string, // String for the popup message
  popupHeading: PropTypes.string, // String for the popup heading
  saveClicked: PropTypes.bool, // Boolean indicating if save was clicked
  isOverlayLoader: PropTypes.bool // Boolean indicating if an overlay loader is active
};

export default DeleteConfirmation;
