import { toast } from "react-toastify";
import {
  createOtherTpiApi,
  getTpiParamBasistApi,
  getTpiSetApi,
  TPISetCountApi,
  updateOtherTpiApi,
} from "../../../../services/api";
import {
  postDataFromApi,
  putDataFromApi,
} from "../../../../services/commonServices";
import { encryptDataForURL } from "../../../../utills/useCryptoUtils";

export const handleSFMCreateWithOperations = async (
  formData,
  OperationType,
  OperationTypeID,
  navigate,
  setIsOverlayLoader,
  setIsPopupOpen,
  TPIData
) => {
  // navigate(`/operation/vessel-ji-list/other-tpi/${encryptDataForURL(formData[0].ji_id)}/${encryptDataForURL('otherTPI')}/${encryptDataForURL(OperationTypeID)}?OperationType=${encryptDataForURL(OperationType)}&operationId=${encryptDataForURL(OperationTypeID)}`)
  // return
  let payload = {
    ji_id: formData[0].ji_id,
    jis_id: OperationTypeID,
    for_tpi: {
      jila_id: TPIData,
    }
  };
  setIsOverlayLoader(true)
  let res = await postDataFromApi(createOtherTpiApi, payload);
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
      setIsOverlayLoader(false)
      // navigate(
      //   `/operation/vessel-ji-list/other-tpi/${encryptDataForURL(
      //     formData[0].ji_id
      //   )}/${encryptDataForURL("otherTPI")}/${encryptDataForURL(
      //     OperationTypeID
      //   )}/${encryptDataForURL(
      //     res.data.data.tpi_id
      //   )}?OperationType=${encryptDataForURL(
      //     OperationType
      //   )}&operationId=${encryptDataForURL(OperationTypeID)}`
      // );
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
    setIsOverlayLoader(false)
  }
};
export const handleSFMUpdateWithOperations = async (
  TPIID,
  type,
  navigate,
  setIsOverlayLoader,
  setIsPopupOpen
) => {
  try {


    let status = "posted";
    if (type === "post") {
      status = "completed";
    }
    let payload = {
      tpi_id: TPIID,
      tpi_data: { status: status },
    };
    setIsOverlayLoader(true)
    let res = await putDataFromApi(updateOtherTpiApi, payload);
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
        navigate(`/operation/other-tpi`);
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
  }
  catch (error) {

  } finally {
    setIsOverlayLoader(false)
    setIsPopupOpen(false)
  }
};

