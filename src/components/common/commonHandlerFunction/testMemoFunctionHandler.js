import { toast } from "react-toastify";
import {
  sampleInwardUpdate,
  scopenonscopecountApi,
  SFMRejectFlowApi,
  testMemoCreateasyncApi,
  testMemoDeleteApi,
  testMemoGetApi,
  testMemoGetParambasisstdApi,
  testMemoGetSamplesetsApi,
  testMemoUpdateApi,
  testReportGetApi,
} from "../../../services/api";
import {
  deleteDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../services/commonServices";
import { encryptDataForURL } from "../../../utills/useCryptoUtils";
import { handleSFMCreateWithoutVerification } from "./sfmHandlerFunctions";

let testmemoId = 0;

export const getTestMemoDetails = async (
  id,
  setTabOpen,
  setFormData,
  setTestMemoSetData,
  isPreview,
  setIsOverlayLoader
) => {
  if (setIsOverlayLoader) {
    setIsOverlayLoader(true);
  }
  try {
    const bodyToPass = {
      test_memo_id: id,
    };
    let res = await postDataFromApi(testMemoGetApi, bodyToPass);
    if (res?.data?.status === 200) {
      let responseData = res.data.data;
      if (!isPreview) {
        setTabOpen(true);
        setFormData({
          0: responseData?.jrf_detail,
        });
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              jrf_commodity: responseData?.commodity?.cmd_name,
              jrf_sub_commodity_name:
                responseData?.sub_commodity?.sub_commodity_name,
              fkey_commodity: responseData?.commodity?.cmd_id,
              tm_number: responseData.tm_number,
              tm_msfm_no: responseData.testmemo_msfm_number,
              tm_remarks: responseData.tm_remarks,
              tm_datestartinganalysis: responseData.tm_datestartinganalysis,
              tm_datecompletion: responseData.tm_datecompletion,
              sampleInwardIdMain: responseData.fk_inward_id,
              sa_allotment_no: responseData.tm_number,
              status: responseData.status,
              tm_smpl_inward_number:
                responseData.inward_detail.smpl_inward_number,
              sample_condition:
                responseData.jrf_detail.jrf_sample_condition.join(","),
              technical_manager: responseData.technical_manager,
              tm_created_by: responseData.tm_created_by,
              smpl_dos: responseData?.inward_detail?.smpl_dos,
              sa_actualdateofreporting: responseData?.inward_detail?.smpl_dos,
              sa_inward_no: responseData?.inward_detail?.smpl_inward_number,
              jrf_is_petro: responseData?.jrf_detail?.jrf_is_petro,
            },
          };
        });
      }
      getTestMemoSetDetails(
        setTestMemoSetData,
        id,
        setFormData,
        setIsOverlayLoader
      );
      testmemoId = id;
    }
  } catch (error) {
  } finally {
    if (setIsOverlayLoader) {
      setIsOverlayLoader(false);
    }
  }
};

export const getTestMemoSetDetails = async (
  setTestMemoSetData,
  testMemoId,
  setFormData,
  setIsOverlayLoader
) => {
  if (setIsOverlayLoader) {
    setIsOverlayLoader(true);
  }
  try {
    const bodyToPass = {
      test_memo_id: testMemoId,
      module: "tm",
    };
    let res = await postDataFromApi(testMemoGetSamplesetsApi, bodyToPass);
    if (res?.data?.status === 200) {
      setTestMemoSetData(res.data.data);
      if (res.data.data.length > 0) {
        let smplValue = res.data.data[0]?.sample_ids?.[0]?.smpl_inwrd_detail_id;
        localStorage.setItem("smplValue", encryptDataForURL(smplValue));
        let samplGrp = "";
        if (res.data.data[0]?.groups == "Parameters") {
          samplGrp = "Parameters";
        } else {
          samplGrp = res.data.data[0]?.groups?.[0]?.group_id;
        }

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            1: {
              ...prevFormData[1],
              "smpl_detail_smpl_id_0": smplValue,
              "group_id_0": samplGrp,
            },
          };
        });
      }
    } else {
      setTestMemoSetData([]);
    }
  } catch (error) {
  } finally {
    if (setIsOverlayLoader) {
      setIsOverlayLoader(false);
    }
  }
};

