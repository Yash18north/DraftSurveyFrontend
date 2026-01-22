import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { handlTenderCreateUpdate } from '../../commonHandlerFunction/Tender/TenderHandlerFunc'

const TenderButton = ({
  formData,
  handleSubmit,
  setIsOverlayLoader,
  setFormData,
  viewOnly,
  participantFields
}) => {
  const navigate = useNavigate()
  return (
    <div className="auditBtns">
      <Button
        type="button"
        className="cancelBtn"
        onClick={() => {
          navigate("/tenderList")
        }}
      >
        Back
      </Button>
      {!viewOnly &&
        <>
          <Button
            type="button"
            className="submitBtn"
            onClick={() => {
             
              handlTenderCreateUpdate(formData, handleSubmit, setIsOverlayLoader,navigate,"",participantFields)
              
            }}
          >
            Save
          </Button>

        </>}


    </div>
  )
}

export default TenderButton