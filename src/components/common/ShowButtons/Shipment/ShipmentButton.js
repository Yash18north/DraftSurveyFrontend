import React from 'react'
import { Button } from "react-bootstrap";
// import { handleCreateUpdateSalesRegister } from '../../../commonHandlerFunction/Audit/SalesRegister/SalesRegisterHandlerFunction';
import { useNavigate } from 'react-router-dom';
import { handleShipmentCreateAndUpdate } from '../../commonHandlerFunction/Shipment/ShipmentHandler';


const ShipmentButtons = ({ formData, handleSubmit, setIsOverlayLoader, EditRecordId, viewOnly }) => {
  let navigate = useNavigate();

  return (

    <div className="auditBtns">

      <Button
        type="button"
        className="cancelBtn"
        onClick={() => navigate("/shipment")}
      >
        Back
      </Button>


      {!viewOnly && (
        <>

          <Button
            type="button"
            className="submitBtn"
            onClick={() =>
              
               handleShipmentCreateAndUpdate(formData, handleSubmit, setIsOverlayLoader, navigate, "posted")
            }
          >
            Post
          </Button>

          {!formData[0]?.ship_id && (
            <Button
              type="button"
              className="saveBtn"
              onClick={() =>
                
                handleShipmentCreateAndUpdate(formData, handleSubmit, setIsOverlayLoader, navigate,"saved")
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
