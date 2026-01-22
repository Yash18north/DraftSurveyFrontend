import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { handleVerificationFormPost } from "../commonHandlerFunction/sampleVerificationHandlerFunctions";
import PropTypes from 'prop-types';


const SFMButtons = ({
  setIsPopupOpen,
  setJRFCreationType,
  handleSubmit,
  saveClicked,
  formData,
  viewOnly,
  testMemoSetData,
  handleBackButtonFunction
}) => {
  const { t } = useTranslation();
  const translate = t;

  const getTotalNotFilledCount = () => {
    let count = 0;
    testMemoSetData.forEach((tab, tabIndex) => {
      count += formData["tab_" + tabIndex]?.["noFilledCount"];
    });
    return count;
  };

  return (
    <div className="submit_btns">
      {" "}
      <Button
        type="button"
        className="saveBtn"
        id="submit_btn3"
        onClick={() => {
          handleBackButtonFunction()
        }}
      >
        {translate("common.backBtn")}
      </Button>
      {!viewOnly && !getTotalNotFilledCount() && (
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
        >
          {translate("common.postBtn")}
        </button>
      )}
    </div>
  );
};

SFMButtons.propTypes = {
  setIsPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  saveClicked: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  handleBackButtonFunction: PropTypes.func.isRequired,

  viewOnly: PropTypes.bool.isRequired,
  testMemoSetData: PropTypes.func.isRequired,
};
export default SFMButtons;