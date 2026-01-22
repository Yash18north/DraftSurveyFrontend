import { toast } from "react-toastify";
import {
  deleteDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../services/commonServices";
import {
  getJRFOperationDataApi,
  getSimgleAllotmentDetailsApi,
  OPSJRFDeleteApi,
  referenceDataApi,
} from "../../../services/api";
import { decryptDataForURL, encryptDataForURL } from "../../../utills/useCryptoUtils";
import { getOperationActivityUrl } from "../../../services/commonFunction";
import moment from "moment";
/**
 * get data based on reference data and also check validation for ref
 * @param {*} referenceNo 
 * @param {*} setIsValideReferenceNo 
 * @param {*} formData 
 * @param {*} setReferenceData 
 * @param {*} setFormData 
 * @param {*} setSubCommodityOptions 
 * @param {*} setIsRefrenceNoCalled 
 * @param {*} setIsOverlayLoader 
 */
export const getReferenceData = async (
  referenceNo,
  setIsValideReferenceNo,
  formData,
  setReferenceData,
  setFormData,
  setSubCommodityOptions,
  setIsRefrenceNoCalled,
  setIsOverlayLoader
) => {
  let bodyToPass = {
    jrf_referenceno: referenceNo,
  };
  setIsValideReferenceNo("");
  setIsRefrenceNoCalled(false)
  setIsOverlayLoader(true)
  try {
    let res = await postDataFromApi(referenceDataApi, bodyToPass);
    if (res?.data?.status === 200) {
      const response = res.data.data;
      if (formData["0"]) {
        setReferenceData(response);

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              jrf_state: response.state.state_name,
              jrf_company: response.company.cmp_id,
              jrf_company_name: response.company.cmp_name,
              // cmp_address: response.company.cmp_address,
              jrf_commodity: response.commodity.cmd_name,
              fk_sub_commodity: "",
              jrf_mode: response.mode.mode_name,
            },
          };
        });
        let options = [];
        response.commodity.sub_commodity.map((singleComm, i) =>
          options.push({
            id: singleComm.sub_cmd_id,
            name: singleComm.sub_cmd_name,
          })
        );
        setSubCommodityOptions(options);
      }
      setIsValideReferenceNo("");
      setIsOverlayLoader(false)
    }
    else {
      setIsValideReferenceNo(res?.data?.message)
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            jrf_state: "--",
            jrf_commodity: "--",
            jrf_mode: "--",
            fk_sub_commodity: "",
          },
        };
      });
      setSubCommodityOptions([])
      setIsRefrenceNoCalled(true)
      setIsOverlayLoader(false)
    }
    setIsRefrenceNoCalled(true);
  } catch (error) {
    toast.error(error.message, {
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
          jrf_state: "--",
          jrf_commodity: "--",
          jrf_mode: "--",
        },
      };
    });
    setSubCommodityOptions([]);
    setIsRefrenceNoCalled(true);
    setIsOverlayLoader(false);
  } finally {
    setIsOverlayLoader(false);
  }
};
/**
 * Create or update jrf data
 * @param {*} setSaveClicked 
 * @param {*} formData 
 * @param {*} referenceData 
 * @param {*} jrfId 
 * @param {*} formConfig 
 * @param {*} setJRFID 
 * @param {*} navigate 
 * @param {*} setIsPopupOpen 
 * @param {*} type 
 * @param {*} isExternalJRF 
 * @param {*} setIsOverlayLoader 
 * @param {*} isRegularJRF 
 */
