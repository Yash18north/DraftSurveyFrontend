import React, { useEffect, useState } from "react";
import {
    Row
} from "react-bootstrap";

import SFMFormulaFields from "../../../formJsonData/LMS/SFMCalculation.json";
import RenderFields from "../RenderFields";
import { toast } from "react-toastify";
import { getFormulaFieldData } from "../commonHandlerFunction/sfmHandlerFunctions";
import { formulaCreateapi } from "../../../services/api";
import { postDataFromApi } from "../../../services/commonServices";
import PropTypes from 'prop-types';

const SFMCalculationForm = ({ setIsCalculateOpen, allFormulaList }) => {
    const [isResultGenerated, setIsResultGenerated] = useState(false);
    const [customFormData, setCustomFormData] = useState({
        0: {
            result_data: '-'
        }
    });
    const [formulafieldsData, setFormulafieldsData] = useState([]);
    const handleClosePopup = () => {
        setIsCalculateOpen(false)
    }
    useEffect(() => {
        if (customFormData[0]?.calc_formula) {
            getFormulaFieldData(customFormData[0]?.calc_formula, setFormulafieldsData)
        }
    }, [customFormData[0]?.calc_formula])
    const getCustomCellValues = (cell) => {
        if (cell.name == "calc_formula") {
            cell.isCustomOptions = true;
            cell.customOptions = allFormulaList;
        }
        return cell;
    };
    const handleCalculationData = async () => {
        const payload = {}
        formulafieldsData.map((field) => {
            payload[field] = customFormData[0][field]
        })
        if (customFormData[0].calc_formula === undefined || customFormData[0].calc_formula === "") {
            toast.error("Formula Field is required", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        }
        for (let obj in payload) {
            if (
                payload[obj] === undefined ||
                payload[obj] === ""
            ) {
                toast.error(obj + " Field is required", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
                
            }
        }
        try {
            let bodaydata = {
                "f_id": customFormData[0].calc_formula,
                "data": payload
            }
            let res = await postDataFromApi(formulaCreateapi, bodaydata);
            if (res?.data?.status === 200) {
                setIsResultGenerated(true)
                setCustomFormData((prevData) => {
                    return {
                        ...prevData,
                        0: {
                            ...prevData[0],
                            'result_data': res?.data?.data ? parseFloat(res?.data?.data).toFixed(3) : 0,
                        },
                    };
                });
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                setIsResultGenerated(false)
                toast.success(res.data.message, {
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
        } catch (error) { setIsResultGenerated(false) }
    }
    const handleCopyResult = () => {
        let textField = document.createElement('textarea')
        textField.innerText = customFormData[0].result_data ? customFormData[0].result_data : 0
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        toast.success("Result Copied", {
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
    const onCustomChangeHandler = (indexNo, name, value) => {
        setCustomFormData((prevData) => {
            return {
                ...prevData,
                [indexNo]: {
                    ...prevData[indexNo],
                    [name]: value,
                },
            };
        });
    };
    return (
        <div className="popupSearchContainerBG">
            <div className="popupInwardModal popupWidthAdjustmentCalc">
                <div className="rejectSearchCross">
                    <button
                        onClick={handleClosePopup}
                        className="nonNativeButton2"
                        aria-label="Reject Button"
                    >
                        <i className="bi bi-x-lg h4"></i>
                    </button>
                </div>
                <Row className="autoWidthImportant">
                    <h2 className="modalHeader">Calculation Details</h2>
                    {SFMFormulaFields.fields.map((cell, cellIndex) => (
                        <div
                            className={"col-md-" + cell?.width}
                            key={"Modal-Header-" + cellIndex}
                        >
                            <RenderFields
                                field={getCustomCellValues(cell)}
                                sectionIndex={0}
                                fieldIndex={0 * 100 + cellIndex}
                                formData={customFormData}
                                handleFieldChange={onCustomChangeHandler}
                                renderTable={true}
                                tableIndex={0}
                                upperClass="popupUpperClass"
                            />
                        </div>
                    ))
                    }
                    {
                        formulafieldsData.map((cell, cellIndex) => (
                            <div
                                className={"col-md-" + 6}
                                key={"Modal-Header-" + cellIndex}
                            >
                                <RenderFields
                                    field={getCustomCellValues({
                                        "label": cell,
                                        "name": cell,
                                        "placeholder": cell,
                                        "type": "number",
                                        "required": true,
                                        "width": 6,
                                        "fieldWidth": 100,
                                    })}
                                    sectionIndex={0}
                                    fieldIndex={0 * 100 + cellIndex}
                                    formData={customFormData}
                                    handleFieldChange={onCustomChangeHandler}
                                    renderTable={true}
                                    tableIndex={0}
                                    upperClass="popupUpperClass"
                                />
                            </div>
                        ))
                    }
                    <div
                        className={"col-md-" + 6}
                    >
                        <RenderFields
                            field={getCustomCellValues({
                                "label": "Final Result",
                                "name": "result_data",
                                "placeholder": "Result",
                                "type": "label",
                                "required": true,
                                "width": 6,
                                "fieldWidth": 100,
                            })}
                            sectionIndex={0}
                            fieldIndex={0 * 100}
                            formData={customFormData}
                            handleFieldChange={onCustomChangeHandler}
                            renderTable={true}
                            tableIndex={0}
                            upperClass="popupUpperClass"
                        />
                    </div>
                </Row>
                <div className="popupInwardButtonsContainer">
                    <div className="popupSearchButtons">
                        {isResultGenerated && <button type="button" onClick={handleCopyResult}>
                            Copy
                        </button>}
                        <button type="button" onClick={handleCalculationData}
                        >
                            Generate Result
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
SFMCalculationForm.propTypes = {
    setIsCalculateOpen: PropTypes.func,
    allFormulaList: PropTypes.array
  };

SFMCalculationForm.propTypes = {
    setIsCalculateOpen: PropTypes.func,
    allFormulaList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string, // Adjust based on the actual type of id
            formula: PropTypes.string // Adjust based on the actual type of formula
        })
    )
};

export default SFMCalculationForm;
