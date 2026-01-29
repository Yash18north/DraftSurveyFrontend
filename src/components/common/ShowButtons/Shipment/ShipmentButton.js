import React from 'react'
import { Button } from "react-bootstrap";
// import { handleCreateUpdateSalesRegister } from '../../../commonHandlerFunction/Audit/SalesRegister/SalesRegisterHandlerFunction';
import { useNavigate } from 'react-router-dom';


const ShipmentButtons = ({ formData, handleSubmit, setIsOverlayLoader, EditRecordId, viewOnly }) => {
  let navigate = useNavigate();

  return (

    <div className="auditBtns">

      <Button
        type="button"
        className="cancelBtn"
        onClick={() => navigate("/audit/sales-register-list")}
      >
        Back
      </Button>


      {!viewOnly && (
        <>

          <Button
            type="button"
            className="submitBtn"
            onClick={() =>
              <></>
              // handleCreateUpdateSalesRegister(formData, handleSubmit, EditRecordId, navigate, "posted")
            }
          >
            Post
          </Button>

          {!formData[0]?.id && (
            <Button
              type="button"
              className="saveBtn"
              onClick={() =>
                <></>
                // handleCreateUpdateSalesRegister(formData, handleSubmit, setIsOverlayLoader, navigate,"saved")
              }
            >
              Save
            </Button>
          )}
        </>
      )}
    </div>

  )
}

export default ShipmentButtons
