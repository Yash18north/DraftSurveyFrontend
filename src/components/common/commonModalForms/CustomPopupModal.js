import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import RenderFields from "../RenderFields";
import { useSelector } from "react-redux";
import { Row } from "react-bootstrap";

function CustomPopupModal({
  isCustomPopup,
  setIsCustomPopup,
  handleConfirm,
  section = [],
  formData,
  setFormData,
  moduleType,
  filterMasterOptions = []
}) {
  const session = useSelector((state) => state.session);
  const user = session.user;
  const onHandleCloseFunc = () => {
    setIsCustomPopup(false)
  }
  const handleCustomFieldChange = (
    sectionIndex,
    fieldName,
    value
  ) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [sectionIndex]: {
          ...prevFormData[sectionIndex],
          [fieldName]: value,
        },
      };
    });
  }

  const getCustomCellValues = (cell) => {
    if (["PoPreview", 'purchaseReq'].includes(moduleType)) {
      if (['req_fk_approval_id', 'fk_approval_id'].includes(cell.name)) {
        // cell.includesData = [
        //   "T10075",
        //   "T10249",
        //   "SU2005",
        //   "P10115",
        //   user?.all_roles?.usr_emp_id_orig
        // ]
        cell.defaultValue = user?.all_roles?.usr_emp_id_orig
      }

    }
    return cell;
  }
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
            <div className={`popupSearchContainer popupWidthAdjustment ${section.isFullform ? "popupWidthAdjustmentFullShow" : ''}`}>
              <div className="rejectSearchCross">
                <button onClick={() => onHandleCloseFunc()} className="nonNativeButton2" aria-label="Reject Button">
                  <i className="bi bi-x-lg h4"></i>
                </button>
              </div>
              <h2 className="modalHeader">{section.title}</h2>
              <div className="popupSearchGroupContainer">
                <Row>
                  {
                    section.fields.map((field, fieldIndex) => {
                      return (
                        <div
                          key={"Form-Extra-Adjustments" + fieldIndex}
                          className={"col-md-" + field.width}
                        >

                          <RenderFields
                            field={getCustomCellValues(field)}
                            sectionIndex={0}
                            fieldIndex={fieldIndex}
                            formData={formData}
                            handleFieldChange={handleCustomFieldChange}
                            setFormData={setFormData}
                            masterOptions={filterMasterOptions}
                          />
                        </div>
                      )
                    })
                  }
                </Row>
              </div>
              <div className="rejectButtonsContainer">
                <div className="popupSearchButtons">
                  <button type="button" onClick={() => onHandleCloseFunc()}>
                    {section?.buttons?.cancel?.title || "Cancel"}
                  </button>
                  <button type="button" onClick={handleConfirm}>
                    {section?.buttons?.confirm?.title || "Cancel"}
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
CustomPopupModal.propTypes = {
  isCustomPopup: PropTypes.bool.isRequired,
  setIsCustomPopup: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  popupMessage: PropTypes.string,
  popupHeading: PropTypes.string,
  setRemarkText: PropTypes.func.isRequired,
  remarkText: PropTypes.string,
};
export default CustomPopupModal;