export const handleJRFCreateOrUpdate = async (
  setSaveClicked,
  formData,
  referenceData,
  jrfId,
  formConfig,
  setJRFID,
  navigate,
  setIsPopupOpen,
  type = "",
  isExternalJRF,
  setIsOverlayLoader,
  isRegularJRF
) => {
  setSaveClicked(true);
  let payloadData = formData[0];
  let actualFormData = formData[0];
  if (!isExternalJRF) {
    payloadData.jrf_commodity = referenceData?.commodity?.cmd_id;
  }
  payloadData.jrf_cmp_address = formData[0]?.cmp_address;
  if (type === "post") {
    payloadData.jrf_status = "posted";
  } else {
    payloadData.jrf_status = "saved";
  }
  if (isExternalJRF) {
    if (type === "post") {
      payloadData.jrf_status = "awaited";
      // payloadData.jrf_status = "posted";
    }
    payloadData.jrf_is_external = 1;
  }
  payloadData.jrf_mode = "SS"
  if (isRegularJRF) {
    // payloadData.jrf_is_external=1
    payloadData.jrf_is_regular = 1
  }
  payloadData.jrf_remark = null;
  payloadData.tenant = GetTenantDetails(1);
  delete payloadData.jrf_id;
  let res;
  setIsOverlayLoader(true);
  if (jrfId) {
    let MainData = {
      jrf_data: {
        ...payloadData,
        jrf_status: payloadData.jrf_status
      },
    };
    MainData.jrf_id = jrfId;
    res = await putDataFromApi(formConfig.apiEndpoints.update, MainData);
  } else {
    let MainData = {
      jrf: payloadData,
    };
    res = await postDataFromApi(formConfig.apiEndpoints.create, MainData);
  }
  if (!isExternalJRF) {
    payloadData.jrf_commodity = actualFormData?.cmd_id;
  }
  delete payloadData.jrf_status;
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
    setJRFID(res?.data?.data?.jrf_id);
    setIsOverlayLoader(false);
    setTimeout(() => {
      navigate("/jrfListing");
    }, 1000);
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
  setIsPopupOpen(false);
  setIsOverlayLoader(false);
};

/**
 * check for validation on submit the form
 * @param {*} e 
 * @param {*} handleSubmit 
 * @param {*} setIsPopupOpen 
 * @param {*} setJRFCreationType 
 * @returns 
 */
export const handleFormSave = async (
  e,
  handleSubmit,
  setIsPopupOpen,
  setJRFCreationType
) => {
  e.preventDefault();
  let isValidate = handleSubmit();
  if (!isValidate) {
    return false;
  }
  setIsPopupOpen(true);
  setJRFCreationType("save");
};
/**
 * check for validation on submit the form
 * @param {*} e 
 * @param {*} handleSubmit 
 * @param {*} setIsPopupOpen 
 * @param {*} setJRFCreationType 
 * @returns 
 */
export const handleFormPost = async (
  e,
  handleSubmit,
  setJRFCreationType,
  setIsPopupOpen
) => {
  e.preventDefault();
  let isValidate = handleSubmit();
  if (!isValidate) {
    return false;
  }
  setJRFCreationType("post");
  setIsPopupOpen(true);
};
/**
 * Create or update OPS JRF data
 * @param {*} formData 
 * @param {*} setIsOverlayLoader 
 * @param {*} setIsPopupOpen 
 * @param {*} navigate 
 * @param {*} jrfCreateUrl 
 * @param {*} OperationTypeID 
 * @param {*} OperationType 
 * @param {*} fk_ops_lms_assignments 
 * @param {*} subTableData 
 */

