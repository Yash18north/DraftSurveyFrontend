import { toast } from "react-toastify";
import { deleteDataFromApi, GetTenantDetails, postDataFromApi, putDataFromApi } from "../../../../services/commonServices";
import { consortiumDeleteApi } from "../../../../services/api";
import { data } from "jquery";

export const handleConsortiumValidation = async (
    handleSubmit,
    setJRFCreationType,
    setIsPopupOpen,
    type
) => {
    let isValidate = handleSubmit();
    if (!isValidate) {
        return false;
    }
    setJRFCreationType(type);
    setIsPopupOpen(true);
};
export const handleConsortiumCreateOrUpdate = async (
    formData,
    formConfig,
    setIsOverlayLoader,
    setIsPopupOpen,
    type,
    navigate,
    getSingleConsortiumRecord,
    setFormData
) => {
    let payloadData = {
        co_name: formData[0].co_name,
        co_date: formData[0].co_date,
        fk_commodity_id: formData[0].fk_commodity_id,
        fk_sub_commodity_id: formData[0].fk_sub_commodity_id,
        co_vessel_name: formData[0].co_vessel_name,
        tenant:GetTenantDetails(1)
    };
    if (type === "post") {
        payloadData.status = "posted";
    } else {
        payloadData.status = "saved";
    }
    let res;
    setIsOverlayLoader(true);
    if (formData[0].co_id) {
        let MainData = {
            consortium_order: payloadData,
        };
        MainData.co_id = formData[0].co_id;
        res = await putDataFromApi(formConfig.apiEndpoints.update, MainData);
    } else {
        let MainData = {
            consortium_order: payloadData,
        };
        res = await postDataFromApi(formConfig.apiEndpoints.create, MainData);
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
        setTimeout(() => {
            navigate("/operation/consortiums-list")
        }, 10)
        // getSingleConsortiumRecord(
        //     formConfig.apiEndpoints.read,
        //     res?.data?.data?.co_id,
        //     setFormData,
        //     setIsOverlayLoader
        // )
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
    setIsPopupOpen(false);
    setIsOverlayLoader(false);
};

export const handleConsortiumDelete = async (
    row,
    setIsDelete,
    getAllListingData,
    setPopupIndex
) => {
    let deleteBody = {
        "co_id": row?.co_id
    }
    let res = await deleteDataFromApi(consortiumDeleteApi, deleteBody);

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
};
export const getSingleConsortiumRecord = async (
    apiEndpoint,
    co_id,
    setFormData,
    setIsOverlayLoader,
    viewOnly
) => {
    try {

        setIsOverlayLoader(true);
        let res = await postDataFromApi(apiEndpoint, {
            co_id: co_id,
        });
        if (res?.data?.status === 200 && res.data.data) {
            const responseData = res.data.data;
            // setFormData((prevFormData) => {
            //     return {
            //         ...prevFormData,
            //         0: responseData,
            //         1: responseData,
            //     };
            // });
            if (viewOnly == 'View') {
                setFormData((prevFormData) => {
                    return {
                        ...prevFormData,
                        0: {
                            ...prevFormData[0], // Spread the existing object at the 0th index
                            fk_commodity_id: responseData.commodity.cmd_name,
                            fk_sub_commodity_id: responseData.sub_commodity.sub_cmd_name,
                            co_number: responseData.co_number,
                            co_date: responseData.co_date,
                            co_vessel_name: responseData.co_vessel_name
                        },
                        1: responseData,
                    };
                });
            }
            else {
                setFormData((prevFormData) => {
                    return {
                        ...prevFormData,
                        0: responseData,
                        1: responseData,
                    };
                });

            }


        }
    } catch (error) {
        console.error(error);
    } finally {
        setTimeout(() => {
            setIsOverlayLoader(false);
        }, 10);
    }
};