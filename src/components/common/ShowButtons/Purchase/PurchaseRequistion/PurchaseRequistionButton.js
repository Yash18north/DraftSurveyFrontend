import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handlePurchaseReqUpdateCreate } from '../../../commonHandlerFunction/Purchase/PurchaseReq/PurchaseRequsitionHandler';
import CustomPopupModal from '../../../commonModalForms/CustomPopupModal';

const PurchaseRequistionButtons = (
    { formData, handleSubmit, setIsOverlayLoader, status, setFormData, viewOnly, editableIndex, setEditableIndex, setPopupAddPurchaseReq, setTableData, section, moduleType, setIsRejectPopupOpen }
) => {
    const [isCustomPopup, setIsCustomPopup] = useState(false);
    const handleCustomConfirmHandler = () => {
        handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 2, setFormData, setTableData, 1, "")
    }
    let navigate = useNavigate();
    return (
        <div className="auditBtns">
            {formData[0]?.req_no && <Button
                type="button"
                className="cancelBtn"
                onClick={() => navigate("/PurchRequistion")}
            >
                Back
            </Button>}


            {/* <>

           
                {

                    !viewOnly && formData[0]?.req_status !== "Posted" && formData[0]?.req_status != "Sent for Approval" && formData[0]?.req_status != "Approved" ?
                        <Button
                            type="button"
                            className="submitBtn"
                            onClick={() =>
                                handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 0, setFormData, setTableData, 1)
                            }
                        >
                            Save
                        </Button> : ""
                }

                {
                    !viewOnly && (
                        (formData[0].req_no || formData[0]?.items?.length)  && (formData[0]?.req_status === "Saved" )
                      ) ?
                        <Button
                            type="button"
                            className="submitBtn"
                            onClick={() =>
                                handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 1, setFormData, setTableData, 1)
                            }
                        >
                            Post
                        </Button> : ""
                }

                {
                    !viewOnly && formData[0]?.req_status == "Posted" &&
                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={() =>
                            handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 2, setFormData, setTableData, 1)
                        }
                    >
                        Send for Approval
                    </Button>
                }

                {
                    !viewOnly && formData[0]?.req_status === "Sent for Approval" &&
                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={() =>
                            handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 3, setFormData, setTableData, 1)
                        }
                    >
                        Approve
                    </Button>
                }
            </> */}

            <>
                {
                    !viewOnly && formData[0]?.items?.length > 0 && (
                        <>
                            {
                                !['Posted', 'Sent for Approval', 'Approved', 'Reject'].includes(formData[0]?.req_status) && (
                                    <Button
                                        type="button"
                                        className="submitBtn"
                                        onClick={() =>
                                            handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 0, setFormData, setTableData, 1, "")
                                        }
                                    >
                                        Save
                                    </Button>
                                )
                            }

                            {
                                (formData[0].req_no || formData[0]?.items?.length > 0) &&
                                ['Saved','Reject'].includes(formData[0]?.req_status) && (
                                    <Button
                                        type="button"
                                        className="submitBtn"
                                        onClick={() =>
                                            handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 1, setFormData, setTableData, 1, "")
                                            // setIsCustomPopup(true)
                                        }
                                    >
                                        Post
                                    </Button>
                                )
                            }

                            {
                                formData[0]?.req_status === "Posted" && (
                                    <Button
                                        type="button"
                                        className="submitBtn"
                                        onClick={() =>
                                            // handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 2, setFormData, setTableData, 1, "")
                                            setIsCustomPopup(true)
                                        }
                                    >
                                        Send for Approval
                                    </Button>
                                )
                            }

                            {
                                formData[0]?.req_status === "Sent for Approval" && (
                                    <>
                                        <Button
                                            type="button"
                                            className="submitBtn"
                                            onClick={(e) => setIsRejectPopupOpen(true)}
                                        // onClick={() =>
                                        //     handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 3, setFormData, setTableData, 1)
                                        // }
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            type="button"
                                            className="submitBtn"
                                            onClick={() =>
                                                handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 3, setFormData, setTableData, 1)
                                            }
                                        >
                                            Approve
                                        </Button>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </>
            {
                isCustomPopup && <CustomPopupModal isCustomPopup={isCustomPopup} setIsCustomPopup={setIsCustomPopup} handleConfirm={() => handleCustomConfirmHandler()} formData={formData} setFormData={setFormData} section={section.customField} moduleType={moduleType} />
            }

        </div>
    )
}

export default PurchaseRequistionButtons