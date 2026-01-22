import React, { useEffect, useRef, useState } from 'react'
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { handleDownloadPO, handlePurchaseOrderCreateUpdate } from '../../../commonHandlerFunction/Purchase/PurchaseOrder/PurchaseOrderHandler';
import CustomPopupModal from '../../../commonModalForms/CustomPopupModal';
import { decryptDataForURL, encryptDataForURL } from '../../../../../utills/useCryptoUtils';

const PurchaseButtons = ({ formData, handleSubmit, setIsOverlayLoader, status, setFormData, viewOnly, editableIndex, setEditableIndex, setPopupAddPurchaseReq, setTableData, section, setIsRejectPopupOpen, moduleType }) => {


    let navigate = useNavigate();
    const [isCustomPopup, setIsCustomPopup] = useState(false);
    const [isPreClosed, setIsPreClosed] = useState(false);
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const actionType = decryptDataForURL(params.get("action"));

    const handleCustomConfirmHandler = () => {
        const status = isPreClosed ? 5 : 2
        handlePurchaseOrderCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate, status, setFormData, "", setTableData, 1)
    }
    return (
        <div className="auditBtns">
            <Button
                type="button"
                className="cancelBtn"
                onClick={() => navigate("/purchase")}
            >
                Back
            </Button>

            {
                moduleType === "PoPreview" && !viewOnly && (
                    <>
                        <Button
                            type="button"
                            className="submitBtn"
                            onClick={() => {
                                // const isValidate = handleSubmit();
                                // if (!isValidate) {
                                //     return false;
                                // }
                                setIsPreClosed(false)
                                setIsCustomPopup(true);
                            }}
                        >
                            Post
                        </Button>
                        <Button
                            type="button"
                            className="submitBtn"
                            onClick={() => {
                                // const isValidate = handleSubmit();
                                // if (!isValidate) {
                                //     return false;
                                // }
                                setIsPreClosed(true)
                                setIsCustomPopup(true);
                            }}
                        >
                            Pre Close
                        </Button>
                    </>
                )}

            {!viewOnly && formData[0].po_status === "Saved" && moduleType === "purchase" &&
                <>

                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={() =>

                            handlePurchaseOrderCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate, 1, setFormData, "", setTableData, 1)
                        }
                    >
                        Save
                    </Button>
                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={() => {
                            handlePurchaseOrderCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate, 1, setFormData, "", setTableData, 1, '', 1)

                        }
                        }
                    >
                        Preview PDF
                    </Button>





                </>
            }
            {actionType == "approve" &&
                <>

                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={(e) => setIsRejectPopupOpen(true)}
                    >
                        Reject
                    </Button>
                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={(e) =>

                            handlePurchaseOrderCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate, 4, setFormData, "", setTableData, 1)
                        }
                    >
                        Approve
                    </Button>
                </>
            }
            {
                isCustomPopup && <CustomPopupModal isCustomPopup={isCustomPopup} setIsCustomPopup={setIsCustomPopup} handleConfirm={() => handleCustomConfirmHandler()} formData={formData} setFormData={setFormData} section={section.customField} moduleType={moduleType} />
            }
        </div >
    )
}

export default PurchaseButtons