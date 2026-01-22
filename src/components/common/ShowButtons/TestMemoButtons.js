import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { changeTestMEmoStatuChange } from "../commonHandlerFunction/testMemoFunctionHandler";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
const TestMemoButtons = ({
  setIsPopupOpen,
  setJRFCreationType,
  setInwardBtnchange,
  viewOnly,
  role,
  setIsRejectPopupOpen,
  testMemoId,
  pageType,
  handleBackButtonFunction,
  setIsOverlayLoader
}) => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const translate = t;
  const session = useSelector((state) => state.session);

  const user = session.user;
  return (
    <div className="submit_btns">
      {" "}
      <Button
        type="button"
        className="saveBtn"
        id="submit_btn3"
        onClick={() => {
          // handleBackButtonFunction();
          navigate(-1);
        }}
      >
        {translate("common.backBtn")}
      </Button>
      {!viewOnly &&
        (pageType == "verifytestresult" ? (
          <>
            <Button
              type="button"
              className="saveBtn"
              id="submit_btn1"
              onClick={(e) => setIsRejectPopupOpen(true)}
            >
              {translate("common.rejectBtn")}
            </Button>
            <Button
              type="button"
              className="submitBtn"
              id="submit_btn1"
              onClick={() => {
                // if (user?.all_roles?.main_role_id && user?.all_roles?.other_roles?.length) {
                //   changeTestMEmoStatuChange(testMemoId, navigate, "certified", '', setIsOverlayLoader, '', user, true)
                // }
                // else {
                  changeTestMEmoStatuChange(testMemoId, navigate, "verified", '', setIsOverlayLoader)
                // }
              }
              }
            >
              {translate("common.verifyBtn")}
            </Button>

          </>
        ) : pageType === "verifytestmemo" ? (
          <>
            <Button
              type="button"
              className="saveBtn"
              id="submit_btn1"
              onClick={(e) => setIsRejectPopupOpen(true)}
            >
              {translate("common.rejectBtn")}
            </Button>
            <Button
              type="button"
              className="submitBtn"
              id="submit_btn1"
              onClick={() =>
                changeTestMEmoStatuChange(testMemoId, navigate, "posted", '', setIsOverlayLoader, "", user)
              }
            >
              {translate("common.acceptBtn")}
            </Button>
          </>
        ) : pageType == "Edit" ? (
          <button
            type="button"
            className="submitBtn"
            id="submit_btn3"
            data-name="save"
            onClick={() => {
              setInwardBtnchange("reassign");
              setIsPopupOpen(true);
            }}
          >
            Reassign
          </button>
        ) : (
          <button
            type="button"
            className="submitBtn"
            id="submit_btn3"
            data-name="save"
            onClick={() => {
              setInwardBtnchange("sendToLab");
              setIsPopupOpen(true);
            }}
          >
            {translate("common.sendLabBtn")}
          </button>
        ))}
    </div>
  );
};
TestMemoButtons.propTypes = {
  setIsPopupOpen: PropTypes.func, // Function to set popup open state
  setJRFCreationType: PropTypes.func, // Function to set JRF creation type
  setInwardBtnchange: PropTypes.func, // Function to handle inward button changes
  viewOnly: PropTypes.bool, // Boolean to indicate view-only mode
  role: PropTypes.string, // Role of the user, string type
  setIsRejectPopupOpen: PropTypes.func, // Function to set reject popup open state
  testMemoId: PropTypes.any, // ID for the test memo; use 'any' or specify type if known
  pageType: PropTypes.string, // Type of the page, string type
  handleBackButtonFunction: PropTypes.func, // Function for handling back button
  setIsOverlayLoader: PropTypes.func // Function to set overlay loader state
};
export default TestMemoButtons;