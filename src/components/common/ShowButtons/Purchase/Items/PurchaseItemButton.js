import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handlePurchaseItemCreateUpdate } from '../../../commonHandlerFunction/Purchase/Items/ItemsHandler';


const PurchaseItemButton = ({ formData, handleSubmit, setIsOverlayLoader, viewOnly, setFormData }) => {

    const navigate = useNavigate();
    return (

        <div className="auditBtns">
            <Button
                type="button"
                className="cancelBtn"
                onClick={() => navigate("/itemlist")}
            >
                Back
            </Button>
            {
                !viewOnly && (
                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={() =>
                            handlePurchaseItemCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate)
                        }
                    >
                        Create
                    </Button>
                )
            }



        </div>
    )
}

export default PurchaseItemButton
