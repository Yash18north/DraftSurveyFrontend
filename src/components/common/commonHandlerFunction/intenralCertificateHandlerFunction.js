import { toast } from "react-toastify";
import {
  checkexistingulrnoApi,
  InternalCertificateCreateApi,
  InternalCertificateGetApi,
  InternalCertificateUpdateApi,
} from "../../../services/api";
import {
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../services/commonServices";

export const handleIntarnalCertificateValidate = async (
  handleSubmit,
  setIsPopupOpen,
  setJRFCreationType,
  type
) => {
  if (["post", "save"].includes(type)) {
    let isValidate = handleSubmit();
    if (!isValidate) {
      return false;
    }
  }

  setIsPopupOpen(true);
  setJRFCreationType(type);
};
export const handleIntarnalCertificateCreateUpdate = async (
  formData,
  testMemoId,
  navigate,
  type,
  setIsOverlayLoader,
  subTableData,
  user
) => {
  let payload;
  payload = {
    ic_data: {
      ic_ulrno: formData[0]["ic_ulrno"],
      ic_refenence: formData[0]["ic_refenence"],
      ic_discipline: formData[0]["ic_discipline"],
      ic_group: formData[0]["ic_group"],
      ic_customername: formData[0]["ic_customername"],
      ic_customeraddress: formData[0]["ic_customeraddress"],
      ic_smpldrawnbylab:
        formData[0]["ic_smpldrawnbylab"] == "Sample Drawn By Laboratory"
          ? true
          : false,
      ic_is_client_req: !["Sample Drawn By Laboratory", "Sample Not Drawn By Laboratory"].includes(formData[0]["ic_smpldrawnbylab"])
        ? true
        : false,
      ic_descofsmpl: formData[0]["ic_descofsmpl"],
      ic_locationofsmpl: formData[0]["ic_locationofsmpl"],
      ic_dos: formData[0]["ic_dos"] === "N/A" ? null : formData[0]["ic_dos"],
      // ic_samplingmethods:
      //   formData[0]["ic_smpldrawnbylab"] == "Sample Drawn By Laboratory"
      //     ? formData[0]["ic_samplingmethods"]
      //       ? formData[0]["ic_samplingmethods"]
      //       : ""
      //     : formData[0]["ic_samplingmethods"],
      ic_samplingmethods: formData[0]["ic_samplingmethods"],
      ic_envcondition: formData[0]["ic_envcondition"],
      ic_mark_from: formData[0]["ic_mark_from"],
      ic_mark_to: formData[0]["ic_mark_to"],
      ic_seal_from: formData[0]["ic_seal_from"],
      ic_seal_to: formData[0]["ic_seal_to"],
      ic_conditionofsmpl: formData[0]["ic_conditionofsmpl"],
      ic_dateofrecsmpl: formData[0]["ic_dateofrecsmpl"],
      ic_dateofanalysis: formData[0]["ic_dateofanalysis"],
      ic_noofsmpls: formData[0]["ic_noofsmpls"],
      ic_ambienttemp: formData[0]["ic_ambienttemp"],
      ic_humidity: formData[0]["ic_humidity"],
      ic_borometric_pressure: formData[0]["ic_borometric_pressure"],
      ic_remarks: formData[0]["ic_remarks"],
      ic_is_mark: formData[0]["ic_is_mark"] ? true : false,
      ic_is_seal: formData[0]["ic_is_seal"] ? true : false,
      ic_dateanalysiscompleted: formData[0].ic_dateanalysiscompleted,
      ic_reference_date: formData[0].ic_reference_date,
      ic_test_performed_at: formData[0].ic_test_performed_at,
      ic_is_dos: formData[0]["ic_is_dos"] ? true : false,
      ic_is_samplingmethods: formData[0]["ic_is_samplingmethods"] ? true : false,
      ic_is_locationofsmpl: formData[0]["ic_is_locationofsmpl"] ? true : false,
      ic_is_envcondition: formData[0]["ic_is_envcondition"] ? true : false,
      ic_is_conditionofsmpl: formData[0]["ic_is_conditionofsmpl"] ? true : false,
      ic_mark_and_seal_qualifier: formData[0]["ic_mark_and_seal_qualifier"],
      ic_test_report_no: formData[0]["ic_test_report_no"],
      ic_is_2sign_format: formData[0]["ic_is_2sign_format"] || false,
      ic_lab_address: formData[0]["ic_lab_address"],
      tenant: GetTenantDetails(1),
      ic_is_size_analysis:
        (formData[0].ic_is_size_analysis &&
          formData[0].ic_is_size_analysis[0]) ||
        false,
      ic_size_analysis_data: subTableData,
      ic_is_account_of:
        formData[0]["ic_is_account_of"] == "Yes"
          ? true
          : false,
    },
  };
  if (type == "post") {
    payload["ic_data"].status = "pending";
    if (!user?.logged_in_user_info?.lab_or_branch?.lab_is_compliant &&
      user?.logged_in_user_info?.lab_or_branch?.lab_is_skip_process) {
      payload["ic_data"].status = "publish";
    }
    else if (user?.all_roles?.main_role_id && user?.all_roles?.other_roles?.length) {
      payload["ic_data"].status = "dtm-approved";
    }
  }
  setIsOverlayLoader(true);
  let res;
  if (formData[0].ic_id) {
    payload.ic_id = formData[0].ic_id;
    res = await putDataFromApi(InternalCertificateUpdateApi, payload);
  } else {
    if (type == "post") {
      payload["ic_data"].status = "pending";
      if (!user?.logged_in_user_info?.lab_or_branch?.lab_is_compliant &&
        user?.logged_in_user_info?.lab_or_branch?.lab_is_skip_process) {
        payload["ic_data"].status = "publish";
      }
      else if (user?.all_roles?.main_role_id && user?.all_roles?.other_roles?.length) {
        payload["ic_data"].status = "dtm-approved";
      }
    } else {
      payload["ic_data"].status = "saved";
    }
    payload.test_memo_id = testMemoId;
    res = await postDataFromApi(InternalCertificateCreateApi, payload);
  }

  if (res.data && res.data.status === 200) {
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
      navigate("/testReport");
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
};

export const getCertificateDetailsById = async (
  id,
  setTabOpen,
  setFormData,
  setTestMemoId,
  isPreview,
  setViewOnly,
  getAssignmentMasterData,
  setIsValideValue,
  setSubTableData
) => {
  try {
    const bodyToPass = {
      ic_id: id,
    };
    let res = await postDataFromApi(InternalCertificateGetApi, bodyToPass);
    if (res?.data?.status === 200) {
      let responseData = res.data.data;
      if (!isPreview) {
        if (responseData.status === "tm-approved") {
          setViewOnly(true);
        }
      }
      setTestMemoId(responseData.fk_tmid);
      responseData.ic_smpldrawnbylab = responseData.ic_smpldrawnbylab
        ? "Sample Drawn By Laboratory"
        : responseData.ic_is_client_req ? "As Per Client" : "Sample Not Drawn By Laboratory";
      responseData.ic_dos = responseData.ic_dos ? responseData.ic_dos : "N/A";
      responseData.ic_ambienttemp = responseData.ic_ambienttemp
        ? responseData.ic_ambienttemp.replace(
          new RegExp(`\\s*°C\\s*`, "gi"),
          ""
        )
        : "";
      responseData.ic_humidity = responseData.ic_humidity
        ? responseData.ic_humidity.replace(new RegExp(`\\s*%\\s*`, "gi"), "")
        : "";
      responseData.ic_borometric_pressure = responseData.ic_borometric_pressure
        ? responseData.ic_borometric_pressure.replace(
          new RegExp(`\\s*hPa\\s*`, "gi"),
          ""
        )
        : "";
      responseData.ic_rejection_remark = responseData.ic_rejection_remark
        ? responseData.ic_rejection_remark
        : "-";

      responseData.company_code = responseData.company.company_code;
      responseData.cmd_id = responseData.commodity.commodity_id;
      responseData.lab_id = responseData.fk_lab_id;
      responseData.ic_is_size_analysis = Array.isArray(responseData.ic_is_size_analysis) ? responseData.ic_is_size_analysis : responseData.ic_is_size_analysis ? [responseData.ic_is_size_analysis] : [];
      responseData.ic_is_account_of = responseData.ic_is_account_of
        ? "Yes"
        : "No";
      if (isPreview) {
        // responseData.company.company_code="L"
        setFormData(responseData);
      } else {
        if (setSubTableData && responseData.ic_size_analysis_data && responseData.ic_is_size_analysis?.[0]) {
          responseData.ic_size_analysis_data.map((singleData, index) => {
            responseData["sa_sample_id_" + index] = singleData["sa_sample_id"];
            responseData["param_name_" + index] = singleData["param_name"];
            responseData["param_value_" + index] = singleData["param_value"];
            responseData["param_unit_" + index] = singleData["param_unit"];
            responseData["param_method_" + index] = singleData["param_method"];
          });
          setTimeout(() => {
            setSubTableData(responseData.ic_size_analysis_data);
          }, 1000)
        }
        if (setIsValideValue) {
          setIsValideValue(true);
        }
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: responseData,
            1: responseData,
          };
        });
        if (responseData.ic_smpldrawnbylab) {
          getAssignmentMasterData(
            responseData.commodity.commodity_id,
            responseData.fk_lab_id,
            "parameter"
          );
        }

      }
    }
  } catch (error) { }
};

