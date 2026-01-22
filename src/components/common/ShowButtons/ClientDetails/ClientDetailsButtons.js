import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handleClientCreateUpdate } from '../../commonHandlerFunction/MasterData/Users/userHandler';


const ClientDetailsButtons = ({ formData, handleSubmit, setIsOverlayLoader, viewOnly, setFormData }) => {

    const navigate = useNavigate();
    return (

        <div className="auditBtns">
            <Button
                type="button"
                className="cancelBtn"
                onClick={() => navigate("/collections/client-list")}
            >
                Back
            </Button>
            {
                !viewOnly && (
                    <Button
                        type="button"
                        className="submitBtn"
                        onClick={() =>
                            handleClientCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate)
                        }
                    >
                        Save
                    </Button>
                )
            }



        </div>
    )
}

export default ClientDetailsButtons
