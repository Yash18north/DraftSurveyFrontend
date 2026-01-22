import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handleFeedbackCreateAndUpdate } from '../../commonHandlerFunction/Feedback/FeedbackHandler';


const FeedbackButton = ({ formData, handleSubmit, setIsOverlayLoader, status, setFormData, viewOnly, editableIndex, setEditableIndex, setPopupAddPurchaseReq, setTableData, setActionClicked }) => {

    const navigate = useNavigate();
    return (

        <div className="auditBtns">
            <Button
                type="button"
                className="cancelBtn"
                onClick={() => {
                    setFormData((prevData) => {
                        return {
                            0: {}
                        }
                    })
                    setActionClicked(false)
                }
                }
            >
                Reset
            </Button>
            <Button
                type="button"
                className="submitBtn"
                onClick={() =>
                    handleFeedbackCreateAndUpdate(
                        formData,
                        handleSubmit,
                        setFormData,
                        setActionClicked
                    )
                }
            >
                Send
            </Button>
        </div>
    )
}

export default FeedbackButton
