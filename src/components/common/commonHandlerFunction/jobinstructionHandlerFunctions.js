import { toast } from "react-toastify";
import {
  deleteDataFromApi,
  getDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../services/commonServices";
import {
  createManPowerApi,
  createOPSExecApi,
  deleteManPowerApi,
  deleteInvoiceApi,
  deleteOPSExecApi,
  getActivityDataApi,
  getActivityDatabyOperationApi,
  getActivityListDatabyjiApi,
  getAllPortDataApi,
  getBranchDetailsApi,
  getClientDataApi,
  getCompanyBranchApi,
  getConsortiumOrderApi,
  getfirstrefnumberApi,
  getJIForPreviewApi,
  getJIQualityAnalysisCreateApi,
  getJIQualityAnalysisDeleteApi,
  getJIQualityAnalysisUpdateApi,
  getJIsowandactivityApi,
  getLoadingPortDataApi,
  getManPowerApi,
  getInvoiceDetailsApi,
  getInvoiceRetriveApi,
  getOperationTypeApi,
  getOperationTypeDataApi,
  getOPSExecApi,
  getSamplingMethodsApi,
  getscopeofworkDataApi,
  getScopeworkCreateApi,
  getScopeworkDeleteApi,
  getScopeworkUpdateApi,
  getSubCommodityDataApi,
  jobinstructionDeleteApi,
  labdropdownApi,
  MasterListApi,
  OPESGrouoparametersApi,
  getAssignemtnLabDropdownApi,
  sampleMarkOptionsLotWiseApi,
  updateManPowerApi,
  updateInvoiceApi,
  createInvoiceApi,
  getJiForCCApi
} from "../../../services/api";
import { encryptDataForURL, decryptDataForURL } from "../../../utills/useCryptoUtils";
import { getComonCodeForCompany, getLMSOperationActivity, getVesselOperation, getOperationActivityUrl, getActivityCode, getPlantOperations } from "../../../services/commonFunction";
import { singleQuote } from "pdf-lib";
import { useSelector, useDispatch } from "react-redux";
import { store } from '../../../services/store';
import { getUniqueData } from "../../../services/commonFunction";
export const handleJIValidation = async (
  handleSubmit,
  setJRFCreationType,
  setIsPopupOpen,
  type
) => {
  let isValidate = handleSubmit();
  // if (!isValidate) {
  //   return false;
  // }
  setJRFCreationType(type);
  setIsPopupOpen(true);
};

export const getcheckStatus = (
  currentStatus,
  recordType,
  type,
  mainStatus,
  subTableData
) => {
  if (mainStatus) {
    return mainStatus;
  }
  if (!currentStatus) {
    return "saved";
  } else {
    if (!recordType) {
      if (currentStatus === "saved") {
        return "created";
      }
      return currentStatus;
    } else {
      if (recordType === "analysis") {
        if (currentStatus === "created") {
          return "pre-analysis";
        } else if (currentStatus === "pre-analysis") {
          return "analysis";
        }
        return currentStatus;
      } else if (recordType === "nomination") {
        if (type === "post") {
          return "posted";
        }
        return currentStatus;
      }
    }
  }
};

export const handleJICreateOrUpdate = async (
  formData,
  formConfig,
  setIsOverlayLoader,
  setIsPopupOpen,
  type,
  setTabOpen,
  setFormData,
  editReordType,
  navigate,
  setSubTableData,
  subTableData,
  isNotShowMsg,
  setMainJISaved
) => {
  let payloadData = {
    ji_date: formData[0].ji_date,
    fk_clientid: formData[0].fk_clientid,
    fk_companyid: formData[0].fk_companyid,
    ji_sent_through: Array.isArray(formData[0].ji_sent_through) ? formData[0].ji_sent_through.join(',') : formData[0].ji_sent_through,
    fk_commodityid: formData[0].fk_commodityid,
    fk_subcommodityid: formData[0].fk_subcommodityid,
    ji_totalqty: formData[0].ji_totalqty,
    ji_appointed_totalqty: formData[0].ji_appointed_totalqty,
    // ji_is_hardcopy: formData[0]?.ji_is_hardcopy?.includes("Print Hard Copy") ? true : false,
    ji_is_hardcopy: true,
    ji_is_ecertification: true,
    fk_supplierid: formData[0].fk_supplierid,
    ji_reference: formData[0].ji_reference,
    ji_work_date: formData[0].ji_work_date,
    ji_dispatch_address: formData[0].ji_dispatch_address,
    ji_payment_terms: formData[0].ji_payment_terms,
    ji_type_of_sampling: formData[0].ji_type_of_sampling,
    ji_type_of_analysis: formData[0].ji_type_of_analysis,
    ji_analysis: formData[0].ji_analysis,
    fk_branchid: formData[0].fk_branchid,
    fk_userbranchheadid: formData[0].fk_userbranchheadid,
    fk_userbranchcaptainid: formData[0].fk_userbranchcaptainid,
    fk_useropsexecutiveid: formData[0].fk_useropsexecutiveid,
    fk_useropsexecutiveheadid: formData[0].fk_useropsexecutiveheadid
      ? parseInt(formData[0].fk_useropsexecutiveheadid)
      : "",
    fk_usersalespersonid: formData[0].fk_usersalespersonid,
    ji_nameofoperationmode: formData[0].ji_nameofoperationmode,
    fk_operationtypetid: formData[0].fk_operationtypetid,
    ji_is_supplier: formData[0].ji_is_supplier === "Supplier" ? 1 : 0,
    ji_port: formData[0].ji_port,
    ji_is_loading: formData[0].ji_is_loading === "Loading" ? 1 : 0,
    ji_loading_unloading_name: formData[0].ji_loading_unloading_name,
    ji_sampling_methods: formData[0].ji_sampling_methods,
    ji_with_whom: formData[0].ji_with_whom,
    ji_analysis_with_whom: formData[0].ji_analysis_with_whom,
    ji_client_billing_address: formData[0].ji_client_billing_address,
    ji_client_email: formData[0].ji_client_email,
    ji_total_qty_unit: formData[0].ji_total_qty_unit || "MT",
    ji_appointed_qty_unit: formData[0].ji_appointed_qty_unit || "MT",
    ji_is_consortium_order:
      formData[0].ji_is_consortium_order === "Yes" ? true : false,
    fk_consortium_order: formData[0].fk_consortium_order,
    ji_eta: formData[0].ji_eta,
    ji_is_dual_port: formData[0].ji_is_dual_port === "Yes" ? true : false,
    ji_first_ref_no: formData[0].ji_first_ref_no,
    fk_loading_unloading_country: formData[0].fk_loading_unloading_country,
    fk_loading_unloading_port: formData[0].fk_loading_unloading_port,
    ji_billing: formData[0]?.ji_billing,
    ji_is_plot_no: formData[0].ji_is_plot_no === "Yes" ? true : false,
    ji_is_monthly: formData[0].ji_is_monthly === "Yes",
    ji_plot_no: formData[0].ji_plot_no,
    ji_month_name: formData[0].ji_month_name,
    ji_client_cc_emails: formData[0].ji_client_cc_emails,
    ji_other_placework: formData[0].ji_other_placework,
    ji_loading_destination: formData[0].ji_loading_destination,
    fk_placeworkid: formData[0].fk_placeworkid,
    ji_additional_remark: formData[0].ji_additional_remark,
    ji_dos: formData[0].ji_dos,
    ji_no_of_sample: formData[0].ji_no_of_sample,
    ji_work_order_2: formData[0].ji_work_order_2,
    ji_work_date_2: formData[0].ji_work_date_2,
    tenant: GetTenantDetails(1)
  };
  payloadData.ji_dual_port_seq = 1;
  payloadData.ji_first_ref_no = "";
  if (payloadData.ji_is_dual_port) {
    payloadData.ji_dual_port_seq =
      formData[0].ji_dual_port_seq === "First" ? 1 : 2;
    if (payloadData.ji_dual_port_seq == 2) {
      payloadData.ji_first_ref_no = formData[0].ji_first_ref_no;
    }
  }
  if (type === "post") {
    payloadData.status = "posted";
  } else {
    payloadData.status = "created";
  }
  let res;
  if (
    !formData[0].ji_id ||
    formData[0]?.ji_internal_status === "created" ||
    payloadData.status === "posted"
  ) {
    payloadData.ji_internal_status = getcheckStatus(
      formData[0]?.ji_internal_status,
      editReordType,
      type,
      "",
      subTableData
    );
  }
  if (payloadData.ji_internal_status === "pre-analysis") {
    payloadData.status = "updating";
  }
  if (['posted', 'accepted'].includes(formData?.[0]?.status)) {
    payloadData.status = formData?.[0]?.status;
    payloadData.ji_internal_status = formData?.[0]?.ji_internal_status;
  }
  setIsOverlayLoader(true);
  if (formData[0].ji_id) {
    if (formData[0].ji_internal_status === "rejected" && payloadData.status === "posted") {
      payloadData.ji_internal_status = "posted";
      payloadData.is_rejected_record = true;
    }
    let MainData = {
      job_inst_data: payloadData,
    };
    MainData.ji_id = formData[0].ji_id;
    res = await putDataFromApi(formConfig.apiEndpoints.update, MainData);
  } else {
    // payloadData.send_email=true
    let MainData = {
      job_inst_data: payloadData,
    };
    res = await postDataFromApi(formConfig.apiEndpoints.create, MainData);
  }
  if (res?.data?.status === 200) {
    if (!isNotShowMsg) {
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
    }

    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    let responseData = res.data.data;
    setSubTableData([]);
    getSingleJiRecord(
      formConfig.apiEndpoints.read,
      responseData.ji_id,
      setFormData,
      setTabOpen,
      setIsOverlayLoader,
      editReordType
    );
    if (setMainJISaved) {
      setMainJISaved(true)
    }
    if (!formData[0].ji_id) {

      // navigate(
      //   "/operation/jrfInstructionListing/job-instruction/" +
      //   encryptDataForURL(res.data.data.ji_id)
      // );
      // setTimeout(() => {
      //   window.location.reload();
      // }, 10);
    }
    if (type === "post") {
      navigate("/operation/jrfInstructionListing");
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
  setIsPopupOpen(false);
  setIsOverlayLoader(false);
};
export const handleJobInstructionDelete = async (
  ji_id,
  setIsDelete,
  getAllListingData,
  setPopupIndex
) => {
  let deleteBody = {
    ji_id: ji_id,
  };
  let res = await deleteDataFromApi(jobinstructionDeleteApi, deleteBody);

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
export const handleJIUpdateStatus = async (
  formData,
  formConfig,
  setIsOverlayLoader,
  editReordType,
  navigate,
  isMainStatusChange,
  mainStatus = "",
  remarkText = "",
  subTableData,
  isForAllData,
  isCancelled
) => {
  let newStatus = getcheckStatus(
    formData[0]?.ji_internal_status,
    editReordType,
    "fillNew",
    mainStatus,
    subTableData
  );
  if (newStatus === "created") {
    if (['CS', 'TL', 'DS', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
      newStatus = "pre-analysis"
    }
  }
  let payloadData = {
    ji_internal_status: newStatus,
  };
  if (newStatus === "pre-analysis") {
    payloadData.status = "updating";
  }
  if (isMainStatusChange) {
    payloadData.status = mainStatus;
    if (isCancelled) {
      payloadData.ji_cancel_description = remarkText;
    }
    else {
      payloadData.ji_remark = remarkText;
    }
  }
  if (isForAllData) {
    payloadData.ji_appointed_totalqty = formData[0].ji_appointed_totalqty
    payloadData.ji_totalqty = formData[0].ji_totalqty
    payloadData.ji_nameofoperationmode = formData[0].ji_nameofoperationmode
  }
  let res;
  setIsOverlayLoader(true);
  let MainData = {
    job_inst_data: payloadData,
  };

  MainData.ji_id = formData[0].ji_id;
  res = await putDataFromApi(formConfig.apiEndpoints.update, MainData);
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
    // let responseData = res.data.data;
    if (isMainStatusChange) {
      navigate('/operation/jrfInstructionListing');
    } else {
      navigate(
        !editReordType
          ? "/operation/jrfInstructionListing/job-instruction-analysis/" +
          encryptDataForURL(formData[0]?.ji_id) +
          "/" +
          encryptDataForURL("analysis")
          : "/operation/jrfInstructionListing/job-instruction-nomination/" +
          encryptDataForURL(formData[0]?.ji_id) +
          "/" +
          encryptDataForURL("nomination")
      );
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
  setIsOverlayLoader(false);
};
export const getSubCommodityData = async (
  cmd_id,
  setMasterResponse,
  setIsOverlayLoader,
  fieldName
) => {
  try {
    setIsOverlayLoader(true);
    // let res = await postDataFromApi(getSubCommodityDataApi, {
    //   cmd_id: cmd_id,
    // });
    let res = await postDataFromApi(getSubCommodityDataApi + "?page=1&search=", {
      cmd_id: cmd_id,
      is_dropdown: true,
      search_text: "",
      tenant: 1
    });
    if (res?.data?.status === 200 && res.data) {
      const clientData = res.data.data?.map((client) => ({
        id: client.sub_cmd_id,
        name: client.sub_cmd_name,
      }));
      const bodyToPass = {
        model: fieldName ? fieldName : "fk_subcommodityid",
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      setIsOverlayLoader(false);
    }, 10);
  }
};
export const getclientDetails = async (
  customer_id,
  setFormData,
  setIsOverlayLoader,
  formData,
  isBillingchange
) => {
  try {
    setIsOverlayLoader(true);
    let res = await postDataFromApi(getClientDataApi, {
      customer_id: customer_id,
    });
    if (res?.data?.status === 200 && res.data.data) {
      let responseData = res.data.data;
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ji_client_address: responseData.cust_address,
            ji_client_billing_address: isBillingchange ? formData?.[0]?.ji_client_billing_address : responseData.cust_billingaddress || responseData.cust_address,
            ji_client_email: isBillingchange ? formData?.[0]?.ji_client_email : (responseData.cust_email && responseData.cust_email != "NULL" ? responseData.cust_email : ''),
            ji_client_gst: responseData.cust_gstno,
            im_gst_invoice_number: responseData.cust_gstno,
            jrf_ext_orgnizationname: responseData.cust_name,
            jrf_ext_address: responseData.cust_address,
            state_of_client: responseData?.state?.state_name || '--',
            "im_billtoplace": responseData?.state?.state_name || '--',
            "im_shiptoplace": responseData?.state?.state_name || '--',
          },
        };
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      setIsOverlayLoader(false);
    }, 10);
  }
};
export const getclientDetailsJRF = async (
  customer_id,
  setFormData,
  setIsOverlayLoader,
  formData,
  isBillingchange
) => {
  try {
    setIsOverlayLoader(true);
    let res = await postDataFromApi(getClientDataApi, {
      customer_id: customer_id,
    });
    if (res?.data?.status === 200 && res.data.data) {
      let responseData = res.data.data;
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            im_gst_invoice_number: responseData.cust_gstno,
            jrf_ext_orgnizationname: responseData.cust_name,
            jrf_ext_address: responseData.cust_address,
            jrf_ext_contactpersonemail: responseData.cust_email != "NULL" ? responseData.cust_email : "",
            jrf_ext_gstno: responseData.cust_gstno,
          },
        };
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      setIsOverlayLoader(false);
    }, 10);
  }
};

