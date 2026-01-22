import { toast } from "react-toastify";
import {
    deleteDataFromApi,
    getDataFromApi,
    GetTenantDetails,
    postDataFromApi,
    putDataFromApi,
} from "../../../../../services/commonServices";
import { invoiceUpdateApi, getSingleJobCosting as onGetSingleJobCostingApi } from "../../../../../services/api";
import { getFormatedDate } from "../../../../../services/commonFunction";

export const handleJobCostingFormCreateAndUpdate = async (
    setFormData,
    EditRecordId,
    formData,
    formConfig,
    navigate,
    status,
    viewOnly,

) => {
    let expenses = ['jc_days_work', 'jc_manpower', 'jc_travel_expense', 'jc_charges', 'jc_survey_analysis', 'jc_courier', 'jc_jabour_charges', 'jc_food_charges', 'purcase_material', 'jc_ot', 'jc_analysis_charges', 'jc_guest_house_exp'];
    let commentJson = {}
    expenses.forEach(expense => {
        commentJson[`${expense}_comment`] = formData?.[0]?.[`${expense}_comment`] || null;
    });
    let payload = {
        jc_id: EditRecordId,
        "jc_data": {
            ...formData[0],
            fk_im_id: formData[0]?.fk_im_id?.im_id,
            branch: formData[0]?.branch?.br_id,
            client: formData[0]?.client?.cust_id || "",
            jc_status: `${status}`,
            invoice_date: formData[0]?.invoice_date,
            // ?(() => {
            //     const [day, month, year] = formData[0].invoice_date.split("/");
            //     return `${year}-${month}-${day}`; 
            //   })()
            // : null,
            commodity: Array.isArray(formData[0]?.commodity_json)
                ? formData[0].commodity_json.map(item => item.cmd_id)
                : formData[0]?.commodity?.cmd_id
                    ? [formData[0].commodity.cmd_id]
                    : [],
            jc_comment_json: commentJson
        }
    };
    if (EditRecordId) {
        delete payload.jc_data.commodity
    }

    let res = await putDataFromApi(formConfig?.apiEndpoints.update, payload);
    if (res.data.status === 200) {
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
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                0: {
                    ...prevFormData[0],
                    ...res?.data?.data,
                },
            };
        });
        navigate("/audit/job-costing-list")
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

export const handleGetJobCostingList = async (EditRecordId, setFormData) => {

    let payload = {
        jc_id: EditRecordId,
    };
    let res = await postDataFromApi(onGetSingleJobCostingApi, payload);
    if (res.data.status === 200) {
        setFormData((prevFormData) => {
            const updatedData = {
                ...prevFormData,
                0: {
                    ...prevFormData[0],
                    ...res?.data?.data,
                    ...res?.data?.data?.jc_comment_json,
                    client_name: res?.data?.data.fk_im_id?.client.cust_name,
                    im_jc_comment: res?.data?.data.fk_im_id?.im_jc_comment,
                    place_of_attendance: res?.data?.data.branch?.br_name
                        ? `${res?.data?.data.branch?.br_name} (${res?.data?.data.branch?.br_code})`
                        : "",
                    commodity: Array.isArray(res?.data?.data.commodity_json)
                        ? res?.data?.data.commodity_json.map((commodity) => {
                            return commodity.cmd_name
                        }).join(", ")
                        : res?.data?.data.commodity_json || "",
                    // res?.data?.data.commodity_json.map((commodity)=>{
                    //  return commodity.cmd_name
                    // }).join(", ")
                    vessel_name: Array.isArray(res?.data?.data.vessel_json) ?
                        res?.data?.data?.vessel_json.join(", ")
                        : res?.data?.data?.vessel_json || "",
                    certificate_data: Array.isArray(res?.data?.data.certificate_data) ?
                        res?.data?.data?.certificate_data.join(", ")
                        : res?.data?.data?.certificate_data || "",
                    // invoice_date: getFormatedDate(res?.data?.data?.invoice_date, true)
                },
            };
            return updatedData;
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

export const getCalculationsForJobCosting = (formData, setFormData) => {

    const total_exp = [
        formData.jc_misc_3p,
        formData.jc_ho_exp_10p,
        formData.jc_travel_expense,
        formData.jc_survey_analysis,
        formData.jc_courier,
        formData.jc_charges,
        formData.jc_jabour_charges,
        formData.jc_food_charges,
        formData.purcase_material,
        formData.jc_ot,
        formData.jc_analysis_charges,
        formData.jc_guest_house_exp,
    ]
        .map((val) => Number(String(val || "0").replace(/,/g, "")))
        .reduce((acc, val) => acc + val, 0)
        .toFixed(2);

    let profit_loss = 0;
    let profit_perc = 0;

    const invAmt = Number(String(formData.jc_inv_amt || total_exp).replace(/,/g, ""));
    profit_loss = (invAmt - Number(total_exp)).toFixed(2);
    profit_perc = invAmt !== 0 ? ((profit_loss / invAmt) * 100).toFixed(2) : 0;

    return { total_exp, profit_loss, profit_perc };
    // setFormData((previousData) => ({
    //   ...previousData,
    //   0: {
    //     ...previousData[0],
    //     jc_total_exp: total_exp,
    //     jc_profit_loss: profit_loss,
    //     jc_profit_perc: profit_perc,
    //   },
    // }));
};


export const handleCancelRemarkFunck = async (
    formData,
    setIsOverlayLoader,
    navigate,
    row,
    getAllListingData
) => {
    setIsOverlayLoader(true)
    try {
        let payloadData = {
            "im_data": {
                im_jc_comment: formData[0]?.im_jc_comment,
                im_is_jc_comment: true
            }
        }
        let MainData = payloadData;
        MainData.im_id = row?.fk_im_id.im_id;
        let res = await putDataFromApi(invoiceUpdateApi, MainData);
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
                getAllListingData();
            }, 1000)
        }
    }
    catch (ex) { }
    finally {
        setIsOverlayLoader(false)
    }
}