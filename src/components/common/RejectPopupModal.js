import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import InputTextArea from "./elements/InputTextArea";
import { toast } from "react-toastify";
import { masterUploadApi } from "../../services/api";
import { postDataFromApi } from "../../services/commonServices";
function RejectPopupModal({
  isOpen,
  handleClose,
  handleConfirm,
  popupMessage,
  popupHeading,
  setRemarkText,
  remarkText,
  isCancelPopupOpen,
  setFormData,
  formData
}) {
  const onHandleCloseFunc = () => {
    setRemarkText("")
    handleClose(false)
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUploadFile(file);
    }
  };
  const handleUploadFile = async (file) => {
    const customformData = new FormData();
    customformData.append("file", file);
    customformData.append("model_type ", "userdata");
    try {
      let response = await postDataFromApi(masterUploadApi, customformData, "TRUE");
      if (response.data.status === 200) {
        setFormData((prev)=>{
          return {
            ...prev,
            [0]:{
              ...prev[0],
              reject_img_file:response.data.data.file
            }
          }
        })
      }
      else {
        toast.error(
          response?.message ||
          response?.data?.message,
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    } finally {
    }
  };
  return (
    <span>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={isOpen}
        onHide={() => onHandleCloseFunc()}
      >
        <Modal.Body className="popup_body">
          <div className="popupSearchContainerBG">
            <div className="popupSearchContainer popupWidthAdjustment">
              <div className="rejectSearchCross">
                <button onClick={() => onHandleCloseFunc()} className="nonNativeButton2" aria-label="Reject Button">
                  <i className="bi bi-x-lg h4"></i>
                </button>
              </div>

              <div className="rejectPopupHeader">
                <i className="bi bi-exclamation-lg rejectHeadingImg h1"></i>

                <h1 className="rejectHeadingText">{popupMessage}</h1>
              </div>
              <div className="popupSearchGroupContainer">
                {/* <textarea
                  className="rejectRemarkTextbox"
                  placeholder="Enter Remark"
                  value={remarkText}
                  name={'rejectremark'}
                  onChange={(e) => setRemarkText(e.target.value)}
                /> */}
                <InputTextArea
                  field={{
                    name: 'rejectMark',
                    label: "Reject Mark",
                    value: remarkText || "",
                    upperClass: "popupUpperClass",
                    fieldWidth: 100,
                    onChange: (e, isValue) =>
                      setRemarkText(isValue ? e : e.target.value),
                    required: true,
                  }}
                />
                {/* <button
                  className="submitBtn compBtn"
                  type="button"
                  onClick={() => {
                    document.getElementById("hiddenFileInput").click();
                  }}
                >
                  Upload Proof
                </button>
                <input
                  type="file"
                  id="hiddenFileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                /> */}
              </div>
              <div className="rejectButtonsContainer">
                <div className="popupSearchButtons">
                  <button type="button" onClick={() => onHandleCloseFunc()}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleConfirm}>
                    {isCancelPopupOpen ? "Yes" : "Reject"}
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
RejectPopupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  popupMessage: PropTypes.string,
  popupHeading: PropTypes.string,
  setRemarkText: PropTypes.func.isRequired,
  remarkText: PropTypes.string,
};
export default RejectPopupModal;
