import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

function VerifyOTPModal({
  isCustomPopup,
  setIsCustomPopup,
  handleConfirm
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const onHandleCloseFunc = () => {
    setIsCustomPopup(false)
  }
  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      refs[index + 1].current.focus();
    } else if (value === "" && index > 0) {
      refs[index - 1].current.focus();
    } else if (value !== "" && index === 5) {
      refs[index].current.blur();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    const pastedChars = pastedData.split("").filter((char) => !isNaN(char));
    const newOtp = [...otp];

    for (let i = 0; i < pastedChars.length && i < 6; i++) {
      newOtp[i] = pastedChars[i];
    }

    setOtp(newOtp);
  };
  return (
    <span>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={isCustomPopup}
        onHide={() => onHandleCloseFunc()}
      >
        <Modal.Body className="popup_body">
          <div className="popupSearchContainerBG">
            <div className={`popupSearchContainer popupWidthAdjustment verifyOTPModal`}>
              <div className="rejectSearchCross">
                <button onClick={() => onHandleCloseFunc()} className="nonNativeButton2" aria-label="Reject Button">
                  <i className="bi bi-x-lg h4"></i>
                </button>
              </div>
              <h2 className="modalHeader">Verify OTP</h2>
              <div className="popupSearchGroupContainer">
                <Row>
                  <div className="forgot_password_otp">
                    {otp.map((value, index) => (
                      <input
                        key={"Forgot Password" + index}
                        type="number"
                        maxLength="1"
                        value={value}
                        // onChange={(e) => handleChange(index, e.target.value)}
                        // onPaste={handlePaste}
                        ref={refs[index]}
                      />
                    ))}
                  </div>
                </Row>
              </div>
              <div className="rejectButtonsContainer">
                <div className="popupSearchButtons">
                  <button type="button" onClick={() => onHandleCloseFunc()}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleConfirm}>
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </span>
  );
}
VerifyOTPModal.propTypes = {
  isCustomPopup: PropTypes.bool.isRequired,
  setIsCustomPopup: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  popupMessage: PropTypes.string,
  popupHeading: PropTypes.string,
  setRemarkText: PropTypes.func.isRequired,
  remarkText: PropTypes.string,
};
export default VerifyOTPModal;