export const handleScopeOfWorkFunction = async (
  actionSelected,
  editableIndex,
  tableData,
  simpleInwardId,
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
  getOPScopeWorkData,
  setUpdatedMasterOptions
) => {
  try {

    setIsOverlayLoader && setIsOverlayLoader(true)
    if (actionSelected === "Save" || actionSelected === "customSave") {
      setIsBtnClicked(true);
      let newRowIndex = editableIndex;
      if (actionSelected === "customSave") {
        newRowIndex = tableData.length;
      }
      let payload = {
        ji_scopeofwork: {
          fk_jiid: formData[0]?.ji_id,
          // jis_loading_or_soure_id: formData["1"]?.["jis_loading_or_soure_id_" + newRowIndex],
          // jis_loading_or_soure: formData["1"]?.["jis_loading_or_soure_id_" + newRowIndex],
          // jis_discharge_or_destination_id:
          //   formData["1"]?.["jis_discharge_or_destination_id_" + newRowIndex],
          // jis_discharge_or_destination:
          //   formData["1"]?.["jis_discharge_or_destination_id_" + newRowIndex],

          // fk_port_loading:
          //   formData["1"]?.["jis_loading_or_soure_id_" + newRowIndex],
          // fk_port_unloading:
          //   formData["1"]?.["jis_discharge_or_destination_id_" + newRowIndex],
          // jis_nameofopsmode:
          //   formData["1"]?.["jis_nameofopsmode_" + newRowIndex],
          // fk_operationtypetid:
          //   formData["1"]?.["fk_operationtypetid_" + newRowIndex],
          // fk_scopeworkid: formData["1"]?.["fk_scopeworkid_" + newRowIndex],
          // jis_scopeofwork: formData["1"]?.["fk_scopeworkid_" + newRowIndex],
          fk_activitymasterid:
            formData["1"]?.["fk_activitymasterid_" + newRowIndex],
          jis_unit: formData["1"]?.["jis_unit_" + newRowIndex],
          jis_rate: formData["1"]?.["jis_rate_" + newRowIndex],
          // formData["1"]?.["jis_rate_" + newRowIndex] +
          // " " +
          // (formData["1"]?.["jis_rate_unit_" + newRowIndex]
          //   ? formData["1"]?.["jis_rate_unit_" + newRowIndex]
          //   : "INR"),
          // jis_qty: formData["1"]?.["jis_qty_" + newRowIndex],
          // jis_total_rate: formData["1"]?.["jis_total_rate_" + newRowIndex],
          tenant: GetTenantDetails(1),
          status: "tasked",
        },
      };
      let nonRequiredFields = [];

      for (let obj in payload.ji_scopeofwork) {
        if (
          (payload["ji_scopeofwork"][obj] === undefined ||
            payload["ji_scopeofwork"][obj] === "") &&
          !nonRequiredFields.includes(obj)
        ) {
          const field = section.rows[0].filter((field, index) => {
            if (field.name === obj) {
              field.label = section.headers[index].label;
              return true;
            }
            return false;
          });
          let errLabel = field.length ? field[0].label : obj;
          toast.error(errLabel + " is required", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsBtnClicked(false);
          return;
        }
      }

      let res;

      if (actionSelected !== "customSave" && tableData[editableIndex].jis_id) {
        let newMainPayload = {};
        newMainPayload.jis_id = tableData[editableIndex].jis_id;
        newMainPayload.ji_scopeofwork = payload.ji_scopeofwork;
        res = await putDataFromApi(getScopeworkUpdateApi, newMainPayload);
      } else {
        res = await postDataFromApi(getScopeworkCreateApi, payload);
      }
      if (res.data.status === 200) {
        getJIsowandactivityData(
          formData[0]?.ji_id,
          setTableData,
          "scope_of_work",
          formData,
          setFormData,
          section,
          null,
          null,
          null,
          null,
          getOPScopeWorkData,
          setUpdatedMasterOptions
        );
        setPopupOpenAssignment(false);
        setPopupIndex("");
        setEditableIndex("");
        setIsBtnClicked(false);
        setIsOverlayLoader(false);
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
        setIsBtnClicked(false);
        setIsOverlayLoader(false);
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
      setIsOverlayLoader(false);
    } else if (actionSelected === "Delete") {
      setSaveClicked(true);
      let payload = {
        jis_id: tableData[popupIndex]?.jis_id,
      };
      setIsOverlayLoader(true);
      let res = await deleteDataFromApi(getScopeworkDeleteApi, payload);
      if (res.data.status === 200) {

        getJIsowandactivityData(
          formData[0]?.ji_id,
          setTableData,
          "scope_of_work",
          formData,
          setFormData,
          section,
          null,
          null,
          null,
          null,
          getOPScopeWorkData,
          setUpdatedMasterOptions,
          "",
          "",
          1,
          tableData.length - 1
        );
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
      setIsOverlayLoader(false);
      setSaveClicked(false);
    } else if (actionSelected === "Cancel") {
      setEditableIndex("");
    }
  }
  finally {
    setIsOverlayLoader && setIsOverlayLoader(false)
  }
};

export const getSingleJiRecord = async (
  apiEndpoint,
  ji_id,
  setFormData,
  setTabOpen,
  setIsOverlayLoader,
  editReordType,
  moduleType,
  formConfig,
  setSubTableData,
  sections,
  isMainJiSaved,
  role,
  OperationType,
  JISID,
  operationMode,
  OpsConfigID
) => {
  // const session = useSelector((state) => state.session);
  const state = store.getState();
  const session = state.session;
  try {
    setIsOverlayLoader(true);
    let payload = {
      ji_id: ji_id,
    }
    let res
    if (
      (moduleType === "vesselJICertificate" ||
        moduleType === "operationCertificate") && formConfig?.['sections']?.[0]?.moduleSubType != "ConfigurationCertificate" && (['TR', 'TRUCK'].includes(operationMode.toUpperCase()) || OperationType === getPlantOperations('TR')) && OpsConfigID
    ) {
      payload.config_id = OpsConfigID
      res = await postDataFromApi(getJiForCCApi, payload);
    }
    else {
      res = await postDataFromApi(apiEndpoint, payload);
    }
    if (res?.data?.status === 200 && res.data.data) {
      let responseData = res.data.data;
      if (
        moduleType === "vesselJICertificate" ||
        moduleType === "operationCertificate"
      ) {
        delete res.data.data.ji_date
        // setFormData((prevFormData) => {
        //   return {
        //     ...prevFormData,
        //     0: {
        //       ...prevFormData[0],
        //       cc_accountof: res.data.data.company.company_name,
        //       cc_supp_buyer: res.data.data.fk_supplierid,
        //       cc_fk_place_pf_work_id: res.data.data.fk_placeworkid,
        //     },
        //   };
        // });
        responseData.cc_accountof = responseData?.company.company_name
        responseData.cc_supp_buyer = responseData?.fk_supplierid
        responseData.cc_fk_place_pf_work_id = responseData?.fk_placeworkid
        responseData.cc_fk_sub_commodity_id = responseData?.fk_subcommodityid
        responseData.cc_other_placework = responseData?.ji_other_placework
        responseData.cc_place_of_work_name = responseData.place_of_work.pow_name;
        responseData.cc_appointed_totalqty = responseData?.ji_appointed_totalqty
        responseData.cc_appointed_qty_unit = responseData?.ji_appointed_qty_unit
        if ((['TR', 'TRUCK'].includes(operationMode.toUpperCase()) || OperationType === getPlantOperations('TR')) && OpsConfigID) {
          responseData.cc_appointed_totalqty = responseData?.total_jism_quantity
        }
      } else {
        if (!editReordType) {
          setFormData((prevFormData) => {
            return {
              ...prevFormData,
              0: "",
              1: "",
            };
          });
        }

      }

      setTabOpen(false);

      // responseData.ji_is_hardcopy = responseData.ji_is_hardcopy
      //   ? ["Print Hard Copy"]
      //   : ["E-Certificate"];
      let tempArr = []
      // if (res.data.data.ji_is_ecertification) {
      //   tempArr.push("E-Certificate");
      // }
      // if (res.data.data.ji_is_hardcopy) {
      //   tempArr.push("Print Hard Copy");
      // }
      // responseData.ji_is_ecertification = tempArr;
      responseData.ji_is_supplier = responseData.ji_is_supplier
        ? "Supplier"
        : "Buyer";
      responseData.ji_is_loading = responseData.ji_is_loading
        ? "Loading"
        : "Unloading";
      responseData.ji_is_consortium_order = responseData.ji_is_consortium_order
        ? "Yes"
        : "No";
      responseData.ji_is_dual_port = responseData.ji_is_dual_port
        ? "Yes"
        : "No";
      responseData.ji_is_plot_no = responseData.ji_is_plot_no
        ? "Yes"
        : "No";
      responseData.ji_is_monthly = responseData.ji_is_monthly
        ? "Yes"
        : "No";
      responseData.ji_dual_port_seq =
        responseData.ji_dual_port_seq == "2" ? "Second" : "First";
      responseData.ji_client_name = responseData.client_details.client_name + `(${responseData.client_details.client_gst_no})`;
      responseData.ji_client_address =
        responseData.client_details.client_address;

      responseData.ji_client_gst = responseData.client_details.client_gst_no;
      // responseData.ji_client_state = responseData.client_details.state || '-';
      responseData.ji_commodity_name = responseData.commodity_details.cmd_name;
      responseData.ji_sub_commodity_name =
        responseData.sub_commodity.sub_cmd_name;
      // responseData.ji_company_name = getComonCodeForCompany(
      //   responseData.company.company_code
      // );
      responseData.ji_company_name = responseData.company.company_name;
      //company_name
      responseData.ji_place_of_work_name = responseData.place_of_work.pow_name;
      // responseData.ji_place_of_work_name = responseData.place_of_work.pow_name + `${responseData.ji_is_plot_no && responseData.ji_plot_no ? ',' + responseData.ji_plot_no : ''}`;
      responseData.ji_suplier_name = responseData?.supplier?.supplier_name;
      responseData.operation_type_name =
        responseData.operation_type.operation_type_name;
      responseData.ji_branch_name = responseData?.branch?.branch_name + ` (${responseData?.branch?.branch_code})`
      // responseData.branch_head_id =
      //   responseData?.branch_head?.branch_head_id;
      responseData.ji_branch_head_name = responseData?.branch_head ?
        responseData?.branch_head?.branch_head_name + `${responseData?.branch_head?.branch_head_emp_id ? '(' + responseData?.branch_head?.branch_head_emp_id + ')' : ''}` : "";
      responseData.ji_branch_ex_name =
        responseData?.ops_executive?.ops_executive_name;
      responseData.ji_branch_ex_heade_name =
        responseData?.ops_executive_head?.ops_executive_head_name;
      responseData.ji_branch_sales_person_name =
        responseData?.sales_person?.sales_person_name;
      responseData.consortium_number =
        responseData?.consortium_order?.consortium_order_number;
      responseData.ji_branch_sales_person =
        responseData?.sales_person?.sales_person_id;
      responseData.cc_accountof = res.data.data.company.company_name;
      responseData.loading_unloading_country_name =
        responseData?.loading_unloading_country?.country_name || '-';
      responseData.loading_unloading_port_name =
        responseData?.loading_unloading_port?.port_name || '-';
      responseData.ji_sent_through =
        responseData?.ji_sent_through ? responseData?.ji_sent_through.split(',') : '-';
      responseData.consortium_number = responseData?.consortium_order?.consortium_order_number;
      responseData.fk_operationtypetid_code = responseData?.operation_type?.operation_type_code;

      responseData.ji_branch_state = responseData?.branch?.state_name
      responseData.ji_branch_state_id = responseData?.branch?.state_id
      responseData.ji_branch_captain_name =
        responseData?.branch_captain ? responseData?.branch_captain?.ops_executive_head_name + `${responseData?.branch_captain?.ops_executive_head_emp_id ? '(' + responseData?.branch_captain?.ops_executive_head_emp_id + ')' : ''}` : '';
      if (formConfig && formConfig?.sections?.[0]?.subModuleType === "jobinstructionView") {
        // if (responseData?.additional_activities && responseData?.additional_activities.length > 0) {
        //   responseData.jiscopeofwork = [...responseData?.jiscopeofwork, ...responseData?.additional_activities];
        // }
        responseData?.jiscopeofwork?.map((singleInwardData, i) => {
          formConfig.sections[0].subSections[1].rows.forEach((row) => {
            row.forEach((columnName) => {
              const fieldName = `${columnName.name}_${i}`;
              const value =
                columnName.name === "sample_id"
                  ? singleInwardData["smpl_detail_smpl_id"]
                  : singleInwardData[columnName.name];
              if (columnName.name === "scope_name") {
                let spValue = singleInwardData?.scope_of_work?.scope_name;
                responseData[fieldName] = spValue;
              } else if (columnName.name === "activity_name") {
                let spValue = singleInwardData?.activity_master?.activity_name;
                responseData[fieldName] = spValue;
              } else {
                responseData[fieldName] = value;
              }
            });
          });
        });
        setSubTableData(responseData?.jiscopeofwork);
      }

      setTimeout(() => {
        if (
          moduleType === "vesselJICertificate" ||
          moduleType === "operationCertificate"
        ) {
          setFormData((prevFormData) => {
            return {
              ...prevFormData,
              0: {
                ...prevFormData[0],
                ...responseData
              }
              // [1]: responseData,
            };
          });
        } else {
          setFormData((prevFormData) => {
            return {
              ...prevFormData,
              0: {
                ...prevFormData[0],
                ...responseData
              },
              1: {
                ...prevFormData[1],
                ...responseData
              },
            };
          });
        }
        if (
          ["created"].includes(responseData.ji_internal_status) &&
          editReordType === "analysis"
        ) {
          setTabOpen(false);
        } else if (
          ["analysis"].includes(responseData.ji_internal_status) &&
          editReordType === "nomination"
        ) {
          setTabOpen(false);
        } else {
          if (sections?.[0]?.isMainPage) {
            const isMainScopeWork = session?.isMainScopeWork;
            if (isMainJiSaved || isMainScopeWork) {
              // if (isMainJiSaved || localStorage.getItem('isMainScopeWork')) {
              setTabOpen(true);
            }
            else {
              if (role !== "OPS_ADMIN")
                setTabOpen(true);
              else {
                setTabOpen(false);
              }
            }
          }
          else {
            if (OperationType === getVesselOperation('DS')) {
              setTabOpen(false);
            } else {
              if (moduleType !== "operationCertificate") {
                setTabOpen(true);
              }

            }
          }
        }
      }, 10);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      setIsOverlayLoader(false);
    }, 10);
  }
};

export const getGroupParameterDataOperation = async (
  commodity_id,
  context,
  setMasterResponse,
  operationAssignmentData,
  editReordType,
  OperationType,
  vesselGroupParameter,
  operationStepNo,
  extraFormData
) => {
  try {
    let tempBody = {
      commodity_id: commodity_id,
      context: context,
    };
    // if (OperationType === getVesselOperation("TML")) {
    //   tempBody.ops_type = "VL_TML";
    // }
    if (operationStepNo == 1) {
      tempBody.lab_id = extraFormData[1]?.smpl_filter_lab !== "otherTpi" ? extraFormData[1]?.smpl_filter_lab : ""
      if (!extraFormData[1]?.smpl_filter_lab) {
        return
      }
    }
    let res = await postDataFromApi(OPESGrouoparametersApi, tempBody);
    // const payLoad = {
    //   ji_id: ji_id,
    //   jis_id: OperationTypeID,
    //   lab_id: extraFormData[1]?.smpl_filter_lab !== "otherTpi" ? extraFormData[1]?.smpl_filter_lab : "",
    //   context: extraFormData[1]?.smpl_filter_lab === "otherTpi" ? "otherTpi" : "",
    // };
    // let res = await postDataFromApi(getAssignemtnLabDropdownApi, payLoad);


    if (res.data && res.data.status === 200) {
      const actualResponse = res.data.data;
      if (actualResponse.length === 0) {
        toast.error(
          "Parameters not found under this lab for commodity please check with admin",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
      let parameters = actualResponse.parameters || [];
      let groups = actualResponse.groups || [];
      let isExcludeOptions = false;
      let assignmentArr = [];
      let assignmentaddedArr = [];
      if (editReordType !== "analysis" && !vesselGroupParameter) {
        operationAssignmentData?.map((singleData) => {
          if (context === "parameter") {
            singleData.jia_set_paramjson?.map((paramdata) => {
              if (!assignmentArr.includes(paramdata.param_id)) {
                assignmentArr.push(paramdata.param_id);
                assignmentaddedArr.push(paramdata);
              }
            });
          } else {
            singleData.jia_set_groupjson?.map((paramdata) => {
              if (!assignmentArr.includes(paramdata.group_id)) {
                assignmentArr.push(paramdata.group_id);
                assignmentaddedArr.push(paramdata);
              }
            });
          }
        });
        if (
          context !== "parameter"
          ||
          (context === "parameter"
            // &&
            // OperationType !== getVesselOperation("TML")
          )
        ) {
          isExcludeOptions = true;
        }
      }

      groups = groups.filter((group) => {
        if (
          isExcludeOptions &&
          !assignmentArr.includes(group.group_id.toString())
        ) {
          return false;
        }
        group.name = group.group_name;
        group.id = group.group_id;
        return true;
      });
      parameters = parameters.filter((group) => {
        if (isExcludeOptions && !assignmentArr.includes(group.param_id)) {
          return false;
        }
        group.name = group.param_name;
        group.id = group.param_id;
        group.value = group.param_id;
        group.label = group.param_name;
        return true;
      });
      if (operationStepNo == 3) {
        if (context === "parameter") {
          assignmentaddedArr.filter((group) => {
            group.name = group.param_name;
            group.id = group.param_id;
            group.value = group.param_id;
            group.label = group.param_name;
            if (
              parameters.find(
                (singlepara) => singlepara.param_id === group.param_id
              )
            ) {
              return false;
            }
            parameters.push(group);
          });
        }
      }
      parameters.sort((a, b) => a.param_name.localeCompare(b.param_name));

      // if (context === "parameter") {
      //   if(parameters.length===0){
      //     toast.success("This lab has no any Parameters so please select other lab or select Group", {
      //       position: "top-right",
      //       autoClose: 2000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "light",
      //     });
      //   }
      // }
      // else {
      //   if(groups.length===0){
      //     toast.success("This lab has no any Groups so please select other lab or select Parameter", {
      //       position: "top-right",
      //       autoClose: 2000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "light",
      //     });
      //   }
      // }
      const groupsData = {
        model: "smpl_set_groupjson",
        data: groups,
      };
      const parametersdata = {
        model: "smpl_set_paramjson",
        data: parameters,
      };
      setMasterResponse((prev) => [...prev, groupsData, parametersdata]);
    }
  } catch (error) {
    console.error(error);
  } finally {
  }
  return true;
};

export const getBranchDetailsById = async (
  br_id,
  setMasterResponse,
  setIsOverlayLoader
) => {
  try {
    setIsOverlayLoader(true);
    let res = await postDataFromApi(getBranchDetailsApi, {
      br_id: br_id,
      // br_id: 1
    });
    if (res?.data?.status === 200 && res.data.data) {
      const responseData = res.data.data;

      let headeData = [];
      let captainData = [];
      responseData.branch_head?.map((bhData) => {
        headeData.push({
          id: bhData.branch_head_id,
          name: bhData.branch_head_name + `${bhData.branch_head_emp_id ? '(' + bhData.branch_head_emp_id + ')' : ''}`,
        });
      })
      responseData.branch_captain?.map((bhData) => {
        captainData.push({
          id: bhData.branch_captain_id,
          name: bhData.branch_captain_name + `${bhData.branch_captain_emp_id ? '(' + bhData.branch_captain_emp_id + ')' : ''}`,
        });
      })

      const bodyToPass = {
        model: "fk_userbranchheadid",
        data: headeData,
      };
      const bodyToPass2 = {
        model: "fk_userbranchcaptainid",
        data: captainData,
      };
      setMasterResponse((prev) => [
        ...prev,
        bodyToPass,
        bodyToPass2,
      ]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      setIsOverlayLoader(false);
    }, 10);
  }
};

export const getOpeartionType = async (setMasterResponse) => {
  try {
    let res = await getDataFromApi(getOperationTypeApi);
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data?.map((client) => ({
        id: client.ops_id,
        name: client.ops_name,
        code: client.ops_code,
      }));

      const bodyToPass = {
        model: "fk_operationtypetid",
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCommodityData = async (setMasterResponse) => {
  try {
    let res = await postDataFromApi(MasterListApi, {
      is_dropdown: true,
      model_name: "commodity",
    });
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data?.map((client) => ({
        id: client[0],
        name: client[1],
      }));

      const bodyToPass = {
        model: "fk_commodityid",
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCompanyData = async (setMasterResponse, fieldName = "") => {
  try {
    let res = await postDataFromApi(MasterListApi, {
      is_dropdown: true,
      model_name: "company",
    });
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = [];
      res.data.data?.map((client) => {
        // if (client[1] !== "TCRC PETROLABS BHARAT PRIVATE LIMITED") {
        clientData.push({
          id: client[0],
          name: client[1],
        });
        // }
      });

      const bodyToPass = {
        model: fieldName ? fieldName : "fk_companyid",
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getOPActivityData = async (
  setMasterResponse,
  fk_operationtypetid,
  isMainPage,
  setTableData,
  formData,
  setFormData,
  tableData,
  isAdditional
) => {
  try {
    let res = await postDataFromApi(getActivityDatabyOperationApi, {
      ops_id: fk_operationtypetid,
    });
    if (res?.data?.status === 200 && res.data.data) {
      let clientData = []
      if (isAdditional) {
        res.data.data?.map((client, i) => {
          // if (!tableData?.find((singleItem) => singleItem?.activitymaster?.am_id === client.am_id)) {
          clientData.push({
            id: client.am_id,
            name: client.am_name,
            code: client.am_code,
          })
          // }

        })
        setMasterResponse(clientData)
        return
      }
      // let existinfTableData = [...tableData]

      // const updatedFormData = { ...formData };
      // if (!updatedFormData[1]) {
      //   updatedFormData[1] = {};
      // }

      // res.data.data?.map((client, i) => {
      //   if(!tableData.find((activity)=>activity.fk_activitymasterid==client.am_id)){
      //     const indextno = existinfTableData.length + i
      //     updatedFormData[1]['fk_activitymasterid_' + indextno] = client.am_id;
      //     existinfTableData.push(client)
      //   }

      // })

      res.data.data?.map((client, i) => {
        // if (client?.am_code.toLowerCase() === getVesselOperation("SV")) {
        if (client?.am_name.toLowerCase() === 'supervision') {
          // if (tableData.find((singleTableData) => client?.am_code.toLowerCase() === singleTableData?.activity_master?.activity_code.toLowerCase())) {
          if (tableData.find((singleTableData) => client?.am_name.toLowerCase() === singleTableData?.activity_master?.activity_name.toLowerCase())) {
            return
          }
        }
        if (GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) == "TPBPL") {
          if (!client?.am_is_system_generated) {
            return
          }
        }
        const isConsortiumExists = tableData.find((singleData) => singleData.isAdditionalJIS && singleData.fk_activitymasterid == client.am_id)
        if (!isConsortiumExists) {
          clientData.push({
            id: client.am_id,
            name: client.am_name,
          })
        }
      });
      const bodyToPass = {
        model: "fk_activitymasterid",
        data: clientData,
      };
      // if (isMainPage) {
      //   setTableData(existinfTableData)
      //   setFormData(updatedFormData)
      // }

      setMasterResponse((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  }
};
export const getOPScopeWorkData = async (setMasterResponse, value, indexNo) => {
  return
  try {
    let res = await postDataFromApi(getscopeofworkDataApi, {
      activity_id: value,
    });
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data?.map((client) => ({
        id: client.scope_id,
        name: client.scope_name,
      }));

      const bodyToPass = {
        model: "fk_scopeworkid_" + indexNo,
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  }
};
export const getOPLoadingUnLoadingSourceData = async (setMasterResponse) => {
  try {
    let res = await getDataFromApi(getAllPortDataApi + "?is_dropdown=" + true);
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data?.map((client) => ({
        id: client.port_id,
        name: client.port_name,
      }));

      const bodyToPass = {
        model: "jis_loading_or_soure_id",
        data: clientData,
      };
      const bodyToPass2 = {
        model: "jis_discharge_or_destination_id",
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass, bodyToPass2]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const createQualityAnalysisHandler = async (
  parameterData,
  setIsOverlayLoader,
  formData,
) => {
  let smpl_set_smpljson = [];
  let smpl_set_paramjson = [];
  let smpl_set_groupjson = [];
  let param_sequance_no = 0;
  parameterData?.map((paramData, seqIndex) => {
    paramData.smpl_set_smpljson?.map((sample) => {
      if (!smpl_set_smpljson.includes(sample)) {
        smpl_set_smpljson.push(sample);
      }
    });
    let basis = [];
    let basiscodes = [];
    if (paramData.smpl_set_basisjson_name.length > 0) {
      basiscodes = paramData.smpl_set_basisjson_name.split(",");
    } else {
      basiscodes = [];
    }
    paramData.smpl_set_basisjson?.map((basId, i) => {
      basis.push({
        basis_id: basId,
        basis_code: basiscodes[i],
      });
    });
    if (paramData["is_group_param"] == "Group") {
      let parameters = [];
      const groupParamJson = paramData.groupJsonParameter.filter(
        (singleparam) => {
          singleparam.param_sequence = param_sequance_no;
          param_sequance_no++;
          return true;
        }
      );
      smpl_set_groupjson.push({
        group_id: paramData.smpl_set_groupjson,
        group_name: paramData.smpl_set_groupjson_name,
        parameters: groupParamJson,
        sequanceNo: seqIndex,
      });
    } else {
      smpl_set_paramjson.push({
        param_id: paramData.smpl_set_paramjson,
        param_name: paramData.smpl_set_paramjson_name,
        std_id: paramData.smpl_set_testmethodjson,
        std_name: paramData.smpl_set_testmethodjson_name,
        basis: basis,
        sequanceNo: seqIndex,
        param_unit: paramData.smpl_set_unit,
        param_sequence: param_sequance_no,
      });
      param_sequance_no++;
    }
  });
  const newMainPayload = {
    ji_quality_analysis: {
      fk_jiid: formData[0]?.ji_id,
      jia_set_groupjson: smpl_set_groupjson,
      jia_set_paramjson: smpl_set_paramjson,
      tenant: GetTenantDetails(1),
    },
  };
  setIsOverlayLoader(true);
  const res = await postDataFromApi(
    getJIQualityAnalysisCreateApi,
    newMainPayload
  );
  if (res.data.status === 200) {
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
  setIsOverlayLoader(false);

};

export const getJIsowandactivityData = async (
  ji_id,
  setTableData,
  type,
  formData,
  setFormData,
  section,
  setFinalParamDataSort,
  setSampleDataTable,
  isUseForDropdown,
  setOperationAssignmentData,
  getOPScopeWorkData,
  setUpdatedMasterOptions,
  isCancelled = "",
  indexNo,
  isDeleted,
  popupIndex,
  setIsLoadedData
) => {
  try {
    if (setIsLoadedData) {
      setIsLoadedData(false)
    }

    const bodyData = {
      ji_id: ji_id,
    };
    let res = await postDataFromApi(getJIsowandactivityApi, bodyData);
    if (res?.data?.status === 200 && res.data.data) {
      let responseData = res.data.data;
      const updatedFormData = { ...formData };
      if (type === "scope_of_work") {
        // let type1 = "additional_activities";
        // if (type === "scope_of_work") {
        //   responseData[type] = [...responseData[type], ...responseData?.[type1]];
        // }
        if (!updatedFormData[1]) {
          updatedFormData[1] = {};
        }
        if (isDeleted) {
          section.rows.forEach((row) => {
            row.forEach((columnName) => {
              if (columnName.type === "doubleText") {
                updatedFormData[1][`${columnName.name}_unit_${popupIndex}`] = '';
                updatedFormData[1][`${columnName.name}_unit_custom`] = '';
              }
              updatedFormData[1][`${columnName.name}_${popupIndex}`] = '';
            });
          });
        }

        responseData[type].forEach((singleInwardData, i) => {
          if (!updatedFormData[1]) {
            updatedFormData[1] = {};
          }
          section.rows.forEach((row) => {
            row.forEach((columnName) => {
              const fieldName = `${columnName.name}_${i}`;
              const value =
                columnName.name === "sample_id"
                  ? singleInwardData["smpl_detail_smpl_id"]
                  : singleInwardData[columnName.name];
              // if (
              //   ["smpl_detail_smpl_qty", "jis_rate"].includes(columnName.name)
              // ) {
              //   let spValue = value.split(" ");
              //   updatedFormData[1][fieldName] = spValue[0];
              //   updatedFormData[1][`${columnName.name}_unit_${i}`] =
              //     spValue.length > 1 ? spValue[1] : "";
              // } else {
              if (columnName.name === "smpl_detail_dos") {
                updatedFormData[1][fieldName] = value;
              } else {
                updatedFormData[1][fieldName] = value;
              }
              // }
            });
          });
          if (getOPScopeWorkData) {
            if (isCancelled) {
              if (i === indexNo) {
                getOPScopeWorkData(
                  setUpdatedMasterOptions,
                  singleInwardData.fk_activitymasterid,
                  i
                );
              }
            } else {
              getOPScopeWorkData(
                setUpdatedMasterOptions,
                singleInwardData.fk_activitymasterid,
                i
              );
            }
          }
          responseData[type][i]['isAdditionalJIS'] = singleInwardData.fk_jiid !== ji_id
        });
        setFormData(updatedFormData);
        setTableData(responseData[type]);
      } else {
        const newArray = responseData[type];
        if (isUseForDropdown) {
          setOperationAssignmentData(newArray);
          return;
        }
        if (setFormData) {
          if (!updatedFormData[1]) {
            updatedFormData[1] = {};
          }
          updatedFormData[1]["scope_of_work_data"] =
            // responseData["scope_of_work"];
            responseData["scope_of_work"];
          setFormData(updatedFormData);
        }
        if (type !== "quality_analysis_for_nominate") {
          getJIAssignmentData(
            newArray,
            setTableData,
            setFinalParamDataSort,
            setSampleDataTable
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
  finally {
    if (setIsLoadedData) {
      setTimeout(() => {
        setIsLoadedData(true)
      }, [10])
    }
  }
};
export const getJIAssignmentData = (
  newArray,
  setTableData,
  setFinalParamDataSort,
  setSampleDataTable
) => {
  let FinalCombinedArray = [];
  newArray?.map((singleParamaSet) => {
    let combinedArray = [];
    for (const [key, value] of Object.entries(
      singleParamaSet.jia_set_groupjson
    )) {
      value.param_type = "Group";
      combinedArray.push({ ...value });
    }
    for (const [key, value] of Object.entries(
      singleParamaSet.jia_set_paramjson
    )) {
      value.param_type = "Parameter";
      combinedArray.push({ ...value });
    }
    combinedArray = combinedArray.sort((a, b) => a.sequanceNo - b.sequanceNo);
    FinalCombinedArray.push(combinedArray);
  });
  setFinalParamDataSort(FinalCombinedArray);
  if (setSampleDataTable) {
    setSampleDataTable(newArray);
  }
  setTableData(newArray);
};
export const getLabPramDetails = async (
  ji_id,
  type,
  formData,
  setParameterDataTable,
  setMasterResponse,
  masterResponse,
  OperationTypeID,
  setExtraFormData,
  extraFieldChange,
  setBeforeLabWiseParameterDataTable
) => {
  try {
    const bodyData = {
      ji_id: ji_id,
      jis_id: OperationTypeID,
    };
    let res = await postDataFromApi(getOPSExecApi, bodyData);
    if (res?.data?.status === 200 && res.data.data) {
      if (res.data.data.length === 0) {
        getJIsowandactivityDataForVessel(
          ji_id,
          type,
          formData,
          setParameterDataTable,
          setMasterResponse,
          masterResponse,
          OperationTypeID,
          setBeforeLabWiseParameterDataTable
        );
      } else {
        const responseData = res.data.data;
        let paramTableData = [];
        const updatedFormData = { ...extraFieldChange };
        if (!updatedFormData[0]) {
          updatedFormData[0] = {};
        }
        responseData.map((singleData, index) => {
          updatedFormData[0]["lab_id_" + singleData?.ops_exec_la_id] =
            singleData.ops_exec_la_is_other_tpi
              ? "External Results"
              : singleData?.lab_detail?.lab_name;
          let labData = [{
            id: singleData.ops_exec_la_is_other_tpi ? "otherTpi" : singleData?.lab_detail?.lab_id,
            name: singleData.ops_exec_la_is_other_tpi ? "External Results" : singleData?.lab_detail?.lab_name,
          }]
          const bodyToPass = {
            model: "lab_id_" + singleData?.ops_exec_la_id,
            data: labData,
          };
          let isExists = false;
          let filterData = masterResponse.filter((model) => {
            if (model.model === "lab_id_" + singleData?.ops_exec_la_id) {
              model.data = labData;
              isExists = true;
            }
            return true;
          });
          if (isExists) {
            setMasterResponse(filterData);
          } else {
            setMasterResponse((prev) => [...prev, bodyToPass]);
          }
          if (singleData.ops_exec_la_set_groupjson.length > 0) {
            const singleParam = singleData.ops_exec_la_set_groupjson[0];
            // getSampleIdsLabMasterData(
            //   setMasterResponse,
            //   masterResponse,
            //   formData[0].fk_commodityid,
            //   singleParam.group_id,
            //   index,
            //   "Group"
            // );
            let groupdata = {
              smpl_set_basisjson: [],
              labIdSaved: true,
              ops_exec_la_id: singleData.ops_exec_la_id,
              is_group_param: "Group",
              is_group_param_name: "Group",
              smpl_set_groupjson: singleParam.group_id,
              smpl_set_groupjson_name: singleParam.group_name,
              groupJsonParameter: singleParam.parameters,
            };
            singleParam.parameters?.map((param, paramindex) => {
              groupdata["smpl_set_unit_" + paramindex] = param.param_unit;
            });
            paramTableData.push(groupdata);
          } else {
            const singleParam = singleData.ops_exec_la_set_paramjson[0];

            // getSampleIdsLabMasterData(
            //   setMasterResponse,
            //   masterResponse,
            //   formData[0].fk_commodityid,
            //   singleParam.param_id,
            //   index,
            //   "Parameter",
            //   singleParam.std_id
            // );
            let smpl_set_basisjson = [];
            let smpl_set_basisjson_name = [];
            singleParam.basis?.map((bas) => {
              smpl_set_basisjson.push(bas.basis_id);
              smpl_set_basisjson_name.push(bas.basis_code);
            });
            paramTableData.push({
              smpl_set_basisjson: smpl_set_basisjson,
              smpl_set_basisjson_name: smpl_set_basisjson_name,
              labIdSaved: true,
              ops_exec_la_id: singleData.ops_exec_la_id,
              smpl_set_smpljson: [],
              is_group_param: "Parameter",
              is_group_param_name: "Parameter",
              smpl_set_paramjson: singleParam.param_id,
              smpl_set_testmethodjson: singleParam.std_id,
              smpl_set_unit: singleParam.param_unit,
              smpl_set_testmethodjson_name: singleParam.std_name,
              smpl_set_paramjson_name: singleParam.param_name,
            });
          }
          setExtraFormData(updatedFormData);
        });
        setParameterDataTable(paramTableData);
      }
    } else {
    }
  } catch (error) {
    console.error("errrr-", error);
  }
};
export const getJIsowandactivityDataForVessel = async (
  ji_id,
  type,
  formData,
  setParameterDataTable,
  setMasterResponse,
  masterResponse,
  OperationTypeID,
  setBeforeLabWiseParameterDataTable
) => {
  try {
    const bodyData = {
      ji_id: ji_id,
    };
    let res = await postDataFromApi(getJIsowandactivityApi, bodyData);
    if (res?.data?.status === 200 && res.data.data) {
      const responseData = res.data.data;
      const newArray = responseData[type];
      let FinalCombinedArray = [];
      newArray?.map((singleParamaSet) => {
        let combinedArray = [];
        for (const [key, value] of Object.entries(
          singleParamaSet.jia_set_groupjson
        )) {
          value.param_type = "Group";
          combinedArray.push({ ...value });
        }
        for (const [key, value] of Object.entries(
          singleParamaSet.jia_set_paramjson
        )) {
          value.param_type = "Parameter";
          combinedArray.push({ ...value });
        }
        combinedArray = combinedArray.sort(
          (a, b) => a.sequanceNo - b.sequanceNo
        );
        FinalCombinedArray.push(combinedArray);
      });
      let paramTableData = [];
      FinalCombinedArray[0]?.map((singleParam, index) => {
        if (singleParam.param_type === "Group") {
          getSampleIdsLabMasterData(
            setMasterResponse,
            masterResponse,
            formData[0].fk_commodityid,
            singleParam.group_id,
            index,
            "Group"
          );
          let groupdata = {
            smpl_set_basisjson: [],
            is_group_param: singleParam.param_type,
            is_group_param_name: singleParam.param_type,
            smpl_set_groupjson: singleParam.group_id,
            smpl_set_groupjson_name: singleParam.group_name,
            groupJsonParameter: singleParam.parameters,
          };
          singleParam.parameters?.map((param, paramindex) => {
            groupdata["smpl_set_unit_" + paramindex] = param.param_unit;
          });
          paramTableData.push(groupdata);
        } else {
          getSampleIdsLabMasterData(
            setMasterResponse,
            masterResponse,
            formData[0].fk_commodityid,
            singleParam.param_id,
            index,
            "Parameter",
            singleParam.std_id
          );
          let smpl_set_basisjson = [];
          let smpl_set_basisjson_name = [];
          singleParam.basis?.map((bas) => {
            smpl_set_basisjson.push(bas.basis_id);
            smpl_set_basisjson_name.push(bas.basis_code);
          });
          paramTableData.push({
            smpl_set_basisjson: smpl_set_basisjson,
            smpl_set_basisjson_name: smpl_set_basisjson_name,
            smpl_set_smpljson: [],
            is_group_param: "Parameter",
            is_group_param_name: "Parameter",
            smpl_set_paramjson: singleParam.param_id,
            smpl_set_testmethodjson: singleParam.std_id,
            smpl_set_unit: singleParam.param_unit,
            smpl_set_testmethodjson_name: singleParam.std_name,
            smpl_set_paramjson_name: singleParam.param_name,
          });
        }
      });
      setParameterDataTable(paramTableData);
      setBeforeLabWiseParameterDataTable(paramTableData);
    }
  } catch (error) { }
};
export const qualityAnalysisPageHandleAction = async (
  actionSelected,
  tableData,
  setSaveClicked,
  setEditableIndex,
  popupIndex,
  setIsOverlayLoader,
  setTableData,
  formData,
  setFormData,
  section,
  setFinalParamDataSort,
  setSampleDataTable
) => {
  if (actionSelected == "Delete") {
    setSaveClicked(true);
    setIsOverlayLoader(true);
    let payload = {
      jia_id: tableData[popupIndex]?.jia_id,
    };
    let res = await deleteDataFromApi(getJIQualityAnalysisDeleteApi, payload);
    if (res.data.status === 200) {
      getJIsowandactivityData(
        formData[0]?.ji_id,
        setTableData,
        "quality_analysis",
        formData,
        setFormData,
        section,
        setFinalParamDataSort,
        setSampleDataTable
      );
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
    setSaveClicked(false);
    setIsOverlayLoader(false);
  } else if (actionSelected === "Cancel") {
    setEditableIndex("");
  }
};

export const getSampleIdsLabMasterData = async (
  setMasterResponse,
  masterResponse,
  commodity_id,
  paramValue,
  indexNo,
  type,
  standardId
) => {
  try {
    let tempBody = {
      commodity_id: commodity_id,
    };
    if (type === "Group") {
      tempBody.group_id = paramValue;
    } else {
      tempBody.param_id = paramValue;
      tempBody.std_id = standardId;
    }
    let res = await postDataFromApi(labdropdownApi, tempBody);
    if (res.data && res.data.status === 200 && res.data.data) {
      const labData = res.data.data?.map((value) => ({
        id: value.lab_id,
        name: value.lab_name + ` (${value.lab_code})`,
      }));
      labData.push({
        id: "otherTpi",
        name: "External Results",
      });
      const bodyToPass = {
        model: "lab_id_" + indexNo,
        data: labData,
      };
      let isExists = false;
      let filterData = masterResponse.filter((model) => {
        if (model.model === "lab_id_" + indexNo) {
          model.data = labData;
          isExists = true;
        }
        return true;
      });
      if (isExists) {
        setMasterResponse(filterData);
      } else {
        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const handleAssignLabToParameter = async (
  setParameterDataTable,
  parameterDataTable,
  rowIndex,
  setIsLoading,
  setIsOverlayLoader,
  formData,
  OperationTypeID,
  extraFormData,
  userDetails,
  isNewAdd,
  setExtraFormData,
  setIsLabAssignFailed,
  setFailedParameters,
  setAssignLabRowIndex,
  setAssignedLabId
) => {
  let assignLabId = isNewAdd ? extraFormData?.[1]?.smpl_filter_lab : extraFormData?.[0]?.["lab_id_" + rowIndex];
  if (!assignLabId) {
    toast.error("Please select the lab", {
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
  setIsLoading(true);
  setIsOverlayLoader(true);
  let ops_exec_grp_param = {
    fk_jisid: OperationTypeID,
    fk_jiid: formData[0].ji_id,
    commodityid: formData[0].fk_commodityid,
    fk_labid:
      assignLabId === "otherTpi"
        ? ""
        : assignLabId,
    fk_branchid: userDetails?.logged_in_user_info?.lab_or_branch?.branch_id,
    ops_exec_la_is_other_tpi:
      assignLabId === "otherTpi" ? true : false,
    tenant: GetTenantDetails(1),
  };
  let paramData = parameterDataTable[rowIndex];
  if (paramData.is_group_param === "Group") {
    let groupdSetData = [
      {
        group_id: paramData.smpl_set_groupjson,
        group_name: paramData.smpl_set_groupjson_name,
        parameters: paramData.groupJsonParameter,
      },
    ];
    ops_exec_grp_param.ops_exec_la_set_groupjson = groupdSetData;
    ops_exec_grp_param.ops_exec_la_set_paramjson = [];
  } else {
    let basisdata = [];
    paramData.smpl_set_basisjson?.map((basid, i) => {
      basisdata.push({
        basis_id: basid,
        basis_code: Array.isArray(paramData.smpl_set_basisjson_name)
          ? paramData.smpl_set_basisjson_name[i]
          : paramData.smpl_set_basisjson_name.split(",")?.[i],
      });
    });
    let paramSetData = [
      {
        basis: basisdata,
        std_id: paramData.smpl_set_testmethodjson,
        param_id: paramData.smpl_set_paramjson,
        std_name: paramData.smpl_set_testmethodjson_name,
        param_name: paramData.smpl_set_paramjson_name,
        param_unit: paramData.smpl_set_unit,
      },
    ];

    ops_exec_grp_param.ops_exec_la_set_paramjson = paramSetData;
    ops_exec_grp_param.ops_exec_la_set_groupjson = [];
  }
  const newMainPayload = { ops_exec_grp_param: ops_exec_grp_param };

  const res = await postDataFromApi(createOPSExecApi, newMainPayload);
  if (res.data.status === 200) {
    parameterDataTable[rowIndex].labIdSaved = true;
    parameterDataTable[rowIndex].ops_exec_la_id = res.data.data.ops_exec_la_id;
    setParameterDataTable(parameterDataTable);
    if (isNewAdd) {
      setExtraFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ['lab_id_' + res.data.data.ops_exec_la_id]: res.data.data.ops_exec_la_is_other_tpi ? 'External Results' : res.data.data?.lab_detail?.lab_name,
            ['smpl_filter_lab']: ""
          }
        };
      });
    }
    else {
      setExtraFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ['lab_id_' + res.data.data.ops_exec_la_id]: res.data.data.ops_exec_la_is_other_tpi ? 'External Results' : res.data.data?.lab_detail?.lab_name,
          }
        };
      });
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
    if (res?.data?.is_param_failed) {
      setIsLabAssignFailed(true)
      setFailedParameters(res.data.data)
      setAssignLabRowIndex(rowIndex)
      setAssignedLabId(assignLabId)
    }
  }
  setIsOverlayLoader(false);
  setIsLoading(false);
};
export const deleteOPSExecData = async (setIsOverlayLoader, ops_exec_la_id) => {
  setIsOverlayLoader(true);
  let payload = {
    ops_exec_la_id: ops_exec_la_id,
  };
  let res = await deleteDataFromApi(deleteOPSExecApi, payload);
  if (res.data.status === 200) {
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
    setIsOverlayLoader(false);
    return true;
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
    setIsOverlayLoader(false);
    return false;
  }
};
export const checkAllNonLMSActivity = (subTableData) => {
  const LMSTypes = getLMSOperationActivity();
  const filterData = subTableData.filter((singleActivity) => {
    return LMSTypes.includes(getActivityCode(singleActivity?.activity_master?.activity_code).toLowerCase());
  });
  if (filterData.length === 0) {
    return true;
  }
  return false;
};

export const getReferenceNoListData = async (setUpdatedMasterOptions) => {
  try {
    let res = await postDataFromApi(getfirstrefnumberApi, {});
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data?.map((client) => ({
        id: client.ji_reference_number,
        name: client.ji_reference_number,
      }));

      const bodyToPass = {
        model: "ji_first_ref_no",
        data: clientData,
      };
      setUpdatedMasterOptions((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getConsortiumListData = async (setUpdatedMasterOptions) => {
  try {
    let res = await getDataFromApi(getConsortiumOrderApi, {});
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data?.map((client) => ({
        id: client.co_id,
        name: client.co_number,
      }));

      const bodyToPass = {
        model: "fk_consortium_order",
        data: clientData,
      };
      if (setUpdatedMasterOptions) {
        setUpdatedMasterOptions((prev) => [...prev, bodyToPass]);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getSingleJiRecordForPreview = async (
  ji_id,
  setFormData,
  setIsOverlayLoader,
  section,
  setIsShow,
  setSubTableData
) => {
  try {
    setIsOverlayLoader(true);
    let res = await postDataFromApi(getJIForPreviewApi, {
      ji_id: ji_id,
    });
    if (res?.data?.status === 200 && res.data.data) {
      let responseData = res.data.data;
      let tempArr = []
      // if (res.data.data.ji_is_ecertification) {
      //   tempArr.push("E-Certificate");
      // }
      // if (res.data.data.ji_is_hardcopy) {
      //   tempArr.push("Print Hard Copy");
      // }
      // responseData.ji_is_ecertification = tempArr;
      // responseData.ji_is_hardcopy = responseData.ji_is_hardcopy
      //   ? "Print Hard Copy"
      //   : "E-Certificate";

      responseData.ji_is_supplier = responseData.ji_is_supplier
        ? "Supplier"
        : "Buyer";
      responseData.ji_is_loading = responseData.ji_is_loading
        ? "Loading"
        : "Unloading";
      responseData.ji_is_consortium_order = responseData.ji_is_consortium_order
        ? "Yes"
        : "No";
      responseData.ji_is_dual_port = responseData.ji_is_dual_port
        ? "Yes"
        : "No";
      responseData.ji_is_plot_no = responseData.ji_is_plot_no
        ? "Yes"
        : "No";
      responseData.ji_is_monthly = responseData.ji_is_monthly
        ? "Yes"
        : "No";
      responseData.ji_dual_port_seq =
        responseData.ji_dual_port_seq == "2" ? "Second" : "First";
      responseData.ji_client_name = responseData.client_details.client_name;
      responseData.ji_client_address =
        responseData.client_details.client_address;
      responseData.ji_client_gst = responseData.client_details.client_gst_no;
      // responseData.ji_client_state = responseData.client_details.state || '-';
      responseData.ji_commodity_name = responseData.commodity_details.cmd_name;
      responseData.ji_sub_commodity_name =
        responseData.sub_commodity.sub_cmd_name;
      // responseData.ji_company_name = getComonCodeForCompany(
      //   responseData.company.company_code
      // );
      responseData.ji_company_name = responseData.company.company_name;
      responseData.ji_place_of_work_name = responseData.place_of_work.pow_name;
      // responseData.ji_place_of_work_name = responseData.place_of_work.pow_name + `${responseData.ji_is_plot_no && responseData.ji_plot_no ? ',' + responseData.ji_plot_no : ''}`;
      responseData.ji_suplier_name = responseData?.supplier?.supplier_name;
      responseData.operation_type_name =
        responseData.operation_type.operation_type_name;
      responseData.ji_branch_name = responseData?.branch?.branch_name + ` (${responseData?.branch?.branch_code})`
      responseData.ji_branch_head_name = responseData?.branch_head ?
        responseData?.branch_head?.branch_head_name + `${responseData?.branch_head?.branch_head_emp_id ? '(' + responseData?.branch_head?.branch_head_emp_id + ')' : ''}` : "";
      responseData.ji_branch_ex_name =
        responseData?.ops_executive?.ops_executive_name;
      responseData.ji_branch_ex_heade_name =
        responseData?.ops_executive_head?.ops_executive_head_name;
      responseData.ji_branch_sales_person =
        responseData?.sales_person?.sales_person_name;
      responseData.ji_branch_sales_person_name =
        responseData?.sales_person?.sales_person_name;
      responseData.loading_unloading_country_name =
        responseData?.loading_unloading_country?.country_name || '-';
      responseData.loading_unloading_port_name =
        responseData?.loading_unloading_port?.port_name || '-';
      responseData.consortium_number = responseData?.consortium_order?.consortium_order_number;
      responseData.fk_operationtypetid_code = responseData?.operation_type?.operation_type_code;
      responseData.ji_branch_state = responseData?.branch?.state_name
      responseData.ji_branch_state_id = responseData?.branch?.state_id
      responseData.ji_branch_captain_name =
        responseData?.branch_captain ? responseData?.branch_captain?.ops_executive_head_name + `${responseData?.branch_captain?.ops_executive_head_emp_id ? '(' + responseData?.branch_captain?.ops_executive_head_emp_id + ')' : ''}` : '';
      let formdata1 = responseData;
      let formdata2 = responseData;
      // if (responseData?.additional_activities && responseData?.additional_activities.length > 0) {
      //   responseData.jiscopeofwork = [...responseData?.jiscopeofwork, ...responseData?.additional_activities];
      // }
      responseData?.jiscopeofwork?.map((singleInwardData, i) => {
        section.rows.forEach((row) => {
          row.forEach((columnName) => {
            const fieldName = `${columnName.name}_${i}`;
            const value =
              columnName.name === "sample_id"
                ? singleInwardData["smpl_detail_smpl_id"]
                : singleInwardData[columnName.name];
            if (columnName.name === "scope_name") {
              let spValue = singleInwardData?.scope_of_work?.scope_name;
              formdata2[fieldName] = spValue;
            } else if (columnName.name === "activity_name") {
              let spValue = singleInwardData?.activity_master?.activity_name;
              formdata2[fieldName] = spValue;
            } else {
              formdata2[fieldName] = value;
            }
          });
        });
      });
      setSubTableData(responseData?.jiscopeofwork);
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: formdata1,
          1: formdata2,
        };
      });
    }
  } catch (error) {
  } finally {
    setTimeout(() => {
      setIsOverlayLoader(false);
      setIsShow(true);
    }, 10);
  }
};
export const getActivityListDatabyji = async (
  ji_id,
  setCustomOptions,
  setIsDisplayNewAddOption
) => {
  try {
    setIsDisplayNewAddOption(false);
    const bodyData = {
      ji_id: ji_id,
    };
    let res = await postDataFromApi(getActivityListDatabyjiApi, bodyData);
    if (res?.data?.status === 200 && res.data.data) {
      let options = [];
      res.data.data?.map((singleData) => {
        options.push({
          id: singleData.am_id,
          name: singleData.am_name,
        });
      });
      setCustomOptions(options);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIsDisplayNewAddOption(true);
  }
};
export const getAllManPowerData = async (
  ji_id,
  setTableData,
  formData,
  setFormData,
  section,
  activityID,
  OpsActivityName
) => {
  try {
    const bodyData = {
      ji_id: ji_id,
      fk_activity_id: activityID,
    };
    let res = await postDataFromApi(getManPowerApi, bodyData);
    if (res?.data?.status === 200 && res.data.data) {
      const responseData = res.data.data;
      let updatedFormData = { ...formData };
      if (!updatedFormData) {
        updatedFormData = { ...formData };
      }
      let i = 0;
      const actualResponseData = responseData.filter((singleInwardData) => {
        if (!updatedFormData[1]) {
          updatedFormData[1] = {};
        }
        for (let obj in singleInwardData.jism_jsonb_front) {
          singleInwardData[obj] = singleInwardData.jism_jsonb_front[obj];
        }
        section.rows.forEach((row) => {
          row.forEach((columnName) => {
            if (columnName.name === "fk_activity_id") {
              updatedFormData[1]['fk_activity_id_' + i] = OpsActivityName;
            }
            else {
              const fieldName = `${columnName.name}_${i}`;
              const value = singleInwardData[columnName.name];
              updatedFormData[1][fieldName] = value;
            }
          });
        });

        updatedFormData[1]["fk_ji_sample_marks_id_" + i] =
          singleInwardData["jism_id"];
        i++;
        return true;
      });
      section.rows.forEach((row) => {
        row.forEach((columnName) => {
          if (columnName.name === "fk_activity_id") {
            updatedFormData[1]['fk_activity_id_' + responseData.length] = OpsActivityName;
          }
          else {
            const fieldName = `${columnName.name}_${responseData.length}`;
            updatedFormData[1][fieldName] = '';
          }
        });
      });
      setFormData(updatedFormData);
      setTableData(actualResponseData);
    }
  } catch (error) {
    console.error(error);
  }
};



export const handleManPowerCreateUpdate = async (
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
  OpsActivityName
) => {
  if (actionSelected === "Save" || actionSelected === "customSave") {
    setIsBtnClicked(true);
    let newRowIndex = editableIndex;
    if (actionSelected === "customSave") {
      newRowIndex = tableData.length;
    }
    let payload = {
      vessel_manpower: {
        vessel_mp_date: formData[1]?.["vessel_mp_date_" + newRowIndex],
        vessel_mp_shift: formData[1]?.["vessel_mp_shift_" + newRowIndex],
        vessel_mp_emp_name: formData[1]?.["vessel_mp_emp_name_" + newRowIndex],
        vessel_mp_designation:
          formData[1]?.["vessel_mp_designation_" + newRowIndex],
        fk_activity_id: activityID,
        fk_ji_id: formData[0]?.["ji_id"],
        vessel_mp_duty_in: formData[1]?.["vessel_mp_duty_in_" + newRowIndex],
        vessel_mp_duty_out: formData[1]?.["vessel_mp_duty_out_" + newRowIndex],
        vessel_mp_total_duty_hours:
          formData[1]?.["vessel_mp_total_duty_hours_" + newRowIndex],
        tenant: GetTenantDetails(1),
      },
    };
    let nonRequiredFields = [];

    for (let obj in payload.jism_lots) {
      if (
        (payload["vessel_manpower"][obj] === undefined ||
          payload["vessel_manpower"][obj] === "") &&
        !nonRequiredFields.includes(obj)
      ) {
        const field = section.rows[0].filter((field, index) => {
          if (field.name === obj) {
            field.label = section.headers[index].label;
            return true;
          }
          return false;
        });

        if (field.length > 0) {
          let errLabel = field ? field[0].label : "";
          toast.error(errLabel + " is required", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsBtnClicked(false);
          return;
        }
      }
    }

    let res;
    if (actionSelected !== "customSave") {
      payload.vessel_mp_id = tableData[editableIndex].vessel_mp_id;
      res = await putDataFromApi(updateManPowerApi, payload);
    } else {
      res = await postDataFromApi(createManPowerApi, payload);
    }
    if (res.data.status === 200) {
      getAllManPowerData(
        formData[0]?.ji_id,
        setTableData,
        formData,
        setFormData,
        section,
        activityID,
        OpsActivityName
      );
      setPopupOpenAssignment(false);
      setPopupIndex("");
      setEditableIndex("");
      setIsBtnClicked(false);
      setIsOverlayLoader(false);
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
      setIsBtnClicked(false);
      setIsOverlayLoader(false);
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
    setIsOverlayLoader(false);
  } else if (actionSelected === "Delete") {
    setSaveClicked(true);
    let payload = {
      vessel_mp_id: tableData[popupIndex]?.vessel_mp_id,
    };
    setIsOverlayLoader(true);
    let res = await deleteDataFromApi(deleteManPowerApi, payload);
    if (res.data.status === 200) {
      getAllManPowerData(
        formData[0]?.ji_id,
        setTableData,
        formData,
        setFormData,
        section,
        activityID,
        OpsActivityName
      );
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
    setIsOverlayLoader(false);
    setSaveClicked(false);
  } else if (actionSelected === "Cancel") {
    setEditableIndex("");
  }
};


export const geSamplingMethodMasterData = async (commodity_id, setMasterResponse, setFormData) => {
  try {
    let tempBody = {
      commodity_id: commodity_id
    };
    let res = await postDataFromApi(getSamplingMethodsApi, tempBody);
    if (res?.data?.status === 200 && res.data.data) {
      const transformedData = res.data.data?.map((singleData) => ({
        id: singleData.std_id,
        name: singleData.std_name,
      }));

      const bodyToPass = {
        model: "ji_sampling_methods",
        data: transformedData,
      };

      setMasterResponse((prev) => [...prev, bodyToPass]);
      if (setFormData) {
        if (transformedData.length == 0) {
          setFormData((prevFormData) => {
            return {
              ...prevFormData,
              0: {
                ...prevFormData[0],
                ji_sampling_methods: '-',
              },
            };
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getBranchDetailsData = async (setMasterResponse, company_id, fieldName = "", valueFields = "", isMultiple, multipleFields) => {
  try {
    let res = await postDataFromApi(getCompanyBranchApi, {
      company_id: company_id,
    });
    if (res?.data?.status === 200 && res.data.data) {
      const branchData = res.data.data.map((singleBranch) => ({
        id: valueFields ? singleBranch?.[valueFields] : singleBranch.branch_id,
        name: singleBranch.branch_name + ` (${singleBranch.branch_code})`,
      }));

      const bodyToPass = {
        model: fieldName ? fieldName : "fk_branchid",
        data: branchData,
      };
      setMasterResponse((prev) => {
        const branchFeidls = [...prev, bodyToPass]
        if (isMultiple) {
          multipleFields.map((field) => {
            branchFeidls.push({
              model: field,
              data: branchData,
            })
          })
        }
        return branchFeidls
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const getPortDetailsbyCountryId = async (
  country_id,
  setMasterResponse,
  setIsOverlayLoader
) => {
  try {
    setIsOverlayLoader(true);
    let res = await postDataFromApi(getLoadingPortDataApi, {
      country_id: country_id,
      is_dropdown: true
    });
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data.map((client) => ({
        id: client.port_id,
        name: client.port_name,
      }));
      const bodyToPass = {
        model: "fk_loading_unloading_port",
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      setIsOverlayLoader(false);
    }, 10);
  }
};

export const getLabMasterDataForJI = async (setLabDropDownOptions) => {
  try {
    let tempBody = {
      model_name: "lab",
      is_dropdown: true,
    };
    let res = await postDataFromApi(MasterListApi, tempBody);
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data?.map((labDetail) => ({
        id: labDetail[0],
        name: labDetail[2] ? labDetail[2] + ` (${labDetail[1]})` : "",
      }));
      clientData.push({
        id: "otherTpi",
        name: "External Results",
      });

      setLabDropDownOptions(clientData);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getSampleMarkForDropdown = async (ji_id, jis_id, context, setMasterResponse, masterResponse, setAllSampleMarksData) => {
  try {
    let tempBody = {
      ji_id: ji_id,
      jis_id: jis_id,
      context: context.toLowerCase()
    };
    let res = await postDataFromApi(sampleMarkOptionsLotWiseApi, tempBody);
    if (res.data && res.data.status === 200 && res.data.data) {
      setAllSampleMarksData(res.data.data)
      const transformedData = res.data.data.map((value) => ({
        id: value.sample_mark + `--###TCRCOPS###--` + value.sample_id,
        name: value.sample_mark,
      }));
      const bodyToPass = {
        model: "smpl_set_smpljson",
        data: transformedData,
      };
      let isExists = false;
      let filterData = masterResponse.filter((model) => {
        if (model.model === "smpl_set_smpljson") {
          model.data = transformedData;
          isExists = true;
        }
        return true;
      });
      if (isExists) {
        setMasterResponse(filterData);
      } else {
        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    } else {
      const bodyToPass = {
        model: "smpl_set_smpljson",
        data: [],
      };
      let isExists = false;
      let filterData = masterResponse.filter((model) => {
        if (model.model === "smpl_set_smpljson") {
          model.data = [];
          isExists = true;
        }
        return true;
      });
      if (isExists) {
        setMasterResponse(filterData);
      } else {
        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    }
  } catch (error) {

  }
}

export const getCommonTabsFroJI = (role = "") => {
  if (role && role != "OPS_ADMIN") {
    return []
  }
  let tabs = [
    // { Text: "Company & Commodity", leftSubTitle: "Step 1", rightSubTitle: "In Progress" },
]
  if (!role) {
    tabs.splice(0, 1)
  }
  return tabs
}

export const updateQualityAnalysis = async (
  parameterData,
  setIsOverlayLoader,
  formData,
  existingData,
  setIsSubmit,
  setParameterDataTable
) => {
  let smpl_set_smpljson = [];
  let smpl_set_paramjson = existingData.jia_set_paramjson || [];
  let smpl_set_groupjson = existingData.jia_set_groupjson || [];
  let param_sequance_no = 0;
  parameterData?.map((paramData, seqIndex) => {
    paramData.smpl_set_smpljson?.map((sample) => {
      if (!smpl_set_smpljson.includes(sample)) {
        smpl_set_smpljson.push(sample);
      }
    });
    let basis = [];
    let basiscodes = [];
    if (paramData.smpl_set_basisjson_name.length > 0) {
      basiscodes = paramData.smpl_set_basisjson_name.split(",");
    } else {
      basiscodes = [];
    }
    paramData.smpl_set_basisjson?.map((basId, i) => {
      basis.push({
        basis_id: basId,
        basis_code: basiscodes[i],
      });
    });
    if (paramData["is_group_param"] == "Group") {
      let parameters = [];
      const groupParamJson = paramData.groupJsonParameter.filter(
        (singleparam) => {
          singleparam.param_sequence = param_sequance_no;
          param_sequance_no++;
          return true;
        }
      );
      smpl_set_groupjson.push({
        group_id: paramData.smpl_set_groupjson,
        group_name: paramData.smpl_set_groupjson_name,
        parameters: groupParamJson,
        sequanceNo: seqIndex,
      });
    } else {
      smpl_set_paramjson.push({
        param_id: paramData.smpl_set_paramjson,
        param_name: paramData.smpl_set_paramjson_name,
        std_id: paramData.smpl_set_testmethodjson,
        std_name: paramData.smpl_set_testmethodjson_name,
        basis: basis,
        sequanceNo: seqIndex,
        param_unit: paramData.smpl_set_unit,
        param_sequence: param_sequance_no,
      });
      param_sequance_no++;
    }
  });
  const newMainPayload = {
    jia_id: existingData.jia_id,
    ji_quality_analysis: {
      jia_set_groupjson: smpl_set_groupjson,
      jia_set_paramjson: smpl_set_paramjson,
      tenant: GetTenantDetails(1),
    },
  };
  setIsOverlayLoader(true);
  // return;
  const res = await putDataFromApi(
    getJIQualityAnalysisUpdateApi,
    newMainPayload
  );
  if (res.data.status === 200) {
    setParameterDataTable([])
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
    setIsSubmit(true)
    setTimeout(() => {
      setIsSubmit(false)
    }, 10);
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
  setIsOverlayLoader(false);

};

export const getAllBrancheDataforDropdown = async (setMasterResponse, fieldName, isBrCode) => {
  try {
    let res = await postDataFromApi(MasterListApi, { is_dropdown: true, model_name: "branch" });
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data?.map((client) => ({
        id: client[0],
        name: `${client[1]} ${isBrCode ? '(' + client[2] + ')' : ''}`,
      }));

      const bodyToPass = {
        model: fieldName ? fieldName : "fk_branchid",
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  }
};