export const handleJRFCreateOrUpdateWithOperations = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  navigate,
  jrfCreateUrl,
  OperationTypeID,
  OperationType,
  fk_ops_lms_assignments,
  subTableData
) => {

  let jrf_parameters_to_analyze = [];
  let jrf_test_method_details = [];
  let descriptionSamples = [];
  subTableData.map((singleData) => {
    if (!fk_ops_lms_assignments.includes(singleData.jila_id.toString())) {
      return
    }
    singleData.jila_set_markjson.map((mark) => {
      if (!descriptionSamples.includes(mark)) {
        descriptionSamples.push(mark)
      }
    })
    singleData.jila_set_groupjson.map((singleParam) => {
      singleParam.parameters.map((parameter) => {
        if (!jrf_parameters_to_analyze.includes(parameter.param_name)) {
          jrf_parameters_to_analyze.push(parameter.param_name)
        }
        parameter.standards.map((std) => {
          if (!jrf_test_method_details.includes(std.std_name)) {
            jrf_test_method_details.push(std.std_name)
          }
        })
      })
    })
    singleData.jila_set_paramjson.map((singleParam) => {
      if (!jrf_parameters_to_analyze.includes(singleParam.param_name)) {
        jrf_parameters_to_analyze.push(singleParam.param_name)
      }
      if (!jrf_test_method_details.includes(singleParam.std_name)) {
        jrf_test_method_details.push(singleParam.std_name)
      }
    })
  })
  // return
  let payloadData = {
    // "jrf_contact_person": formData[0]?.client_details?.client_name,
    // jrf_contact_person_number: "-",
    cmp_address: formData[0]?.company?.company_address,
    jrf_cmp_address: formData[0]?.branch?.branch_address,
    noOfSamples: 0,
    // jrf_date: formData[0]?.ji_date,
    jrf_date: moment(new Date()).format("yyyy-MM-DD"),
    jrf_referenceno: formData[0]?.ji_reference_number,
    jrf_state: "-",
    jrf_company: formData[0]?.fk_companyid,
    jrf_company_name: formData[0]?.company?.company_name,
    jrf_commodity: formData[0]?.fk_commodityid,
    jrf_mode: formData[0]?.mode,
    fk_sub_commodity: formData[0]?.fk_subcommodityid,
    // jrf_quanity_sample: "-",
    jrf_desc_of_sample: descriptionSamples.length > 0 ? descriptionSamples.join(',') : '',
    jrf_parameters_to_analyze: jrf_parameters_to_analyze.length > 0 ? jrf_parameters_to_analyze.join(',') : '-',
    // jrf_other_info: "-",
    // jrf_test_repo_req_on: 1,
    jrf_test_method: formData[0]?.sampling_method_details,
    jrf_test_method_details: jrf_test_method_details.length > 0 ? jrf_test_method_details.join(',') : '-',
    jrf_terms_and_conditions: true,
    // jrf_lab: formData[1]?.smpl_filter_lab,
    jrf_lab: formData[1]?.send_for_jrf_lab_id,
    jrf_status: "saved",
    jrf_remark: null,
    jrf_is_ops: true,
    fk_jiid: formData[0]?.ji_id,
    fk_jisid: OperationTypeID,
    tenant: GetTenantDetails(1),
    fk_ops_lms_assignments: fk_ops_lms_assignments,
  };
  let res;
  setIsOverlayLoader(true);
  let MainData = {
    jrf: payloadData,
  };
  // console.log( getOperationActivityUrl(formData[0]?.operation_type?.operation_type_name),formData[0]?.operation_type?.operation_type_name, formData);
  res = await postDataFromApi(jrfCreateUrl, MainData);
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
      window.location.reload();
    }, 1000);
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
 * get OPS JRF Data
 * @param {*} ji_id 
 * @param {*} jis_id 
 */
export const getJRFOperationData = async (ji_id, jis_id) => {
  try {
    let tempBody = {
      ji_id: ji_id,
      jis_id: jis_id,
    };
    let res = await postDataFromApi(getJRFOperationDataApi, tempBody);
  } catch (error) {
    console.error(error);
  }
};
/**
 * JRF delete handler
 * @param {*} JRFID 
 * @param {*} setIsOverlayLoader 
 * @param {*} handleBackButtonFunction 
 */
export const handleOPSJRFDeleteFunc = async (JRFID, setIsOverlayLoader, handleBackButtonFunction) => {
  try {
    let res;
    let deleteBody = {
      jrf_id: JRFID,
    };
    setIsOverlayLoader(true)
    res = await deleteDataFromApi(OPSJRFDeleteApi, deleteBody);
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
      setTimeout(() => {
        handleBackButtonFunction()
      }, 1000);
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

  } finally {
    setIsOverlayLoader(false)
  }
};