export const getTPISetDetails = async (
  setTestMemoSetData,
  editModuleId,
  OperationTypeID,
  setFormData,
  TPIID
) => {
  try {
    const bodyToPass = {
      ji_id: editModuleId,
      jis_id: OperationTypeID,
      tpi_id: TPIID,
    };
    let res = await postDataFromApi(getTpiSetApi, bodyToPass);
    if (res?.data?.status === 200) {
      let responseData = res.data.data;
      setTestMemoSetData(responseData);
      if (responseData.length > 0) {
        let smplValue = responseData[0]?.sample_ids?.[0]?.fk_sample_mark_id;
        let samplGrp = "";
        if (res.data.data[0]?.groups == "Parameters") {
          samplGrp = "Parameters";
        } else {
          samplGrp = responseData[0]?.groups?.[0]?.group_id;
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
  } catch (error) { }
};

export const getTPIParamBasis = async (
  smpl_inwrd_detail_id,
  group_id,
  tabIndex,
  setParamBasisData,
  setParamBasisSetData,
  setBasisCodeData,
  EditRecordId,
  OperationTypeID,
  setBasisCodeDataValue,
  ops_set_id,
  setIsParamChanged,
  isfromParamChanged

) => {
  try {
    // if (!smpl_inwrd_detail_id || !group_id) {
    //   return [];
    // }
    const bodyToPass = {
      ji_id: EditRecordId,
      jis_id: OperationTypeID,
      sample_mark_id: smpl_inwrd_detail_id,
      ops_set_id: ops_set_id,
    };
    if (group_id !== "Parameters") {
      bodyToPass.group_id = group_id;
    }
    localStorage.setItem("detailID", encryptDataForURL(smpl_inwrd_detail_id));
    if (group_id !== "Parameters") {
      bodyToPass.group_id = group_id;
    }
    let res = await postDataFromApi(getTpiParamBasistApi, bodyToPass);
    if (res?.data?.status === 200) {

      const responseData = res.data.data;
      setParamBasisSetData(responseData);
      let testMemoData = {};
      const basisDetails = [];
      let basisDetailsValues = [];
      responseData.forEach((singleData, index) => {
        // const unitspValue = singleData?.param_detail?.param_unit.split(",");
        const unitspValue = singleData?.ops_sp_param_unit.split(",")
        testMemoData["sp_id_" + index + "_" + tabIndex] = singleData?.ops_sp_id;
        testMemoData["param_name_" + index + "_" + tabIndex] =
          singleData?.param_detail?.param_name;
        testMemoData["param_unit_" + index + "_" + tabIndex] =
          singleData?.ops_sp_param_unit;
        testMemoData["std_name_" + index + "_" + tabIndex] =
          singleData?.std_detail?.std_name;
        testMemoData["param_unit_" + index + "_" + tabIndex] =
          singleData?.ops_sp_param_unit ? singleData?.ops_sp_param_unit.split(",")?.[0] : unitspValue[0];

        // testMemoData["value_adb_" + index + "_" + tabIndex] = "N/A";
        // testMemoData["value_arb_" + index + "_" + tabIndex] = "N/A";
        // testMemoData["value_daf_" + index + "_" + tabIndex] = "N/A";
        // testMemoData["value_db_" + index + "_" + tabIndex] = "N/A";
        // testMemoData["value_oxidising_" + index + "_" + tabIndex] = "N/A";
        // testMemoData["value_reducing_" + index + "_" + tabIndex] = "N/A";
        // testMemoData["value_equilibrated_" + index + "_" + tabIndex] = "N/A";
        // testMemoData["value_sample_basis_" + index + "_" + tabIndex] = "N/A";
        // testMemoData["value_na_" + index + "_" + tabIndex] = "N/A";
        singleData?.basis_detail.map((code, codeIndex) => {
          let basisCode = code.ops_spbr_basiscode;
          basisCode = basisCode.replace(" ", "_");
          testMemoData[
            "spbr_id_" + basisCode.toLowerCase() + "_" + index + "_" + tabIndex
          ] = code.ops_spbr_id;
          testMemoData[
            "value_" + basisCode.toLowerCase() + "_" + index + "_" + tabIndex
          ] = code.ops_spbr_lcvalue;
          testMemoData[
            "value_" +
            basisCode.toLowerCase() +
            "_icon_" +
            index +
            "_" +
            tabIndex
          ] = code.ops_spbr_lcvalue !== null;

          if (!basisDetails.includes(basisCode)) {
            basisDetails.push(basisCode);
            basisDetailsValues.push('value_' + basisCode.toLowerCase())
          }
        });
        testMemoData["param_unit_options_" + index + "_" + tabIndex] = unitspValue
        responseData.forEach((singleData, index) => {
          basisDetails.map((singlebase) => {
            if (testMemoData["value_" + singlebase.toLowerCase() + "_" + index + "_" + tabIndex] === undefined) {
              testMemoData["value_" + singlebase.toLowerCase() + "_" + index + "_" + tabIndex] = "N/A";
            }
          })
        })
      });
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
  } catch (error) { }
  finally {
    if (isfromParamChanged) {
      setIsParamChanged(false)
      setTimeout(() => {
        setIsParamChanged(true)
      }, 10)
    }
  }
};

export const getSampleStatusCountsForTPI = async (
  ji_id,
  jis_id,
  ops_set_id,
  setFormData,
  tabIndex
) => {
  if (jis_id && ops_set_id) {
    try {
      const bodyToPass = {
        ji_id: ji_id,
        jis_id: jis_id,
        ops_set_id: ops_set_id,
      };
      let res = await postDataFromApi(TPISetCountApi, bodyToPass);
      if (res?.data?.status === 200) {
        const responseData = res.data.data;
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            ["tab_" + tabIndex]: {
              ...prevFormData[tabIndex],
              "filledCount": responseData.filled_count,
              "noFilledCount": responseData.remaining_count,
            },
          };
        });
      } else {
        return [];
      }
    } catch (error) { }
  }
};
