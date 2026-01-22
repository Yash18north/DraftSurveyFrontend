import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

const AllotmentButtons = ({
  setIsPopupOpen,
  setJRFCreationType,
  saveClicked,
  handleAllotValidate,
  viewOnly,
  handleBackButtonFunction
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
          handleBackButtonFunction()
        }}
      >
        {translate("common.backBtn")}
      </Button>
      {!viewOnly && (
        <button
          type="button"
          className="submitBtn"
          id="submit_btn3"
          data-name="save"
          onClick={(e) => handleAllotValidate(e)}
        >
          {translate("common.allotBtn")}
        </button>
      )}
    </div>
  );
};

AllotmentButtons.propTypes = {
  setIsPopupOpen: PropTypes.func.isRequired,
  setJRFCreationType: PropTypes.func.isRequired,
  saveClicked: PropTypes.bool.isRequired,
  handleAllotValidate: PropTypes.func.isRequired,
  handleBackButtonFunction: PropTypes.func.isRequired,
  viewOnly: PropTypes.bool.isRequired,
};

export default AllotmentButtons;