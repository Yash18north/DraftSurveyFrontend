import { toast } from "react-toastify";
import {
  SFMCreateApi,
  SFMGetApi,
  SFMUnitUpdateApi,
  SFMUpdateApi,
  SFMbasisupdateApi,
  allotmentUpdateApi,
  formulaListapi,
  formulagetapi,
  getTpibasisvalueUpdateApi,
  testMemoGetParambasisstdApi,
  testMemoGetSamplesetsApi,
} from "../../../services/api";
import {
  getDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../services/commonServices";
import { encryptDataForURL } from "../../../utills/useCryptoUtils";

let testmemoId = 0;

export const handleSFMCreate = async (
  responseData,
  navigate,
  message,
  testMemoId,
  setSaveClicked
) => {
  let payload = {
    sfm_data: {
      fk_commodityid: responseData?.fk_commodity_id,
      fk_lab_id: responseData?.allotment_detail?.testmemo_detail?.fk_lab_id,
      sfm_status: "pending",
      fk_tmid: testMemoId,
      fk_allotment_id: responseData?.allotment_detail?.sa_id,
      tenant: GetTenantDetails(1),
    },
  };
  let res = await postDataFromApi(SFMCreateApi, payload);
  if (res?.data?.status === 200) {
    toast.success(message, {
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
      navigate("/verificationList");
    }, 1000);
  } else {
    setSaveClicked(false);
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
export const handleSFMCreateWithoutVerification = async (responseData) => {
  let payload = {
    sfm_data: {
      fk_commodityid: responseData?.fkey_commodity,
      fk_allotment_id: responseData?.sa_id,
      fk_lab_id:
        responseData?.test_memo_detail?.fk_lab_id || responseData?.fk_lab_id,
      sfm_status: "pending",
      fk_tmid: responseData?.fk_testmemo_id,
      tenant: GetTenantDetails(1),
    },
  };
  let res = await postDataFromApi(SFMCreateApi, payload);
};
export const getSFMDetails = async (
  id,
  setFormData,
  setTabOpen,
  setIstavSaveClicked,
  setTestMemoSetData,
  isView,
  formData
) => {
  try {
    const bodyToPass = {
      sfm_id: id,
    };
    let res = await postDataFromApi(SFMGetApi, bodyToPass);
    if (res?.data?.status === 200) {
      let responseData = res.data.data;
      responseData.commodityName = responseData?.commodity?.cmd_name;
      responseData.jrf_sub_commodity_name =
        responseData?.sub_commodity?.sub_commodity_name;
      responseData.sfm_msfm_no = responseData?.sfm_msfm_no
        ? responseData?.sfm_msfm_no
        : "-";
      if (responseData.sfm_status === "pending") {
        // responseData.sfm_dateanalysisstarted =
        //   responseData?.sample_verification?.sample_dateofverification;
        responseData.actual_sfm_dateanalysisstarted =
          responseData?.allotment_details?.[0]?.sa_actualdateofreporting;
        responseData.sfm_dateanalysisstarted =
          responseData?.allotment_details?.[0]?.sa_actualdateofreporting;
      }
      setFormData({
        0: responseData,
      });
      if (responseData.sfm_status != "pending" || isView) {
        setTabOpen(true);
        setIstavSaveClicked(true);
        getTestMemoSetDetails(
          setTestMemoSetData,
          responseData?.fk_tmid,
          setFormData,
          formData
        );
        testmemoId = responseData?.fk_tmid;
      }
    }
  } catch (error) { }
};

export const handleSingleDetailsCreateUpdate = async (
  tabIndex,
  paramIndex,
  name,
  parambasisData,
  getSFMParamBasis,
  paramBasisSetData,
  moduleType,
  isClick,
  setIsOverlayLoader,
  setFormData,
  formData
) => {
  try {
    let spcode = name.split("_");
    spcode = spcode.length === 2 ? spcode[1] : spcode.slice(1).join("_");
    if (
      !parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex] &&
      parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex] !== 0
    ) {
      if (isClick) {
        toast.error("Please add the value", {
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
      return;
    }
    if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1,formData[0]?.jrf_is_petro))) {
      const inputType =
        paramBasisSetData[paramIndex]?.param_detail?.param_sfm_input_type;
      let regex = "";
      let errMsg = "";
      if (inputType === "alphabet") {
        regex = /^[a-zA-Z\s]+$/;
        errMsg = "Please Enter Valid Alphabet Value";
      } else if (inputType === "numerical_special") {
        // regex = /^[<>+-]\d+(\.\d+)?$/;
        regex = /^[<>+\-]?\d+(\.\d+)?$/;
        errMsg = "Please Enter Valid Numerical with Special Characters Value";

      } else if (inputType === "numerical_alphabet") {
        // regex = /^\d+[a-zA-Z]$/;
        // regex = /^[1-4][a-d]$/;
        regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d ]+$/;
        errMsg = "Please Enter Valid Numerical with Alphabet Value";

      } else {
        regex = /^\d+(\.\d+)?$/;
        errMsg = "Please Enter Valid Numerical Value";

      }
      const value =
        parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex];
      if (!regex.test(value)) {
        toast.error("Please enter valid value", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return false;
      }
    }
    setIsOverlayLoader(true)
    let res;
    if (moduleType === "jobinstruction") {
      let payload = {
        ops_spbr_id:
          parambasisData[tabIndex]?.[
          "spbr_id_" + spcode + "_" + paramIndex + "_" + tabIndex
          ],
        ops_spid:
          parambasisData[tabIndex]?.["sp_id_" + paramIndex + "_" + tabIndex],
        tpi_parambasis_data: {
          ops_spbr_tmvalue:
            parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex],
          ops_spbr_lcvalue:
            parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex],
          tenant: GetTenantDetails(1),
        },
      };

      res = await putDataFromApi(getTpibasisvalueUpdateApi, payload);
    } else {
      let inputType = "";

      let payload = {
        sp_id: parambasisData[tabIndex]?.["sp_id_" + paramIndex + "_" + tabIndex],
        spbr_id:
          parambasisData[tabIndex]?.[
          "spbr_id_" + spcode + "_" + paramIndex + "_" + tabIndex
          ],
        smpl_parambasis_data: {
          spbr_tmvalue:
            parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex],
          spbr_lcvalue:
            parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex],
          tenant: GetTenantDetails(1),
        },
      };
      if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1,formData[0]?.jrf_is_petro))) {
        inputType =
          paramBasisSetData[paramIndex]?.param_detail?.param_sfm_input_type;
        let txt =
          parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex];
        let numb = parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex];
        if (['alphabet', 'numerical_special', 'numerical_alphabet'].includes(inputType)) {
          numb = txt.match(/[\d.]/g)?.join("") ?? "0";
          // numb = numb ? numb?.join("") : "";
          numb = numb ? numb : 0;
        }

        payload.smpl_parambasis_data = {
          spbr_tmvalue: numb,
          spbr_lcvalue: numb,
          spbr_sfm_input_type_value:
            parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex],
          input_type: inputType,
          tenant: GetTenantDetails(1),
        }
      }
      res = await putDataFromApi(SFMbasisupdateApi, payload);
    }
    if (res?.data?.status === 200) {
      getSFMParamBasis(1, formData);
      // setFormData((prevFormData) => {
      //   return {
      //     ...prevFormData,
      //     ['tab_' + tabIndex]: {
      //       noFilledCount: formData['tab_' + tabIndex]['noFilledCount'] - 1,
      //       filledCount: formData['tab_' + tabIndex]['noFilledCount'] + 1,
      //     }
      //   }
      // })
    } else {
      toast.error(res?.message, {
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
    setIsOverlayLoader(false)
  }
};

export const handleSingleDetailsSPUpdate = async (
  tabIndex,
  paramIndex,
  name,
  parambasisData,
  getSFMParamBasis,
  formData,
  value
) => {
  let payload = {
    sp_id: parambasisData[tabIndex]?.["sp_id_" + paramIndex + "_" + tabIndex],
    smpl_param_data: {
      sp_param_unit:
        // parambasisData[tabIndex]?.[name + "_" + paramIndex + "_" + tabIndex],
        value
    },
  };
  let res = await putDataFromApi(SFMUnitUpdateApi, payload);
  if (res?.data?.status === 200) {
    getSFMParamBasis(1, formData);
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

export const getTestMemoSetDetails = async (
  setTestMemoSetData,
  testMemoId,
  setFormData,
  formData
) => {
  try {
    const bodyToPass = {
      test_memo_id: testMemoId,
      module: "sfm",
    };

    let res = await postDataFromApi(testMemoGetSamplesetsApi, bodyToPass);
    if (res?.data?.status === 200) {
      let responseData = res.data.data;
      setTestMemoSetData(responseData);
      if (responseData.length > 0) {
        let smplValue = responseData[0]?.sample_ids?.[0]?.fk_smpl_detail_id;
        let samplGrp = "";
        if (res.data.data[0]?.groups == "Parameters") {
          samplGrp = "Parameters";
        } else {
          samplGrp = responseData[0]?.groups?.[0]?.group_id;
        }
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [1]: {
              ...prevFormData[1],
              ["smpl_detail_smpl_id_0"]: smplValue,
              ["group_id_0"]: samplGrp,
            },
          };
        });
        const updatedFormData = {}
        // updatedFormData[1]['smpl_detail_smpl_id_0']=smplValue
        // updatedFormData[1]['group_id_0']=samplGrp
        responseData.forEach((tab, tabIndex) => {
          const tabKey = `tab_${tabIndex}`;

          // Ensure the tabKey exists in updatedFormData
          if (!updatedFormData[tabKey]) {
            updatedFormData[tabKey] = {};
          }

          // Assign values properly
          updatedFormData[tabKey]['noFilledCount'] = tab.data_count.remaining_count;
          updatedFormData[tabKey]['filledCount'] = tab.data_count.filled_count;
        });
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            ...updatedFormData
          };
        });
      }

    } else {
      setTestMemoSetData([]);
    }
  } catch (error) {
  }
};
export const tempTestMemoId = (id) => { };
export const getTestMemoParamBasis = async (
  smpl_inwrd_detail_id,
  group_id,
  tabIndex,
  setParamBasisData,
  setParamBasisSetData,
  setBasisCodeData,
  formData,
  setUpdatedMasterOptions,
  setBasisCodeDataValue,
  setIsOverlayLoader,
  setIsParamChanged,
  isfromParamChanged
) => {
  try {
    if (GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) == "TPBPL") {
      group_id = "Parameters";
    }
    if (!smpl_inwrd_detail_id || !group_id) {
      return [];
    }
    const testmemoId = formData[0].fk_tmid;
    const bodyToPass = {
      smpl_inwrd_detail_id: smpl_inwrd_detail_id,
      tm_id: parseInt(testmemoId), // Harcoded Data by yash
    };
    localStorage.setItem("detailID", encryptDataForURL(smpl_inwrd_detail_id));
    if (group_id !== "Parameters") {
      bodyToPass.group_id = group_id;
    }
    setIsOverlayLoader(true)
    let res = await postDataFromApi(testMemoGetParambasisstdApi, bodyToPass);
    if (res?.data?.status === 200) {
      let responseData = res.data.data;
      responseData = responseData.sort(
        (a, b) => a.sp_param_sequence - b.sp_param_sequence
      );
      responseData = responseData.filter((singleData) => {
        if (!singleData?.param_detail?.param_sfm_input_type) {
          singleData.param_detail.param_sfm_input_type = "numerical"
        }
        return singleData
      })
      setParamBasisSetData(responseData);
      let testMemoData = {};
      let basisDetails = [];
      let basisDetailsValues = [];
      let updateMasterOptions = [];
      responseData.forEach((singleData, index) => {
        let unitspValue = singleData?.param_detail?.param_unit.split(",");
        unitspValue=unitspValue.map((singleunit)=>singleunit.replace(/\s+/g, " ").trim())
        testMemoData["sp_id_" + index + "_" + tabIndex] = singleData?.sp_id;
        testMemoData["param_name_" + index + "_" + tabIndex] =
          singleData?.param_detail?.param_name;
        testMemoData["param_unit_" + index + "_" + tabIndex] =
          (singleData?.sp_param_unit ? singleData?.sp_param_unit.split(",")?.[0] : unitspValue[0]).replace(/\s+/g, " ").trim();
        // console.log("param_unit_" + index + "_" + tabIndex,unitspValue,singleData?.sp_param_unit.split(",")?.[0])
        testMemoData["std_name_" + index + "_" + tabIndex] =
          singleData?.std_detail?.std_name;

        singleData?.basis_detail.map((code, codeIndex) => {
          let basisCode = code.spbr_basiscode;
          basisCode = basisCode.replace(" ", "_");
          basisCode = basisCode.toUpperCase();

          testMemoData[
            "spbr_id_" + basisCode.toLowerCase() + "_" + index + "_" + tabIndex
          ] = code.spbr_id;
          if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1,formData[0]?.jrf_is_petro))) {
            testMemoData[
              "value_" + basisCode.toLowerCase() + "_" + index + "_" + tabIndex
            ] = code.spbr_sfm_input_type_value || code.spbr_lcvalue || '';
          } else {
            testMemoData[
              "value_" + basisCode.toLowerCase() + "_" + index + "_" + tabIndex
            ] = code.spbr_lcvalue || '';
          }
          testMemoData[
            "value_" +
            basisCode.toLowerCase() +
            "_icon_" +
            index +
            "_" +
            tabIndex
          ] = code.spbr_lcvalue !== null;

          if (!basisDetails.includes(basisCode)) {
            basisDetails.push(basisCode);
            basisDetailsValues.push('value_' + basisCode.toLowerCase())
          }

        });
        responseData.forEach((singleData, index) => {
          basisDetails.map((singlebase) => {
            if (testMemoData["value_" + singlebase.toLowerCase() + "_" + index + "_" + tabIndex] === undefined) {
              testMemoData["value_" + singlebase.toLowerCase() + "_" + index + "_" + tabIndex] = "N/A";
            }
          })
        })

        // let unitoptions = [];
        // unitspValue.map((opt) => {
        //   unitoptions.push({
        //     name: opt,
        //     id: opt,
        //   });
        // });
        // const smlpUnits = {
        //   model: "param_unit_" + index + "_" + tabIndex,
        //   data: unitoptions,
        // };
        testMemoData["param_unit_options_" + index + "_" + tabIndex] = unitspValue
        // updateMasterOptions.push(smlpUnits);
        setParamBasisData((prevFormData) => {
          return {
            ...prevFormData,
            [tabIndex]: testMemoData,
          };
        });
      });
      // setUpdatedMasterOptions(updateMasterOptions);

      setBasisCodeData(basisDetails);
      setBasisCodeDataValue(basisDetailsValues);
    } else {
      return [];
    }
  } catch (error) { }
  finally {
    if (isfromParamChanged) {
      setIsParamChanged(false)
      setTimeout(() => {
        setIsParamChanged(true)
      }, 10)
    }

    setIsOverlayLoader(false)
  }
};

