import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import React from "react";
import PropTypes from "prop-types";
import { vesselListBackFunctionality } from "../../commonHandlerFunction/operations/TMLOperations";
const JIButtons = ({
  formData,
  subTableData,
  testMemoSetData,
  operationStepNo,
  OperationType,
  parameterDataTableMain,
}) => {
  const { t } = useTranslation();


  return (
    <div className="submit_btns">
      <button>
        Next
      </button>
    </div>
  );
};

JIButtons.propTypes = {
  action: PropTypes.func, // Function for handling actions
  tabOpen: PropTypes.bool, // Boolean to indicate if a tab is open
  setIsPopupOpen: PropTypes.func, // Function to set popup open state
  setJRFCreationType: PropTypes.func, // Function to set JRF creation type
  setInwardBtnchange: PropTypes.func, // Function to handle inward button changes
  formData: PropTypes.object, // Form data, object type
  subTableData: PropTypes.array, // Array of sub-table data
  EditRecordId: PropTypes.any, // ID of the record being edited; use 'any' or specify type if known
  viewOnly: PropTypes.bool, // Boolean to indicate view-only mode
  handleBackButtonFunction: PropTypes.func, // Function for handling back button
  navigate: PropTypes.func, // Function for navigation
  editReordType: PropTypes.string, // Type of record being edited, string type
  setJrfCreationType: PropTypes.func, // Function to set JRF creation type
  handleSubmit: PropTypes.func, // Function to handle form submission
  formConfig: PropTypes.object, // Configuration for the form
  setIsOverlayLoader: PropTypes.func, // Function to set overlay loader state
  setIsRejectPopupOpen: PropTypes.func, // Function to set reject popup open state
  useForComponent: PropTypes.string, // String to specify use for component
  activeTab: PropTypes.string, // String to indicate the active tab
  setActiveTab: PropTypes.func, // Function to set active tab
  testMemoSetData: PropTypes.object, // Object containing test memo data
  isDisplayNewAddOption: PropTypes.bool, // Boolean to control display of new add option
};

export default JIButtons;
