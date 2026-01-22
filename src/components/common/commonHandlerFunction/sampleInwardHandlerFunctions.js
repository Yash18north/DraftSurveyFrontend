import { toast } from "react-toastify";
import {
  deleteDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../services/commonServices";
import {
  checkSampleIdAvailable,
  sampleDetailsAPI,
  sampleInwardDetailsDeleteAPI,
  sampleInwardDetailsUpdateAPI,
  sampleInwardUpdate,
} from "../../../services/api";
import { encryptDataForURL } from "../../../utills/useCryptoUtils";
/**
 * use for create or update single sample inward
 * @param {*} actionSelected 
 * @param {*} editableIndex 
 * @param {*} tableData 
 * @param {*} simpleInwardId 
 * @param {*} formData 
 * @param {*} section 
 * @param {*} setSaveClicked 
 * @param {*} setEditableIndex 
 * @param {*} getInwardTabledata 
 * @param {*} setPopupIndex 
 * @param {*} popupIndex 
 * @param {*} setPopupOpenAssignment 
 * @param {*} setIsBtnClicked 
 * @param {*} setIsOverlayLoader 
 * @param {*} isNewAdd 
 * @returns 
 */
export const InwardPageHandleAction = async (
  actionSelected,
  editableIndex,
  tableData,
  simpleInwardId,
  formData,
  section,
  setSaveClicked,
  setEditableIndex,
  getInwardTabledata,
  setPopupIndex,
  popupIndex,
  setPopupOpenAssignment,
  setIsBtnClicked,
  setIsOverlayLoader,
  isNewAdd
) => {
  if (actionSelected === "Save" || actionSelected === "customSave") {
    setIsBtnClicked(true);
    let newRowIndex = editableIndex;
    if (actionSelected === "customSave" && !isNewAdd) {
      newRowIndex = tableData.length;
    }
    let payload = {
      sample_inward_id: simpleInwardId,
      sample_inward_detail: {
        smpl_detail_smpl_id: formData["1"]?.["sample_id_" + newRowIndex],
        smpl_detail_dos: formData["1"]?.["smpl_detail_dos_" + newRowIndex],
        smpl_detail_recpt_mode:
          formData["1"]?.["smpl_detail_recpt_mode_" + newRowIndex],
        smpl_detail_seal_number:
          formData["1"]?.["smpl_detail_seal_number_" + newRowIndex],
        smpl_detail_sample_mark:
          formData["1"]?.["smpl_detail_sample_mark_" + newRowIndex],
        smpl_detail_pkging_condition:
          formData["1"]?.["smpl_detail_pkging_condition_" + newRowIndex],
        smpl_detail_smpl_condtion:
          formData["1"]?.["smpl_detail_smpl_condtion_" + newRowIndex],
        smpl_detail_smpl_qty:
          formData["1"]?.["smpl_detail_smpl_qty_" + newRowIndex] +
          " / " +
          formData["1"]?.["smpl_detail_smpl_qty_unit_" + newRowIndex],
        tenant: GetTenantDetails(1),
      },
    };

    if (["Raw and Powdered Sample", "Physical and Raw Sample", "Physical,Raw and Powdered Sample"].includes(formData["1"]?.["smpl_detail_smpl_condtion_" + newRowIndex])) {
      payload.sample_inward_detail.smpl_detail_smpl_pwd_qty =
        formData["1"]?.["smpl_detail_smpl_pwd_qty_" + newRowIndex];
      payload.sample_inward_detail.smpl_detail_smpl_pwd_qty_unit =
        formData["1"]?.["smpl_detail_smpl_pwd_qty_unit_" + newRowIndex];
      payload.sample_inward_detail.smpl_detail_is_raw_and_powdered = true;
      if (["Physical,Raw and Powdered Sample"].includes(formData["1"]?.["smpl_detail_smpl_condtion_" + newRowIndex])) {
        payload.sample_inward_detail.smpl_detail_smpl_physical_qty =
          formData["1"]?.["smpl_detail_smpl_physical_qty_" + newRowIndex];
        payload.sample_inward_detail.smpl_detail_smpl_physical_qty_unit =
          formData["1"]?.["smpl_detail_smpl_physical_qty_unit_" + newRowIndex];
        payload.sample_inward_detail.smpl_detail_is_physical_raw_and_powdered = true;
      }
    }
    let nonRequiredFields = [];
    if (
      ["Unsealed", "Intact"].includes(payload.sample_inward_detail["smpl_detail_pkging_condition"])
    ) {
      nonRequiredFields.push("smpl_detail_seal_number");
    }
    if (
      !formData["1"]?.["smpl_detail_smpl_qty_" + newRowIndex] ||
      !formData["1"]?.["smpl_detail_smpl_qty_unit_" + newRowIndex]
    ) {
      let errLabel = "";
      if (formData["1"]?.["smpl_detail_smpl_qty_" + newRowIndex] == "") {
        errLabel = "Sample Quantity";
      } else {
        errLabel = "Sample Quantity Unit";
      }
      errLabel = "Sample Quantity Unit";
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
    for (let obj in payload.sample_inward_detail) {
      if (
        (payload["sample_inward_detail"][obj] === undefined ||
          payload["sample_inward_detail"][obj] === "") &&
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
        if (errLabel == "smpl_detail_smpl_pwd_qty") {
          errLabel = "Powdered Sample Quantity"
        }
        else if (errLabel == "smpl_detail_smpl_pwd_qty_unit") {
          errLabel = "Powdered Sample Quantity Unit"
        }
        else if (errLabel == "smpl_detail_smpl_id") {
          errLabel = "Sample Id"
        }
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
      else if (
        // ['smpl_detail_seal_number', 'smpl_detail_sample_mark'].includes(obj) &&
        [].includes(obj) &&
        payload["sample_inward_detail"][obj].length > 15
      ) {
        const field = section.rows[0].filter((field, index) => {
          if (field.name === obj) {
            field.label = section.headers[index].label;
            return true;
          }
          return false;
        });
        let errLabel = field.length ? field[0].label : obj;
        toast.error("Please ensure the " + errLabel + " is no longer than 15 characters.", {
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
        return
      }
    }
    let isSealNumberDuplicate = false;
    let isSampleMarkDuplicate = false;
    const duplicateData = tableData.filter((singleData) => {
      if (
        payload["sample_inward_detail"]["smpl_detail_seal_number"] &&
        payload["sample_inward_detail"]["smpl_detail_seal_number"] != "NA" &&
        singleData.smpl_detail_seal_number ===
        payload["sample_inward_detail"]["smpl_detail_seal_number"] &&
        (actionSelected === "customSave" ||
          (actionSelected !== "customSave" &&
            singleData.smpl_inwrd_detail_id !==
            tableData[editableIndex].smpl_inwrd_detail_id))
      ) {
        isSealNumberDuplicate = true;
        return true;
      } else if (
        singleData.smpl_detail_sample_mark ==
        payload["sample_inward_detail"]["smpl_detail_sample_mark"] &&
        (actionSelected === "customSave" ||
          (actionSelected !== "customSave" &&
            singleData.smpl_inwrd_detail_id !==
            tableData[editableIndex].smpl_inwrd_detail_id))
      ) {
        isSampleMarkDuplicate = true;
        return true;
      }
    });
    if (
      (isSampleMarkDuplicate || isSealNumberDuplicate) &&
      !formData[0]?.jrf_is_ops
    ) {
      let field;
      if (isSampleMarkDuplicate) {
        field = section.rows[0].filter((field, index) => {
          if (field.name === "smpl_detail_sample_mark") {
            field.label = section.headers[index].label;
            return true;
          }
          return false;
        });
      } else {
        field = section.rows[0].filter((field, index) => {
          if (field.name === "smpl_detail_seal_number") {
            field.label = section.headers[index].label;
            return true;
          }
          return false;
        });
      }

      let errLabel = field.length ? field[0].label : "smpl_detail_seal_number";
      toast.error(errLabel + " has duplicate value", {
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
    setSaveClicked(true);
    setIsOverlayLoader(true);
    let res;

    if (actionSelected !== "customSave" && !isNewAdd) {
      let newMainPayload = {};
      newMainPayload.smpl_inwrd_detail_id =
        tableData[editableIndex].smpl_inwrd_detail_id;
      newMainPayload.sample_inward_detail_data = payload.sample_inward_detail;
      res = await putDataFromApi(sampleInwardDetailsUpdateAPI, newMainPayload);
    } else {
      if (formData[1]?.["smpl_inwrd_detail_id_" + newRowIndex]) {
        let newMainPayload = {};
        newMainPayload.smpl_inwrd_detail_id =
          formData[1]?.["smpl_inwrd_detail_id_" + newRowIndex];
        newMainPayload.sample_inward_detail_data = payload.sample_inward_detail;
        res = await putDataFromApi(
          sampleInwardDetailsUpdateAPI,
          newMainPayload
        );
      } else {
        if (isNewAdd) {
          payload.sample_inward_detail.fk_ji_sample_marks_id =
            formData[1]?.["fk_ji_sample_marks_id_" + newRowIndex];
        }
        res = await postDataFromApi(sampleDetailsAPI, payload);
      }
    }
    if (res.data.status === 200) {
      setPopupOpenAssignment(false);
      getInwardTabledata(simpleInwardId);
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
  } else if (actionSelected === "Edit") {
    setEditableIndex(popupIndex);
  } else if (actionSelected === "Delete") {
    setSaveClicked(true);
    let payload = {
      smpl_inwrd_detail_id: tableData[popupIndex]?.smpl_inwrd_detail_id,
    };
    setIsOverlayLoader(true);
    let res = await deleteDataFromApi(sampleInwardDetailsDeleteAPI, payload);
    if (res.data.status === 200) {
      getInwardTabledata(simpleInwardId);
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
/**
 * use for change status of inward
 * @param {*} btnType 
 * @param {*} pageType 
 * @param {*} formData 
 * @param {*} navigate 
 * @param {*} jrfId 
 * @param {*} setIsOverlayLoader 
 */
export const handleInwardStatusChange = async (
  btnType,
  pageType,
  formData,
  navigate,
  jrfId,
  setIsOverlayLoader
) => {
  let payload;
  let smpl_status = "saved";
  let module;
  if (pageType === "assignment") {
    module = "assignment";
  }
  if (btnType === "save") {
    if (module === "assignment") {
      smpl_status = "assigning";
    }
    payload = {
      smpl_inwrd_id: formData[1]?.sampleInwardIdMain,
      sample_inward: {
        smpl_status: smpl_status,
        tenant: GetTenantDetails(1),
      },
    };
  } else {
    smpl_status = "inwarded";
    if (module === "assignment" && btnType === "assign") {
      smpl_status = "assigned";
    }
    payload = {
      smpl_inwrd_id: formData[1]?.sampleInwardIdMain
        ? formData[1]?.sampleInwardIdMain
        : formData[0]?.sampleInwardIdMain,
      sample_inward: {
        smpl_status: smpl_status,
        tenant: GetTenantDetails(1),
      },
    };
  }
  setIsOverlayLoader(true);
  let res = await putDataFromApi(sampleInwardUpdate, payload);
  if (res?.data?.status === 200) {
    toast.success(res.data?.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    if (btnType === "assignment") {
      setTimeout(() => {
        navigate(
          "/inwardList/groupAssignment?status=" +
          encryptDataForURL("assignment") +
          "&sampleInwardId=" +
          encryptDataForURL(formData[1]?.sampleInwardIdMain) +
          "&id=" +
          encryptDataForURL(jrfId)
        );
      }, 1000);
    } else {
      setTimeout(() => {
        navigate("/inwardList");
      }, 1000);
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

/**
 * Use for handle verifi jrf checklist buttons like accept and reject
 * @param {*} e 
 * @param {*} kind 
 * @param {*} formData 
 * @param {*} remarkText 
 * @param {*} setSaveClicked 
 * @param {*} formConfig 
 * @param {*} navigate 
 * @param {*} setIsOverlayLoader 
 * @returns 
 */
export const handleChecklistBtns = async (
  e,
  kind,
  formData,
  remarkText,
  setSaveClicked,
  formConfig,
  navigate,
  setIsOverlayLoader
) => {
  e.preventDefault();

  let payload;

  formData["1"].jrf_finalize_timeframe = parseInt(
    formData["1"].jrf_finalize_timeframe
  );


  formData["1"].jrf_agrees_with_time =
    formData["1"].jrf_agrees_with_time === "Yes";
  let jrfCheckListFields = {}
  jrfCheckListFields['jrf_liquid_checkbox']=formData["1"].jrf_liquid_checkbox
  jrfCheckListFields['jrf_liquid_input']=formData["1"].jrf_liquid_input
  jrfCheckListFields['jrf_gaseous_checkbox']=formData["1"].jrf_gaseous_checkbox
  jrfCheckListFields['jrf_gaseous_input']=formData["1"].jrf_gaseous_input
  jrfCheckListFields['jrf_semisolid_checkbox']=formData["1"].jrf_semisolid_checkbox
  jrfCheckListFields['jrf_semisolid_input']=formData["1"].jrf_semisolid_input

  if (kind === "accept") {
    formData["1"].jrf_status = "accepted";
    payload = {
      jrf_id: formData["1"].jrf_id,
      jrf_data: {
        jrf_sample_condition: formData["1"].jrf_sample_condition,
        jrf_pkging_condition: formData["1"].jrf_pkging_condition,
        jrf_qty_of_raw_smpl_checkboxes:
          formData["1"].jrf_qty_of_raw_smpl_checkboxes,
        jrf_qty_of_raw_smpl_input: formData["1"].jrf_qty_of_raw_smpl_input,
        jrf_qty_of_powedered_smpl_checkboxes:
          formData["1"].jrf_qty_of_powedered_smpl_checkboxes,
        jrf_qty_of_powedered_smpl_input:
          formData["1"].jrf_qty_of_powedered_smpl_input,
        jrf_test_method_conf_through:
          formData["1"].jrf_test_method_conf_through,
        jrf_checklist: formData["1"].jrf_checklist,
        jrf_agrees_with_time: Boolean(formData["1"].jrf_agrees_with_time),
        jrf_is_lab_capable: Boolean(formData["1"].jrf_is_lab_capable === "Yes"),
        jrf_finalize_timeframe: formData["1"].jrf_finalize_timeframe,
        jrf_vc_term_condition: formData["1"].jrf_vc_term_condition,
        jrf_petro_checklist_json: jrfCheckListFields,
        jrf_status: "accepted",
        tenant: GetTenantDetails(1),
      },
    };
  } else if (kind === "reject") {
    payload = {
      jrf_id: formData["1"].jrf_id,
      jrf_status: "rejected",
      jrf_remark: remarkText,
      jrf_vc_term_condition: formData["1"].jrf_vc_term_condition,
    };
  } else {
    formData["1"].jrf_status = "posted";
    payload = {
      jrf_id: formData["1"].jrf_id,
      jrf_data: {
        jrf_sample_condition: formData["1"].jrf_sample_condition,
        jrf_pkging_condition: formData["1"].jrf_pkging_condition,
        jrf_qty_of_raw_smpl_checkboxes:
          formData["1"].jrf_qty_of_raw_smpl_checkboxes,
        jrf_qty_of_raw_smpl_input: formData["1"].jrf_qty_of_raw_smpl_input,
        jrf_qty_of_powedered_smpl_checkboxes:
          formData["1"].jrf_qty_of_powedered_smpl_checkboxes,
        jrf_qty_of_powedered_smpl_input:
          formData["1"].jrf_qty_of_powedered_smpl_input,
        jrf_test_method_conf_through:
          formData["1"].jrf_test_method_conf_through,
        jrf_checklist: formData["1"].jrf_checklist,
        jrf_agrees_with_time: Boolean(formData["1"].jrf_agrees_with_time),
        jrf_is_lab_capable: Boolean(formData["1"].jrf_is_lab_capable === "Yes"),
        jrf_finalize_timeframe: formData["1"].jrf_finalize_timeframe,
        jrf_status: "posted",
        tenant: GetTenantDetails(1),
      },
    };
  }
  let notRequired = [
    "jrf_is_lab_capable",
    "jrf_agrees_with_time",
    "jrf_qty_of_raw_smpl_input",
    "jrf_qty_of_powedered_smpl_input",
    "jrf_qty_of_raw_smpl_checkboxes",
    "jrf_qty_of_powedered_smpl_checkboxes",
  ];
  if (GetTenantDetails(1, 1) == "TPBPL") {
    notRequired.push("jrf_sample_condition");
    if (["accept", "reject"].includes(kind)) {
      if (!formData["1"]?.jrf_vc_term_condition) {
        toast.error("Please select Terms & Conditions", {
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
  if (GetTenantDetails(1, 1) !== "TPBPL") {
    notRequired.push("jrf_vc_term_condition");
  }
  for (let obj in payload.jrf_data) {
    if (
      !notRequired.includes(obj) &&
      (payload["jrf_data"][obj] === undefined ||
        payload["jrf_data"][obj] === "" ||
        payload["jrf_data"][obj].length === 0)
    ) {
      const tablength = formConfig.sections?.[1]?.tabs.length;
      const field = formConfig.sections?.[1]?.tabs?.[
        tablength - 1
      ].fields.filter((field) => {
        return field.name === obj;
      });
      let errLabel = field.length ? field[0].label : obj;
      let errorMsg = errLabel + "  required";
      toast.error(errorMsg, {
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
  setSaveClicked(true);
  setIsOverlayLoader(true);
  let res = await putDataFromApi(formConfig.apiEndpoints.update, payload);
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
  setIsOverlayLoader(false);
  setSaveClicked(false);
};

/**
 * Handle after verify checklist main submit button click
 * @param {*} e 
 * @param {*} formData 
 * @param {*} setSaveClicked 
 * @param {*} setTabOpen 
 * @param {*} setFormData 
 * @param {*} setIsOverlayLoader 
 * @returns 
 */
export const handleInwardMainSubmit = async (
  e,
  formData,
  setSaveClicked,
  setTabOpen,
  setFormData,
  setIsOverlayLoader
) => {
  let payload = {
    sample_inward: {
      smpl_inward_number: "",
      smpl_status: "created",
      smpl_reference_number: formData["0"].jrf_referenceno,
      smpl_jrf_id: formData["0"].jrf_id,
      smpl_jrf_no: formData["0"].jrf_no,
      smpl_customer_id: formData["0"].jrf_company_detail.cmp_id,
      smpl_commodity_id: formData["0"].jrf_commodity_detail.cmd_id,
      smpl_qty_of_test_smpl: formData["0"].jrf_quanity_sample,
      smpl_desc_of_the_smpl: formData["0"].smpl_desc_of_the_smpl
        ? formData["0"].smpl_desc_of_the_smpl
        : "n/a",
      smpl_param_to_be_analyzed: formData["0"].jrf_parameters_to_analyze,
      smpl_other_req: formData["0"].jrf_other_info,
      smpl_test_report_req_after_days: formData["0"].jrf_test_repo_req_on,
      smpl_test_method: formData["0"].jrf_test_method,
      smpl_lab_id: formData["0"].jrf_lab_detail.lab_id,
      jrf_status: "tasked",
      smpl_dos: formData["0"].smpl_detail_dos,
      smpl_receipt_mode: formData["0"].smpl_detail_recpt_mode,
      tenant: GetTenantDetails(1),
    },
  };
  for (let obj in payload.sample_inward) {
    if (
      (payload["sample_inward"][obj] === undefined ||
        !payload["sample_inward"][obj]) &&
      ["smpl_dos", "smpl_receipt_mode"].includes(obj)
    ) {
      let errLabel;
      if (obj === "smpl_dos") {
        errLabel = "Date of Receipt";
      } else if (obj === "smpl_receipt_mode") {
        errLabel = "Sample Receipt Mode";
      }
      toast.error(errLabel + "  required", {
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
      // }
    }
  }
  setSaveClicked(true);
  setIsOverlayLoader(true);
  let res = await postDataFromApi(sampleDetailsAPI, payload);
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
    setTabOpen(true);
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        1: {
          ...prevFormData[1],
          sampleInwardIdMain: res.data.data.smpl_inwrd_id,
        },
      };
    });
    const currentURL = window.location.href;
    const newQueryString =
      "?status=" +
      encryptDataForURL("inward") +
      "&sampleInwardId=" +
      encryptDataForURL(res.data.data.smpl_inwrd_id) +
      "&id=" +
      encryptDataForURL(formData["0"].jrf_id);
    const spbaseUrl = currentURL.split("?");
    let baseUrl = spbaseUrl[0];
    if (spbaseUrl.length > 2) {
      baseUrl = spbaseUrl[0] + spbaseUrl[1];
    }
    const newURL = baseUrl + newQueryString;
    window.history.replaceState({}, "", newURL);
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
};

/**
 * After create samples click on next process for assign parameter
 * @param {*} btnType 
 * @param {*} formData 
 * @param {*} navigate 
 * @param {*} setIsPopupOpen 
 * @param {*} setInwardBtnchange 
 * @param {*} jrfId 
 * @param {*} module 
 * @returns 
 */
export const handleInward = async (
  btnType,
  formData,
  navigate,
  setIsPopupOpen,
  setInwardBtnchange,
  jrfId,
  module = ""
) => {
  if (
    btnType === "assignment" &&
    formData[0]?.smpl_status !== "created" &&
    formData[0]?.smpl_status !== "saved"
  ) {
    navigate(
      "/inwardList/groupAssignment?status=" +
      encryptDataForURL("assignment") +
      "&sampleInwardId=" +
      encryptDataForURL(formData[1]?.sampleInwardIdMain) +
      "&id=" +
      encryptDataForURL(jrfId)
    );
    return;
  }
  setIsPopupOpen(true);
  setInwardBtnchange(btnType);
};

export const checkSampleIdAvailibility = async (
  value,
  setIsOverlayLoader,
  setIsSampleIdAvailable
) => {
  // setIsSampleIdAvailable(true)
  // return ""
  const regex = /^\d{4}[A-Z]\d{2}[A-Z]{2}\d{4,5}$/;
  const trimmedValue = value.trim();
  if (!regex.test(trimmedValue)) {
    setIsSampleIdAvailable(false);
    return;
  }
  let payload = {
    sample_id: value,
  };
  setIsOverlayLoader(true);
  let res = await postDataFromApi(checkSampleIdAvailable, payload);
  if (res?.data?.status === 200) {
    setIsSampleIdAvailable(true);
    toast.success(res.data?.message, {
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
    setIsSampleIdAvailable(false);
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
