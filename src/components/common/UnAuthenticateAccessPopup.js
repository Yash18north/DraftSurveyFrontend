import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import PropTypes from "prop-types";


function UnAuthenticateAccessPopup({
    isShow,
    setIsShow,
    handleFunction
}) {

    return (
        <span>
            <Modal
                aria-labelledby="contained-modal-title-vcenter unauthenticate-modal"
                centered
                show={isShow}
                onHide={() => setIsShow(false)}
                backdropClassName={"unauthenticate-modal"}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Error!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Restricted Area. This section is intended for standard users only. Please navigate to the appropriate admin section.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-primary"
                        variant="primary"
                        onClick={handleFunction}
                    >
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </span>
    );
}
UnAuthenticateAccessPopup.propTypes = {
    isShow: PropTypes.object,
    setIsShow: PropTypes.func,
    handleFunction: PropTypes.func,
};
export default UnAuthenticateAccessPopup;
