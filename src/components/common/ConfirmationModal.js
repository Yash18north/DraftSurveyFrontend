import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
function ConfirmationModal({
  isOpen,
  handleClose,
  handleConfirm,
  popupMessage,
  popupHeading,
  popbuttons,
  saveClicked,
  isNoOption,
  setPopupClose
}) {
  return (
    <span>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={isOpen}
        onHide={() => setPopupClose ? setPopupClose(false) : handleClose(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{popupHeading}</Modal.Title>
        </Modal.Header>
        <Modal.Body><>{popupMessage}</></Modal.Body>
        <Modal.Footer>
          {!isNoOption && (<Button
            className="btn btn-primary"
            variant="primary"
            onClick={() => handleClose(false)}
          >
            {popbuttons?.['no'] || "No"}
          </Button>)}
          <Button className="btn btn-danger" onClick={handleConfirm} disabled={saveClicked}>
            {popbuttons?.['yes'] || "YES"}
          </Button>
        </Modal.Footer>
      </Modal>
    </span >
  );
}
ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func,
  popupMessage: PropTypes.string,
  popupHeading: PropTypes.string,
  saveClicked: PropTypes.bool,
  isOverlayLoader: PropTypes.bool
};
export default ConfirmationModal;
