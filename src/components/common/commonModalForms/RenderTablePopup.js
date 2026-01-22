import React, { useState } from "react";
import RenderFields from "../RenderFields";
import PropTypes from "prop-types";

import { Button, Row } from "react-bootstrap";
import OverlayLoading from "../OverlayLoading";
import { checkSampleIdAvailibility } from "../commonHandlerFunction/sampleInwardHandlerFunctions";
import { GetTenantDetails } from "../../../services/commonServices";
import { ToastContainer } from "react-toastify";
import { getLMSOperationActivity, getVesselOperation } from "../../../services/commonFunction";

const RenderTablePopup = ({
    section,
    sectionIndex,
    formData,
    handleFieldChange,
    formErrors,
    tableData,
    updatedMasterOptions,
    setPopupOpenAssignment,
    onActionHandleClick,
    actionName,
    handleCloseCustomPopup,
    editableIndex,
    isBtnclicked,
    isOverlayLoader,
    setIsOverlayLoader,
    getCustomCellValues,
    moduleType,
    operationStepNo,
    OperationType,
    allFieldDisabled,
    tabIndex
}) => {
    // const getCustomCellValues = (cell) => {
    //     return cell;
    // };
    const handleCustomFieldChange = (
        sectionIndex,
        fieldName,
        value,
        type = "",
        isChecked = ""
    ) => {
        handleFieldChange(sectionIndex, fieldName, value, type, isChecked);
    };
    const checkToShowField = (field) => {
        let isShowField = true;
        if (moduleType === "jobinstruction") {
            if (OperationType === getVesselOperation("SV")) {
                // if (tabIndex === 5) {
                //     const unLoadingFields = ['barge_detail_jetty_along_side', 'barge_detail_commence_discharge', 'barge_detail_completed_discharge', 'barge_detail_barge_cast_of']
                //     if (formData[sectionIndex]['barge_detail_type_' + (actionName === "Save" ? editableIndex : tableData.length)] === "Loading") {
                //         isShowField = !unLoadingFields.includes(field.name)
                //     }
                //     else {
                //         isShowField = !['barge_detail_dispatch_time','barge_detail_qty'].includes(field.name)
                //     }
                // }
            }
        }
        return isShowField
    }
    return (
        <div className="popupSearchContainerBG">

            <div className="popupInwardModal popupWidthAdjustmentInward">
                <div className="rejectSearchCross">
                    <button
                        onClick={handleCloseCustomPopup}
                        className="nonNativeButton2"
                        aria-label="Reject Button"
                        type="button"
                    >
                        <i className="bi bi-x-lg h4"></i>
                    </button>
                </div>

                {section.rows.map((row, rowIndex) => (
                    <Row className="autoWidthImportant">
                        <h2 className="modalHeader">{section?.label}</h2>
                        {isOverlayLoader && <OverlayLoading />}
                        {section.rows[0].map((cell, cellIndex) => {
                            let isShowField = checkToShowField(cell)
                            cell = {
                                ...cell,
                                label: section.headers?.find((header) => cell.name === header.name)?.label
                            }
                            if (['jobinstruction'].includes(moduleType)) {
                                if (actionName === "Save" && operationStepNo == 2 && getLMSOperationActivity().includes(OperationType)) {
                                    if (!["jism_quantity", "jism_truck_no"].includes(cell.name) && !(cell.isExternalJson)) {
                                        cell = {
                                            ...cell,
                                            readOnly: true,
                                            isDisabledField: true
                                        }
                                    }
                                    else {
                                        cell = {
                                            ...cell,
                                            readOnly: false,
                                            isDisabledField: false
                                        }
                                    }

                                }
                                if (cell.name === "jism_truck_no") {
                                    return null
                                }

                            }
                            cell.isDisabledField = cell.isDisabledField || allFieldDisabled
                            cell.readOnly = cell.readOnly || allFieldDisabled
                            return isShowField && (
                                <>
                                    <div
                                        className={"col-md-" + cell?.width}
                                        key={"Modal-Header-" + cellIndex}
                                    >
                                        <RenderFields
                                            field={getCustomCellValues(cell, actionName === "Save" ? editableIndex : tableData.length)}
                                            sectionIndex={sectionIndex}
                                            fieldIndex={rowIndex * 100 + cellIndex}
                                            formData={formData}
                                            handleFieldChange={handleCustomFieldChange}
                                            formErrors={formErrors} // Pass formErrors to RenderFields
                                            renderTable={true}
                                            tableIndex={rowIndex}
                                            customName={
                                                cell.name +
                                                "_" +
                                                (actionName === "Save" ? editableIndex : tableData.length)
                                            }
                                            masterOptions={updatedMasterOptions}
                                            upperClass="popupUpperClass"

                                        />
                                    </div>
                                </>
                            )
                        })}

                        {/* <>
                            <div className=" col-md-6 addBtnPurchaseReq" style={{ justifyContent: "end" }}>
                                <Button
                                    className="submitBtn addStickyBtn"

                                >
                                    +
                                </Button>
                            </div>
                        </> */}
                    </Row>
                ))}

                <div className="popupInwardButtonsContainer">
                    <div className="popupSearchButtons">
                        <button type="button" onClick={handleCloseCustomPopup}>
                            Cancel
                        </button>
                        {!allFieldDisabled && <button
                            type="button"
                            // disabled={isBtnclicked}
                            onClick={() => {
                                onActionHandleClick(actionName);
                            }}
                        >
                            Save
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    );
};
RenderTablePopup.propTypes = {
    section: PropTypes.object, // Adjust if you know the exact shape
    sectionIndex: PropTypes.number,
    formData: PropTypes.object, // Adjust if you know the exact shape
    handleFieldChange: PropTypes.func,
    formErrors: PropTypes.object, // Adjust if you know the exact shape
    tableData: PropTypes.array, // Adjust if you know the type of elements
    updatedMasterOptions: PropTypes.object, // Adjust if you know the exact shape
    setPopupOpenAssignment: PropTypes.func,
    onActionHandleClick: PropTypes.func,
    actionName: PropTypes.string, // Adjust if you expect different types
    handleCloseCustomPopup: PropTypes.func,
    editableIndex: PropTypes.number,
    isBtnclicked: PropTypes.bool,
    isOverlayLoader: PropTypes.bool,
    setIsOverlayLoader: PropTypes.func,
};
export default RenderTablePopup;