export const getAllotmentDetails = async (setFormData, setIsOverlayLoader) => {
  setIsOverlayLoader(true)
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  const id = decryptDataForURL(params.get("sampleAllotmentId"));
  let bodyToPass = {
    sa_id: id,
  };
  try {
    let res = await postDataFromApi(getSimgleAllotmentDetailsApi, bodyToPass);
    if (res?.data?.status === 200) {
      let actulaResponse = res.data.data;
      actulaResponse.jrf_commodity =
        actulaResponse?.commodity_detail?.cmd_name;
      actulaResponse.jrf_sub_commodity_name =
        actulaResponse?.sub_commodity?.sub_commodity_name;
      actulaResponse.sv_verifiedby =
        actulaResponse?.sample_allotedto_data?.usr_id;
      actulaResponse.sv_dateofverification =
        actulaResponse?.sa_actualdateofreporting;
      actulaResponse.sv_verifiedName =
        actulaResponse?.sample_allotedto_data?.first_name +
        " " +
        actulaResponse?.sample_allotedto_data?.last_name;
      actulaResponse.sa_inward_no =
        actulaResponse?.inward_number;
      setFormData({
        0: actulaResponse,
      });
    }
  } catch (error) { }
  finally {
    setIsOverlayLoader(false)
  }
};