export const getTestMemoParamBasis = async (
  smpl_inwrd_detail_id,
  group_id,
  tabIndex,
  setParamBasisData,
  setParamBasissetData,
  setBasisCodeData,
  setIsOverlayLoader,
  setBasisCodeDataValue,
  setIsParamChanged,
  formData
) => {
  if (setIsOverlayLoader) {
    setIsOverlayLoader(true);
  }
  try {
    if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL") {
      group_id = "Parameters";
    }
    if (!smpl_inwrd_detail_id || !group_id) {
      return [];
    }

    let bodyToPass = {
      smpl_inwrd_detail_id: smpl_inwrd_detail_id,
      tm_id: testmemoId, // TestMemo value done by yash temporarily
    };
    if (group_id !== "Parameters") {
      bodyToPass.group_id = group_id;
    }
    let res = await postDataFromApi(testMemoGetParambasisstdApi, bodyToPass);
    if (res?.data?.status === 200) {
      let responseData = res.data.data;
      responseData = responseData.sort(
        (a, b) => a.sp_param_sequence - b.sp_param_sequence
      );
      setParamBasissetData(responseData);
      let testMemoData = {};
      let basisDetails = [];
      let basisDetailsValues = [];
      responseData.forEach((singleData, index) => {
        testMemoData["param_name_" + index + "_" + tabIndex] =
          singleData?.param_detail?.param_name;
        testMemoData["param_unit_" + index + "_" + tabIndex] =
          singleData?.sp_param_unit;
        testMemoData["non_scope_" + index + "_" + tabIndex] = singleData
          ?.basis_detail[0]?.spbr_outofscope
          ? "Yes"
          : "No";
        testMemoData["std_name_" + index + "_" + tabIndex] =
          singleData?.std_detail?.std_name;
        singleData?.basis_detail.map((code) => {
          let basisCode = code.spbr_basiscode;
          basisCode = basisCode.replace(" ", "_");
          if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1, formData[0]?.jrf_is_petro))) {
            testMemoData[
              "value_" + basisCode.toLowerCase() + "_" + index + "_" + tabIndex
            ] = code.spbr_sfm_input_type_value
                ? code.spbr_sfm_input_type_value
                : code.spbr_lcvalue || "N/A";
          } else {
            testMemoData[
              "value_" + basisCode.toLowerCase() + "_" + index + "_" + tabIndex
            ] = code.spbr_lcvalue ? code.spbr_lcvalue : "N/A";
          }

          if (!basisDetails.includes(basisCode)) {
            basisDetails.push(basisCode);
            basisDetailsValues.push('value_' + basisCode.toLowerCase())
          }
        });
      });
      responseData.forEach((singleData, index) => {
        basisDetails.map((singlebase) => {
          if (testMemoData["value_" + singlebase.toLowerCase() + "_" + index + "_" + tabIndex] === undefined) {
            testMemoData["value_" + singlebase.toLowerCase() + "_" + index + "_" + tabIndex] = "--";
          }
        })
      })
      setParamBasisData((prevFormData) => {
        return {
          ...prevFormData,
          [tabIndex]: testMemoData,
        };
      });
      setBasisCodeData(basisDetails);
      setBasisCodeDataValue(basisDetailsValues);
    } else {
      return [];
    }
  } catch (error) {
  } finally {
    setIsParamChanged(false)
    setTimeout(() => {
      setIsParamChanged(true)
    }, 10)
    setIsOverlayLoader(false)
    if (setIsOverlayLoader) {
      setIsOverlayLoader(false);
    }
  }
};

