import { toast } from "react-toastify";
import {
    deleteDataFromApi,
    getDataFromApi,
    postDataFromApi,
    putDataFromApi,
} from "../../../../../services/commonServices";
import { purchaseOrderDeleteApi, purchaseOrderUpdateApi, purchaseOrderCreateApi, purchaseOrderGetApi, purchaseOrderGet_Api, purchaseOrderDownload } from "../../../../../services/api";
import { getFormatedDate } from "../../../../../services/commonFunction";
import { encryptDataForURL } from "../../../../../utills/useCryptoUtils";


export const handleGetPurchaseOrder = async (EditRecordId, setFormData, setTableData, viewOnly, status) => {

    let getApi = purchaseOrderGet_Api(EditRecordId)
    let res = await getDataFromApi(getApi)

    if (res?.data?.status === 200) {
        if (res.data.data.po_terms_conditions === null) {
            delete res.data.data.po_terms_conditions
        }

        setFormData((prevFormData) => {
            let updatedFormData = {};
            res.data.data.items.map((item, i) => {

                updatedFormData["prd_id_" + i] = item.prd_id;
                updatedFormData["prd_item_code_" + i] = item.fk_item_id;
                updatedFormData["prd_item_code_text_" + i] = item?.item_details?.item_rm_code;
                updatedFormData["prd_item_description_" + i] = item.prd_item_description;
                updatedFormData["prd_quantity_" + i] = item.prd_quantity;
                updatedFormData["prd_uom_" + i] = item.prd_uom;
                updatedFormData["prd_manufacture_time_" + i] = item.prd_manufacture_time;
                updatedFormData["prd_tech_specification_" + i] = item.prd_tech_specification;
                updatedFormData["prd_avg_monthly_consumption_" + i] = item.prd_avg_monthly_consumption;
                updatedFormData["prd_buffer_stock_" + i] = item.prd_buffer_stock;
                updatedFormData["prd_closing_stock_" + i] = item.prd_closing_stock;
                updatedFormData["prd_consumption_per_day_" + i] = item.prd_consumption_per_day;
                updatedFormData["prd_available_stock_days_" + i] = item.prd_available_stock_days;
                updatedFormData["prd_requested_delivery_date_" + i] = item.prd_requested_delivery_date;
                updatedFormData["prd_remark_" + i] = item.prd_remark;
                updatedFormData["prd_unit_price_" + i] = item.prd_unit_price;
                updatedFormData["prd_price_" + i] = item.prd_price;
                updatedFormData["prd_discount_" + i] = item.prd_discount;
                updatedFormData["prd_total_" + i] = item.prd_total;
                updatedFormData["prd_miscellaneous_items_" + i] = item?.prd_miscellaneous_item;
                // updatedFormData["prd_additional_remark_" + i] = item?.prd_addtional_remark;
                updatedFormData["prd_additional_remark_" + i] = item?.prd_remark;

                updatedFormData["prd_specification_" + i] = item?.prd_item_specifications;
                if (item.prd_insurance_json) {
                    Object.entries(item.prd_insurance_json).map(([key, value]) => {
                        updatedFormData[key + "_" + i] = value
                    })
                }

            })
            return {
                0: {
                    ...prevFormData[0],
                    ...res?.data?.data,
                    ...res?.data?.data?.po_vendor_json,
                    po_no: res.data.data?.po_number,
                    po_billing_address: res.data.data?.po_billing_address,
                    po_date: res.data.data?.po_date,
                    po_gst_no: res.data.data?.po_gst_no,
                    po_ship_to: status === "View" ? res.data.data?.po_ship_to_details?.cmp_name : res.data.data?.po_ship_to,
                    // po_to: res.data.data?.po_to,
                    po_category: res.data.data?.po_category,
                    fk_supplier_id: status === "View" ? res.data.data?.supplier_details?.sup_name : res.data.data?.fk_supplier_id,
                    po_quotation_no: res.data.data?.po_quotation_no,
                    po_quotation_date: res.data.data?.po_quotation_date,
                    po_req_no: res.data.data?.po_req_no,
                    po_requisition_date: res?.data?.data?.po_requisition_date.split("-").reverse().join("/"),
                    fk_req_id: res?.data?.data?.fk_req_id,
                    po_gst_type: res?.data?.data?.po_gst_type,
                    po_ship_address: res.data.data?.po_ship_address,
                    // po_delivery_address: res.data.data?.po_delivery_address,
                    po_delivery_date: res.data.data?.po_delivery_date,
                    po_payment_term: res.data.data?.po_payment_term,
                    // po_manufacture_time: res.data.data?.po_manufacture_time,

                    // po_payment_term:
                    // res?.data?.data?.po_payment_term === "advance" ? "Advance" :
                    //     res?.data?.data?.po_payment_term === "partially_advance" ? "Partially Advance" :
                    //         res?.data?.data?.po_payment_term === "credit_1_15" ? "1-15 Days Credit" :
                    //             res?.data?.data?.po_payment_term === "credit_15_30" ? "15-30 Days Credit" :
                    //                 res?.data?.data?.po_payment_term === "credit_30_45" ? "30-45 Days Credit" :
                    //                     res?.data?.data?.po_payment_term === "credit_45_60" ? "45-60 Days Credit" :
                    //                         res?.data?.data?.po_payment_term === "against_proforma_invoice" ? "Against Proforma Invoice" :
                    //                             res?.data?.data?.po_payment_term 
                    //                                 "",
                    // fk_supplier_id: viewOnly ? res?.data?.data?.supplier_details?.sup_name : res?.data?.data?.fk_supplier_id
                },
                1: {
                    ...prevFormData[1],
                    po_total_amt: res.data.data?.po_total_amount,
                    po_gst: res.data.data?.po_gst_amount,
                    po_total_gst: res.data.data?.po_total_gst,
                    po_ship_to: res.data.data?.po_ship_to,
                    fk_supplier_id: res.data.data?.fk_supplier_id,
                    ...updatedFormData
                }

            };
        });
        setTableData(res.data.data.items)
    }

    else {
        toast.error(res.message, {
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

export const handleGetPurchaseOrderTableData = async (
    formData,
    setFormData,
    i
) => {

    // let purchaseTableDataGetApi = purchaseOrderGetApi(formData.prd_id);

    // let res = await getDataFromApi(purchaseTableDataGetApi)
    let updatedFormData = {};
    // let item = res?.data?.data
    // updatedFormData["prd_id_" + i] = item.prd_id;
    // updatedFormData["prd_item_code_" + i] = item?.fk_item_id;
    // updatedFormData["prd_item_code_text_" + i] = item?.item_details?.item_rm_code;
    // updatedFormData["prd_item_description_" + i] = item.prd_item_description;
    // updatedFormData["prd_quantity_" + i] = item.prd_quantity;
    // updatedFormData["prd_uom_" + i] = item.prd_uom;
    // updatedFormData["prd_make_" + i] = item.prd_make;
    // updatedFormData["prd_manufacturing_time_" + i] = item.prd_manufacture_time;
    // updatedFormData["prd_tech_specification_" + i] = item.prd_tech_specification;
    // updatedFormData["prd_avg_monthly_consumption_" + i] = item.prd_avg_monthly_consumption;
    // updatedFormData["prd_buffer_stock_" + i] = item.prd_buffer_stock;
    // updatedFormData["prd_closing_stock_" + i] = item.prd_closing_stock;
    // updatedFormData["prd_consumption_per_day_" + i] = item.prd_consumption_per_day;
    // updatedFormData["prd_available_stock_days_" + i] = item.prd_available_stock_days;
    // updatedFormData["prd_requested_delivery_date_" + i] = item.prd_requested_delivery_date;
    // updatedFormData["prd_remark_" + i] = item.prd_remark;
    // updatedFormData["prd_unit_price_" + i] = item.prd_unit_price;
    // updatedFormData["prd_price_" + i] = item.prd_price;
    // updatedFormData["prd_discount_" + i] = item.prd_discount;
    // updatedFormData["prd_total_" + i] = item.prd_total;
    // updatedFormData["prd_miscellanous_items_" + i] = item?.prd_miscellanous_items;
    // updatedFormData["prd_additional_remark_" + i] = item?.prd_additional_remark;
    // updatedFormData["prd_specification_" + i] = item?.prd_specification;
    // if (res.data.status === 200) {
    //     setFormData((prevFormData) => {
    //         const updatedData = {
    //             ...prevFormData,
    //             0: {
    //                 ...prevFormData[0],

    //             },
    //             1: {
    //                 ...prevFormData[1],
    //                 ...updatedFormData,


    //             }
    //         };

    //         return updatedData;
    //     });
    // }
    // else {
    //     toast.error(res.message, {
    //         position: "top-right",
    //         autoClose: 2000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "light",
    //     });
    // }
}
export const handlePurchaseOrderCreateUpdate = async (
    formData,
    handleSubmit,
    setIsOverlayLoader,
    navigate,
    status,
    setFormData,
    EditRecordId,
    setSubTableData,
    isNavigate,
    remarkText,
    isPreview
) => {

    try {
        let payloadData = {
            //   po_number: formData[0]?.po_no,
            po_billing_address: formData[0]?.po_billing_address,
            po_date: formData[0]?.po_date,
            po_gst_no: formData[0]?.po_gst_no,
            po_to: formData[0]?.po_to,
            po_ship_to: formData[0]?.po_ship_to,
            po_quotation_no: formData[0]?.po_quotation_no,
            po_quotation_date: formData[0]?.po_quotation_date,
            po_req_no: formData[0]?.po_req_no,
            po_req_date: formData[0]?.po_req_date,
            // po_payment_term: formData[0]?.po_payment_term,
            po_gst_type: formData[0]?.po_gst_type,
            po_category: formData[0]?.po_category,
            po_delivery_date: formData[0]?.po_delivery_date,
            //  po_delivery_address: formData[0]?.po_delivery_address,
            po_ship_address: formData[0]?.po_ship_address,
            fk_req_id: formData[0]?.fk_req_id,
            fk_supplier_id: formData[0]?.fk_supplier_id,
            po_total_amount: formData[1]?.po_total_amt,
            po_gst_amount: formData[1]?.po_gst,
            po_total_gst: formData[1]?.po_total_gst,
            po_terms_conditions: formData[0]?.po_terms_conditions,
            po_payment_term: formData[0]?.po_payment_term,
            po_vendor_json: {
                po_vendor_id: formData[0]?.po_vendor_id,
                po_vendor_name: formData[0]?.po_vendor_name,
                po_vendor_type: formData[0]?.po_vendor_type,
                po_qty_ordered: formData[0]?.po_qty_ordered,
                po_qty_accepted: formData[0]?.po_qty_accepted,
                po_qty_accepted_under_deviation: formData[0]?.po_qty_accepted_under_deviation,
                po_qty_rejected: formData[0]?.po_qty_rejected,
                po_quality_rating: formData[0]?.po_quality_rating,
                po_item_targeted_date: formData[0]?.po_item_targeted_date,
                po_item_rcv_date: formData[0]?.po_item_rcv_date,
                po_delivery_days: formData[0]?.po_delivery_days,
                po_delivery_rating: formData[0]?.po_delivery_rating,
                po_discount_per: formData[0]?.po_discount_per,
                po_cost_rating_per: formData[0]?.po_cost_rating_per,
                po_comm_resp_rating: formData[0]?.po_comm_resp_rating,
                po_stock_avail_rating: formData[0]?.po_stock_avail_rating,
                po_vendor_rating: formData[0]?.po_vendor_rating,
                po_final_vendor_rating: formData[0]?.po_final_vendor_rating,
            }
            // po_manufacture_time: formData[0]?.po_manufacture_time
            // po_payment_term:
            // formData[0]?.po_payment_term === "Advance" ? "advance" :
            //     formData[0]?.po_payment_term === "Partially Advance" ? "partially_advance" :
            //         formData[0]?.po_payment_term === "Against Proforma Invoice" ? "against_proforma_invoice" :
            //             formData[0]?.po_payment_term === "Other" ? "other" :
            //                 formData[0]?.po_payment_term === "1-15 Days Credit" ? "credit_1_15" :
            //                     formData[0]?.po_payment_term === "15-30 Days Credit" ? "credit_15_30" :
            //                         formData[0]?.po_payment_term === "30-45 Days Credit" ? "credit_30_45" :
            //                             formData[0]?.po_payment_term === "45-60 Days Credit" ? "credit_45_60" :
            //                                 ""

        }
        const statuses = {
            1: "Saved",
            2: "Posted",
            3: "Reject",
            4: "Accept",
            5: "Pre-Close",
        }
        let res
        if ([2, 5].includes(status)) {
            payloadData.fk_approval_id = formData[0]?.fk_approval_id
            if (!payloadData.fk_approval_id) {
                toast.error("Please select approval user", {
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

        }
        else if (status === 3) {
            payloadData.fk_supplier_id = formData[1]?.fk_supplier_id
            payloadData.po_ship_to = formData[1]?.po_ship_to
            payloadData.po_reject_remark = remarkText
            // payloadData={
            //     po_reject_remark:remarkText,
            //     fk_req_id: formData[0]?.fk_req_id,
            // }
        }
        else if (status === 4) {
            payloadData.fk_supplier_id = formData[1]?.fk_supplier_id
            payloadData.po_ship_to = formData[1]?.po_ship_to
        }
        if (formData[0]?.po_id || formData[0]?.po_no) {
            const isValidate = handleSubmit();
            if (!isValidate) {
                return false;
            }

            payloadData.po_id = formData[0]?.po_id;
            payloadData.po_status = statuses?.[status] || ""

            const updateApi = purchaseOrderUpdateApi(formData[0]?.po_id);
            res = await postDataFromApi(updateApi, payloadData);

            if (res?.data?.status === 200) {
                handleGetPurchaseOrder(res.data.data.po_id, setFormData, setSubTableData, "");
            }
        } else {

            res = await postDataFromApi(purchaseOrderCreateApi, formData);

        }

        if (res?.data?.status === 200) {
            toast.success(res?.data?.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            if (isPreview) {
                navigate(`/purchase/purchaseForm/${encryptDataForURL(
                    formData[0]?.po_id
                )}/purchaseOrderPreview/${encryptDataForURL(
                    formData[0]?.po_id
                )}`)
                return
            }
            if (isNavigate) {
                navigate("/purchase")
            }


        } else {

            // toast.error(res.message, {
            //     position: "top-right",
            //     autoClose: 2000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            // });
        }
    }
    catch (ex) {
        // console.log("Purchase Order", ex)
    }
}

export const handlePurchaseOrderDelete = async (
    poId,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {


    let deletePurchaseOrder = purchaseOrderDeleteApi(poId)
    let res = await deleteDataFromApi(deletePurchaseOrder);
    if (res?.data?.status === 200) {
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
        toast.error(res.message, {
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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
}

export const handlePurchaseReqTableDataDelete = async (
    formData,
    setIsPopupOpen,
    setEditableIndex,
    indexNo,
    setFormData,
    setTableData
) => {
    let purchaseTableDataDeleteApi = purchaseOrderDeleteApi(formData[1]['prd_id_' + indexNo]);
    let res = await deleteDataFromApi(purchaseTableDataDeleteApi);
    if (res?.data?.status === 200) {
        setIsPopupOpen('')
        setEditableIndex('')
        setFormData((prevData) => {
            let updatedFormData = {}
            let i = indexNo
            updatedFormData["prd_id_" + i] = '';
            updatedFormData["prd_item_description_" + i] = '';
            updatedFormData["prd_quantity_" + i] = '';
            updatedFormData["prd_uom_" + i] = '';
            updatedFormData["prd_manufacture_time_" + i] = '';
            updatedFormData["prd_tech_specification_" + i] = '';
            updatedFormData["prd_avg_monthly_consumption_" + i] = '';
            updatedFormData["prd_buffer_stock_" + i] = '';
            updatedFormData["prd_closing_stock_" + i] = '';
            updatedFormData["prd_consumption_per_day_" + i] = '';
            updatedFormData["prd_available_stock_days_" + i] = '';
            updatedFormData["prd_requested_delivery_date_" + i] = '';
            updatedFormData["prd_remark_" + i] = '';
            return {
                ...prevData,
                0: {
                    ...prevData[0],

                },
                1: {
                    ...prevData[1],
                    ...updatedFormData,
                }
            }
        })
        handleGetPurchaseOrder(formData[0]?.po_no, setFormData, setTableData, "", "")
        // handleGetPurchaseOrderTableData(formData[0]?.po_no, setFormData, setTableData, "", "")
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
        toast.error(res.message, {
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

export const getCalculationsForPrice = (formData, index) => {
    const unitPrice = parseFloat(formData?.[`prd_unit_price_${index}`]) || 0;
    const discount = parseFloat(formData?.[`prd_discount_${index}`]) || 0;

    const price = unitPrice * (1 - discount / 100);
    return price.toFixed(2);
}

export const getCalculationsForTotal = (formData, setFormData) => {
    if (!formData[1]) return;

    const updatedFormData = formData[1];
    const updatedTotals = {};

    Object.keys(updatedFormData).forEach((key) => {
        if (key.startsWith("prd_price_")) {
            const index = key.split("_").pop();
            const unitPrice = parseFloat(updatedFormData[`prd_unit_price_${index}`]) || 0;
            const discount = parseFloat(updatedFormData[`prd_discount_${index}`]) || 0;
            const quantity = parseFloat(updatedFormData[`prd_quantity_${index}`]) || 0;
            const price = parseFloat(updatedFormData[`prd_price_${index}`]) || 0;

            const isValid = unitPrice > 0 && quantity > 0 && price > 0;

            if (isValid) {
                const total = price * quantity;
                // total.toFixed(2)
                updatedTotals[`prd_total_${index}`] = total.toFixed(2);
            }
            else {
                updatedTotals[`prd_total_${index}`] = 0;
            }
        }
    });
    if (Object.keys(updatedTotals).length > 0) {
        setFormData((prev) => ({
            ...prev,
            [1]: {
                ...prev[1],
                ...updatedTotals,
            },
        }));
    }
};

export const handleDownloadPO = async (poId, poNo,) => {
    try {
        let res;
        let payload = {
            "po_id": poId
        }
        res = await postDataFromApi(purchaseOrderDownload, payload, "", 1)
        if (res.data.status === 200) {
            let pdfDate = "PO" + poNo + "_" + getFormatedDate(new Date(), "", 1);
            const blob = new Blob([res.data], { type: "application/pdf" })
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = pdfDate + ".pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(res?.data?.message, {
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
        else {
            toast.error(res.message, {
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
    } catch (err) {
        console.log("err", err)
    }

}
