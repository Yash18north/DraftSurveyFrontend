import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handleChemicalStocksCreateAndUpdate } from '../../commonHandlerFunction/ChemicalStocks/ChemicalstockHandler';
import { getPurchaseManager } from '../../../../services/commonFunction';

const ChemicalStocksButtons = ({ formData, handleSubmit, setIsOverlayLoader, status, setFormData, viewOnly, editableIndex, setEditableIndex, setPopupAddPurchaseReq, setTableData }) => {
    const navigate = useNavigate();
    return (

        <div className="auditBtns">
            <Button
                type="button"
                className="cancelBtn"
                onClick={() => navigate("/chemicalStocks")}
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
                            handleChemicalStocksCreateAndUpdate(
                                formData,
                                handleSubmit,
                                setIsOverlayLoader,
                                navigate,
                                formData[0]?.stock_status || 0
                            )
                        }
                    >
                        Save
                    </Button>
                    {getPurchaseManager('stocks', 'add') &&
                        <Button
                            type="button"
                            className="submitBtn"
                            onClick={() =>
                                handleChemicalStocksCreateAndUpdate(
                                    formData,
                                    handleSubmit,
                                    setIsOverlayLoader,
                                    navigate,
                                    1
                                )
                            }
                        >
                            Post
                        </Button>
                    }
                </>
            }



        </div>
    )
}

export default ChemicalStocksButtons
