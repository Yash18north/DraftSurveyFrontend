import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handlePurchaseItemCreateUpdate } from '../../../commonHandlerFunction/Purchase/Items/ItemsHandler';
import { handleCategoryCreateAndUpdate } from '../../../commonHandlerFunction/Purchase/Category/CategoryHandler';


const CategoryBtn = ({ formData, handleSubmit, setIsOverlayLoader, viewOnly, setFormData }) => {
    const navigate = useNavigate();
    return (

        <div className="auditBtns">
            <Button
                type="button"
                className="cancelBtn"
                onClick={() => navigate("/categorieslist")}
            >
                Back
            </Button>
            {
                !viewOnly && (
                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={() =>
                            handleCategoryCreateAndUpdate(formData, handleSubmit, setFormData, setIsOverlayLoader, navigate)
                        }
                    >
                        {formData[0]?.category_id ?"Update":"Create"} 
                    </Button>
                )
            }

            

        </div>
    )
}

export default CategoryBtn
