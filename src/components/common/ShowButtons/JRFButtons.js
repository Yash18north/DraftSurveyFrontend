import { Button, Card, CardBody, CardTitle } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  handleFormPost,
  handleFormSave,
  handleOPSJRFDeleteFunc,
} from "../commonHandlerFunction/JRFHandlerFunctions";
import React, { useState } from "react";
import PropTypes from 'prop-types';
import DeleteConfirmation from "../DeleteConfirmation";
import ConfirmationModal from "../ConfirmationModal";
const JRFButtons = ({ setIsPopupOpen, setJRFCreationType, handleSubmit, viewOnly, handleBackButtonFunction, setIsOverlayLoader, formData }) => {
  const { t } = useTranslation();
  const translate = t;
  const [isDelete, setIsDelete] = useState(false)
  const getPopupMesg = () => {
    return (<>
      <CardBody>
        <CardTitle tag="h5">
          Are you sure you want to delete this JRF record?
        </CardTitle>
        <CardTitle tag="h5">
          This action will also delete all associated groups and parameters. This cannot be undon.
        </CardTitle>
      </CardBody>
    </>)
  }
  const openDeletePopup = () => {
    let headingMsg = "Confirmation!";
    let titleMsg = "";
    headingMsg = "Confirmation!";
    titleMsg = "Are you sure you want to delete this JRF record? \n This action will also delete all associated groups and parameters. This cannot be undone.";
    return (
      // <DeleteConfirmation
      //   isOpen={isDelete}
      //   handleClose={setIsDelete}
      //   handleConfirm={() => handleOPSJRFDeleteFunc(formData[0]?.jrf_id, setIsOverlayLoader, handleBackButtonFunction)}
      //   popupMessage={titleMsg}
      //   popupHeading={headingMsg}
      //   actionType={"Delete"}
      // />
      <ConfirmationModal isOpen={isDelete} handleClose={() => setIsDelete(false)} handleConfirm={() => handleOPSJRFDeleteFunc(formData[0]?.jrf_id, setIsOverlayLoader, handleBackButtonFunction)} popupMessage={getPopupMesg()} popupHeading={headingMsg} popbuttons={{ no: "Cancel", yes: "Delete" }} />
    );
  };

  return (
    <div className="submit_btns">
      {
        isDelete && openDeletePopup()
      }
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
      {!viewOnly && (
        <React.Fragment>

          <button
            type="button"
            className="saveBtn"
            id="submit_btn2"
            data-name="save"
            onClick={(e) =>
              handleFormSave(
                e,
                handleSubmit,
                setIsPopupOpen,
                setJRFCreationType
              )
            }
          >
            {translate("common.saveBtn")}
          </button>
          <Button
            type="button"
            className="submitBtn"
            id="submit_btn1"
            onClick={(e) =>
              handleFormPost(
                e,
                handleSubmit,
                setJRFCreationType,
                setIsPopupOpen
              )
            }
          >
            {translate("common.postBtn")}
          </Button>
          {
            formData[0]?.jrf_status === "rejected" && formData[0]?.jrf_is_ops ?
              <Button
                type="button"
                className="submitBtn"
                id="submit_btn1"
                onClick={(e) =>
                  setIsDelete(true)
                }
              >
                Delete JRF
              </Button> : null
          }
        </React.Fragment>
      )}
    </div>
  );
};


JRFButtons.propTypes = {
  setIsPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleBackButtonFunction: PropTypes.func,
  viewOnly: PropTypes.bool,
};

export default JRFButtons;
