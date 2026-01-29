import { toast } from "react-toastify";
import {
    deleteDataFromApi,
    getDataFromApi,
    postDataFromApi,
    putDataFromApi,
} from "../../../../../services/commonServices";
import { purchaseOrderTableDataDeleteApi, purchaseOrderGetApi, purchaseRequistionTableDataCreateApi, purchaseRequistionTableDataUpdateApi, purchaseRequistionTableDataDeleteApi, purchaseOrderDownload } from "../../../../../services/api";
import { handleGetPurchaseReq } from "./PurchaseRequsitionHandler";
import { handleGetPurchaseOrder } from "../PurchaseOrder/PurchaseOrderHandler";

export const handleGetPurchaseReqTableData = async (
    formData,
    setFormData,
    i
) => {

    let purchaseTableDataGetApi = purchaseOrderGetApi(formData.prd_id);

    let res = await getDataFromApi(purchaseTableDataGetApi)
    let updatedFormData = {};

    let item = res?.data?.data
    updatedFormData["prd_item_code_" + i] = item?.fk_item_id;
    updatedFormData["prd_item_code_text_" + i] = item?.item_details?.item_rm_code;
    updatedFormData["prd_id_" + i] = item.prd_id;
    updatedFormData["prd_item_description_" + i] = item.prd_item_description;
    updatedFormData["prd_quantity_" + i] = item.prd_quantity;
    updatedFormData["prd_uom_" + i] = item?.prd_uom;
    updatedFormData["prd_manufacture_time_" + i] = item?.prd_manufacture_time;
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
    updatedFormData["prd_additional_remark_" + i] = item?.prd_addtional_remark;
    updatedFormData["prd_specification_" + i] = item?.prd_item_specifications;

    if (res.data.status === 200) {

        setFormData((prevFormData) => {
            const updatedData = {
                ...prevFormData,
                0: {
                    ...prevFormData[0],

                },
                1: {
                    ...prevFormData[1],
                    ...updatedFormData,


                }
            };

            return updatedData;
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
}

export const handlePurchaseReqTableDataCreateUpdate = async (
    formData,
    handleSubmit,
    setIsOverlayLoader,
    navigate,
    status,
    setPopupAddPurchaseReq,
    setFormData,
    editableIndex,
    isUpdate,
    setEditableIndex,
    setTableData,
    tab,
    moduleType
) => {
    try {
        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }
        let prd_insurance_json = {}
        tab?.headers?.filter((field) => {
            if (field.isInsuranceField && field.type != "label") {
                prd_insurance_json = {
                    ...prd_insurance_json,
                    [field.name]: formData[1]?.[field.name + (isUpdate && ('_' + editableIndex) || '')] || "",
                }
            }
        });

        let payloadData = {
            fk_req: formData[0]?.["req_id" + (isUpdate && ('_' + editableIndex) || '')],
            fk_item_id: formData[1]?.["prd_item_code" + (isUpdate && ('_' + editableIndex) || '')],
            prd_item_description: formData[1]?.["prd_item_description" + (isUpdate && ('_' + editableIndex) || '')] || "",
            prd_quantity: Number(formData[1]?.["prd_quantity" + (isUpdate && ('_' + editableIndex) || '')]),
            prd_uom: formData[1]?.["prd_uom" + (isUpdate && ('_' + editableIndex) || '')],
            prd_manufacture_time: formData[1]?.["prd_manufacture_time" + (isUpdate && ('_' + editableIndex) || '')],
            prd_make: formData[1]?.["prd_make" + (isUpdate && ('_' + editableIndex) || '')] || 0,
            prd_tech_specification: formData[1]?.["prd_tech_specification" + (isUpdate && ('_' + editableIndex) || '')],
            prd_avg_monthly_consumption: Number(formData[1]?.["prd_avg_monthly_consumption" + (isUpdate && ('_' + editableIndex) || '')]),
            prd_buffer_stock: Number(formData[1]?.["prd_buffer_stock" + (isUpdate && ('_' + editableIndex) || '')]),
            prd_closing_stock: Number(formData[1]?.["prd_closing_stock" + (isUpdate && ('_' + editableIndex) || '')]),
            prd_consumption_per_day: Number(formData[1]?.["prd_consumption_per_day" + (isUpdate && ('_' + editableIndex) || '')]),
            prd_available_stock_days: Number(formData[1]?.["prd_available_stock_days" + (isUpdate && ('_' + editableIndex) || '')]),
            prd_requested_delivery_date: formData[1]?.["prd_requested_delivery_date" + (isUpdate && ('_' + editableIndex) || '')],
            prd_remark: formData[1]?.["prd_remark" + (isUpdate && ('_' + editableIndex) || '')] || "",
            prd_unit_price: isNaN(formData[1]?.["prd_unit_price" + (isUpdate ? `_${editableIndex}` : "")]) || formData[1]?.["prd_unit_price" + (isUpdate ? `_${editableIndex}` : "")] === ""
                ? "0"
                : Number(formData[1]?.["prd_unit_price" + (isUpdate ? `_${editableIndex}` : "")]).toString(),

            prd_price: isNaN(formData[1]?.["prd_price" + (isUpdate ? `_${editableIndex}` : "")]) || formData[1]?.["prd_price" + (isUpdate ? `_${editableIndex}` : "")] === ""
                ? "0"
                : Number(formData[1]?.["prd_price" + (isUpdate ? `_${editableIndex}` : "")]).toString(),

            prd_discount: isNaN(formData[1]?.["prd_discount" + (isUpdate ? `_${editableIndex}` : "")]) || formData[1]?.["prd_discount" + (isUpdate ? `_${editableIndex}` : "")] === ""
                ? "0"
                : Number(formData[1]?.["prd_discount" + (isUpdate ? `_${editableIndex}` : "")]).toString(),

            prd_total: isNaN(formData[1]?.["prd_total" + (isUpdate ? `_${editableIndex}` : "")]) || formData[1]?.["prd_total" + (isUpdate ? `_${editableIndex}` : "")] === ""
                ? "0"
                : Number(formData[1]?.["prd_total" + (isUpdate ? `_${editableIndex}` : "")]).toString(),
            prd_addtional_remark: formData[1]?.["prd_additional_remark" + (isUpdate && ('_' + editableIndex) || '')] || "",
            prd_item_specifications: formData[1]?.["prd_specification" + (isUpdate && ('_' + editableIndex) || '')] || "",
            prd_insurance_json: prd_insurance_json
        }
        let res
        let notRequired = [
            "fk_req",
            "prd_unit_price",
            "prd_price",
            "prd_total",
            "prd_discount",
            "prd_miscellaneous_item",
            "prd_addtional_remark",
            "prd_item_specification",
            "prd_tech_specification"
        ];
        // for (let obj in payloadData) {
        //     if (
        //         !notRequired.includes(obj) &&
        //         (payloadData[obj] === undefined ||
        //             payloadData[obj] === "" ||
        //             payloadData[obj].length === 0
        //         )
        //     ) {

        //         const field = tab?.headers?.filter((field) => {
        //             return field.name === obj;
        //         });
        //         let errLabel = field.length ? field[0].label : obj;
        //         let errorMsg = errLabel + "  required";
        //         toast.error(errorMsg, {
        //             position: "top-right",
        //             autoClose: 2000,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             draggable: true,
        //             progress: undefined,
        //             theme: "light",
        //         });
        //         return;
        //     }
        // }

        if (isUpdate) {

            let purchaseRequistionTableDataUpdateapi = purchaseRequistionTableDataUpdateApi(formData[1]?.['prd_id_' + editableIndex])
            res = await postDataFromApi(purchaseRequistionTableDataUpdateapi, payloadData)
        } else {
            res = await postDataFromApi(purchaseRequistionTableDataCreateApi, payloadData);
        }
        if (res?.data?.status === 200) {
            if (moduleType != "purchase") {
                handleGetPurchaseReq(formData[0]?.req_no, setFormData, setTableData, "")
            }

            setPopupAddPurchaseReq(false)
            setEditableIndex("")
            setFormData((prevData) => {
                let updatedFormData = {}
                updatedFormData["prd_id"] = '';
                updatedFormData["prd_item_code"] = '';
                updatedFormData["prd_item_description"] = '';
                updatedFormData["prd_quantity"] = '';
                updatedFormData["prd_uom"] = '';
                updatedFormData["prd_manufacture_time"] = '';
                updatedFormData["prd_tech_specification"] = '';
                updatedFormData["prd_avg_monthly_consumption"] = '';
                updatedFormData["prd_buffer_stock"] = '';
                updatedFormData["prd_closing_stock"] = '';
                updatedFormData["prd_consumption_per_day"] = '';
                updatedFormData["prd_available_stock_days"] = '';
                updatedFormData["prd_requested_delivery_date"] = '';
                updatedFormData["prd_remark"] = '';
                updatedFormData["prd_miscellaneous_items"] = '';
                updatedFormData["prd_additional_remark"] = "";
                updatedFormData["prd_specification"] = "";
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
    catch (ex) {
        // console.log('ex--', ex)
    }
}

export const handlePurchaseReqTableDataDelete = async (
    formData,
    setIsPopupOpen,
    setEditableIndex,
    indexNo,
    setFormData,
    setTableData,
    moduleType
) => {


    let purchaseTableDataDeleteApi = purchaseRequistionTableDataDeleteApi(formData[1]['prd_id_' + indexNo]);
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

        if (moduleType === "purchase") {
            handleGetPurchaseOrder(formData[0]?.po_id, setFormData, setTableData, "", "")
        }
        else {
            handleGetPurchaseReq(formData[0]?.req_no, setFormData, setTableData)
        }

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

// useEffect(() => {
//   const gst = formData[1]?.po_gst;
//   const amt = parseFloat(formData[1]?.po_total_amt);

//   if (gst === "") {
//     // 🔄 Explicitly clear po_total_gst if GST is empty
//     setFormData((prev) => ({
//       ...prev,
//       [1]: {
//         ...prev[1],
//         po_total_gst: "",
//       },
//     }));
//     return;
//   }

//   if (!isNaN(gst) && !isNaN(amt)) {
//     const gstAmount = (amt * gst) / 100;
//     const totalWithGST = (amt + gstAmount).toFixed(2);

//     setFormData((prev) => ({
//       ...prev,
//       [1]: {
//         ...prev[1],
//         po_total_gst: totalWithGST,
//       },
//     }));
//   }
// }, [formData[1]?.po_gst]);


export const calculateTotalGST = (totalAmt, gstPercentage, setFormData) => {
    // console.log("objectgst",gstPercentage)
    if (gstPercentage === "") {
        setFormData((prev) => ({
            ...prev,
            [1]: {
                ...prev[1],
                po_total_gst: "",
            },
        }));
        return;
    }

    const amt = parseFloat(totalAmt);
    const gst = parseFloat(gstPercentage);

    if (!isNaN(amt) && !isNaN(gst)) {
        const gstAmount = (amt * gst) / 100;
        const totalWithGST = (amt + gstAmount).toFixed(2);

        setFormData((prev) => ({
            ...prev,
            [1]: {
                ...prev[1],
                po_total_gst: totalWithGST,
            },
        }));
    }
};


