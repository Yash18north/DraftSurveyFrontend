import React from 'react'
import { Card, CardBody, Col, Modal, Row } from 'react-bootstrap'
import RenderFields from './RenderFields'
import { handlePurchaseReqTableDataCreateUpdate } from './commonHandlerFunction/Purchase/PurchaseReq/PurchaseReqTableHandler'
import { decryptDataForURL } from '../../utills/useCryptoUtils'

const PopUpPurchaseReq = ({
    popupAddPurchaseReq,
    setPopupAddPurchaseReq,
    formData,
    handleFieldChange,
    formErrors,
    tab,
    sectionIndex,
    handleSubmit,
    setIsOverlayLoader,
    navigate,
    setFormData,
    editableIndex,
    setEditableIndex,
    setTableData,
    moduleType,
    tableData
}) => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const isInsurance = decryptDataForURL(params.get("isInsurance"));

    const cancelFormData = () => {
        let item = tableData[editableIndex]
        let updatedFormData = { ...formData }
        const i = editableIndex
        updatedFormData["prd_id_" + i] = item?.prd_id;
        updatedFormData["prd_item_code_" + i] = item?.fk_item_id;
        updatedFormData["prd_item_code_text_" + i] = item?.item_details?.item_rm_code;
        updatedFormData["prd_item_description_" + i] = item?.prd_item_description;
        updatedFormData["prd_quantity_" + i] = item?.prd_quantity;
        updatedFormData["prd_uom_" + i] = item?.prd_uom;
        updatedFormData["prd_manufacture_time_" + i] = item?.prd_manufacture_time;
        // updatedFormData["prd_make_" + i] = item?.prd_make;
        updatedFormData["prd_tech_specification_" + i] = item?.prd_tech_specification;
        updatedFormData["prd_avg_monthly_consumption_" + i] = item?.prd_avg_monthly_consumption;
        updatedFormData["prd_buffer_stock_" + i] = item?.prd_buffer_stock;
        updatedFormData["prd_closing_stock_" + i] = item?.prd_closing_stock;
        updatedFormData["prd_consumption_per_day_" + i] = item?.prd_consumption_per_day;
        updatedFormData["prd_available_stock_days_" + i] = item?.prd_available_stock_days;
        updatedFormData["prd_requested_delivery_date_" + i] = item?.prd_requested_delivery_date;
        updatedFormData["prd_remark_" + i] = item?.prd_remark;
        updatedFormData["prd_unit_price_" + i] = item?.prd_unit_price;
        updatedFormData["prd_price_" + i] = item?.prd_price;
        updatedFormData["prd_discount_" + i] = item?.prd_discount;
        updatedFormData["prd_total_" + i] = item?.prd_total;
        updatedFormData["prd_miscellaneous_items_" + i] = item?.prd_miscellaneous_item;
        updatedFormData["prd_additional_remark_" + i] = item?.prd_remark;
        updatedFormData["prd_specification_" + i] = item?.prd_item_specifications;
        let prd_insurance_json = {}
        if (item.prd_insurance_json) {
            prd_insurance_json = Object.fromEntries(
                Object.entries(item.prd_insurance_json).map(([key, value]) => [`${key}_${i}`, value])
            );
        }

        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                1: {
                    ...prevFormData[1],
                    ...updatedFormData,
                    ...prd_insurance_json
                },
            };
        });
        setPopupAddPurchaseReq(false)
        setEditableIndex("")
    }
    return (
        popupAddPurchaseReq &&
        <div className="popupSearchContainerBG">
            <div className="popupPurchaseModal">
                <Row className="autoWidthImportant">
                    <span className="purchaseModalHeader">Add Purchase Requistion</span>

                </Row>
                <div className="my-2 bg-white purchaseMainDiv">
                    <Card className="CardbodyPurchasePopUp">
                        <CardBody >
                            <Row className="autoWidthImportant ">
                                {tab?.headers?.map((field, fieldIndex) => {
                                    let viewOnlyField = false
                                    if (isInsurance) {
                                        viewOnlyField = !field.isInsuranceField
                                    }
                                    if (field.isInsuranceField && (moduleType === "purchaseReq" || formData?.[0]?.po_status != "Accept")) {
                                        return null
                                    }
                                    return (
                                        <div
                                            className={"col-md-" + (field.width || 6)}
                                            key={"Headers-" + fieldIndex}
                                        >

                                            <RenderFields
                                                field={{
                                                    ...field,
                                                    required: ["prd_tech_specification", "prd_specification"].includes(field.name) || field.isInsuranceField ? false : true,
                                                    type: field.isInsuranceField ? field.type : (field.name === "prd_requested_delivery_date" ? "date" : field.name === "prd_item_code" && moduleType === "purchaseReq" ? "DropDownWithLoadMore" :
                                                        ["prd_item_description", "prd_tech_specification", "prd_remark", "prd_uom", "prd_item_code_text", "prd_miscellaneous_items", "prd_specification", "prd_additional_remark"].includes(field.name) ? "text" : ['prd_manufacture_time'].includes(field.name) ? 'Time' : 'number'),
                                                    readOnly: viewOnlyField ? true : moduleType === "purchaseReq"
                                                        ? ["prd_item_description", "prd_uom"].includes(field.name)
                                                        : moduleType === "purchase" ? ["prd_item_code_text", "prd_item_description", "prd_uom", "prd_manufacture_time", "prd_price", "prd_total", "prd_specification"].includes(field.name) : false,
                                                    // maxLength: field.name === "prd_remark" ? 200 : undefined,
                                                    tooltip: field.name === "prd_remark" ? "Character limit 200" : `Enter ${field.label}`,
                                                    name: field.isInsuranceField && field.type === "label" ? field.name : (editableIndex !== "" ? field.name + '_' + editableIndex : field.name)

                                                }}
                                                required={true}
                                                // type={field.name === "prd_requested_delivery_date" ? "date" : field.name === "prd_item_code" ? "DropDownWithLoadMore" : field.name === "prd_tech_specification" ? "text" : "number"}
                                                sectionIndex={sectionIndex}
                                                fieldIndex={fieldIndex}
                                                formData={formData}
                                                handleFieldChange={handleFieldChange}
                                                formErrors={formErrors}
                                                upperClass="popupPurchaseUpperClass"
                                                customName={field.isInsuranceField && field.type === "label" ? field.name : (editableIndex !== "" ? field.name + '_' + editableIndex : field.name)}
                                            />

                                        </div>
                                    )
                                })}
                            </Row>


                        </CardBody>

                    </Card>
                    <div className="purchasePopupButtonRow">
                        <button
                            onClick={() => {
                                cancelFormData()


                            }}
                            className="cancelPurchaseBtn"
                        >
                            Cancel
                        </button>
                        <button

                            className="submitPurchaseBtn"
                            onClick={
                                (e) => {

                                    handlePurchaseReqTableDataCreateUpdate(
                                        formData,
                                        handleSubmit,
                                        setIsOverlayLoader,
                                        navigate,
                                        "status",
                                        setPopupAddPurchaseReq,
                                        setFormData,
                                        editableIndex,
                                        editableIndex !== "",
                                        setEditableIndex,
                                        setTableData,
                                        tab,
                                        moduleType === "purchase" ? "purchase" : ""
                                    )
                                }
                            }
                            type='button'
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopUpPurchaseReq