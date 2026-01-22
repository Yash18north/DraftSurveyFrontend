import { toast } from "react-toastify";
import {
  deleteDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../services/commonServices";

import {
  deleteInvoiceApi,
  getInvoiceDetailsApi,
  updateInvoiceApi,
  createInvoiceApi,
  getInvoiceRetriveApi,
  createBulkInvoices
} from "../../../services/api";
import { getFormatedDate, getUniqueData } from "../../../services/commonFunction";
import {
  decryptDataForURL,
  encryptDataForURL,
} from "../../../utills/useCryptoUtils";
import moment from "moment";

const getRefNums = (data, item_to_extract) => {
  let all_ref_nos = data.invoice_details.flatMap(item => item[item_to_extract]);
  all_ref_nos = getUniqueData(all_ref_nos);
  return all_ref_nos.join(" , ")
}

export const getInvoiceData = async (EditRecordId, setFormData, setSubTableData, formData, section, status) => {
  let payload = {
    im_id: EditRecordId,
  };
  let res = await postDataFromApi(getInvoiceRetriveApi, payload);
  if (res.data.status === 200) {
    res.data.data.actual_work_branch = res?.data?.data?.actual_work_branch?.br_code || "--"
    if (res.data.data.im_is_regular === "revised") {
      res.data.data.im_is_regular = "Revised"
    }
    else if (res.data.data.im_is_regular !== "external") {
      res.data.data.im_is_regular = res.data.data.im_is_regular === "advance" ? "Advance" : "Regular"
    }
    res.data.data = {
      ...res.data.data,
      ...res.data.data.im_courier_details_json
    };
    if (status.toLowerCase() == "view") {

      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ...res?.data?.data,
            cert_number: res?.data?.data?.cc_certificatenumber,
            fk_clientid: res?.data?.data?.client?.cust_name,
            invoice_details: res?.data?.data?.invoice_details,
            fk_client: res?.data?.data?.client?.cust_name,
            reference_number: getRefNums(res?.data?.data, "ivd_ref_no"),
            fk_invoice_branchid: res.data.data.branch.br_name,
            invoiceCompanyCode: res.data.data.branch.company?.cmp_code,
            // actual_work_branch: res?.data?.data?.actual_work_branch?.br_code || "--",
            // actual_work_branch: res.data.data.actual_work_branch || "--",
            // iv_jireference: res.data.data.iv_jireference || "--",
            im_gst_invoice_number: res.data.data.im_gst_invoice_number || "--",
            im_creditnote: res.data.data.im_creditnote || "--",
            im_salespersonid: res.data.data.sales_person.full_name || '-',
            ji_client_address: res.data.data?.client?.cust_address,
            ji_client_gst: res.data.data?.client?.cust_gstno,
            state_of_client: res.data.data?.client?.state?.state_name,
          },
        };
      });
    }
    else {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ...res?.data?.data,
            cert_number: res?.data?.data?.cc_certificatenumber,
            fk_clientid: res?.data?.data?.fk_client,
            invoice_details: res?.data?.data?.invoice_details,
            fk_client: res?.data?.data?.client?.cust_name,
            reference_number: getRefNums(res?.data?.data, "ivd_ref_no") || "--",
            invoiceCompanyCode: res.data.data.branch.company?.cmp_code,
            // actual_work_branch: res?.data?.data?.actual_work_branch?.br_code || "--",
            // actual_work_branch: getRefNums(res?.data?.data, "ivd_ref_nos"),
            // iv_jireference: getRefNums(res?.data?.data, "ivd_ref_nos"),
            // fk_client: status == "View" ? res?.data?.data?.client?.cust_name : res?.data?.data?.client?.cust_id,
            ji_client_address: res.data.data?.client?.cust_address,
            ji_client_gst: res.data.data?.client?.cust_gstno,
            state_of_client: res.data.data?.client?.state?.state_name,
          },
        };
      });
    }
  }
};

export const handleInvoiceCreateOrUpdate = async (
  formData,
  formConfig,
  setIsOverlayLoader,
  setIsPopupOpen,
  type,
  navigate,
  setFormData,
  setTabOpen,
  useFor = "",
  masterResponse,
  handleSubmit,
  subTableData,
  user
) => {
  try {
    let isValidate = handleSubmit();
    if (!isValidate) {
      return false;
    }
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const Type = decryptDataForURL(params.get("type"));
    const Status = decryptDataForURL(params.get("status"));
    setIsOverlayLoader(true)
    const firstActivityMasterFil = masterResponse?.filter(
      (item) => item.model === "fk_activitymaster"
    );
    let firstActivityMaster = firstActivityMasterFil[firstActivityMasterFil.length - 1]
    const getDataByActivity = (activity, ccactivities, value) => {
      const found = ccactivities?.find(item => {
        let match, lastNumber;
        if (typeof item.activity == "string") {
          match = item?.activity?.match(/\d+$/);
          lastNumber = match ? parseInt(match[0], 10) : null;
        }
        return item.am_id === activity || lastNumber === activity;
      });

      return found ? found[value] : null;
    };
    const getExternalAct = (activity, formData) => {
      if (activity == "SS") {
        activity = formData[0]?.refActivities[0].am_id
      }
      return activity
    }
    const getDataByActivityIC = (activity, ccactivities, value) => {
      const found = ccactivities?.find(item => {
        return item.activity === activity;
      });
      return found ? found[value] : null;
    };

    const getDataByActivityCCN = (activity, ccactivities, value) => {
      const found = ccactivities?.find(item => {
        let match, lastNumber;
        if (typeof item.activity == "string") {
          match = item?.activity?.match(/\d+$/);
          lastNumber = match ? parseInt(match[0], 10) : null;
        }
        return item.am_id === activity || lastNumber === activity || item.activity == activity;
      });
      // const found = ccactivities?.find(item => (item.am_name === activity || item.activity === activity));
      return found ? found[value] : null;
    };



    let imv_details_val = firstActivityMaster?.data;
    if (formData[0].activities?.length > 0) {
      let validActivity = formData[0].activities.map(item => item.activity);

      if (Type != "IC") {
        const extractNumbers = (arr) => arr.map(item => parseInt(item?.match(/\d+/g)));
        validActivity = extractNumbers(validActivity);
        imv_details_val = imv_details_val?.filter(item => validActivity.includes(item.id));
      }

    }
    let invoice_details
    if (Type != "IC" && formData[0]?.im_is_regular != "external") {

      const invoiceDetailsCreateArr = (imv_details_val) => {
        if (formData[0]?.invoice_details && formData[0]?.im_is_regular?.toLowerCase() == "revised" && user?.role === "LR") {
          return formData[0]?.invoice_details.map((invData) => ({
            "ivd_number": null,
            "fk_activitymaster": invData?.fk_activitymaster,
            "fk_activitymastername": invData?.activitymaster?.am_name,
            "ivd_rate": invData?.ivd_rate,
            "ivd_qty": invData?.ivd_qty,
            "ivd_activitytotal": invData?.ivd_activitytotal,
            "fk_ic_id": invData?.fk_ic_id,
            "ivd_ref_no": invData?.ivd_ref_no,
          }))
        }
        else
          if (Type !== "Advance" && (Type === "CC" || (formData[0]?.im_is_regular?.toLowerCase() == "regular" && !formData[0]?.im_is_manual_with_regular))) {
            return imv_details_val?.map((item) => ({
              ivd_number: formData[0].im_invoicenumber,
              fk_activitymastername: item.name,
              fk_jis_id: item.fk_jis_id,
              ivd_rate: "",
              ivd_qty: "",
              ivd_activitytotal: "",
              "fk_cc_id": item.id,
              "fk_ic_id": null,
              "ivd_ref_no": getDataByActivity(item.id, formData[0].refActivities, "ji_reference_number"),
            }));
          }
          else {
            if (Type === "Advance" && user?.role === "LR") {
              return imv_details_val?.map((item) => ({
                // ivd_number: formData[0].im_invoicenumber,
                // fk_activitymastername: item.am_id,
                // // fk_jis_id: item.JISID,
                // ivd_rate: "",
                // ivd_qty: "",
                // ivd_activitytotal: "",
                // "fk_cc_id": getDataByActivity(item.id, formData[0].activities, "cc_id"),
                // "fk_ic_id": formData[0].refActivities?.[0]?.ic_id,
                // "ivd_ref_no": getDataByActivity(item.id, formData[0].refActivities, "ji_reference_number"),
                ivd_number: formData[0].im_invoicenumber,
                fk_activitymaster: item?.am_id,
                fk_activitymastername: "Submitted Samples",
                ivd_rate: item?.ivd_rate,
                ivd_qty: item?.ivd_qty,
                ivd_activitytotal: item?.ivd_activitytotal,
                "fk_ic_id": formData[0].refActivities?.[0]?.ic_id,
                // "ivd_ref_no": formData[0].iv_jireference,
                "ivd_ref_no": formData[0].iv_ivd_jireference
              }));
            }
            else {
              return imv_details_val?.map((item) => ({
                ivd_number: formData[0].im_invoicenumber,
                fk_activitymastername: item.name,
                fk_jis_id: item.id,
                ivd_rate: "",
                ivd_qty: "",
                ivd_activitytotal: "",
                "fk_cc_id": getDataByActivity(item.id, formData[0].activities, "cc_id"),
                "fk_ic_id": getDataByActivityIC(item.id, formData[0].activities, "ic_id"),
                "ivd_ref_no": getDataByActivity(item.id, formData[0].refActivities, "ji_reference_number"),
              }));
            }
          }
      };
      invoice_details = invoiceDetailsCreateArr(imv_details_val);
    }
    else {
      const invoiceDetailsCreateArr = (imv_details_val) => {
        if (Type != "IC") {
          return formData[0]?.invoice_details?.map((item) => ({
            ivd_number: formData[0].im_invoicenumber,
            fk_activitymaster: item?.fk_activitymaster,
            fk_activitymastername: "Submitted Samples",
            ivd_rate: item?.ivd_rate,
            ivd_qty: item?.ivd_qty,
            ivd_activitytotal: item?.ivd_activitytotal,
            "fk_ic_id": item.fk_ic_id,
            "ivd_ref_no": item.ivd_ref_no
          }));
        }
        else {
          return formData[0].activities?.map((item) => ({
            ivd_number: formData[0].im_invoicenumber,
            fk_activitymaster: getExternalAct(item.activity, formData),
            fk_activitymastername: "Submitted Samples",
            ivd_rate: "",
            ivd_qty: "",
            ivd_activitytotal: "",
            "fk_ic_id": item.ic_id,
            "ivd_ref_no": item.cc_refencenumber
          }));
        }
      };
      invoice_details = invoiceDetailsCreateArr(formData[0].refActivities);
    }
    let im_courier_details_json = {}
    let courierJsonField = [
      "courier_service_name",
      "courier_tracking_no",
      "courier_date",
      "courier_recieved_date",
      "courier_done_by_executive",
      "courier_address",
      "courier_acknowledge_by",
      "courier_persone_name",
      "courier_reciever_name",
      "courier_date_submission",
      "courier_submission_address",
      "courier_remark"]
    courierJsonField.forEach(field => {
      im_courier_details_json[field] = formData[0]?.[field] || null;
    });

    if (user.role === "LR" && Type != "IC") {
      let chkicidExists = false
      if (formData[0]?.invoice_details) {
        chkicidExists = formData[0]?.invoice_details.find((singleData) => !singleData.fk_ic_id)
      }
      if (!chkicidExists) {
        invoice_details = invoice_details.map((singleData) => {
          return {
            ...singleData,
            fk_ic_id: null
          }
        })
      }
    }
    let payloadData = {
      "im_data": {
        "im_invoicenumber": formData[0].im_invoicenumber,
        "im_invoice_date": formData[0].im_invoice_date,
        "fk_client": formData[0].fk_clientid,
        "im_gst_invoice_number": formData[0].im_gst_invoice_number,
        "fk_invoice_branchid": formData[0].fk_invoice_branchid,
        "fk_actual_work_branchid": formData[0]?.fk_actual_work_branchid,
        "fk_jrf_clientid": formData[0]?.fk_jrf_clientid,
        "im_reference_number": Array.isArray(formData[0]?.reference_number) ? formData[0]?.reference_number?.[0] : formData[0]?.reference_number,
        "im_invoiceurl": formData[0].im_invoiceurl,
        "im_status": formData[0].im_status,
        "im_paymentmode": formData[0].im_paymentmode,
        "fk_im_state": formData[0].fk_im_state,
        "im_currency_code": formData[0].im_currency_code,
        "im_tax_type": formData[0].im_tax_type,
        "im_voucher_type": formData[0].im_voucher_type,
        "im_tax_classification": formData[0].im_tax_classification,
        "im_salespersonid": formData[0].im_salespersonid != "NA" ? formData[0].im_salespersonid : "",
        "im_billtoplace": formData[0].im_billtoplace,
        "im_shiptoplace": formData[0].im_shiptoplace,
        "im_total": formData[0].im_total_act,
        "im_naration_no": formData[0].im_naration_no,
        "im_creditnote": formData[0].im_creditnote,
        "im_workorderno": formData[0].iv_jireference,
        // "im_workorderdate": formData[0].im_workorderdate,
        "iv_jireference": formData[0].iv_jireference,
        "im_workorderdate": formData[0].iv_work_order_date,
        "im_is_debit_created": formData[0].im_is_debit_created,
        "im_courier": formData[0].im_courier,
        "im_courier_details_json": im_courier_details_json,
        tenant: GetTenantDetails(1),

      },
      "invoice_details": invoice_details
    };
    // return
    if (type === "post") {
      const invoiceDetails = formData[0]?.invoice_details || [];
      const allCompleted = invoiceDetails.every(detail => detail.ivd_status === "Completed");
      if (!allCompleted) {
        toast.error("Please Select all Activities before Posting", {
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
      payloadData.im_data.im_status = "Posted";
    } else {
      payloadData.im_data.im_status = "Saved";
    }
    if (decryptDataForURL(params.get("isCourier"))) {
      payloadData.im_data.im_status = type;
    }
    if (Status !== "Edit") {
      payloadData.im_data.im_is_regular = ["Advance"].includes(Type) ? "advance" : ["IC"].includes(Type) ? "external" : "regular";
    }
    if (!["IC"].includes(Type) && formData[0]?.im_is_regular != "external") {
      payloadData.im_data.im_is_regular = formData[0]?.im_is_regular == "Advance" ? "advance" : "regular"
    }
    else {
      payloadData.im_data.im_is_regular = formData[0]?.im_is_regular || (["IC"].includes(Type) ? "external" : "regular")
    }
    if (!["IC"].includes(Type) && formData[0]?.im_is_regular != "external" && user?.role === "LR") {
      payloadData.im_data.im_is_regular = "external"
    }
    if (formData[0]?.im_is_regular === "Revised") {
      payloadData.im_data.im_is_regular = "revised"
    }
    let res;
    // if (payloadData?.im_data?.im_tax_classification?.includes("IGST") && (payloadData?.im_data.im_tax_classification?.includes("SGST") || payloadData?.im_data.im_tax_classification?.includes("CGST"))) {
    //   toast.error("You can only select IGST singularly", {
    //     position: "top-right",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    //   return false
    // }
    // return
    if (formData[0].im_id) {
      let MainData = payloadData;
      payloadData.invoice_details = invoice_details.map((singleInvDetails) => {
        delete singleInvDetails.ivd_scope_description
        return singleInvDetails
      })
      MainData.im_id = formData[0].im_id;
      res = await putDataFromApi(formConfig.apiEndpoints.update, MainData);
    } else {
      if (["Advance"].includes(Type) && payloadData.im_data.im_is_regular === "regular") {
        payloadData.im_data.im_is_manual_with_regular = true
      }
      let MainData = payloadData;
      res = await postDataFromApi(formConfig.apiEndpoints.create, MainData);
    }
    if (res?.data?.status === 200) {
      res.data.data.actual_work_branch = res?.data?.data?.actual_work_branch?.br_code || "--"
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ...res?.data?.data
          },
        };
      });
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
      setTabOpen(true);

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
    // setIsOverlayLoader(false);
    if (useFor == "button") {
      navigate("/operation/invoice-listing")
    }
  } catch (ex) {

  }
  finally {
    setIsOverlayLoader(false)
  }
};
export const handleDebitCreate = async (
  formData,
  formConfig,
  setIsOverlayLoader,
  setIsPopupOpen,
  type,
  navigate,
  setFormData,
  setTabOpen,
  useFor = "",
  masterResponse,
  handleSubmit,
  subTableData,
  user,
  debit_status
) => {
  try {
    let isValidate = handleSubmit();
    if (!isValidate) {
      return false;
    }
    setIsOverlayLoader(true)
    const firstActivityMasterFil = masterResponse?.filter(
      (item) => item.model === "fk_activitymaster"
    );
    let firstActivityMaster = firstActivityMasterFil[firstActivityMasterFil.length - 1]
    const getDataByActivity = (activity, ccactivities, value) => {
      const found = ccactivities?.find(item => {
        let match, lastNumber;
        if (typeof item.activity == "string") {
          match = item?.activity?.match(/\d+$/);
          lastNumber = match ? parseInt(match[0], 10) : null;
        }
        return item.am_id === activity || lastNumber === activity;
      });

      return found ? found[value] : null;
    };
    const getExternalAct = (activity, formData) => {
      if (activity == "SS") {
        activity = formData[0]?.refActivities[0].am_id
      }
      return activity
    }
    const getDataByActivityIC = (activity, ccactivities, value) => {
      const found = ccactivities?.find(item => {
        return item.activity === activity;
      });
      return found ? found[value] : null;
    };

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const Type = decryptDataForURL(params.get("type"));
    const Status = decryptDataForURL(params.get("status"));

    let imv_details_val = firstActivityMaster?.data;
    if (formData[0].activities?.length > 0) {
      let validActivity = formData[0].activities.map(item => item.activity);

      if (Type != "IC") {
        const extractNumbers = (arr) => arr.map(item => parseInt(item?.match(/\d+/g)));
        validActivity = extractNumbers(validActivity);
        imv_details_val = imv_details_val?.filter(item => validActivity.includes(item.id));
      }

    }
    let invoice_details
    if (Type != "IC" && formData[0]?.im_is_regular != "external") {

      const invoiceDetailsCreateArr = (imv_details_val) => {
        if (Type !== "Advance" && (Type === "CC" || (formData[0]?.im_is_regular?.toLowerCase() == "regular" && !formData[0]?.im_is_manual_with_regular))) {
          return imv_details_val?.map((item) => ({
            ivd_number: formData[0].im_invoicenumber,
            fk_activitymastername: item.name,
            fk_jis_id: item.fk_jis_id,
            ivd_rate: "",
            ivd_qty: "",
            ivd_activitytotal: "",
            "fk_cc_id": item.id,
            "fk_ic_id": null,
            "ivd_ref_no": getDataByActivity(item.id, formData[0].refActivities, "ji_reference_number"),
          }));
        }
        else {
          if (Type === "Advance" && user?.role === "LR") {
            return imv_details_val?.map((item) => ({

              ivd_number: formData[0].im_invoicenumber,
              fk_activitymaster: item?.am_id,
              fk_activitymastername: "Submitted Samples",
              ivd_rate: item?.ivd_rate,
              ivd_qty: item?.ivd_qty,
              ivd_activitytotal: item?.ivd_activitytotal,
              "fk_ic_id": formData[0].refActivities?.[0]?.ic_id,
              "ivd_ref_no": formData[0].iv_jireference,
            }));
          }
          else {
            return imv_details_val?.map((item) => ({
              ivd_number: formData[0].im_invoicenumber,
              fk_activitymastername: item.name,
              fk_jis_id: item.id,
              ivd_rate: "",
              ivd_qty: "",
              ivd_activitytotal: "",
              "fk_cc_id": getDataByActivity(item.id, formData[0].activities, "cc_id"),
              "fk_ic_id": getDataByActivityIC(item.id, formData[0].activities, "ic_id"),
              "ivd_ref_no": getDataByActivity(item.id, formData[0].refActivities, "ji_reference_number"),
            }));
          }
        }
      };
      // invoice_details = invoiceDetailsCreateArr(imv_details_val);
      // subTableData.map((singledata) => {
      //   if (singledata.is_additional_status) {
      //     invoice_details.push(singledata)
      //   }
      // })
      invoice_details = subTableData.map((singletale) => {
        delete singletale.fk_im
        delete singletale.acvitymaster
        return singletale
      })

    }
    else {
      const invoiceDetailsCreateArr = (imv_details_val) => {
        if (Type != "IC") {
          return formData[0]?.invoice_details?.map((item) => ({
            ivd_number: formData[0].im_invoicenumber,
            fk_activitymaster: item?.fk_activitymaster,
            fk_activitymastername: "Submitted Samples",
            ivd_rate: item?.ivd_rate,
            ivd_qty: item?.ivd_qty,
            ivd_activitytotal: item?.ivd_activitytotal,
            "fk_ic_id": item.fk_ic_id,
            "ivd_ref_no": item.ivd_ref_no
          }));
        }
        else {
          return formData[0].activities?.map((item) => ({
            ivd_number: formData[0].im_invoicenumber,
            fk_activitymaster: getExternalAct(item.activity, formData),
            fk_activitymastername: "Submitted Samples",
            ivd_rate: "",
            ivd_qty: "",
            ivd_activitytotal: "",
            "fk_ic_id": item.ic_id,
            "ivd_ref_no": item.cc_refencenumber
          }));
        }
      };
      invoice_details = invoiceDetailsCreateArr(formData[0].refActivities);
      subTableData.map((singledata) => {
        if (singledata.is_additional_status) {
          invoice_details.push(singledata)
        }
      })

    }
    let payloadData = {
      "im_data": {
        "im_invoicenumber": formData[0].im_invoicenumber,
        "im_invoice_date": moment(formData[0].im_invoice_date).format("YYYY-MM-DD"),
        "fk_client": formData[0].fk_clientid,
        "im_gst_invoice_number": formData[0].im_gst_invoice_number,
        "fk_invoice_branchid": formData[0].fk_invoice_branchid,
        "fk_actual_work_branchid": formData[0]?.fk_actual_work_branchid,
        "fk_jrf_clientid": formData[0]?.fk_jrf_clientid,
        "im_reference_number": Array.isArray(formData[0]?.reference_number) ? formData[0]?.reference_number?.[0] : formData[0]?.reference_number,
        "im_invoiceurl": formData[0].im_invoiceurl,
        // "im_status": formData[0].im_status,
        "im_status": debit_status == "Posted" ? "debit_post" : "debit_save",
        "im_paymentmode": formData[0].im_paymentmode,
        "fk_im_state": formData[0].fk_im_state,
        "im_currency_code": formData[0].im_currency_code,
        "im_tax_type": formData[0].im_tax_type,
        "im_voucher_type": formData[0].im_voucher_type,
        "im_tax_classification": formData[0].im_tax_classification,
        "im_salespersonid": formData[0].im_salespersonid != "NA" ? formData[0].im_salespersonid : "",
        "im_billtoplace": formData[0].im_billtoplace,
        "im_shiptoplace": formData[0].im_shiptoplace,
        "im_total": formData[0].im_total_act,
        "im_naration_no": formData[0].im_naration_no,
        "im_creditnote": formData[0].im_creditnote,
        "im_workorderno": formData[0].iv_jireference,
        "iv_jireference": formData[0].iv_jireference,
        "im_workorderdate": formData[0].iv_work_order_date,
        tenant: GetTenantDetails(1),

      },
      "invoice_details": invoice_details
    };
    if (type === "post") {
      const invoiceDetails = formData[0]?.invoice_details || [];
      const allCompleted = invoiceDetails.every(detail => detail.ivd_status === "Completed");
      if (!allCompleted) {
        toast.error("Please Select all Activities before Posting", {
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
      // payloadData.im_data.im_status = "Posted";
    } else {
      // payloadData.im_data.im_status = "Saved";
    }
    if (Status !== "Edit") {
      payloadData.im_data.im_is_regular = ["Advance"].includes(Type) ? "advance" : ["IC"].includes(Type) ? "external" : "regular";
    }
    if (!["IC"].includes(Type) && formData[0]?.im_is_regular != "external") {
      payloadData.im_data.im_is_regular = formData[0]?.im_is_regular == "Advance" ? "advance" : "regular"
    }
    else {
      payloadData.im_data.im_is_regular = formData[0]?.im_is_regular || (["IC"].includes(Type) ? "external" : "regular")
    }
    if (!["IC"].includes(Type) && formData[0]?.im_is_regular != "external" && user?.role === "LR") {
      payloadData.im_data.im_is_regular = "external"
    }
    let res;

    if (["Advance"].includes(Type) && payloadData.im_data.im_is_regular === "regular") {
      payloadData.im_data.im_is_manual_with_regular = true
    }
    let MainData = payloadData;

    MainData.im_data.im_is_invoice = false
    MainData.im_data.im_invoicenumber = formData[0].im_invoicenumber
    // MainData.im_data.im_status = "debitted"
    MainData.im_data.im_is_debit_created = true

    if (formData[0]?.im_status !== "debit_save") {
      res = await postDataFromApi(formConfig.apiEndpoints.create, MainData);
    }
    else {

      MainData = {
        im_id: formData[0].im_id,
        im_data: {
          ...MainData.im_data
        }
      }
      delete MainData.im_data.im_invoicenumber
      res = await putDataFromApi(formConfig.apiEndpoints.update, MainData);
    }
    if (res?.data?.status === 200) {
      res.data.data.actual_work_branch = res?.data?.data?.actual_work_branch?.br_code || "--"
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ...res?.data?.data
          },
        };
      });
      if (formData[0]?.im_status !== "debit_save") {
        let update_payload = {
          im_id: formData[0].im_id,
          im_data: {
            ...MainData.im_data,
            fk_debit_imid: res.data.data.im_id,
            im_is_debit_created: true,
            im_status: "invoice_generated"
          }

        }
        let res2 = await putDataFromApi(formConfig.apiEndpoints.update, update_payload);
      }
      // if (debit_status == "Posted") {
      //   let update_post_payload = {
      //     im_id: res?.data?.data?.im_id,
      //     im_data: {
      //       ...MainData.im_data,
      //       im_is_debit_created: true,
      //       // im_status: "Posted"
      //     }

      //   }
      //   delete update_post_payload.im_data.im_invoicenumber
      //   let res3 = await putDataFromApi(formConfig.apiEndpoints.update, update_post_payload);
      // }


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
      setTabOpen(true);
      if (useFor == "button") {
        navigate("/operation/invoice-listing")
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



  } catch (ex) {
    // console.log("error :", ex)

  }
  finally {
    setIsPopupOpen(false);
    setIsOverlayLoader(false)
  }
};
export const handleInvoiceStubUpdate = async (
  formData,
  formConfig,
  setIsOverlayLoader,
  setIsPopupOpen,
  type,
  navigate,
  setFormData,
  setTabOpen,
  useFor = "",
  masterResponse,
  EditRecordId
) => {
  let payloadData = {
    "im_id": EditRecordId,
    "im_invoicenumber": formData[0].im_invoicenumber,
    "im_invoice_date": formData[0].im_invoice_date,
    "iv_jireference": formData[0].im_invoicenumber,

    "fk_client": formData[0].fk_clientid,
    // "fk_company": formData[0].fk_company,
    "fk_invoice_branchid": formData[0].fk_invoice_branchid,
    // "im_total": 15000.75,
    // "im_balance": 5000.25,
    // "im_paid": 10000.50,
    // "im_creditnote": 500.00,
    "im_invoiceurl": formData[0].im_invoiceurl,
    "im_status": formData[0]?.im_status,
    "im_paymentmode": formData[0].im_paymentmode,
    "fk_im_state": formData[0].fk_im_state,
    "im_currency_code": formData[0].im_currency_code,
    "im_tax_type": formData[0].im_tax_type,
    "im_tax_classification": formData[0].im_tax_classification,
    "im_billtoplace": formData[0].im_billtoplace,
    "im_shiptoplace": formData[0].im_shiptoplace,
    "im_naration_no": formData[0].im_naration_no,
    "im_creditnote": formData[0].im_creditnote,
    "im_workorderno": formData[0].iv_jireference,
    "iv_jireference": formData[0].iv_jireference,
    "im_workorderdate": formData[0].iv_work_order_date,

    // "invoice_details": invoice_details
  };
  payloadData.im_status = type == "Generated" ? "Generated" : "Posted";
  let res;
  let res2
  let MainData = payloadData;
  let arr = []
  arr.push(MainData);
  res = await postDataFromApi("/invoice/dump_or_update_data/", arr);
  res2 = await postDataFromApi("/invoice/updateFromTally/", MainData);
  if (res2?.data?.status === 200) {
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
    navigate("/operation/tally-list");
  }
  if (res?.data?.status === 200) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        0: {
          ...prevFormData[0],
          ...res?.data?.data
        },
      };
    });
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
    setTabOpen(true);

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
  if (useFor == "button") {
    navigate("/operation/invoice-listing")
  }
};
export const getAllInvoiceDetailsData = async (
  setTableData,
  formData,
  setFormData,
  section,
  activityID,
  OpsActivityName,
  EditRecordId = "",
  setIsOverlayLoader,
  tableData = []
) => {
  try {
    setIsOverlayLoader(true)
    const bodyData = {
      im_id: formData[0]?.im_id || EditRecordId
    };
    let res = await postDataFromApi(getInvoiceRetriveApi, bodyData);
    if (res?.data?.status === 200 && res.data.data) {
      res.data.data = {
        ...res.data.data,
        ...res.data.data.im_courier_details_json
      };
      res.data.data.actual_work_branch = res?.data?.data?.actual_work_branch?.br_code || "--"
      res.data.data.iv_work_order_date = res?.data?.data?.im_workorderdate || ""
      const responseData = res.data.data.invoice_details;
      let updatedFormData;
      if (!updatedFormData) {
        updatedFormData = { ...formData };
      }
      let i = 0;


      let actualResponseData = responseData?.filter((singleInvoiceData) => {
        let storeactivities = []

        if (!updatedFormData[1]) {
          updatedFormData[1] = {};
        }
        tableData.map((row, i) => {
          section.rows.forEach((row) => {
            row.forEach((columnName) => {
              const fieldName = `${columnName.name}_${i}`;
              updatedFormData[1][fieldName] = "";
            })
          })
          updatedFormData[1]["activities_" + i] = ''
          updatedFormData[1]["ivd_ref_nos_" + i] = ''
          updatedFormData[1]['ivd_rate_group_' + i] = '';
        })
        if (singleInvoiceData?.ivd_status != "rejected") {
          section.rows.forEach((row) => {
            row.forEach((columnName) => {
              if (columnName.name === "fk_activitymaster") {
                updatedFormData[1]['fk_activitymaster_' + i] = singleInvoiceData?.activitymaster?.am_id;

              }
              else {
                const fieldName = `${columnName.name}_${i}`;
                const value = singleInvoiceData[columnName.name];
                updatedFormData[1][fieldName] = value;
              }
            });
          });
        }
        i++;
        return true;
      });
      // section.rows.forEach((row) => {
      //   row.forEach((columnName) => {
      //     if (columnName.name === "fk_activity_id") {
      //       updatedFormData[1]['fk_activity_id_' + responseData.length] = OpsActivityName;
      //     }
      //     else {
      //       const fieldName = `${columnName.name}_${responseData.length}`;
      //       updatedFormData[1][fieldName] = '';
      //     }
      //   });
      // });
      if (res.data.data.im_is_regular === "revised") {
        res.data.data.im_is_regular = "Revised"
      }
      updatedFormData[0] = {
        ...updatedFormData[0],
        ...res.data.data,
        fk_client: res.data.data?.client?.cust_name,
        fk_clientid: res.data.data?.client?.cust_id,
        ji_client_address: res.data.data?.client?.cust_address,
        ji_client_gst: res.data.data?.client?.cust_gstno,
        state_of_client: res.data.data?.client?.state?.state_name,
      };
      updatedFormData[0]['is_recordChanged'] = 1
      let result = actualResponseData;
      result = result.filter((singleData, j) => {
        if (singleData?.ivd_status != "rejected") {
          section.rows.forEach((row) => {
            row.forEach((columnName) => {
              if (columnName.name === "fk_activitymaster") {
                updatedFormData[1]['fk_activitymaster_' + j] = singleData.activitymaster.am_name;
              }
              else {
                const fieldName = `${columnName.name}_${j}`;
                const value = singleData[columnName.name];
                updatedFormData[1][fieldName] = value;
              }
            });
          });
        }
        return true
      })

      const groupedTableData = Object.values(
        result?.reduce((acc, { ivd_rate_group, activitymaster, ivd_ref_no, ivd_cc_id, ivd_status, ivd_id, fk_cc_id, ...rest }) => {
          if (ivd_status === "rejected") return acc;
          if (!acc[ivd_rate_group]) {
            acc[ivd_rate_group] = { ivd_rate_group, activities: [], ...rest, ivd_ref_nos: [], ivd_cc_ids: [] };
          }
          acc[ivd_rate_group]?.activities?.push({ ...activitymaster, ivd_id, fk_cc_id });
          acc[ivd_rate_group].ivd_ref_no = ivd_ref_no;
          // acc[ivd_rate_group]?.ivd_ref_nos?.push(...ivd_ref_nos);
          // acc[ivd_rate_group]?.ivd_cc_ids?.push(...ivd_cc_ids);
          return acc;
        }, {})
      );
      groupedTableData?.map((item, itemIndex) => {
        let activitiesOpt = []
        item['activities'].map((activity) => {
          activitiesOpt.push(activity.am_id.toString())
        })

        section.rows.map((row, rowIndex) => {
          row.map((cell, cellIndex) => {
            if (cell.name !== "ivd_ref_nos") {
              updatedFormData[1][cell.name + "_" + itemIndex] = item[cell.name]
            }
          })
        })
        updatedFormData[1]["activities_" + itemIndex] = activitiesOpt
        updatedFormData[1]["ivd_ref_nos_" + itemIndex] = item.ivd_ref_no
        updatedFormData[1]['ivd_rate_group_' + itemIndex] = item?.ivd_rate_group;
      })
      setFormData(updatedFormData);
      setTableData(result);
    }
  } catch (error) {
    console.error(error);
  }
  finally {
    setIsOverlayLoader(false)
  }
};
const getIvdIdFromTableData = (am_name, tableData, item, formData, isAdditional, newRowIndex, user) => {
  if (item.JISID && !Array.isArray(item.JISID)) {
    item.JISID = [item.JISID]
  }
  if (isAdditional) {
    const JISID = formData[1]['ivd_rate_group_' + newRowIndex];
    let finalIvdAct = tableData.filter((item) => item.ivd_rate_group == JISID);
    let ivdId = finalIvdAct[0]?.ivd_id
    return ivdId;
  }
  if (!(Type == "IC" || formData[0]?.im_is_regular == "external" || user.role === "LR")) {
    let finalIvd
    let finalIvdAct
    if (Type !== "Advance" && (Type === "CC" || (formData[0]?.im_is_regular?.toLowerCase() == "regular" && !formData[0]?.im_is_manual_with_regular))) {
      const JISID = item.fk_cc_id;
      finalIvd = tableData.filter((item) => item.fk_cc_id == JISID && formData[1]?.[`ivd_rate_group_${newRowIndex}`] === item?.ivd_rate_group);
      finalIvdAct = tableData.filter((item) => item.fk_activitymaster == JISID && formData[1]?.[`ivd_rate_group_${newRowIndex}`] === item?.ivd_rate_group);
    }
    else {
      const JISID = item.JISID?.[0] || item.am_id;
      finalIvd = tableData.filter((item) => item.fk_jis_id == JISID && formData[1]?.[`ivd_rate_group_${newRowIndex}`] === item?.ivd_rate_group);
      finalIvdAct = tableData.filter((item) => item.fk_activitymaster == JISID && formData[1]?.[`ivd_rate_group_${newRowIndex}`] === item?.ivd_rate_group);
    }
    // const JISID = am_name.match(/\d+/)?.[0] || null; 

    // Ensure at least one valid result before accessing ivd_id
    let ivdId = finalIvd.length > 0 ? finalIvd[0]?.ivd_id : finalIvdAct.length > 0 ? finalIvdAct[0]?.ivd_id : null;

    return ivdId;
  }
  else {
    // const JISID = am_name.match(/\d+/)?.[0] || null;
    // let finalIvd = tableData.filter((item) => item.fk_jis_id == JISID);
    // let ivdId = finalIvd.length > 0 ? finalIvd[0]?.ivd_id : null;
    // return ivdId;
    const JISID = item.JISID?.[0] || item.am_id;
    let finalIvd = tableData.filter((item) => item.fk_ic_id == JISID && formData[1]?.[`ivd_rate_group_${newRowIndex}`] === item?.ivd_rate_group);
    let finalIvdAct = tableData.filter((item) => item.fk_activitymaster == JISID && formData[1]?.[`ivd_rate_group_${newRowIndex}`] === item?.ivd_rate_group);
    // Ensure at least one valid result before accessing ivd_id
    let ivdId = finalIvd.length > 0 ? finalIvd[0]?.ivd_id : finalIvdAct.length > 0 ? finalIvdAct[0]?.ivd_id : null;
    return ivdId;
  }


};
const hash = window.location.hash;
const params = new URLSearchParams(hash.split("?")[1]);
const Status = decryptDataForURL(params.get("status"));
const Type = decryptDataForURL(params.get("type"));

