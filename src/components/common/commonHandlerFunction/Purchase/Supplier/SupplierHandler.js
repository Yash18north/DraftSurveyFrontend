import { toast } from "react-toastify";
import {
    deleteDataFromApi,
    getDataFromApi,
    postDataFromApi,
    putDataFromApi,
} from "../../../../../services/commonServices";
import { SupplierUpdateApi, SupplierCreateApi, SupplierGetApi, SupplierDeleteApi } from "../../../../../services/api";


export const handleGetSupplier = async (EditRecordId, setFormData) => {

    const supplierGetApi = SupplierGetApi(EditRecordId)

    let res = await getDataFromApi(supplierGetApi)

    if (res?.data?.status === 200) {
        setFormData((prevFormData) => {
            return {
                0: {
                    ...prevFormData[0],
                    ...res?.data?.data,
                    sup_name: res?.data?.data?.sup_name,
                    sup_address: res?.data?.data?.sup_address,
                    sup_email: res?.data?.data?.sup_email,
                    sup_gst_no: res?.data?.data?.sup_gst_no,
                    sup_contact_person: res?.data?.data?.sup_contact_person,
                    sup_contact_designation: res?.data?.data?.sup_contact_designation,
                    sup_services_used: res?.data?.data?.sup_services_used,
                    sup_facilities_available: res?.data?.data?.sup_facilities_available,
                    // sup_technical_staff_count: res?.data?.data?.sup_technical_staff_count,
                    sup_calibration_certificate: res?.data?.data?.sup_calibration_certificate === false ? "No" : "Yes",
                    sup_remark: res?.data?.data?.sup_remark,
                    sup_performance: res?.data?.data?.sup_performance,
                    sup_phoneno: res?.data?.data?.sup_phoneno,
                    sup_payment_terms: res?.data?.data?.sup_payment_terms,

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

export const handleSupplierCreateUpdate = async (
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
            sup_name: formData[0]?.sup_name,
            sup_address: formData[0]?.sup_address,
            sup_email: formData[0]?.sup_email,
            sup_gst_no: formData[0]?.sup_gst_no,
            sup_contact_person: formData[0]?.sup_contact_person,
            sup_contact_designation: formData[0]?.sup_contact_designation,
            sup_services_used: formData[0]?.sup_services_used,
            sup_facilities_available: formData[0]?.sup_facilities_available,
            sup_technical_staff_count: Number(formData[0]?.sup_technical_staff_count) || 0,
            sup_calibration_certificate: formData[0]?.sup_calibration_certificate,
            sup_remark: formData[0]?.sup_remark || '',
            sup_performance: formData[0]?.sup_performance,
            sup_payment_terms: formData[0]?.sup_payment_terms,
            sup_phoneno: formData[0]?.sup_phoneno,
            sup_status: status === "posted" ? 1 : formData[0]?.sup_status || 0

        }

        let res
        if (formData[0].sup_id) {

            const supplierUpdateUrl = SupplierUpdateApi(formData[0].sup_id);
            res = await postDataFromApi(supplierUpdateUrl, payloadData);


        }
        else {
            res = await postDataFromApi(SupplierCreateApi, payloadData);
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
            navigate("/supplierList")

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

export const handleSupplierDelete = async (
    row,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    // let deleteBody = {
    //     supplier_id: row.sup_id,
    // };
    let deletesupplierUpdatedApi = SupplierDeleteApi(row.sup_id)
    let res = await deleteDataFromApi(deletesupplierUpdatedApi);
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