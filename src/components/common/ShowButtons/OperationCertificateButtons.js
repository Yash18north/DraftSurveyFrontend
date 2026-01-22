import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { getLMSOperationActivity, getOperationActivityUrl, getVesselOperation } from "../../../services/commonFunction";
import ConfirmationModal from "../ConfirmationModal";
const OperationCertificateButtons = ({
  status,
  moduleSubType,
  RPCID,
  encryptDataForURL,
  EditRecordId,
  JISID,
  previewCertificate,
  generateCertificate,
  isValideValue,
  handleShareFile,
  EditGeneratedCertificate,
  OperationType,
  resendShareFile = false,
  operationMode,
  isCustomMode,
  setUploadPopup,
  setPopupType, formData
}) => {
  const { t } = useTranslation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const translate = t;
  let navigate = useNavigate();
  const handleConfirm = (isWeighted) => {
    if (status === "Edit") {
      EditGeneratedCertificate("posted", "", isWeighted)
    }
    else {
      generateCertificate(status, "posted", "", "", isWeighted)
    }
    setIsConfirmOpen(false)
  }
  return isCustomMode ? <>
    <div className="submit_btns">
      <button
        onClick={() => { navigate(-1);}}
        className="cancelBtn"
        type="button"
      >
        Back
      </button>
      {
        !formData[0]?.cc_id && (<button
          className="saveBtn compBtn"
          type="button"
          onClick={() => generateCertificate("uploadedDocument", "saved", 1)}
          disabled={!isValideValue}
        >
          Generate
        </button>)
      }

      {formData[0]?.cc_id && <button
        className="submitBtn compBtn"
        type="button"
        onClick={() => {
          setPopupType("Upload")
          setUploadPopup(true)
        }}
      >
        Upload
      </button>}
    </div>
  </> : (
    <>
      <div className="submit_btns">
        {status !== "Edit" && moduleSubType !== "ShareFiles" && (
          <button
            onClick={() => {
              const redirectUrl = getOperationActivityUrl(operationMode)
              !getLMSOperationActivity().includes(OperationType) ?
                // navigate(
                //   `/operation/vessel-ji-list/vessel-list/${encryptDataForURL(EditRecordId)}`
                // )
                navigate(-1)
                : navigate(
                  `${redirectUrl}confirugation-certificate-list/${encryptDataForURL(EditRecordId)}/${encryptDataForURL(JISID)}?OperationType=${encryptDataForURL(OperationType)}`+ "&operationMode=" + encryptDataForURL(operationMode)
                )

            }}
            className="cancelBtn"
            type="button"
          >
            Back
          </button>
        )}
        {status === "approve" && (
          <button
            className="submitBtn"
            type="button"
            onClick={() => previewCertificate(RPCID)}
          >
            Preview
          </button>
        )}

        {status !== "approve" &&
          status !== "Edit" &&
          moduleSubType !== "ShareFiles" && (
            <>
              <button
                className="saveBtn compBtn"
                type="button"
                onClick={() => generateCertificate(status, "saved")}
                disabled={!isValideValue}
              >
                Save
              </button>
              <button
                className="submitBtn compBtn"
                type="button"
                onClick={() => {
                  // if (OperationType === getVesselOperation('DS')) {
                  //   setIsConfirmOpen(true)
                  // }
                  // else {
                    generateCertificate(status, "posted")
                  // }
                }}
                disabled={!isValideValue}
              >
                Generate
              </button>
            </>
          )}
        {moduleSubType === "ShareFiles" && (
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="cancelBtn"
            type="button"
          >
            Back
          </button>
        )}
        {moduleSubType === "ShareFiles" && (

          resendShareFile ?
            <button
              className="submitBtn"
              type="button"
              onClick={() => handleShareFile(true)}
            >
              Resend
            </button> : <button
              className={"submitBtn " + (!isValideValue && "")}
              type="button"
              // disabled={!isValideValue}
              onClick={(e) => {
                handleShareFile();
                // setTimeout(() => {
                //   e.target.blur();
                // }, 3000);
              }}
            >
              Share File
            </button>

        )}

        {status === "Edit" && (
          <>

            <button
              onClick={() => {
                navigate("/operation/commercial-certificate-list");
              }}
              className="cancelBtn"
              type="button"
            >
              Back
            </button>
            <button
              className="saveBtn"
              type="button"
              onClick={() => EditGeneratedCertificate("saved")}
            >
              Save
            </button>
            <button
              className="submitBtn"
              type="button"
              // onClick={() => EditGeneratedCertificate("posted")}
              onClick={() => {
                // if (OperationType === getVesselOperation('DS')) {
                //   setIsConfirmOpen(true)
                // }
                // else {
                  EditGeneratedCertificate("posted")
                // }

              }}
            // disabled={isValideValue}
            >
              Generate
            </button>
          </>
        )}
      </div>
      <ConfirmationModal isOpen={isConfirmOpen} handleClose={() => handleConfirm()} handleConfirm={() => handleConfirm(true)} popupMessage={"Do you want to generate it with a weighted certificate?"} popupHeading={"Weighted Certificate"} popbuttons={{ no: "No", yes: "Yes" }} setPopupClose={setIsConfirmOpen} />
    </>
  );
};


OperationCertificateButtons.propTypes = {
  setIsPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleBackButtonFunction: PropTypes.func,
  viewOnly: PropTypes.bool,
};

export default OperationCertificateButtons;