export const handleInvoiceDetailsCreateUpdate = async (
  actionSelected,
  editableIndex,
  tableData,
  formData,
  section,
  setSaveClicked,
  setEditableIndex,
  setPopupIndex,
  popupIndex,
  setPopupOpenAssignment,
  setIsBtnClicked,
  setIsOverlayLoader,
  setTableData,
  setFormData,
  activityID,
  OpsActivityName,
  cc_ids,
  filteredOptions,
  groupedTableData,
  isAdditional,
  user
) => {
  try {
    setIsOverlayLoader(true)
    // let groupedArray = Object.values(
    //   tableData?.reduce((acc, { ivd_rate_group, activitymaster, ...rest }) => {
    //     if (!acc[ivd_rate_group]) {
    //       acc[ivd_rate_group] = { ivd_rate_group, activities: [], ...rest };
    //     }
    //     acc[ivd_rate_group]?.activities?.push(activitymaster);
    //     if (acc?.[ivd_rate_group]?.["ivd_status"] !== "rejected") {
    //       return acc;
    //     }
    //     else {
    //       return []
    //     }
    //   }, {})
    // );
    let groupedArray = Object.values(
      tableData?.reduce((acc,
        { ivd_rate_group,
          activitymaster,
          ivd_ref_nos,
          ivd_cc_ids,
          ivd_ref_no,
          ivd_cc_id,
          ivd_status,
          ivd_id,
          ...rest }) => {
        if (ivd_status === "rejected") return acc;
        if (!acc[ivd_rate_group]) {
          acc[ivd_rate_group] = { ivd_rate_group, activities: [], ...rest, ivd_ref_nos: [], ivd_cc_ids: [], ivd_ref_no, ivd_cc_id };
        }
        acc[ivd_rate_group]?.activities?.push({ ...activitymaster, ivd_id });
        acc[ivd_rate_group]?.ivd_ref_nos?.push(...(Array.isArray(ivd_ref_nos) ? ivd_ref_no : [ivd_ref_no]));
        acc[ivd_rate_group]?.ivd_cc_ids?.push(...(Array.isArray(ivd_cc_ids) ? ivd_cc_id : [ivd_cc_id]));
        acc[ivd_rate_group]?.ivd_cc_ids?.push(...(Array.isArray(ivd_cc_ids) ? ivd_cc_id : [ivd_cc_id]));
        // acc[ivd_rate_group]?.ivd_ref_no =  ivd_ref_no;
        // acc[ivd_rate_group]?.ivd_cc_id =  ivd_cc_id;
        return acc;
      }, {})
    );
    let indexdata = groupedArray
    if (actionSelected === "customSave") {
      indexdata = groupedTableData
    }
    if (actionSelected === "Save" || actionSelected === "customSave" || actionSelected === "Delete") {
      setIsBtnClicked(true);

      let newRowIndex = editableIndex;
      if (actionSelected === "customSave") {
        newRowIndex = indexdata?.length;
      }
      let valueOfActivity = formData[1]?.["activities_" + newRowIndex]
      valueOfActivity = valueOfActivity?.filter(value => value !== undefined && value !== null);
      let chkicidExists = true
      if (user.role === "LR" && Type != "IC") {
        chkicidExists = !formData[0]?.invoice_details.find((singleData) => !singleData.fk_ic_id)
      }
      if ((valueOfActivity == undefined || valueOfActivity?.length < 1) && actionSelected != "Delete") {
        if ((chkicidExists)) {
          toast.error("Please select at least one activity.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }

      }

      const ivd_data = valueOfActivity?.map((activityID, index) => {

        let indata = {
          ivd_number: formData[0]?.im_invoicenumber,
          fk_im: formData[0]?.im_id,
          ivd_rate: formData[1]?.["ivd_rate_" + newRowIndex],
          ivd_qty: formData[1]?.["ivd_qty_" + newRowIndex],
          ivd_activitytotal:
            (parseFloat(formData[1]?.["ivd_rate_" + newRowIndex]) *
              parseFloat(formData[1]?.["ivd_qty_" + newRowIndex]))?.toFixed(2),
          ivd_rate_unit: formData[1]?.["ivd_rate_unit_" + newRowIndex],
          is_rate_group: true,
          fk_jis_id: activityID,
          tenant: GetTenantDetails(1),
        }
        if (isAdditional && actionSelected === "customSave") {
          // indata.fk_activitymastername=""
          // indata.fk_cc_id=formData[1]?.["fk_cc_id_" + newRowIndex]
          // indata.fk_ic_id=null
          // indata.ivd_ref_no=formData[1]?.["ivd_ref_nos_" + newRowIndex]
          // indata.ivd_status='Completed'
          // indata.fk_cc_number=formData[1]?.["fk_cc_number_" + newRowIndex]
          // indata.fk_activitymaster= activityID
          // indata.fk_jis_id= ''
          return {
            "fk_activitymastername": "",
            "fk_activitymaster": activityID,
            "ivd_rate": formData[1]?.["ivd_rate_" + newRowIndex],
            "ivd_qty": formData[1]?.["ivd_qty_" + newRowIndex],
            "ivd_activitytotal": (parseFloat(formData[1]?.["ivd_rate_" + newRowIndex]) *
              parseFloat(formData[1]?.["ivd_qty_" + newRowIndex]))?.toFixed(2),
            // "fk_cc_id": parseInt(formData[1]?.["fk_cc_id_" + newRowIndex] +'0'+ newRowIndex),
            // "fk_ic_id": parseInt(formData[1]?.["fk_ic_id_" + newRowIndex]+'0'+newRowIndex),
            "fk_cc_id": formData[1]?.["fk_cc_id_" + newRowIndex],
            "fk_ic_id": formData[1]?.["fk_ic_id_" + newRowIndex],
            "fk_im": formData[0]?.im_id,
            "ivd_number": formData[0]?.im_invoicenumber,
            "ivd_ref_no": formData[1]?.["ivd_ref_nos_" + newRowIndex],
            "ivd_status": 'Completed',
            "ivd_rate_group": valueOfActivity[0] + '-' + formData[0]?.im_id + '-' + newRowIndex,
            "ivd_rate_unit": formData[1]?.["ivd_rate_unit_" + newRowIndex],
            "is_additional_status": true
          }
        }
        return indata
      });

      let requiredFields = [{
        id: "ivd_rate",
        label: "Rate",
      },
      {
        id: "ivd_qty",
        label: "Qty",
      },
      {
        id: "ivd_rate_unit",
        label: "Rate Unit",
      }]
      if (actionSelected !== "Delete") {
        for (let obj in ivd_data[0]) {
          if (requiredFields.find((field) => obj === field.id) &&
            (formData[1]?.[obj + "_" + newRowIndex] === undefined || formData[1]?.[obj + "_" + newRowIndex] === "")) {
            toast.error(requiredFields.find((field) => obj === field.id)?.label + " field is required", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          }
        }
      }

      let payload = {
        "ivd_data": ivd_data
      };

      let tempArr = []
      let dataToFilter = tableData;
      if (valueOfActivity?.length > 0) {
        // if (valueOfActivity?.length > 0 && !(Type == "IC")) {
        dataToFilter = dataToFilter.filter((activity) => {
          let isExists = false;
          if ((Type == "IC" || formData[0]?.im_is_regular == "external")) {
            isExists = valueOfActivity
              .map((val) => val?.toString())
              .includes(activity.fk_ic_id?.toString());
          }
          else {
            if (Type !== "Advance" && (Type === "CC" || (formData[0]?.im_is_regular?.toLowerCase() == "regular" && !formData[0]?.im_is_manual_with_regular))) {
              isExists = valueOfActivity
                .map((val) => val?.toString())
                .includes(activity.fk_cc_id?.toString());
            }
            else {
              isExists = valueOfActivity
                .map((val) => val?.toString())
                .includes(activity.fk_jis_id?.toString() || activity.fk_ic_id?.toString());
            }
          }

          if (actionSelected !== "customSave") {
            isExists = isExists && formData[1]?.[`ivd_rate_group_${newRowIndex}`] === activity?.ivd_rate_group
          }
          return isExists
        });
      }
      tempArr = dataToFilter?.map((item) => ({
        ivd_data: {
          ivd_rate: formData[1]?.[`ivd_rate_${newRowIndex}`] || 0,
          ivd_qty: formData[1]?.[`ivd_qty_${newRowIndex}`] || 0,
          ivd_activitytotal:
            ((parseFloat(formData[1]?.[`ivd_rate_${newRowIndex}`]) || 0) *
              (parseFloat(formData[1]?.[`ivd_qty_${newRowIndex}`]) || 0))?.toFixed(2),
          ivd_rate_unit: formData[1]?.[`ivd_rate_unit_${newRowIndex}`] || "",
          ivd_scope_description: formData[1]?.[`ivd_scope_description_${newRowIndex}`] || "",
          ivd_status: actionSelected === "Delete" ? "rejected" : "Completed",
          ivd_rate_group: formData[1]?.[`ivd_rate_group_${newRowIndex}`] || "",
          is_rate_group: true
        },
        ivd_id: item?.ivd_id
      }));
      let IDsForCompletedStatus = dataToFilter?.map((item) => (item?.ivd_id));
      let tempArrDel
      if (actionSelected !== "customSave") {
        let dataToFilterRej
        if (valueOfActivity?.length > 0) {
          dataToFilterRej = tableData.filter((activity) => {
            return !valueOfActivity?.includes(activity.fk_activitymaster)
          })
        }
        if (groupedArray.length > -1) {
          tempArrDel = groupedArray[newRowIndex]?.["activities"]
            ?.filter(item => !IDsForCompletedStatus.includes(getIvdIdFromTableData(item.am_name, tableData, item, formData, isAdditional, newRowIndex, user)))
            ?.map(item => ({
              ivd_data: {
                ivd_rate: formData[1]?.[`ivd_rate_${newRowIndex}`] || 0,
                ivd_qty: formData[1]?.[`ivd_qty_${newRowIndex}`] || 0,
                ivd_activitytotal:
                  ((parseFloat(formData[1]?.[`ivd_rate_${newRowIndex}`]) || 0) *
                    (parseFloat(formData[1]?.[`ivd_qty_${newRowIndex}`]) || 0))?.toFixed(2),
                ivd_rate_unit: formData[1]?.[`ivd_rate_unit_${newRowIndex}`] || "",
                ivd_scope_description: formData[1]?.[`ivd_scope_description_${newRowIndex}`] || "",
                ivd_rate_group: formData[1]?.[`ivd_rate_group_${newRowIndex}`] || "",
                ivd_status: isAdditional ? "Completed" : "rejected",
                is_rate_group: true
              },
              ivd_id: getIvdIdFromTableData(item.am_name, tableData, item, formData, isAdditional, newRowIndex, user)
            }));
        }
      }
      let tempArrForDelete = []

      tempArrForDelete = groupedArray[newRowIndex]?.["activities"]
        ?.map(item => ({
          ivd_data: {
            ivd_rate: formData[1]?.[`ivd_rate_${newRowIndex}`] || 0,
            ivd_qty: formData[1]?.[`ivd_qty_${newRowIndex}`] || 0,
            "ivd_cc_ids": getUniqueData(formData[0].cc_ids),
            "ivd_ref_nos": getUniqueData(formData[0].reference_number),
            ivd_activitytotal:
              ((parseFloat(formData[1]?.[`ivd_rate_${newRowIndex}`]) || 0) *
                (parseFloat(formData[1]?.[`ivd_qty_${newRowIndex}`]) || 0))?.toFixed(2),
            ivd_scope_description: formData[1]?.[`ivd_scope_description_${newRowIndex}`] || "",
            ivd_rate_unit: formData[1]?.[`ivd_rate_unit_${newRowIndex}`] || "",
            ivd_rate_group: formData[1]?.[`ivd_rate_group_${newRowIndex}`] || "",
            ivd_status: "rejected",
            is_rate_group: true
          },
          ivd_id: getIvdIdFromTableData(item.am_name, tableData, item, formData, isAdditional, newRowIndex, user)
        }));
      let updatedpayload = [...tempArr, ...(Array.isArray(tempArrDel) && tempArrDel?.length > 0 ? tempArrDel : [])];
      let deletedPayload = tempArrForDelete;
      let createdPayload = tempArr
      let res;
      // return
      if (actionSelected !== "customSave") {
        if (actionSelected === "Delete") {
          if (isAdditional) {
            res = await deleteDataFromApi(deleteInvoiceApi, {
              ivd_rate_group: formData[1]?.[`ivd_rate_group_${newRowIndex}`]
            });
          }
          else {
            res = await putDataFromApi(updateInvoiceApi, deletedPayload);
          }
        } else {
          payload.ivd_id = tableData[editableIndex].ivd_id;
          res = await putDataFromApi(updateInvoiceApi, updatedpayload);
        }
      }
      else {
        if (isAdditional) {
          res = await postDataFromApi(createBulkInvoices, payload);
        }
        // res = await postDataFromApi(createInvoiceApi, payload);
        else {
          createdPayload = createdPayload.map((singleINVDetails) => {
            delete singleINVDetails?.ivd_data?.ivd_scope_description
            return singleINVDetails
          })
          res = await putDataFromApi(updateInvoiceApi, createdPayload);
        }
      }
      if (res.data.status === 200) {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              is_recordChanged: 0,
            }
          }
        })
        setPopupOpenAssignment(false);
        setPopupIndex("");
        setEditableIndex("");
        setIsBtnClicked(false);
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
        setTimeout(() => {
          getAllInvoiceDetailsData(
            setTableData,
            formData,
            setFormData,
            section,
            activityID,
            OpsActivityName,
            "",
            setIsOverlayLoader,
            tableData
          );
        }, 300)


      } else {
        setIsBtnClicked(false);
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
      setSaveClicked(false);
    } else if (actionSelected === "Delete") {
      setSaveClicked(true);
      let payload = {
        ivd_rate_group: parseInt(tableData[popupIndex]?.ivd_rate_group),
      };
      setSaveClicked(false);
    } else if (actionSelected === "Cancel") {
      setEditableIndex("");
    }
  }
  catch (ex) {
  }
  finally {
    setIsOverlayLoader(false)
  }
};

