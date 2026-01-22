import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  handleFormPost,
  handleFormSave,
} from "../commonHandlerFunction/JRFHandlerFunctions";
import React from "react";
import PropTypes from 'prop-types';
import { useNavigate, useParams } from "react-router-dom";

const CommercialCertificateButtons = ({
  useFor,
  status,
  ApproveCertificate,
  handlePublish,
  sendForApproval,
  IsPreviewUpload,
  setIsPreviewUpload,
  dailyReportInDocument,
  CCID,
  setIsRejectPopupOpen
}) => {
  const { t } = useTranslation();
  const translate = t;
  let navigate = useNavigate();
  return (
    <div className="submit_btns">
      <button
        className="cancelBtn"
        type="button"
        onClick={() => navigate("/operation/commercial-certificate-list")}
      >
        Back
      </button>
      {/* {
        useFor === "savedCertificate" && (<button
          className="submitBtn"
          type="button"
          onClick={() => ApproveCertificate("posted", 1)}
        >
          Generate
        </button>)
      } */}
      {(status === "approve" || status === "NonLMSApprove") && (
        <>
        <button
          className="submitBtn"
          type="button"
          onClick={() => ApproveCertificate()}
        >
          Approve
        </button>
        <button
          className="submitBtn"
          type="button"
          onClick={(e) => setIsRejectPopupOpen(true)}
        >
          Reject
        </button>
        </>
      )}

      {(status === "publish" || status === "NonLMSPublish") && (
        <button
          className="submitBtn"
          type="button"
          onClick={() => handlePublish()}
        >
          Publish
        </button>
      )}

      {(status === "posted" || status === "NonLMSPosted") && (
        <button
          className="submitBtn"
          type="button"
          onClick={() => sendForApproval()}
        >
          Send for Approval
        </button>
      )}

      {
        useFor === "daily_report" && (
          <button
            className="submitBtn"
            type="button"
            onClick={() => {
              if (!IsPreviewUpload) {
                setIsPreviewUpload(true);
              }
              else {
                dailyReportInDocument();
              }
            }
            }
          >
            Share Daily Report
          </button>
        )}
    </div>
  );
};


CommercialCertificateButtons.propTypes = {
  setIsPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleBackButtonFunction: PropTypes.func,
  viewOnly: PropTypes.bool,
};

export default CommercialCertificateButtons;
