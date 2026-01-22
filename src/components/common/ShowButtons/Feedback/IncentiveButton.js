import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handleIncentiveCreateAndUpdate } from '../../commonHandlerFunction/Feedback/IncentiveHandler';
import { toast } from 'react-toastify';

const IncentiveButton = ({ formData, handleSubmit, setIsOverlayLoader, status, setFormData, viewOnly, editableIndex, setEditableIndex, setPopupAddPurchaseReq, setTableData }) => {
    const navigate = useNavigate();
    return (

        <div className="auditBtns">
            <Button
                type="button"
                className="cancelBtn"
                onClick={() => navigate("/incentivesList")}
            >
                Back
            </Button>
            {
                !viewOnly &&


                <>
                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={() =>
                            handleIncentiveCreateAndUpdate(
                                formData,
                                handleSubmit,
                                setIsOverlayLoader,
                                navigate,
                                0
                            )
                        }
                    >
                        Save
                    </Button>
                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={() => {
                            if (formData[0]?.incentive_jobcosting) {
                                handleIncentiveCreateAndUpdate(
                                    formData,
                                    handleSubmit,
                                    setIsOverlayLoader,
                                    navigate,
                                    1
                                )
                            }
                            else {
                                toast.error("You must have complete Job Costing Flow", {
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
                        }

                        }
                        // disabled={!formData[0]?.incentive_jobcosting}
                    >
                        <span>Post</span>
                    </Button>
                </>
            }



        </div>
    )
}

export default IncentiveButton
