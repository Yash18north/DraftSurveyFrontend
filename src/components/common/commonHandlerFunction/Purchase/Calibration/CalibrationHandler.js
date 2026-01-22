import { toast } from "react-toastify";
import {
    deleteDataFromApi,
    getDataFromApi,
    postDataFromApi,
    putDataFromApi,
} from "../../../../../services/commonServices";
import { calibrationDeleteApi, calibrationUpdateApi, calibrationCreateApi, calibrationGetApi } from "../../../../../services/api";

export const handleGetCalibration = async (EditRecordId, setFormData, setIsOverlayLoaders) => {
    try {
        setIsOverlayLoaders(true)
        let res = await getDataFromApi(calibrationGetApi + EditRecordId + '/')

        if (res.data.status === 200) {

            setFormData((prevFormData) => {
                return {
                    0: {
                        ...prevFormData[0],
                        ...res?.data?.data,

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
    } catch (error) {
        // console.log('errrr',error)
    }
    finally {
        setIsOverlayLoaders(false)
    }
}

export const handleCalibrationCreateUpdate = async (
    formData,
    handleSubmit,
    setIsOverlayLoader,
    navigate,
    status,
    isCustomPopup,
    setIsCustomPopup,
    setFormData,
    section
) => {
    try {
        setIsOverlayLoader(true)
        if (!isCustomPopup) {
            let isValidate = handleSubmit();
            if (!isValidate) {
                return false;
            }
        }
        let payloadData = {
            calib_no: formData[0]?.calib_no,
            calib_description: formData[0]?.calib_description,
            calib_qty: formData[0]?.calib_qty,
            calib_unit: formData[0]?.calib_unit,
            calib_make_range: formData[0]?.calib_make_range,
            calib_model: formData[0]?.calib_model,
            calib_frequency: formData[0]?.calib_frequency,
            analysis_charges: formData[0]?.analysis_charges,
            calib_date: formData[0]?.calib_date,
            calib_next_due_date: formData[0]?.calib_next_due_date,
            calib_agency: formData[0]?.calib_agency,
            calib_remark: formData[0]?.calib_remark,
            calib_status: status,
        }
        let res
        if (isCustomPopup) {
            for (let obj in payloadData) {
                const field = section.fields.filter((field, index) => {
                    if (field.name === obj) {
                        return true;
                    }
                    return false;
                });
                if (field.length > 0 && field[0]?.required && (payloadData[obj] === undefined || payloadData[obj] === "")) {
                    let errLabel = field.length ? field[0].label : obj;
                    toast.error(errLabel + " is Required", {
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
        }
        if (formData[0].calib_id) {
            res = await postDataFromApi(calibrationUpdateApi + formData[0].calib_id + '/', payloadData)

        } else {
            res = await postDataFromApi(calibrationCreateApi, payloadData);
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
            if (isCustomPopup) {
                setFormData((prev) => {
                    return {
                        ...prev,
                        [0]: {
                            ...prev[0],
                            ['fk_calibration_id']: res.data.data.calib_id
                        }
                    }
                })
                setIsCustomPopup(false)
            }
            else {
                navigate("/calibrationList")
            }

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
        console.log('---', ex)
    }
    finally {
        setIsOverlayLoader(false)
    }
}

export const handleCalibrationDelete = async (
    calibration_id,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    try {
        let res = await deleteDataFromApi(calibrationDeleteApi + calibration_id + '/');
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
    catch (ex) { }
    finally {
        setIsDelete(false);
        setPopupIndex(-1);
    }


}