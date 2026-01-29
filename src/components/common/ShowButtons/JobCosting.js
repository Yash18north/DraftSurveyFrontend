import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { encryptDataForURL } from '../../../utills/useCryptoUtils'

const JobCostingButton = ({
  status,
  formData,
  formConfig,
  setFormData,
  EditRecordId,
  setIsOverlayLoader,
  viewOnly,

}) => {

  const navigate = useNavigate()
  return (
    <div className="auditBtns">
      {/* Cancel Button - Always Visible */}
      <Button
        type="button"
        className="cancelBtn"
        onClick={() => {
          setFormData([]);
          navigate("/audit/job-costing-list");
        }}
      >
        Cancel
      </Button>


      {!viewOnly && (
        <>

          {formData[0]?.jc_status === "updated" && (
            <>

              {formData[0]?.jc_status !== "saved" && (
                <Button
                  type="button"
                  className="saveBtn"
                  onClick={() => {
                    // Job costing functionality removed
                  }}
                >
                  Save
                </Button>
              )}


              <Button
                type="button"
                className="submitBtn"
                onClick={() => {
                  // Job costing functionality removed
                }}
              >
                Post
              </Button>
            </>
          )}


          {formData[0]?.jc_status === "saved" && (
            <>
              <Button
                type="button"
                className="saveBtn"
                onClick={() => {
                  // Job costing functionality removed
                }}
              >
                Save
              </Button>
              <Button
                type="button"
                className="submitBtn"
                onClick={() => {
                  // Job costing functionality removed
                }}
              >
                Post
              </Button>
            </>
          )}
          {formData[0]?.fk_im_id?.im_invoiceurl && <Button
            type="button"
            className="submitBtn"
            // onClick={() => {
            //   navigate(
            //     `/operation/invoice-listing/invoice-preview/${encryptDataForURL(
            //       formData[0]?.["fk_im_id"]?.["im_id"]
            //     )}/${encryptDataForURL(
            //       formData[0]?.["fk_im_id"]?.["im_invoiceurl"]
            //     )}/${encryptDataForURL(
            //       formData[0]?.["fk_im_id"]?.["im_invoiceurl"]
            //     )}`
            //   );
            // }
            // }
            href={`/#/operation/invoice-listing/invoice-preview/${encryptDataForURL(
              formData[0]?.fk_im_id?.im_id
            )}/${encryptDataForURL(
              formData[0]?.fk_im_id?.im_invoiceurl
            )}/${encryptDataForURL(
              formData[0]?.fk_im_id?.im_invoiceurl
            )}`}
            as="a"
            target="_blank"
            rel="noopener noreferrer"
          >
            Preview
          </Button>}
        </>
      )}
    </div>
  );


}

export default JobCostingButton