import { toast } from "react-toastify";
import {
    deleteDataFromApi,
    getDataFromApi,
    postDataFromApi,
    putDataFromApi,
} from "../../../../../services/commonServices";
import { itemsCreateApi, itemsDeleteApi, itemsGetApi, itemsnUpdateApi } from "../../../../../services/api";
import { decryptDataForURL } from "../../../../../utills/useCryptoUtils";
export const handleGetPurchaseItem = async (item_id, setFormData, setIsOverlayLoaders) => {
    try {
        setIsOverlayLoaders(true)
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.split("?")[1]);
        const action = decryptDataForURL(params.get("status"));
        let res = await getDataFromApi(itemsGetApi + '?item_id=' + item_id)

        if (res.data.status === 200) {
            if (action === "View") {
                res.data.data.fk_category_id=res.data.data?.category_details?.category_name
            }
            setFormData((prevFormData) => {
                return {
                    0: {
                        ...prevFormData[0],
                        ...res?.data?.data
                    },
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
    finally {
        setIsOverlayLoaders(false)
    }
}

export const handlePurchaseItemCreateUpdate = async (
    formData,
    handleSubmit,
    setIsOverlayLoader,
    navigate
) => {
    try {
        setIsOverlayLoader(true)
        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }
        let payloadData = formData[0]
        payloadData.fk_item_calibration_id=formData[0]?.fk_calibration_id
        let res


        if (formData[0].item_id) {
            res = await postDataFromApi(itemsnUpdateApi + '?item_id=' + formData[0].item_id, payloadData)

        } else {
            res = await postDataFromApi(itemsCreateApi, payloadData);
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
            navigate("/itemlist")

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
    finally {
        setIsOverlayLoader(false)
    }
}

export const handlePurchaseItemDelete = async (
    item_id,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    try {
        let res = await deleteDataFromApi(itemsDeleteApi + '?item_id=' + item_id);
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
            getAllListingData();
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
    finally {
        setIsDelete(false);
        setPopupIndex(-1);
    }


}