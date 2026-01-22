import React from 'react'
import { Button } from "react-bootstrap";
import { handleCreateUpdateOutstanding } from '../../../commonHandlerFunction/Audit/OutStanding/OutStandingHandlerFunction';
import { useNavigate } from 'react-router-dom';

const OutStandingButtons = ({ formData, handleSubmit, setIsOverlayLoader, EditRecordId,viewOnly }) => {
  
  const navigate = useNavigate()
  return (
    <div className="auditBtns">
      <Button
        type="button"
        className="cancelBtn"
        onClick={() => {
          navigate("/audit/outstanding-list")
        }}
      >
        Back
      </Button>
      {!viewOnly && (
         <>
          <Button
              type="button"
              className="submitBtn"
              onClick={() => {

                handleCreateUpdateOutstanding(formData, handleSubmit, navigate,"posted")
                
              }}
            >
              Post
            </Button>
             {!formData[0]?.id && (
            <Button
              type="button"
              className="saveBtn"
              onClick={() => {
                handleCreateUpdateOutstanding(formData, handleSubmit, navigate,"saved")
                
              }}
            >
              Save
            </Button>
            )}
         </>
                 
        
      )}


    </div>
  )
}

export default OutStandingButtons