export const hanfleInvoiceStatusChange = async (
  formData,
  formConfig,
  setIsOverlayLoader,
  status,
  navigate,
  isCancelled,
  remarkText,
) => {
  setIsOverlayLoader(true)
  try {
    let payloadData = {
      "im_data": {
        im_status: status
      }
    }
    let MainData = payloadData;
    MainData.im_id = formData[0].im_id;
    if (isCancelled) {
      payloadData.im_data.im_remark = remarkText;
    }
    let res = await putDataFromApi(formConfig.apiEndpoints.update, MainData);
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
      }, 1000)
    }
  }
  catch (ex) { }
  finally {
    setIsOverlayLoader(false)
  }
}

export const handleCreateDebitFromList = async (row, formConfig, setIsOverlayLoader, navigate) => {
  try {
    setIsOverlayLoader(true)
    let MainData = {
      "im_data": {
        "im_invoicenumber": row.im_invoicenumber,
        "im_invoice_date": moment(row.im_invoice_date).format("YYYY-MM-DD"),
        "fk_client": row.fk_client,
        "im_gst_invoice_number": row.im_gst_invoice_number,
        "fk_invoice_branchid": row.fk_invoice_branchid,
        "fk_actual_work_branchid": row?.fk_actual_work_branchid,
        // "fk_jrf_clientid": row?.fk_jrf_clientid,
        "im_reference_number": row?.im_reference_number,
        "im_invoiceurl": row.im_invoiceurl,
        // "im_status": row.im_status,
        "im_status": "debit_save",
        "im_paymentmode": row.im_paymentmode,
        "fk_im_state": row.fk_im_state,
        "im_currency_code": row.im_currency_code,
        "im_tax_type": row.im_tax_type,
        "im_voucher_type": row.im_voucher_type,
        "im_tax_classification": row.im_tax_classification,
        "im_salespersonid": row.im_salespersonid,
        "im_billtoplace": row.im_billtoplace,
        "im_shiptoplace": row.im_shiptoplace,
        "im_total": row.im_total,
        "im_naration_no": row.im_naration_no,
        "im_creditnote": row.im_creditnote,
        "im_workorderno": row.iv_jireference,
        "iv_jireference": row.iv_jireference,
        "im_workorderdate": row.im_workorderdate,
        "im_is_regular": row.im_is_regular,
        "im_is_manual_with_regular": true,
        "im_is_invoice": false,
        "im_is_debit_created": true,
        tenant: GetTenantDetails(1),

      },
      "invoice_details": row.invoice_details.map((singleData) => {
        delete singleData.fk_im
        delete singleData.acvitymaster
        delete singleData.ivd_id
        return singleData
      })
    };
    let res;
    // return
    res = await postDataFromApi(formConfig.apiEndpoints.create, MainData);
    if (res?.data?.status === 200) {
      res.data.data.actual_work_branch = res?.data?.data?.actual_work_branch?.br_code || "--"
      let update_payload = {
        im_id: row.im_id,
        im_data: {
          ...MainData.im_data,
          fk_debit_imid: res.data.data.im_id,
          im_is_debit_created: true,
          im_status: "invoice_generated"
        }

      }
      let res2 = await putDataFromApi(formConfig.apiEndpoints.update, update_payload);
      if (res2?.data?.status === 200) {
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
          navigate(
            `/operation/invoice-listing/create-debit/${encryptDataForURL(
              res.data.data.im_id
            )}` + "?status=" +
            encryptDataForURL("Edit")
          );
        }, 10)
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
  } catch (error) {

  }
  finally {
    setIsOverlayLoader(false)
  }

}