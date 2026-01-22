import { toast } from "react-toastify";
import { deleteDataFromApi, GetTenantDetails, postDataFromApi, putDataFromApi } from "../../../../services/commonServices";
import { consortiumDeleteApi, getReferenceWiseDataApi } from "../../../../services/api";
import { data } from "jquery";

export const handleInvoiceValidation = async (
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

export const handleInvoiceCreateOrUpdate = async (
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
        tenant: GetTenantDetails(1),
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
            navigate("/operation/invoice-listing")
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

/**
   * use for get job/jrf detaills based on ref number in invoice page
   * @param {*} ref_nos 
   * @param {*} jrfId 
   */
export const handleMultipleRefForInvoice = async (ref_nos, jrfId, EditRecordId, Type, formData, cc_ids, user, setFormData, setMasterResponse) => {
    const result_ref = Array.isArray(ref_nos) ? ref_nos : typeof ref_nos[0] === 'string'
        ? ref_nos[0].split(/\s*,\s*/) : ref_nos


    let bodytoPass = {
        "im_is_regular": (Type == "IC" || formData[0]?.im_is_regular == "external") ? "external" : (Type == "Advance" || formData[0]?.im_is_regular == "advance") ? "advance" : "regular"
    };
    if (bodytoPass.im_is_regular === "advance" && user?.role === "LR") {
        bodytoPass.im_is_regular = "external"
        bodytoPass.jrf_ids = jrfId
    }
    if (Type == "IC" || formData[0]?.im_is_regular == "external") {
        if (EditRecordId) {
            bodytoPass.ic_ids = formData[0]?.invoice_details?.map((invDetails) => invDetails.fk_ic_id)
        }
        else {
            bodytoPass.ic_ids = cc_ids
        }
    }
    else {
        bodytoPass.reference_numbers = result_ref
    }
    let res = await postDataFromApi(getReferenceWiseDataApi, bodytoPass);
    if (res?.data?.status === 200 && res.data && res.data.invoices.length > 0) {

        const clientIDs = [...new Set(res.data.invoices?.map(invoice => invoice.client.client_id))];
        const clientNames = [...new Set(res.data.invoices?.map(invoice => invoice.client.client_name))];
        const clientGSTNo = [...new Set(res.data.invoices?.map(invoice => invoice.client.client_gstno))];
        const branchCodes = [...new Set(res.data.invoices?.map(invoice => invoice.branch_code + (invoice?.jrf_branch ? ` (${invoice?.jrf_branch?.br_name})` : '')))];
        const fk_actual_work_branchid = [...new Set(res.data.invoices?.map(invoice => invoice.fk_actual_work_branchid))];
        const reference = [...new Set(res.data.invoices?.map(invoice => invoice.ji_reference || invoice.ji_reference_number))];
        const courier_address = res.data.invoices?.[0]?.ji_dispatch_address || ''
        const ops_exec_name = res.data.invoices?.[0]?.operation_executives ? res.data.invoices?.[0]?.operation_executives.first_name +' '+res.data.invoices?.[0]?.operation_executives.last_name : ''
        const ji_work_date = [...new Set(res.data.invoices?.map(invoice => invoice.ji_work_date))];
        // Extract sales person info
        const salesPersons = []
        res.data.invoices.filter(invoice => {
            if (invoice?.sales_person?.sales_person_id != "") {
                if (!salesPersons.find((SP) => SP.id == invoice?.sales_person?.sales_person_id)) {
                    salesPersons.push({
                        id: invoice?.sales_person?.sales_person_id,
                        name: invoice?.sales_person?.sales_person_name
                    })
                }
            }
        });
        let companycode = res.data?.invoices?.[0]?.jrf_branch?.br_code
        companycode = companycode ? companycode[3] : 'C'
        setFormData(prevFormData => ({
            ...prevFormData,
            0: {
                ...prevFormData[0],
                fk_client: EditRecordId ? prevFormData[0]?.fk_clientid : (clientNames.join(', ') != "NA" ? clientNames.join(', ') : ""),
                im_gst_invoice_number_client: EditRecordId ? prevFormData[0]?.im_gst_invoice_number_client : clientGSTNo.join(', ') || "",
                fk_actual_work_branchid: EditRecordId ? prevFormData[0]?.fk_actual_work_branchid : fk_actual_work_branchid?.[0],
                actual_work_branch: EditRecordId ? prevFormData[0]?.actual_work_branch : branchCodes.join(', '),
                isactualbranchisexists: EditRecordId ? prevFormData[0]?.isactualbranchisexists : fk_actual_work_branchid?.[0] !== "NA",
                isClientisexists: clientIDs?.[0] === "NA",
                isSalesPersonsisexists: salesPersons?.[0] === "NA",
                is_iv_jireference: EditRecordId ? prevFormData[0]?.is_iv_jireference : reference.join(', '),
                iv_work_order_date: EditRecordId ? prevFormData[0]?.iv_work_order_date : ji_work_date.join(', '),
                iv_jireference: EditRecordId ? prevFormData[0]?.iv_jireference : reference.join(', '),
                iv_ivd_jireference: reference.join(', '),
                fk_clientid: EditRecordId ? prevFormData[0]?.fk_clientid : clientIDs?.[0],
                fk_invoice_branchid: EditRecordId ? prevFormData[0]?.fk_invoice_branchid : fk_actual_work_branchid?.[0],
                isShowSalesPersonDD: salesPersons.length === 0,
                invoiceCompanyCode: companycode,
                im_salespersonid: EditRecordId ? prevFormData[0]?.im_salespersonid : salesPersons?.[0]?.id,
                ji_jrf_courier_details:{
                    courier_address:courier_address,
                    ops_exec_name:ops_exec_name
                }
            }
        }));
        const bodyToPass = {
            model: "im_salespersonid",
            data: salesPersons,
        };
        setMasterResponse((prev) => [...prev, bodyToPass]);
    }
    else {
        setFormData(prevFormData => ({
            ...prevFormData,
            0: {
                ...prevFormData[0],
                isactualbranchisexists: false,
                isClientisexists: true,
                isSalesPersonsisexists: true,
                isShowSalesPersonDD: true
            }
        }));
    }
}

/**
   * use for get activities list using cc ids or ic ids
   * @param {*} param_cc_ids 
   * @param {*} activities 
   * @param {*} jrfids 
   */
export const handleActivityForInvoice = async (param_cc_ids, activities, jrfids,EditRecordId, Type, formData, cc_ids, user, setFormData, setMasterResponse) => {
    let bodytoPass = {
        "im_is_regular": (Type == "IC" || formData[0]?.im_is_regular == "external") ? "external" : "regular"
    };
    if (Type == "IC" || formData[0]?.im_is_regular == "external") {
        if (EditRecordId) {
            bodytoPass.ic_ids = formData[0]?.invoice_details?.map((invDetails) => invDetails.fk_ic_id)
        }
        else {
            bodytoPass.ic_ids = cc_ids
        }
    }
    else {
        if (Type !== "Advance" && (Type === "CC" || (formData[0]?.im_is_regular?.toLowerCase() == "regular" && !formData[0]?.im_is_manual_with_regular))) {
            bodytoPass.cc_ids = cc_ids
        }
        else {
            if(formData[0]?.im_is_regular?.toLowerCase() == "revised" && user?.role==="LR"){
                bodytoPass.ic_ids = formData[0]?.invoice_details?.map((invDetails) => invDetails.fk_ic_id)
            }
            else{
                bodytoPass.reference_numbers = param_cc_ids
            }
        }
    }
    if (Type !== "IC" && user?.role === "LR") {
        bodytoPass.im_is_regular = "external"
        bodytoPass.jrf_ids = jrfids
    }
    let res = await postDataFromApi("/certificates/activities/", bodytoPass);
    if (res.data) {
        const clientData = [];
        let allActivities = res?.data?.data?.flatMap(item => item.activities);
        let allRefActivities
        if (Type == "IC" || formData[0]?.im_is_regular == "external" || user?.role === "LR") {
            allRefActivities = res?.data?.data?.flatMap(item =>
                item.activities.map(activity => ({
                    am_id: activity?.am_id,
                    am_name: activity.am_name + (activity?.am_id && " (" + activity?.am_id + ")" || ''),
                    ji_reference_number: item.ji_reference_number,
                    JISID: item?.JISID,
                    ic_id: user?.role === "LR" && activity.JISID ? activity.JISID : ''
                }))
            );
            allActivities?.forEach((activity) => {
                clientData.push({
                    id: activity?.JISID,
                    am_id: activity?.am_id,
                    name: activity.am_name,
                    JISID: activity.JISID,
                    ic_id: user?.role === "LR" && activity.JISID ? activity.JISID : ''
                });
            });
        }
        else {
            if (Type !== "Advance" && (Type === "CC" || (formData[0]?.im_is_regular?.toLowerCase() == "regular" && !formData[0]?.im_is_manual_with_regular))) {
                allRefActivities = res?.data?.data?.flatMap(item =>
                    item.activities.map(activity => ({
                        am_id: activity?.cc_id,
                        am_name: activity.am_name + " (" + activity?.cc_id + ")",
                        ji_reference_number: item.cc_refencenumber,
                        JISID: activity?.cc_id,
                        fk_jis_id: activity?.JISID,
                    }))
                );
                allActivities?.forEach((activity) => {
                    clientData.push({
                        id: activity?.cc_id,
                        name: activity.am_name,
                        JISID: activity.cc_id,
                        fk_jis_id: activity.JISID,
                    });
                });
            }
            else {
                allRefActivities = res?.data?.data?.flatMap(item =>
                    item.activities.map(activity => ({
                        am_id: activity?.JISID,
                        am_name: activity.am_name + " (" + activity?.JISID + ")",
                        ji_reference_number: item.ji_reference_number,
                        JISID: activity?.JISID,
                    }))
                );
                allActivities?.forEach((activity) => {
                    clientData.push({
                        id: activity?.JISID,
                        name: activity.am_name,
                        JISID: activity.JISID
                    });
                });
            }
        }
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                0: {
                    ...prevFormData[0],
                    refActivities: allRefActivities
                },
            };
        });
        const bodyToPass = {
            model: "fk_activitymaster",
            data: clientData,
        };
        setMasterResponse((prev) => [...prev, bodyToPass]);
    }
};