export const changeTestReportStatusChange = async (
  ic_id,
  navigate,
  status,
  remarkText = "",
  noRedirect = 0,
  getAllListingData,
  setIsPopupOpen,
  setIsOverlayLoader
) => {
  let ic_data = {
    status: status,
    tenant: GetTenantDetails(1),
  };
  if (status === "dtm-reject" || status === "tm-reject") {
    ic_data.ic_rejection_remark = remarkText;
  }
  let bodyToPass = {
    ic_id: ic_id,
    ic_data: ic_data,
  };
  setIsOverlayLoader(true);
  let res = await putDataFromApi(InternalCertificateUpdateApi, bodyToPass);
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
    if (!noRedirect) {
      setTimeout(() => {
        navigate("/testReport");
      }, 1000);
    } else {
      setIsPopupOpen(false);
      getAllListingData();
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
export const checkICULRNoAvailibility = async (
  value,
  setIsOverlayLoader,
  setIsValideValue
) => {
  const regex = /^[A-Z]{2}\d{4,5}\d{2}\d{9}$/;
  const trimmedValue = value.trim();
  if (!regex.test(trimmedValue)) {
    setIsValideValue(false);
    return;
  }
  let payload = {
    ic_ulrno: value,
  };
  setIsOverlayLoader(true);
  let res = await postDataFromApi(checkexistingulrnoApi, payload);
  if (res?.data?.status === 200) {
    setIsValideValue(true);
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
    setIsValideValue(false);
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