export const cretateTestMemoDetails = async (
  sample_inward_id,
  action,
  navigate,
  setIsOverlayLoader
) => {
  try {
    let bodyToPass = {
      sample_inward_id: sample_inward_id,
    };
    setIsOverlayLoader(true);
    let res = await postDataFromApi(testMemoCreateasyncApi, bodyToPass);
    if (res?.data?.status === 200) {
      const payload = {
        smpl_inwrd_id: sample_inward_id,
        sample_inward: {
          smpl_status: "tm-created",
          tenant: GetTenantDetails(1),
        },
      };
      let response = await putDataFromApi(sampleInwardUpdate, payload);
      if (res?.data?.status === 200) {
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
        setTimeout(() => {
          navigate(
            action?.redirectUrl +
            "?status=" +
            encryptDataForURL(action?.status) +
            "&testMemoId=" +
            encryptDataForURL(res?.data.data?.test_memo_id) +
            "&sampleInwardId" +
            encryptDataForURL(sample_inward_id)
          );
        }, 500);
      } else {
        setIsOverlayLoader(false);
        toast.error(response.message, {
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
    } else {
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
  } catch (error) {
  } finally {
    setIsOverlayLoader(false);
  }
};
export const handleTestMemoStatusChange = async (
  test_memo_id,
  navigate,
  status,
  formData,
  setIsOverlayLoader
) => {
  try {
    const payload = {
      smpl_inwrd_id: formData[0]?.sampleInwardIdMain,
      sample_inward: {
        smpl_status: "sent to lab",
        tenant: GetTenantDetails(1),
      },
    };
    setIsOverlayLoader(true);
    let response = await putDataFromApi(sampleInwardUpdate, payload);
    if (response?.data?.status === 200) {
      changeTestMEmoStatuChange(
        test_memo_id,
        navigate,
        status,
        "",
        setIsOverlayLoader
      );
    } else {
      setIsOverlayLoader(false);
      toast.error(response.message, {
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
  } catch (error) { }
};

export const changeTestMEmoStatuChange = async (
  test_memo_id,
  navigate,
  status,
  remarkText = "",
  setIsOverlayLoader,
  isSFMReject,
  user,
  isMultiRole,
  formData
) => {
  let test_memo_data = {
    status: status,
    is_multi_role: isMultiRole
  };
  if (status === "rejected") {
    if (isSFMReject) {
      test_memo_data.isSFMReject = true;
      test_memo_data.sfm_remarks = remarkText;
    } else {
      test_memo_data.tm_remarks = remarkText;
      test_memo_data.rejected_file = formData[0]?.['reject_img_file'];
    }
  }
  test_memo_data.tenant = GetTenantDetails(1);
  if (
    status === "posted" &&
    !user?.logged_in_user_info?.lab_or_branch?.lab_is_compliant &&
    user?.logged_in_user_info?.lab_or_branch?.lab_is_skip_process
  ) {
    test_memo_data.status = "inprogress";
  }
  let bodyToPass = {
    test_memo_id: test_memo_id,
    test_memo_data: test_memo_data,
  };
  setIsOverlayLoader(true);

  let res;
  if (isSFMReject) {
    res = await postDataFromApi(SFMRejectFlowApi, bodyToPass);
  } else {
    res = await putDataFromApi(testMemoUpdateApi, bodyToPass);
  }
  if (res?.data?.status === 200) {
    if (
      status === "posted" &&
      !user?.logged_in_user_info?.lab_or_branch?.lab_is_compliant &&
      user?.logged_in_user_info?.lab_or_branch?.lab_is_skip_process
    ) {
      let forSFMData = res.data.data;
      forSFMData.fkey_commodity = forSFMData?.commodity?.cmd_id;
      forSFMData.fk_testmemo_id = forSFMData?.tm_id;
      forSFMData.fk_allotment_id = "";
      await handleSFMCreateWithoutVerification(forSFMData);
    }
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
      navigate("/testmemoList");
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

export const getTestMemoDetailsWithCertificate = async (
  id,
  setTabOpen,
  setFormData,
  setTestMemoSetData,
  setTestReportData,
  getAssignmentMasterData,
  setIsValideValue,
  user,
  setCustomOptions,
  setIstestMethods
) => {
  try {
    const bodyToPass = {
      test_memo_id: id,
    };
    let res = await postDataFromApi(testReportGetApi, bodyToPass);
    if (res?.data?.status === 200) {
      let responseData = res.data.data;
      setTestReportData(responseData);
      const jrfDetails = responseData?.jrf;
      const sample_inward_detail = responseData?.sample_inward_detail[0];
      const sfmDetails = responseData?.sfm[responseData?.sfm.length - 1];
      let testmethods = responseData.test_methods;
      let samplingMethods = [...new Set(testmethods)];
      samplingMethods = samplingMethods.join(",");
      let testmethodsData = []
      responseData.test_methods.map((singleData) => {
        testmethodsData.push({
          id: singleData,
          name: singleData,
          value: singleData,
          label: singleData
        })
      })
      setCustomOptions((prevCustomdata) => {
        return {
          ...prevCustomdata,
          'ic_samplingmethods': testmethodsData
        }
      });
      let ic_test_report_no = "";

      if (
        responseData?.sample_code_from_to &&
        responseData?.sample_code_from_to.length > 0
      ) {
        ic_test_report_no = responseData.sample_code_from_to[0];

        if (responseData.sample_code_from_to.length > 1) {
          const lastValue = responseData.sample_code_from_to.at(-1);
          const lastFiveDigits = lastValue.slice(-5); // Extract last 5 digits
          ic_test_report_no += `-${lastFiveDigits}`;
        }
      }
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            // ic_ulrno: "To be generated",
            ic_customeraddress: jrfDetails.jrf_is_external
              ? jrfDetails.jrf_ext_address
              : (jrfDetails?.jrf_cmp_address || jrfDetails?.branch_detail?.branch_address),
            // ic_customeraddress: jrfDetails.jrf_is_external ? jrfDetails.jrf_ext_address : jrfDetails?.jrf_company_detail?.cmp_address,
            ic_customername: jrfDetails?.jrf_is_external
              ? jrfDetails?.jrf_ext_orgnizationname
              : jrfDetails?.jrf_company_detail?.cmp_name,
            // ic_descofsmpl: jrfDetails?.jrf_commodity_detail?.cmd_name,
            ic_descofsmpl: jrfDetails?.jrf_sub_commodity_detail?.sub_cmd_name,
            cmd_id: jrfDetails?.jrf_commodity_detail?.cmd_id,
            lab_id: jrfDetails?.lab_detail?.lab_id,
            ic_refenence: jrfDetails?.jrf_referenceno,
            ic_noofsmpls: responseData?.sample_count,
            ic_humidity: sfmDetails?.sfm_humidity
              ? sfmDetails?.sfm_humidity
              : "",
            ic_ambienttemp: sfmDetails?.sfm_ambient_temp
              ? sfmDetails?.sfm_ambient_temp
              : "",
            ic_dateofanalysis: sfmDetails?.sfm_dateanalysisstarted
              ? sfmDetails?.sfm_dateanalysisstarted
              : "",
            ic_dateofanalysis_completed: sfmDetails?.sfm_dateanalysiscompleted
              ? sfmDetails?.sfm_dateanalysiscompleted
              : "",
            ic_mark_from: responseData?.mark_from_to[0],
            ic_mark_to:
              responseData?.mark_from_to.length > 1 ? responseData?.mark_from_to?.[
                responseData?.mark_from_to.length - 1
              ] : '',
            ic_seal_from: responseData?.seal_from_to?.[0],
            ic_seal_to:
              responseData?.seal_from_to.length > 1 ? responseData?.seal_from_to?.[
                responseData?.seal_from_to.length - 1
              ] : '',
            ic_borometric_pressure:
              sfmDetails?.sfm_borometricpressure &&
                !["C", "L"].includes(jrfDetails?.jrf_company_detail?.cmp_code)
                ? sfmDetails?.sfm_borometricpressure
                : "",
            ic_discipline:
              sfmDetails?.commodity?.cmd_group?.cmd_discpln_name,
            ic_group: sfmDetails?.commodity?.cmd_group?.cmd_group_name,
            ic_samplingmethods: testmethodsData.length > 0 ? "" : '-',
            ic_samplingmethods_exists: testmethodsData.length > 0 ? "" : '-',
            company_code: jrfDetails?.jrf_company_detail?.cmp_code,
            ic_dateanalysiscompleted: sfmDetails?.sfm_dateanalysiscompleted
              ? sfmDetails?.sfm_dateanalysiscompleted
              : "",
            ic_dateofrecsmpl: sample_inward_detail?.smpl_detail_dos
              ? sample_inward_detail?.smpl_detail_dos
              : "",
            ic_dateofrecsmpl_exists: sample_inward_detail?.smpl_detail_dos
              ? sample_inward_detail?.smpl_detail_dos
              : "",
            ic_smpldrawnbylab: "Sample Drawn By Laboratory",
            ic_is_account_of: "No",
            ic_test_performed_at: (GetTenantDetails(1, 1, jrfDetails?.jrf_is_petro) === "TPBPL" &&
              jrfDetails?.jrf_company_detail?.cmp_name + ",\n" || "") +
              jrfDetails?.lab_detail?.lab_address + ('-' + jrfDetails?.lab_detail?.lab_post_code),
            ic_test_report_no: ic_test_report_no,
            sample_inward_detail: responseData?.sample_inward_detail,
            jrf_is_petro: jrfDetails?.jrf_is_petro,
            ic_is_2sign_format: jrfDetails?.lab_detail?.lab_is_2sign_format || false,
            ic_lab_address: jrfDetails?.lab_detail?.lab_address,
          },
        };
      });

      if (testmethodsData.length > 0) {
        setIstestMethods(true)
      }
      else {
        setIstestMethods(false)
      }
      getAssignmentMasterData(
        jrfDetails?.jrf_commodity_detail.cmd_id,
        jrfDetails?.lab_detail?.lab_id,
        "parameter"
      );
      getScopenonscopeCount(id, setFormData, setIsValideValue, user);

    }
  } catch (error) { }
};

export const handleTestMemoDelete = async (test_memo_id, navigate) => {
  let deleteBody = {
    test_memo_id: test_memo_id,
  };
  let res = await deleteDataFromApi(testMemoDeleteApi, deleteBody);

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
      navigate("/testmemoList");
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
};

export const getScopenonscopeCount = async (
  test_memo_id,
  setFormData,
  setIsValideValue,
  user
) => {
  if (!user?.logged_in_user_info?.lab_or_branch?.lab_is_compliant) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        0: {
          ...prevFormData[0],
          nonScopeData: true,
        },
      };
    });
    setIsValideValue(true);
    return;
  }
  let deleteBody = {
    test_memo_id: test_memo_id,
  };
  let res = await postDataFromApi(scopenonscopecountApi, deleteBody);

  if (res?.data?.status === 200) {
    if (res.data.data.scope_count === 0) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            nonScopeData: true,
          },
        };
      });
      setIsValideValue(true);
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
};
