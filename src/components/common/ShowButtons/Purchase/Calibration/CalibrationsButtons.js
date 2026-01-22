import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { handleCalibrationCreateUpdate } from '../../../commonHandlerFunction/Purchase/Calibration/CalibrationHandler'
const CalibrationsButtons = ({
    formData,
    handleSubmit,
    setIsOverlayLoader,
    setFormData,
    viewOnly
}) => {
    const navigate = useNavigate()
    return (
        <div className="auditBtns">
            <Button
                type="button"
                className="cancelBtn"
                onClick={() => navigate("/calibrationList")}
            >
                Back
            </Button>

            {/* // formData[0]?.id ?
                        // <Button
                    type="button"
                    className="submitBtn"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Post
                </Button>
                        // : */}
            {!viewOnly && <>
                
                <Button
                    type="button"
                    className="submitBtn"
                    onClick={() =>
                        handleCalibrationCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate, 0)
                    }
                >
                    Save
                </Button>
                <Button
                    type="button"
                    className="saveBtn"
                    onClick={() =>
                        handleCalibrationCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate, 1)
                    }
                >
                    Post
                </Button>

            </>}



        </div>
    )
}

export default CalibrationsButtons