export const getSingleJRFData = async (formConfig, setFormData, setViewOnly, vieableArr, sampleInwardId, moduleType, getAssignmentMasterData, setReferenceData, user, setLoading, setSubCommodityOptions, setIsOverlayLoader, setIsRefrenceNoCalled, setLoadingTable) => {
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  let status = params.get("status") ? params.get("status") : "";

  status = decryptDataForURL(status).toLowerCase();
  const id = decryptDataForURL(params.get("id"));
  let bodyToPass = {
    jrf_id: id,
    model_name: "jrf_detail",
  };
  try {
    setIsOverlayLoader(true);
    let res = await postDataFromApi(
      formConfig.apiEndpoints.read,
      bodyToPass
    );
    if (res?.data?.status === 200) {
      let options = [];
      let jrfData = res.data.jrf;
      if (jrfData.jrf_status === "saved" && jrfData?.jrf_is_ops) {
        jrfData.jrf_contact_person_number = jrfData?.jrf_contact_person_number === "-" ? '' : jrfData?.jrf_contact_person_number
      }
      if (jrfData.jrf_petro_checklist_json) {
        for (let obj in jrfData.jrf_petro_checklist_json) {
          jrfData = {
            ...jrfData,
            obj: jrfData.jrf_petro_checklist_json?.[obj]
          }
        }
      }

      // jrfData.jrf_is_petro=true
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ...jrfData,
          },
          1: {
            ...prevFormData[1],
            ...jrfData,
          }
        }
      });
      if (status === "edit") {
        if (
          jrfData.jrf_status !== "saved" &&
          jrfData.jrf_status !== "rejected"
        ) {
          setViewOnly(true);
        }
      }
      if (status === "checklist" && jrfData.jrf_status == "posted") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              jrf_commodity: res.data.jrf?.jrf_commodity_detail?.cmd_name,
              jrf_sub_commodity_name:
                res.data.jrf?.jrf_sub_commodity_detail?.sub_cmd_name,
              jrf_company: res.data.jrf?.jrf_company_detail?.cmp_id,
              jrf_company_name: res.data.jrf?.jrf_company_detail?.cmp_name,
              jrf_lab: vieableArr.includes(status)
                ? res.data.jrf?.jrf_lab_detail?.lab_name +
                "-" +
                res.data.jrf?.jrf_lab_detail?.lab_code
                : res.data.jrf?.jrf_lab_detail?.lab_id,
              fk_sub_commodity: vieableArr.includes(status)
                ? res.data.jrf?.jrf_sub_commodity_detail?.sub_cmd_name
                : res.data.jrf?.jrf_sub_commodity_detail?.sub_cmd_id,
              jrf_branch_name: vieableArr.includes(status)
                ? res.data.jrf?.jrf_branch_detail?.br_code
                : res.data.jrf?.jrf_branch_detail?.br_id,
              cmp_address: res.data.jrf?.jrf_cmp_address,

            },
            1: {
              ...prevFormData[1],
              sampleInwardIdMain: sampleInwardId || "",
              jrf_checklist: [
                "Customer Name",
                "Sample Source",
                "Seal Number",
                "Commodity",
                "Test Method",
              ],
            },
          };
        });
      } else {

        setFormData((prevFormData) => {
          if (!(jrfData?.jrf_is_external && moduleType === "jrf" && status.toLowerCase() === "edit")) {
            prevFormData[0]['jrf_commodity'] = jrfData.jrf_commodity_detail?.cmd_name
            prevFormData[0]['jrf_sub_commodity_name'] = jrfData?.jrf_sub_commodity_detail?.sub_cmd_name
          }

          if (status.toLowerCase() == "view") {
            prevFormData[0]['jrf_branch'] = jrfData?.jrf_branch_detail?.br_code
            prevFormData[0]['fk_clientid'] = jrfData?.client_details?.client_name
            prevFormData[0]['jrf_usersalespersonid'] = res.data?.jrf?.sales_person?.full_name || "--"
          }
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              jrf_company: res.data.jrf?.jrf_company_detail?.cmp_id,
              jrf_company_name: res.data.jrf?.jrf_company_detail?.cmp_name,
              jrf_lab: vieableArr.includes(status)
                ? res.data.jrf?.jrf_lab_detail?.lab_name +
                "-" +
                res.data.jrf?.jrf_lab_detail?.lab_code
                : res.data.jrf?.jrf_lab_detail?.lab_id,
              fk_sub_commodity: vieableArr.includes(status)
                ? res.data.jrf?.jrf_sub_commodity_detail?.sub_cmd_name
                : res.data.jrf?.jrf_sub_commodity_detail?.sub_cmd_id,
              jrf_branch_name: vieableArr.includes(status)
                ? res.data.jrf?.jrf_branch_detail?.br_code
                : res.data.jrf?.jrf_branch_detail?.br_id,
              smpl_status: "To be generated",
              smpl_inwrd_No: "To be generated",
              jrf_contact_person:
                jrfData.jrf_contact_person ||
                (status !== "view" ? user?.logged_in_user_info?.contact_person_name : ''),
              jrf_contact_person_number:
                jrfData.jrf_contact_person_number ||
                (status !== "view" ? user?.logged_in_user_info?.contact_person_number : ''),
              cmp_address: res.data.jrf?.jrf_cmp_address,
              jrf_is_lab_capable: res.data.jrf?.jrf_is_lab_capable ? "Yes" : "No",
            },
            1: {
              ...prevFormData[1],
              sampleInwardIdMain: sampleInwardId || "",
              jrf_is_lab_capable: res.data.jrf?.jrf_is_lab_capable ? "Yes" : "No",
            },
          };
        });
      }

      if (moduleType == "GroupAssignment") {
        getAssignmentMasterData(
          res.data.jrf.jrf_commodity_detail.cmd_id,
          res.data.jrf.jrf_lab_detail.lab_id, "parameter"
        );
      }
      setReferenceData(jrfData.jrf_commodity_detail);
      jrfData.jrf_commodity_detail.sub_commodities.map((singleComm, i) =>
        options.push({
          id: singleComm.sub_cmd_id,
          name: singleComm.sub_cmd_name,
        })
      );
      setSubCommodityOptions(options);
      setLoading(true);
      setIsRefrenceNoCalled(false);
      setTimeout(() => {
        setLoading(false);
        setLoadingTable(false);
        setIsRefrenceNoCalled(true);
      }, 1000);
    }
  } catch (error) {
  } finally {
    setLoading(false);
    setLoadingTable(false);
    setIsOverlayLoader(false);
  }
}