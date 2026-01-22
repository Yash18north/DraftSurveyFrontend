import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  handleChecklistBtns
} from "../commonHandlerFunction/sampleInwardHandlerFunctions";
import React from "react";
import PropTypes from 'prop-types';
const ViewCheckListButtons = ({
  remarkText,
  setIsPopupOpen,
  setJRFCreationType,
  setInwardBtnchange,
  formData,
  setSaveClicked,
  formConfig,
  saveClicked,
  setIsRejectPopupOpen,
  viewOnly,
  handleBackButtonFunction,
  setIsOverlayLoader
}) => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const translate = t;
  return (
    <div className="submit_btns">
      {(<React.Fragment>
        <Button
          type="button"
          className="cancelBtn"
          id="submit_btn3"
          onClick={() => {
            handleBackButtonFunction()
          }}
        >
          {translate("common.backBtn")}
        </Button>
        {
          // !formData?.[1]?.jrf_is_ops &&
          <Button
            type="button"
            className="saveBtn"
            id="submit_btn1"
            onClick={(e) => setIsRejectPopupOpen(true)}
          >
            {translate("common.rejectBtn")}
          </Button>
        }
        {formData?.[0]?.jrf_status !== "accepted" && <Button
          type="button"
          className="submitBtn"
          id="submit_btn1"
          onClick={(e) =>
            handleChecklistBtns(
              e,
              "accept",
              formData,
              remarkText,
              setSaveClicked,
              formConfig,
              navigate,
              setIsOverlayLoader
            )
          }
          disabled={formData?.[1]?.jrf_is_lab_capable !== "Yes"}

        >
          {translate("common.acceptBtn")}
        </Button>}
      </React.Fragment>)}
    </div>
  );
};


ViewCheckListButtons.propTypes = {
  remarkText: PropTypes.string, // Expected to be a string
  setIsPopupOpen: PropTypes.func, // Function to set popup open state
  setJRFCreationType: PropTypes.func, // Function to set JRF creation type
  setInwardBtnchange: PropTypes.func, // Function to handle inward button changes
  formData: PropTypes.object, // Form data, object type
  setSaveClicked: PropTypes.func, // Function to set save clicked state
  formConfig: PropTypes.object, // Configuration for the form, object type
  saveClicked: PropTypes.bool, // Boolean indicating if save was clicked
  setIsRejectPopupOpen: PropTypes.func, // Function to set reject popup open state
  viewOnly: PropTypes.bool, // Boolean to indicate view-only mode
  handleBackButtonFunction: PropTypes.func, // Function for handling back button
  setIsOverlayLoader: PropTypes.func // Function to set overlay loader state
};


export default ViewCheckListButtons;
