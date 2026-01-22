import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { handleVerificationFormPost } from "../commonHandlerFunction/sampleVerificationHandlerFunctions";
const SampleVerificationButtons = ({
  setIsPopupOpen,
  setJRFCreationType,
  handleSubmit,
  saveClicked,
  formData,
  tableData,
  viewOnly,
  handleBackButtonFunction,
}) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <div className="submit_btns">
      {" "}
      <Button
        type="button"
        className="saveBtn"
        id="submit_btn3"
        onClick={() => {
          handleBackButtonFunction();
        }}
      >
        {translate("common.backBtn")}
      </Button>
      {/* {formData["0"].sv_detail.length === tableData.length && !viewOnly && ( */}
      {formData["0"].filled_count === tableData.length && formData["0"].remaining_count == 0 && !viewOnly && (
        <button
          type="button"
          className="submitBtn"
          id="submit_btn3"
          data-name="save"
          onClick={(e) =>
            handleVerificationFormPost(
              e,
              handleSubmit,
              setJRFCreationType,
              setIsPopupOpen
            )
          }
          disabled={saveClicked}
        >
          {translate("common.postBtn")}
        </button>
      )}
    </div>
  );
};

SampleVerificationButtons.propTypes = {
  setIsPopupOpen: PropTypes.func.isRequired,
  setJRFCreationType: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleBackButtonFunction: PropTypes.func.isRequired,

  saveClicked: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  viewOnly: PropTypes.bool.isRequired,
};
export default SampleVerificationButtons;
