import { toast } from "react-toastify";
import {
    updateTruckSealingApi,
    createTruckSealingApi,
    updateCargoSupervisionApi,
    createCargoSupervisionApi,
    getTruckSealingApi,
    getCargoSupervisionApi
} from "../../../../services/api";
import {
    deleteDataFromApi,
    GetTenantDetails,
    postDataFromApi,
    putDataFromApi,
} from "../../../../services/commonServices";
import { encryptDataForURL } from "../../../../utills/useCryptoUtils";
import { OperationCreateDataFunction } from "./TMLOperations";
import { getOperationActivityUrl } from "../../../../services/commonFunction";

export const OperationOnlySealCreateDataFunction = async (
    formData,
    setIsOverlayLoader,
    setIsPopupOpen,
    OperationType,
    OperationTypeID,
    navigate,
    subTableData,
    operationMode,
    submitType,
) => {
    let res;
    setIsOverlayLoader(true);
    let truck_sealing = {
        "tr_os_no_of_trucks": formData[1].tr_os_no_of_trucks,
        "tr_os_total_qty": formData[1].tr_os_total_qty,
        "tr_os_json_data": subTableData,
        "fk_jiid": formData[0].ji_id,
        "fk_jisid": OperationTypeID
    }


    if (formData[1].tr_os_id) {
        let MainData = {
            tr_os_id: formData[1].tr_os_id,
            truck_sealing: truck_sealing,
            tenant: GetTenantDetails(1),
        };
        res = await putDataFromApi(updateTruckSealingApi, MainData);
    }
    else {
        let MainData = {
            truck_sealing: truck_sealing,
        };
        res = await postDataFromApi(createTruckSealingApi, MainData);
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
        setIsOverlayLoader(false);
        setIsPopupOpen(false);
        OperationCreateDataFunction(
            formData,
            setIsOverlayLoader,
            setIsPopupOpen,
            OperationType,
            OperationTypeID,
            navigate,
            submitType === "post" ? "posted" : "in-process",
            "",
            [],
            "",
            1,
            "",
            operationMode
        );
        if (submitType === "post") {
            const redirectUrl = getOperationActivityUrl(operationMode)
            navigate(
                redirectUrl + `${encryptDataForURL(
                    formData[0].ji_id
                )}`
            );
        }
        return;
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


export const OperationCargoSupervisionCreateDataFunction = async (
    formData,
    setIsOverlayLoader,
    setIsPopupOpen,
    OperationType,
    OperationTypeID,
    navigate,
    subTableData,
    operationMode,
    submitType,
) => {

    let res;
    setIsOverlayLoader(true);
    let truck_cargo_supervision = {
        "tr_cs_no_of_trs": formData[1].tr_cs_no_of_trs,
        "tr_cs_total_qty": formData[1].tr_cs_total_qty,
        "tr_cs_json_data": subTableData,
        "fk_jiid": formData[0].ji_id,
        "fk_jisid": OperationTypeID,
        tenant: GetTenantDetails(1),
    }


    if (formData[1].tr_cs_id) {
        let MainData = {
            tr_cs_id: formData[1].tr_cs_id,
            truck_cargo_supervision: truck_cargo_supervision,
        };
        res = await putDataFromApi(updateCargoSupervisionApi, MainData);
    }
    else {
        let MainData = {
            truck_cargo_supervision: truck_cargo_supervision,
        };
        res = await postDataFromApi(createCargoSupervisionApi, MainData);
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
        setIsOverlayLoader(false);
        setIsPopupOpen(false);
        OperationCreateDataFunction(
            formData,
            setIsOverlayLoader,
            setIsPopupOpen,
            OperationType,
            OperationTypeID,
            navigate,
            submitType === "post" ? "posted" : "in-process",
            "",
            [],
            "",
            1,
            "",
            operationMode
        );
        const redirectUrl = getOperationActivityUrl(operationMode)
        navigate(
            redirectUrl + `${encryptDataForURL(
                formData[0].ji_id
            )}`
        );
        return;
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

export const getSingleOSData = async (
    OperationTypeID,
    formData,
    setTableData,
    setIsOverlayLoader,
    setFormData,
    section
) => {
    try {
        let res = await postDataFromApi(getTruckSealingApi, {
            ji_id: formData[1]?.ji_id,
            jis_id: OperationTypeID,
        });
        if (res?.data?.status === 200 && res.data.data) {
            const updatedFormData = { ...formData };
            if (!updatedFormData[1]) {
                updatedFormData[1] = {};
            }
            updatedFormData[1]["tr_os_no_of_trucks"] =
                res.data.data.tr_os_no_of_trucks;
            updatedFormData[1]["tr_os_total_qty"] =
                res.data.data.tr_os_total_qty;
            res.data.data.tr_os_json_data.map((singleValue, index) => {
                section.headers.map((singleField) => {
                    const fieldName = singleField.name;
                    updatedFormData[1][fieldName + "_" + index] = singleValue[fieldName];
                });
            });
            updatedFormData[1]["tr_os_id"] = res.data.data.tr_os_id;
            setFormData(updatedFormData);
            setTableData(res.data.data.tr_os_json_data);
        }
    } catch (error) {
        console.error(error);
    }
};
export const getSingleCSData = async (
    OperationTypeID,
    formData,
    setTableData,
    setIsOverlayLoader,
    setFormData,
    section
) => {
    try {
        let res = await postDataFromApi(getCargoSupervisionApi, {
            ji_id: formData[1]?.ji_id,
            jis_id: OperationTypeID,
        });
        if (res?.data?.status === 200 && res.data.data) {
            const updatedFormData = { ...formData };
            if (!updatedFormData[1]) {
                updatedFormData[1] = {};
            }
            updatedFormData[1]["tr_cs_no_of_trs"] =
                res.data.data.tr_cs_no_of_trs;
            updatedFormData[1]["tr_cs_total_qty"] =
                res.data.data.tr_cs_total_qty;
            res.data.data.tr_cs_json_data.map((singleValue, index) => {
                section.headers.map((singleField) => {
                    const fieldName = singleField.name;
                    updatedFormData[1][fieldName + "_" + index] = singleValue[fieldName];
                });
            });
            updatedFormData[1]["tr_cs_id"] = res.data.data.tr_cs_id;
            setFormData(updatedFormData);
            setTableData(res.data.data.tr_cs_json_data);
        }
    } catch (error) {
        console.error(error);
    }
};