import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  changeTestReportStatusChange,
  handleIntarnalCertificateValidate,
} from "../commonHandlerFunction/intenralCertificateHandlerFunction";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { decryptDataForURL, encryptDataForURL } from "../../../utills/useCryptoUtils";
import { CommonTMRoles } from "../../../services/commonFunction";
import VerifyOTPModal from "../commonModalForms/VerifyOTPModal";
import { toast } from "react-toastify";

export const selectUser = (state) => state.user;
const InternalCertificateButtons = ({
  action,
  tabOpen,
  setIsPopupOpen,
  setJRFCreationType,
  setInwardBtnchange,
  formData,
  subTableData,
  jrfId,
  viewOnly,
  handleSubmit,
  remarkText,
  setSaveClicked,
  formConfig,
  saveClicked,
  setIsRejectPopupOpen,
  handleBackButtonFunction,
  setIsOverlayLoader,
  isValideValue,
}) => {
  const { t } = useTranslation();
  let user;
  const session = useSelector((state) => state.session);
  user = session.user;
  const [isCustomPopup, setIsCustomPopup] = useState(false);
  let navigate = useNavigate();
  const translate = t;
  const handleConfirm = () => {
    toast.success("Successfully Verified", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  return (
    <div className="submit_btns">
      <VerifyOTPModal isCustomPopup={isCustomPopup} setIsCustomPopup={setIsCustomPopup} handleConfirm={handleConfirm} />
      {action !== "view" ? (
        CommonTMRoles.includes(user?.role) ? (
          <React.Fragment>
            <Button
              type="button"
              className="cancelBtn"
              id="submit_btn3"
              onClick={() => {
                handleBackButtonFunction();
              }}
            >
              {translate("common.backBtn")}
            </Button>
            <Button
              type="button"
              className="saveBtn"
              id="submit_btn1"
              onClick={(e) =>
                navigate(
                  `/testReport/previewPDF/${encryptDataForURL(formData[0].ic_id)}` + "?ReferenceNo=" +
                  encryptDataForURL(formData[0]?.ic_refenence)
                )
              }
            >
              {translate("common.previewBtn")}
            </Button>
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
              onClick={(e) =>
                changeTestReportStatusChange(
                  formData[0].ic_id,
                  navigate,
                  formData[0]?.status === "pending"
                    ? "dtm-approved"
                    : "tm-approved",
                  "",
                  "",
                  null,
                  setIsPopupOpen,
                  setIsOverlayLoader
                )
                // setIsCustomPopup(true)
              }
            >
              {translate("common.acceptBtn")}
            </Button>
          </React.Fragment>
        ) : user?.role == "DTM" ? (
          <React.Fragment>
            <Button
              type="button"
              className="cancelBtn"
              id="submit_btn3"
              onClick={() => {
                handleBackButtonFunction();
              }}
            >
              {translate("common.backBtn")}
            </Button>
            <Button
              type="button"
              className="saveBtn"
              id="submit_btn1"
              onClick={(e) =>
                navigate(
                  `/testReport/previewPDF/${encryptDataForURL(formData[0].ic_id)}` + "?ReferenceNo=" +
                  encryptDataForURL(formData[0]?.ic_refenence)
                )
              }
            >
              {translate("common.previewBtn")}
            </Button>
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
              onClick={(e) =>
                changeTestReportStatusChange(
                  formData[0].ic_id,
                  navigate,
                  "dtm-approved",
                  "",
                  "",
                  null,
                  setIsPopupOpen,
                  setIsOverlayLoader
                )
              }
            >
              {translate("common.acceptBtn")}
            </Button>
          </React.Fragment>
        ) : formData?.[0]?.status === "tm-approved" ? (
          <React.Fragment>
            <Button
              type="button"
              className="cancelBtn"
              id="submit_btn3"
              onClick={() => {
                handleBackButtonFunction();
              }}
            >
              {translate("common.backBtn")}
            </Button>
            {formData?.[0]?.ic_id && (
              <Button
                type="button"
                className="saveBtn"
                id="submit_btn1"
                onClick={(e) =>
                  navigate(
                    `/testReport/previewPDF/${encryptDataForURL(formData[0].ic_id)}` + "?ReferenceNo=" +
                    encryptDataForURL(formData[0]?.ic_refenence)
                  )
                }
              >
                {translate("common.previewBtn")}
              </Button>
            )}
            <Button
              type="button"
              className="submitBtn"
              id="submit_btn1"
              onClick={(e) =>
                handleIntarnalCertificateValidate(
                  handleSubmit,
                  setIsPopupOpen,
                  setJRFCreationType,
                  "publish"
                )
              }
            >
              {translate("common.publishBtn")}
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button
              type="button"
              className="cancelBtn"
              id="submit_btn3"
              onClick={() => {
                handleBackButtonFunction();
              }}
            >
              {translate("common.backBtn")}
            </Button>
            <button
              type="button"
              className="saveBtn"
              id="submit_btn2"
              data-name="save"
              disabled={!isValideValue}
              onClick={(e) =>
                handleIntarnalCertificateValidate(
                  handleSubmit,
                  setIsPopupOpen,
                  setJRFCreationType,
                  "save"
                )
              }
            >
              {translate("common.saveBtn")}
            </button>
            {formData?.[0]?.ic_id && (
              <Button
                type="button"
                className="saveBtn"
                id="submit_btn1"
                onClick={(e) =>
                  navigate(
                    `/testReport/previewPDF/${encryptDataForURL(formData[0].ic_id)}` + "?ReferenceNo=" +
                    encryptDataForURL(formData[0]?.ic_refenence)
                  )
                }
              >
                {translate("common.previewBtn")}
              </Button>
            )}
            <Button
              type="button"
              className="submitBtn"
              id="submit_btn1"
              disabled={!isValideValue}
              onClick={(e) =>
                handleIntarnalCertificateValidate(
                  handleSubmit,
                  setIsPopupOpen,
                  setJRFCreationType,
                  "post"
                )
              }
            >
              {translate("common.postBtn")}
            </Button>
          </React.Fragment>
        )
      ) : (
        <React.Fragment>
          <Button
            type="button"
            className="cancelBtn"
            id="submit_btn3"
            onClick={() => {
              handleBackButtonFunction();
            }}
          >
            {translate("common.backBtn")}
          </Button>
          {formData?.[0]?.ic_id && (
            <Button
              type="button"
              className="saveBtn"
              id="submit_btn1"
              onClick={(e) =>
                navigate(
                  `/testReport/previewPDF/${encryptDataForURL(formData[0].ic_id)}` + "?ReferenceNo=" +
                  encryptDataForURL(formData[0]?.ic_refenence)
                )
              }
            >
              {translate("common.previewBtn")}
            </Button>
          )}
        </React.Fragment>
      )}
      {
        // ['LR'].includes(user?.role) && formData?.[0]?.ic_id &&
        (<Button
          type="button"
          className="saveBtn"
          id="submit_btn1"
          onClick={(e) =>
            navigate(
              `/testmemoList/testmemo?view=${encryptDataForURL(
                "view"
              )}&status=${encryptDataForURL(
                "testMemo"
              )}&testMemoId=${encryptDataForURL(formData[0]?.["fk_tmid"] || decryptDataForURL(params.get("testMemoId")))}`
            )
          }
        >
          View Test Memo
        </Button>)
      }
    </div>
  );
};

InternalCertificateButtons.propTypes = {
  action: PropTypes.string,
  tabOpen: PropTypes.bool,
  setIsPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  setInwardBtnchange: PropTypes.func,
  formData: PropTypes.object,
  subTableData: PropTypes.arrayOf(PropTypes.object),
  jrfId: PropTypes.string,
  viewOnly: PropTypes.bool,
  handleSubmit: PropTypes.func,
  remarkText: PropTypes.string,
  setSaveClicked: PropTypes.func,
  formConfig: PropTypes.object,
  saveClicked: PropTypes.bool,
  setIsRejectPopupOpen: PropTypes.func,
  handleBackButtonFunction: PropTypes.func,
  setIsOverlayLoader: PropTypes.func,
  isValideValue: PropTypes.bool,
};

export default InternalCertificateButtons;