export const handleSFMVerificationMain = async (
  formData,
  navigate,
  setLoading,
  setIsOverlayLoader,
  sectionsField
) => {
  let payload;
  payload = {
    sfm_id: formData[0].sfm_id,
    sfm_data: {
      sfm_status: "completed",
      sfm_expecteddateanalysis: formData[0].sfm_expecteddateanalysis,
      sfm_dateanalysisstarted: formData[0].sfm_dateanalysisstarted,
      sfm_dateanalysiscompleted: formData[0].sfm_dateanalysiscompleted,
      sfm_remarks: formData[0].sfm_remarks,
      sfm_ambient_temp: formData[0].sfm_ambient_temp,
      sfm_borometricpressure: formData[0].sfm_borometricpressure,
      sfm_humidity: formData[0].sfm_humidity,
      tenant: GetTenantDetails(1),
    },
  };
  const notrequired = ['sfm_expecteddateanalysis', 'sfm_remarks', 'sfm_borometricpressure', 'sfm_humidity', 'tenant']
  for (let obj in payload.sfm_data) {
    if (
      (payload["sfm_data"][obj] === undefined ||
        !payload["sfm_data"][obj]) && !notrequired.includes(obj)
    ) {
      const fields = sectionsField.fields.filter((field, index) => {
        if (field.name === obj) {
          field.label = sectionsField.fields[index]
            ? sectionsField.fields[index].label
            : obj;
          return true;
        }
      });

      let errLabel = fields.length ? fields[0].errorlabel : obj;
      if (obj === "sfm_dateanalysiscompleted") {
        errLabel = "Expected Date of Completion"
      }
      toast.error(obj + "  required", {
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
      return;
      // }
    }
  }
  setIsOverlayLoader(true);
  let res = await putDataFromApi(SFMUpdateApi, payload);
  if (res.data && res.data.status === 200) {
    setLoading(false);
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
      navigate("/SFMList");
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

export const getallFormulaList = async (setAllformulaList) => {
  try {
    let res = await getDataFromApi(formulaListapi);
    if (res?.data?.status === 200) {
      setAllformulaList(res.data.data);
    }
  } catch (error) { }
};
export const getFormulaFieldData = async (f_id, setFormulafieldsData) => {
  try {
    let res = await postDataFromApi(formulagetapi, { f_id: f_id });
    if (res?.data?.status === 200) {
      setFormulafieldsData(res.data.data);
    }
  } catch (error) { }
};

export const handleAllotUpdate = async (formData) => {
  let payload;
  payload = {
    sa_id: formData[0].fk_allotment_id,
    sample_allotment: {
      status: "completed",
      tenant: GetTenantDetails(1),
    },
  };
  let res;
  res = await putDataFromApi(allotmentUpdateApi, payload);
};
