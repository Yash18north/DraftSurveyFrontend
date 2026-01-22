import { toast } from "react-toastify";
import {
    deleteDataFromApi,
    getDataFromApi,
    postDataFromApi,
    putDataFromApi,
} from "../../../../../services/commonServices";
import {purchaseOrderDeleteApi, purchaseOrderUpdateApi, purchaseOrderCreateApi, purchaseOrderTableDataGetApi, purchaseOrderTableDataUpdateApi, purchaseOrderTableDataCreateApi, purchaseOrderTableDataDeleteApi } from "../../../../../services/api";

export const handleGetPurchaseOrderTableData = async (EditRecordId) => {
    let payload = {
        po_id: EditRecordId
    }
    let res = postDataFromApi(purchaseOrderTableDataGetApi , payload)
    if (res.data.status === 200) {
        setFormData((prevFormData) => {
            return {
                0:{
                    ...prevFormData[0],
                    ...res?.data?.data, 
                    description_of_item: res?.data?.data?.description_of_item,
                    qty: res?.data?.data?.qty,
                    unit: res?.data?.data?.unit,
                    size: res?.data?.data?.size,
                    unit_price: res?.data?.data?.unit_price,
                    disc: res?.data?.data?.disc,
                    price: res?.data?.data?.price,
                    total: res?.data?.data?.total,
                }
            };
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

export const handlePurchaseOrderTableDataCreateUpdate = async (
    formData,
    handleSubmit,
    setIsOverlayLoader,
    navigate,
    status
) => {
    
    try {
        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }

        let payloadData = {
            "pot_data": {
                
                description_of_item: formData[0]?.description_of_item,
                qty: formData[0]?.qty,
                unit: formData[0]?.unit,
                make_range: formData[0]?.make_range,
                model: formData[0]?.model,
                disc: formData[0]?.disc,
                price: formData[0]?.price,
                total: formData[0]?.total 
            }
        }
        let res


        if (formData[0].id) {
            payloadData?.pot_data?.pot_id = formData[0].id
            // payloadData.supplier_data.status = "posted"

            res = await putDataFromApi(purchaseOrderTableDataUpdateApi, payloadData)

        } else {
            res = await postDataFromApi(purchaseOrderTableDataCreateApi, payloadData);
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
            navigate("/purchase")

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

    }
}

export const handlePurchaseOrderTableDataDelete = async (
    formData,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    let deleteBody = {        
        pot_id: formData[0].pot_id,
    };
    let res = await deleteDataFromApi(purchaseOrderTableDataDeleteApi, deleteBody);
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