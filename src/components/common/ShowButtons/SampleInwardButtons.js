import React from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { handleInward } from "../commonHandlerFunction/sampleInwardHandlerFunctions";
import PropTypes from "prop-types";

const SampleInwardButtons = ({
  action,
  tabOpen,
  setIsPopupOpen,
  setJRFCreationType,
  setInwardBtnchange,
  formData,
  subTableData,
  jrfId,
  viewOnly,
  handleBackButtonFunction
}) => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const translate = t;
  let disableBtn = subTableData.length === 0
  if (formData[0].jrf_is_ops) {
    disableBtn = formData[0]?.sample_detail_data && subTableData.length !== formData[0]?.sample_detail_data?.length
  }
  return (
    <div className="submit_btns">
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
      {action !== "View" && tabOpen ? (
        <React.Fragment>

          {(formData[0]?.smpl_status !== "created" &&
            formData[0]?.smpl_status !== "saved") ? null : (
            <>
              <button
                type="button"
                className="saveBtn"
                id="submit_btn2"
                data-name="save"
                onClick={(e) =>
                  handleInward(
                    "save",
                    formData,
                    navigate,
                    setIsPopupOpen,
                    setInwardBtnchange,
                    jrfId,
                    ""
                  )
                }
                disabled={
                  disableBtn ||
                  (formData[0]?.smpl_status !== "created" &&
                    formData[0]?.smpl_status !== "saved")
                }
              >
                {translate("common.saveBtn")}
              </button>
              <Button
                type="button"
                className="submitBtn"
                id="submit_btn1"
                onClick={(e) =>
                  handleInward(
                    "post",
                    formData,
                    navigate,
                    setIsPopupOpen,
                    setInwardBtnchange,
                    jrfId,
                    ""
                  )
                }
                disabled={
                  disableBtn ||
                  (formData[0]?.smpl_status !== "created" &&
                    formData[0]?.smpl_status !== "saved")
                }
              >
                {translate("common.postBtn")}
              </Button>
            </>
          )}
          {subTableData.length !== 0 && <Button
            type="button"
            className="submitBtn"
            id="submit_btn1"
            disabled={disableBtn}
            onClick={(e) =>
              handleInward(
                "assignment",
                formData,
                navigate,
                setIsPopupOpen,
                setInwardBtnchange,
                jrfId,
                ""
              )
            }
          >
            {translate("common.assignmentBtn")}
          </Button>}
        </React.Fragment>
      ) : (
        <span></span>
      )}
    </div>
  );
};

SampleInwardButtons.propTypes = {
  action: PropTypes.string.isRequired,
  tabOpen: PropTypes.bool.isRequired,
  setIsPopupOpen: PropTypes.func.isRequired,
  setJRFCreationType: PropTypes.func.isRequired,
  setInwardBtnchange: PropTypes.func.isRequired,
  handleBackButtonFunction: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  subTableData: PropTypes.array.isRequired,
  jrfId: PropTypes.string.isRequired,
  viewOnly: PropTypes.bool.isRequired,
};

export default SampleInwardButtons;