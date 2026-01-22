import React, { useEffect, useState } from "react";
import RenderFields from "./RenderFields";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import {
  labGroupsStdBasisApi,
  labOPEGroupsStdBasisApi,
  labOPEparambasisApi,
  labparambasisApi,
  sampleInwardDetailsGetAPI,
  reportConfigGetApi,
  certConfigGetApi,
  certConfigUpdateApi
} from "../../services/api";
import {
  getDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../services/commonServices";
import PropTypes from "prop-types";
import DeleteConfirmation from "./DeleteConfirmation";
import {
  createQualityAnalysisHandler,
  getGroupParameterDataOperation,
  getJIsowandactivityData,
  // getJIsowandactivityDataForVessel,
  getLabPramDetails,
} from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import {
  createTMLAnalysisDetails,
  getAllSampleAssignmentist,
  getAssignemtnLabDropdownData,
} from "./commonHandlerFunction/operations/TMLOperations";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getChangeOnShipsValue, getLMSOperationActivity, getVesselOperation } from "../../services/commonFunction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  decryptDataForURL,
  encryptDataForURL,
} from "../../utills/useCryptoUtils";
import {
  getJIsowandactivityApi,
  getReportConfigApi,
  getCommercialCertificateListApi,
  documentUpdate,
  documentShareCreate,
  documentListApi,
  documentDeleteApi,
  folderCreateApi,
  ccUpdateApi,
  dsSurveyPdfApi,
  ccCertPdfApi,
  mergeFilesApi,
  masterUploadApi,
  setwiseDataGetApi,
  certConfigCreateApi,
  reportConfigUpdateApi,
  reportConfigCreateApi,
  reportHeaderFooterCreateApi,
} from "../../services/api";

const RenderAssignmentTableSection = ({
  section,
  sectionIndex,
  formData,
  // handleFieldChange,
  // addRow,
  // deleteRow,
  // deleteColumn,
  formErrors,
  setFormData,
  popupMessages,
  pageType,
  action,
  masterOptions,
  saveClicked,
  moduleType,
  setTableData,
  getAssignmentMasterData,
  setSaveClicked,
  tableData,
  getSampleIdsMasterData,
  setIsDisplayNewAddOption,
  isDisplayNewAddOption,
  setIsOverlayLoader,
  isOverlayLoader,
  useForComponent,
  OperationType,
  OperationTypeID,
  TMLID,
  editReordType,
  setJRFTPIFormData,
  JRFTPIFormData,
  operationStepNo,
  configCertStatus,
  configCertStatusRPCID,
  opsCertiView
}) => {
  useForComponent = section.vesselGroupParameter ? "" : useForComponent;
  OperationType = section.vesselGroupParameter ? "" : OperationType;
  const session = useSelector((state) => state.session);
  let navigate = useNavigate();

  let EditAction = [
    {
      icon: "bi bi-floppy2",
      text: "Save",
    },
    {
      icon: "bi bi-x-circle-fill",
      text: "Cancel",
    },
  ];
  let MainAction = [
    {
      icon: "bi bi-pen",
      text: "Edit",
    },
    {
      icon: "bi bi-trash",
      text: "Delete",
    },
  ];
  if (pageType == "assignment" || moduleType !== "GroupAssignment") {
    MainAction.splice(0, 1);
  }
  if (moduleType === "sampleverification") {
    MainAction.splice(1, 1);
  }
  const initialCustomData = {
    [sectionIndex]: {
      smpl_set_basisjson: [],
      smpl_set_smpljson: [],
      is_group_param: GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) == "TPBPL" ? "Parameter" : "Group",
      is_group_param_name:
        GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) == "TPBPL" ? "Parameter" : "Group",
      smpl_set_paramjson: "",
      smpl_set_testmethodjson: "",
      smpl_set_unit: "",
      // is_set_for_JRF: "Yes"
    },
  };
  const [sampleDataTable, setSampleDataTable] = useState([]);
  const [updatedMasterOptions, setUpdatedMasterOptions] = useState([]);
  const [customFormData, setCustomFormData] = useState(initialCustomData);
  const [parameterDataTable, setParameterDataTable] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [popupIndex, setPopupIndex] = useState(-1);
  // const [editableIndex, setEditableIndex] = useState("");
  const [simpleInwardId, setSimpleInwardId] = useState("");
  const [groupParameteres, setGroupParameters] = useState([]);
  const [isGroupChanged, setIsGroupChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [finalParamDataSort, setFinalParamDataSort] = useState([]);
  const [operationAssignmentData, setOperationAssignmentData] = useState([]);
  const [extraFormData, setExtraFormData] = useState("");
  const [optionLoaded, setOptionLoaded] = useState(false);
  const [labDropDownOptions, setDropDownOptionLoaded] = useState([]);

  const [sampleOptions, setSampleOptions] = useState([]);
  const [isCalled, setIsCalled] = useState(true);
  const [sampleAllOptions, setSampleAllOptions] = useState([]);
  const [setwiseParam, setSetwiseParam] = useState([]);
  let { EditRecordId, TMLType, operationName, EditSubRecordId } = useParams();

  [EditRecordId, TMLType, operationName, EditSubRecordId] = [
    EditRecordId,
    TMLType,
    operationName,
    EditSubRecordId,
  ].map((item) => (item ? decryptDataForURL(item) : ""));

  useEffect(() => {
    setTimeout(() => {
      setSimpleInwardId(formData[1]?.sampleInwardIdMain);
      if (formData[1]?.sampleInwardIdMain) {
        getInwardTabledata(formData[1]?.sampleInwardIdMain);
      }
    }, 1000);
  }, [formData[1]?.sampleInwardIdMain]);
  useEffect(() => {
    if (moduleType == "jobinstruction") {
      if (!isSubmit) {
        if (!useForComponent) {
          if (section.vesselGroupParameter) {
            getLabPramDetails(
              formData[0]?.ji_id,
              "quality_analysis",
              formData,
              setParameterDataTable,
              setUpdatedMasterOptions,
              updatedMasterOptions,
              OperationTypeID,
              setExtraFormData,
              extraFieldChange
            );
          } else {
            getJIsowandactivityData(
              formData[0]?.ji_id,
              setTableData,
              "quality_analysis",
              formData,
              setFormData,
              section,
              setFinalParamDataSort,
              setSampleDataTable,
              null,
              null,
              null,
              setUpdatedMasterOptions,
              updatedMasterOptions
            );
          }
        } else {
          getAllSampleAssignmentist(
            formData[0]?.ji_id,
            OperationTypeID,
            setTableData,
            JRFTPIFormData,
            setJRFTPIFormData,
            section,
            setFinalParamDataSort,
            setSampleDataTable,
            setSelectedOptions,
            null,
            null,
            useForComponent
          );
          if (operationStepNo != 3) {
            getJIsowandactivityData(
              formData[0]?.ji_id,
              setTableData,
              "quality_analysis",
              formData,
              setFormData,
              section,
              setFinalParamDataSort,
              setSampleDataTable,
              1,
              setOperationAssignmentData
            );
          }
        }
      }
    }
  }, [formData[0]?.ji_id, isSubmit]);
  useEffect(() => {
    if (moduleType == "jobinstruction") {
      if (!useForComponent) {
        if (tableData.length > 0) {
          setIsDisplayNewAddOption(false);
        } else {
          setIsDisplayNewAddOption(true);
        }
      }
    }
  }, [tableData]);
  useEffect(() => {
    if (operationStepNo == 3 && extraFormData[1]?.smpl_filter_lab) {
      getAssignemtnLabDropdownData(
        formData,
        OperationTypeID,
        null,
        null,
        1,
        extraFormData[1]?.smpl_filter_lab,
        setOperationAssignmentData
      );
    } else if (operationStepNo == 5 && extraFormData[1]?.smpl_filter_lab) {
      getAllSampleAssignmentist(
        formData[0]?.ji_id,
        OperationTypeID,
        setTableData,
        JRFTPIFormData,
        setJRFTPIFormData,
        section,
        setFinalParamDataSort,
        setSampleDataTable,
        setSelectedOptions,
        null,
        null,
        useForComponent,
        setIsOverlayLoader,
        1,
        extraFormData[1]?.smpl_filter_lab,
        setIsDisplayNewAddOption
      );
    }
    setFormData((prevData) => {
      return {
        ...prevData,
        1: {
          ...prevData[1],
          "smpl_filter_lab": extraFormData[1]?.smpl_filter_lab,
        },
      };
    });
  }, [extraFormData[1]?.smpl_filter_lab]);
  useEffect(() => {
    if (operationStepNo == 3 && extraFormData[1]?.smpl_filter_lot_composite) {
      getSampleIdsMasterData(
        formData[0]?.ji_id,
        OperationTypeID,
        extraFormData[1]?.smpl_filter_lot_composite
      );
    }
  }, [extraFormData[1]?.smpl_filter_lot_composite]);
  useEffect(() => {
    if ((operationStepNo == 3 || operationStepNo == 5) && formData[1].ji_id) {
      setTimeout(() => {
        getAssignemtnLabDropdownData(
          formData,
          OperationTypeID,
          setExtraFormData,
          setDropDownOptionLoaded,
          "",
          "",
          null,
          operationStepNo == 3 ? "" : 1
        );
      }, 100);
    }
  }, [formData[1]?.ji_id]);
  useEffect(() => {
    if (
      formData[0]?.fk_jiid &&
      formData[0]?.fk_jisid &&
      formData[0].jrf_is_ops &&
      formData[0]?.sample_detail_data
    ) {
      getAllSampleAssignmentist(
        formData[0]?.fk_jiid,
        formData[0]?.fk_jisid,
        setTableData,
        formData,
        setFormData,
        section,
        setFinalParamDataSort,
        setSampleDataTable,
        setSelectedOptions,
        1,
        setOperationAssignmentData,
        "LMSAssignment",
        setIsOverlayLoader
      );
    }
  }, [
    formData[0]?.fk_jiid,
    formData[0]?.fk_jisid,
    formData[0]?.sample_detail_data,
  ]);

  useEffect(() => {
    setUpdatedMasterOptions(masterOptions);
    setOptionLoaded(true);
  }, [masterOptions]);
  useEffect(() => {
    const getOnloadFunction = async () => {
      if (customFormData[sectionIndex].is_group_param) {
        let newinitialCustomData = initialCustomData;
        newinitialCustomData[sectionIndex].is_group_param =
          customFormData[sectionIndex].is_group_param;
        newinitialCustomData[sectionIndex].smpl_set_smpljson_name =
          customFormData[sectionIndex].smpl_set_smpljson_name;
        newinitialCustomData[sectionIndex].smpl_set_smpljson =
          customFormData[sectionIndex].smpl_set_smpljson;
        newinitialCustomData[sectionIndex].smpl_set_unit =
          customFormData[sectionIndex].smpl_set_unit;
        // newinitialCustomData[sectionIndex].is_set_for_JRF =
        //   customFormData[sectionIndex].is_set_for_JRF;
        setCustomFormData(newinitialCustomData);
        setGroupParameters([]);
        setIsLoading(true);
        let isCalled;
        if (moduleType === "GroupAssignment") {
          if (formData[1]?.sampleInwardIdMain) {
            isCalled = await getAssignmentMasterData(
              formData[1].jrf_commodity,
              formData[1].jrf_lab,
              customFormData[sectionIndex].is_group_param.toLowerCase(),
              operationAssignmentData,
              formData[0].jrf_is_ops,
              setUpdatedMasterOptions
            );
          } else {
            setIsLoading(false);
          }
        } else {
          // isCalled = await getGroupParameterDataOperation(
          //   formData[0].fk_commodityid,
          //   customFormData[sectionIndex].is_group_param.toLowerCase(),
          //   setUpdatedMasterOptions,
          //   operationAssignmentData,
          //   editReordType,
          //   OperationType,
          //   section.vesselGroupParameter,
          //   operationStepNo
          // );
        }
        setIsLoading(false);
      }
    };
    getOnloadFunction();
  }, [customFormData[sectionIndex].is_group_param, operationAssignmentData]);

  const openDeletePopup = () => {
    let headingMsg = "Confirmation!";
    let titleMsg = "Are you sure you want to submit?";
    return (
      <DeleteConfirmation
        isOpen={isSubmit}
        handleClose={setIsSubmit}
        handleConfirm={() => onHandleSubmitConfim()}
        popupMessage={titleMsg}
        popupHeading={headingMsg}
        isOverlayLoader={isOverlayLoader}
        actionType={'submit'}
      />
    );
  };

  const onHandleSubmitConfim = () => {
    if (!useForComponent) {
      createQualityAnalysisHandler(
        parameterDataTable,
        setIsLoading,
        setIsOverlayLoader,
        setParameterDataTable,
        setCustomFormData,
        setIsSubmit,
        formData,
        initialCustomData,
        setFormData,
        setTableData,
        setFinalParamDataSort,
        setSampleDataTable
      );
    } else {
      createTMLAnalysisDetails(
        parameterDataTable,
        setIsLoading,
        setIsOverlayLoader,
        setParameterDataTable,
        setCustomFormData,
        setIsSubmit,
        formData,
        initialCustomData,
        OperationTypeID,
        TMLID
      );
    }
  };

  const onCustomChangeHandler = (indexNo, name, value) => {
    setCustomFormData((prevData) => {
      return {
        ...prevData,
        [indexNo]: {
          ...prevData[indexNo],
          [name]: value,


        },
      };
    });
  };

  const extraFieldChange = (indexNo, name, value) => {
    setExtraFormData((prevData) => {
      return {
        ...prevData,
        [indexNo]: {
          ...prevData[indexNo],
          [name]: value,
        },
      };
    });
  };
  useEffect(() => {
    if (customFormData[sectionIndex]?.smpl_set_paramjson) {
      getGroupParameterMasterData(
        customFormData[sectionIndex]?.smpl_set_paramjson
      );
    }
  }, [customFormData[sectionIndex]?.smpl_set_paramjson]);
  useEffect(() => {
    if (customFormData[sectionIndex]?.smpl_set_groupjson) {
      getGroupParameterMasterData(
        customFormData[sectionIndex]?.smpl_set_groupjson
      );
    }
  }, [customFormData[sectionIndex]?.smpl_set_groupjson]);
  const getGroupParameterMasterData = async (value) => {
    setIsGroupChanged(false);
    setGroupParameters([]);
    try {
      setIsLoading(true);
      let tempBody = {
        lab_id: formData[1]?.jrf_lab,
      };
      if (customFormData[sectionIndex].is_group_param == "Group") {
        tempBody.group_id = value;
      } else {
        tempBody.param_id = value;
      }
      let res;
      if (moduleType === "GroupAssignment") {
        tempBody.commodity_id = formData[1]?.jrf_commodity;
        res = await postDataFromApi(labGroupsStdBasisApi, tempBody);
      } else {
        tempBody.commodity_id = formData[0]?.fk_commodityid;
        res = await postDataFromApi(labOPEGroupsStdBasisApi, tempBody);
      }
      if (res.data && res.data.status == 200) {
        const actualResponse = res.data.data;
        let isExcludeOptions = false;
        let basisArr = [];
        let standardsArr = [];
        let unitArr = [];
        if (
          moduleType === "jobinstruction" &&
          editReordType !== "analysis" &&
          !section.vesselGroupParameter
        ) {
          operationAssignmentData.map((singleData) => {
            if (customFormData[sectionIndex].is_group_param == "Parameter") {
              singleData.jia_set_paramjson.map((paramdata) => {
                if (!standardsArr.includes(paramdata.std_id)) {
                  standardsArr.push(paramdata.std_id);
                }
                paramdata.basis.map((method) => {
                  if (!basisArr.includes(method.basis_id)) {
                    basisArr.push(method.basis_id);
                  }
                });
                if (!unitArr.includes(paramdata.param_unit)) {
                  unitArr.push(paramdata.param_unit);
                }
              });
            } else {
              singleData.jia_set_groupjson.map((paramdata) => {
                paramdata.parameters.map((singleParam) => {
                  singleParam.standards.map((method) => {
                    if (!standardsArr.includes(method.std_id)) {
                      standardsArr.push(method.std_id);
                    }
                  });
                  singleParam.basis.map((method) => {
                    if (!basisArr.includes(method.basis_id)) {
                      basisArr.push(method.basis_id);
                    }
                  });
                  if (!unitArr.includes(singleParam.param_unit)) {
                    unitArr.push(singleParam.param_unit);
                  }
                });
              });
            }
          });
          if (
            customFormData[sectionIndex].is_group_param !== "Parameter" ||
            (customFormData[sectionIndex].is_group_param === "Parameter" &&
              OperationType !== getVesselOperation("TML"))
          ) {
            isExcludeOptions = true;
          }
        }
        if (customFormData[sectionIndex].is_group_param == "Group") {
          setGroupParameters(actualResponse.parameters);
          const existingFormData = customFormData[sectionIndex];
          setCustomFormData({
            [sectionIndex]: {
              smpl_set_basisjson: [],
              is_group_param: "Group",
              is_group_param_name: "Group",
              smpl_set_paramjson: "",
              smpl_set_testmethodjson: "",
              smpl_set_unit: "",
              smpl_set_smpljson: existingFormData.smpl_set_smpljson,
              smpl_set_groupjson: existingFormData.smpl_set_groupjson,
            },
          });
          actualResponse.parameters.map((groupParam, gpindex) => {
            let standards = groupParam.standard || [];
            let basis = [];
            standards = standards.filter((group) => {
              if (
                isExcludeOptions &&
                !standardsArr.includes(group.std_id.toString())
              ) {
                return false;
              }
              group.name = group.std_name;
              group.id = group.std_id;
              return true;
            });

            const groupsData = {
              model: "smpl_set_testmethodjson_" + gpindex,
              data: standards,
            };
            const basisData = {
              model: "smpl_set_basisjson_" + gpindex,
              data: basis,
            };
            const unitspValue = groupParam.param_unit.split(",");
            let unitoptions = [];
            unitspValue.map((opt) => {
              if (isExcludeOptions && !unitArr.includes(opt)) {
                return false;
              }
              unitoptions.push({
                name: opt,
                id: opt,
              });
            });
            const smlpUnits = {
              model: "smpl_set_unit_" + gpindex,
              data: unitoptions,
            };
            setCustomFormData((prevData) => {
              return {
                ...prevData,
                [sectionIndex]: {
                  ...prevData[sectionIndex],
                  ["smpl_set_basisjson_" + gpindex]:
                    basis.length == 1 ? [basis[0].id] : [],
                  "smpl_set_basisjson_name":
                    basis.length == 1 ? [basis[0].basis_code] : [],
                  ["smpl_set_testmethodjson_" + gpindex]:
                    standards.length == 1 ? standards[0].id.toString() : "",
                  "smpl_set_testmethodjson_name":
                    standards.length == 1 ? standards[0].std_name : "",
                  ["smpl_set_unit_" + gpindex]: unitspValue[0],
                },
              };
            });
            setUpdatedMasterOptions((prev) => [
              ...prev,
              groupsData,
              basisData,
              smlpUnits,
            ]);
            if (standards.length == 1) {
              getGroupParameterMasterDataWithTestMethod(
                standards[0].id.toString(),
                gpindex,
                groupParam.param_id
              );
            }
          });
        } else {
          let standards = actualResponse.standard || [];
          let basis = [];
          standards = standards.filter((group) => {
            if (
              isExcludeOptions &&
              !standardsArr.includes(group.std_id.toString())
            ) {
              return false;
            }
            group.name = group.std_name;
            group.id = group.std_id;
            return true;
          });
          const basisData = {
            model: "smpl_set_basisjson",
            data: basis,
          };
          const groupsData = {
            model: "smpl_set_testmethodjson",
            data: standards,
          };

          const unitspValue = actualResponse.param_unit.split(",");
          let unitoptions = [];
          unitspValue.map((opt) => {
            if (isExcludeOptions && !unitArr.includes(opt)) {
              return false;
            }
            unitoptions.push({
              name: opt,
              id: opt,
            });
          });
          const smlpUnits = {
            model: "smpl_set_unit",
            data: unitoptions,
          };
          setCustomFormData((prevData) => {
            return {
              ...prevData,
              [sectionIndex]: {
                ...prevData[sectionIndex],
                "smpl_set_testmethodjson":
                  standards.length == 1 ? standards[0].id.toString() : "",
                "smpl_set_testmethodjson_name":
                  standards.length == 1 ? standards[0].std_name : "",
                "smpl_set_unit": unitspValue[0],
              },
            };
          });

          setUpdatedMasterOptions((prev) => [
            ...prev,
            groupsData,
            basisData,
            smlpUnits,
          ]);
          if (standards.length == 1) {
            getGroupParameterMasterDataWithTestMethod(
              standards[0].id.toString()
            );
          }
        }
      }
    } catch (error) { }
    setTimeout(() => {
      setIsGroupChanged(true);
      setIsLoading(false);
    }, [10]);
  };

  const getGroupParameterMasterDataWithTestMethod = async (
    value,
    gpIndex = "",
    param_id = ""
  ) => {
    try {
      setIsLoading(true);
      let tempBody = {
        lab_id: formData[1].jrf_lab,
        commodity_id: formData[1].jrf_commodity,
      };
      if (customFormData[sectionIndex].is_group_param == "Group") {
        tempBody.group_id = customFormData[sectionIndex]?.smpl_set_groupjson;
        tempBody.param_id = param_id
          ? param_id
          : groupParameteres[gpIndex]?.param_id;
      } else {
        tempBody.param_id = customFormData[sectionIndex]?.smpl_set_paramjson;
      }
      tempBody.std_id = value;
      let res;
      if (moduleType === "GroupAssignment") {
        res = await postDataFromApi(labparambasisApi, tempBody);
      } else {
        tempBody.commodity_id = formData[0]?.fk_commodityid;
        res = await postDataFromApi(labOPEparambasisApi, tempBody);
      }
      if (res.data && res.data.status == 200) {
        const actualResponse = res.data.data;

        let basis = actualResponse.basis || [];
        basis = basis.filter((group) => {
          group.name = group.basis_code;
          group.id = group.basis_id;
          return true;
        });
        const basisData = {
          model:
            customFormData[sectionIndex].is_group_param == "Group"
              ? "smpl_set_basisjson_" + gpIndex
              : "smpl_set_basisjson",
          data: basis,
        };
        setUpdatedMasterOptions((prev) => [...prev, basisData]);
        setCustomFormData((prevData) => {
          return {
            ...prevData,
            [sectionIndex]: {
              ...prevData[sectionIndex],
              [customFormData[sectionIndex].is_group_param == "Group"
                ? "smpl_set_basisjson_" + gpIndex
                : "smpl_set_basisjson"]: basis.length == 1 ? [basis[0].id] : [],
              "smpl_set_basisjson_name":
                basis.length == 1 ? [basis[0].basis_code] : [],
            },
          };
        });
      }
    } catch (error) { }
    setTimeout(() => {
      setIsLoading(false);
    }, [10]);
  };

  const getInwardTabledata = async (simpleId) => {
    setIsOverlayLoader(true);
    let payload = {
      smpl_inwrd_id: simpleId,
    };
    let res = await postDataFromApi(sampleInwardDetailsGetAPI, payload);
    if (res.data.status === 200) {
      const updatedFormData = { ...formData };
      let selectedSimpleIds = [];
      if (!formData[0].jrf_is_ops) {
        res.data.data.sample_set_data.forEach((singleInwardData, i) => {
          singleInwardData.smpl_set_smpljson.map((simpleId) => {
            selectedSimpleIds.push(simpleId);
          });

          if (!updatedFormData[sectionIndex]) {
            updatedFormData[sectionIndex] = {};
          }
          section.rows.forEach((row) => {
            row.forEach((columnName) => {
              const fieldName = `${columnName.name}_${i}`;
              const value = singleInwardData[columnName.name];
              updatedFormData[sectionIndex][fieldName] = value;
            });
          });
        });
        const newArray = res.data.data.sample_set_data;
        let FinalCombinedArray = [];
        newArray.map((singleParamaSet) => {
          let combinedArray = [];
          for (const [key, value] of Object.entries(
            singleParamaSet.smpl_set_groupjson
          )) {
            value.param_type = "Group";
            combinedArray.push({ ...value });
          }
          for (const [key, value] of Object.entries(
            singleParamaSet.smpl_set_paramjson
          )) {
            value.param_type = "Parameter";
            combinedArray.push({ ...value });
          }
          combinedArray = combinedArray.sort(
            (a, b) => a.sequanceNo - b.sequanceNo
          );
          FinalCombinedArray.push(combinedArray);
        });
        setFinalParamDataSort(FinalCombinedArray);
        setSampleDataTable(newArray);
        setTableData(newArray);
        setSelectedOptions(selectedSimpleIds);
      }
      updatedFormData[0]["smpl_status"] = res.data.data.smpl_status;
      updatedFormData[0]["smpl_inwrd_No"] = res.data.data.smpl_inward_number;
      updatedFormData[0]["inward_msfm_number"] =
        res.data.data.inward_msfm_number;
      updatedFormData[0]["sample_detail_data"] =
        res.data.data.sample_detail_data;
      updatedFormData[0]["sample_set_data"] = res.data.data.sample_set_data;
      setFormData(updatedFormData);
    }
    setIsOverlayLoader(false);
  };
  useEffect(() => {
    setTimeout(() => {
      if (editReordType !== "analysis") getSampleOptionData();
    }, 1000);
  }, [masterOptions, selectedOptions]);
  const getSampleOptionData = () => {
    try {
      setIsOverlayLoader(true);
      let simplaMasterData = masterOptions?.find((model, index) => {
        if (model.model === "smpl_set_smpljson") {
          return model;
        }
      });
      if (simplaMasterData) {
        let notSelectedOptions = simplaMasterData?.data.filter((simpleId) => {
          return !selectedOptions.includes(simpleId.name);
        });

        let filterData = masterOptions.filter((model) => {
          return true;
        });
        if (notSelectedOptions.length == 0) {
          if (operationStepNo != 3) {
            setIsDisplayNewAddOption(false);
          }
        } else {
          setIsDisplayNewAddOption(true);
        }
        setUpdatedMasterOptions(filterData);
        return;
      }
      setUpdatedMasterOptions(masterOptions);
      setOptionLoaded(true);
    } finally {
      setTimeout(() => {
        setIsOverlayLoader(false);
      }, 1000);
    }
  };

  const getSampleOptions = async (rpc_id) => {

    setCustomFormData((prevFormData) => {
      return {
        ...prevFormData,
        2: {
          ...prevFormData[2],
          configured_smpl: [],
        },
      };
    });
    setSetwiseParam([]);
    let payload = {
      ji_id: EditRecordId,
      jis_id: EditSubRecordId,
      rpc_id: formData[0]?.rpc_id ? formData[0]?.rpc_id : rpc_id,
    };

    let res = await postDataFromApi(reportConfigGetApi, payload);
    if (res?.data.status === 200) {
      // let sampArray = res.data.data?.jrf_sample_marks?.map((item) => {
      //   if (item.composite_mark) {
      //     return item.composite_mark + " (comp)";
      //   }
      //   return item.sample_mark;
      // });
      let newoptions = [];
      let freeSamples = [];
      res.data.data?.tpi_sample_marks.map((opt) => {
        res.data.data?.jrf_sample_marks.push(opt)
      })
      res.data.data?.jrf_sample_marks.forEach((opt) => {
        if (opt.composite_mark) {
          opt.sample_marks.forEach((opt) => {
            newoptions.push({
              label: opt.sample_mark,
              // value: opt.sample_mark,
              value: opt.sample_mark + '--###TCRCOPS###--' + opt.sample_id,
            });
          });

          // Now, show the composite_mark itself

          newoptions.push({
            label: opt.composite_mark + " (comp)",
            value: opt.composite_mark + " (comp)" + '--###TCRCOPS###--' + opt.sample_id,
          });
        } else {

          freeSamples.push({
            label: opt.sample_mark,
            // value: opt.sample_mark,
            value: opt.sample_mark + '--###TCRCOPS###--' + opt.sample_id,
          });

        }
      });
      // Use a Set to track the values already in newOptions (using 'value' as the unique key)
      const existingValues = new Set(newoptions.map(item => item.value));

      // Filter out items in freeSamples that are already present in newOptions
      const uniqueFreeSamples = freeSamples.filter(item => !existingValues.has(item.value));

      // Append the unique freeSamples to the newOptions array
      newoptions = [...newoptions, ...uniqueFreeSamples];
      // setSampleOptions(sampArray);
      setSampleOptions(newoptions);
      setIsCalled(false);
      setSampleAllOptions(res.data.data?.jrf_sample_marks);
      setTimeout(() => {
        setFormData((prevData) => {
          return {
            ...prevData,
            1: {
              ...prevData[1],
              "isConfigLoaded": 1,
            },
          };
        });
        setIsCalled(true);
      }, 10);
    }

    return res.data.data?.jrf_sample_marks;
  };

  useEffect(() => {
    // setFormData()
    if (formData[0]?.rpc_id) {
      getSampleOptions();
    }
  }, [formData[0]?.rpc_id, formData[0]?.temp_option_change]);


  const [disabledMarks, setDisabledMarks] = useState([]);

  useEffect(() => {

    const custTemp = customFormData?.[2]?.configured_smpl;

    if (custTemp?.[custTemp.length - 1]?.includes("(comp)")) {
      setCustomFormData((prevData) => {
        const targetSampleMark = custTemp[custTemp.length - 1]?.replace("(comp)", "").trim();
        const matchingComposite = sampleAllOptions.find(
          (item) => item.composite_mark === targetSampleMark
        );
        const sampleMarks = matchingComposite?.sample_marks || []; // If no match, fallback to an empty array
        const sampleMarksDis = [
          ...sampleAllOptions.filter(item => item.sample_mark).map(item => item.sample_mark),
        ];

        const secondArray = [...sampleMarks, custTemp[custTemp.length - 1]]; // Combine sampleMarks and last element of custTemp

        const filteredSampleMarks = sampleMarksDis.filter(item => !secondArray.includes(item));
        setDisabledMarks(filteredSampleMarks);
        return {
          ...prevData,
          2: {
            ...prevData[2],
            configured_smpl: [...sampleMarks, custTemp[custTemp.length - 1]], // Add the original sample mark at the end
          },
        };
      });
    }
    else {
      setDisabledMarks([]);
    }
  }, [customFormData[2]?.configured_smpl?.length]); // Ensure the effect runs when configured_smpl changes
  // configCertStatus
  useEffect(() => {
    if (formData[1]?.isConfigLoaded) {
      getCertConfig();
    }

  }, [configCertStatus, formData[1]?.isConfigLoaded])
  const [viewSamples, setViewSamples] = useState([]);
  const getCertConfig = async () => {
    if (!['configured', 'completed'].includes(configCertStatus)) {
      try {
        let payload = {
          ji_id: EditRecordId,
          jis_id: EditSubRecordId,
        }
        const res = await postDataFromApi(certConfigGetApi, payload);
        // console.log(formData[0]?.rpc_id, configCertStatusRPCID, res.data.data);
        // // Extract matching objects
        // const matchingData = res.data.data.filter(item => {
        //   console.log(item.fk_rpc_id, item);
        //   // Make sure to return the result of the comparison
        //   return parseInt(item.fk_rpc_id) === parseInt(configCertStatusRPCID);
        // });

        // console.log(matchingData);

        if (res?.data?.status === 200) {
          // let sampleIds = res.data.data[0].cert_config_sampleids.map(item => item.sample_id);
          // sampleIds = ['MARK-02--###TCRCOPS###--188', "MARK-03--###TCRCOPS###--190"]
          // ----------------------------------------------------------------------------
          // const transformedArray = matchingData[0]?.cert_config_sampleids.map(item =>
          //   `${item.sample_mark}--###TCRCOPS###--${item.sample_id}`
          // );

          // console.log(transformedArray);
          // setCustomFormData(prevData => ({
          //   ...prevData,
          //   2: {
          //     ...prevData[2], // Preserve other keys in this object
          //     configured_smpl: transformedArray,
          //   },
          // }));
          // Static ID to filter by
          const staticId = configCertStatusRPCID || formData[0]?.rpc_id;

          // Filter the array
          let filteredData = res.data.data.find(item => item.fk_rpc_id === parseInt(staticId));
          if (filteredData) {
            setViewSamples(filteredData?.cert_config_mark_no);
            setCustomFormData(prevData => ({
              ...prevData,
              2: {
                ...prevData[2], // Preserve other keys in this object
                cert_config_mark_no: filteredData?.cert_config_mark_no,
              },
            }));
            let newoptions = sampleOptions
            let newoptionsAll = sampleAllOptions
            filteredData?.cert_config_sampleids.map((opt) => {
              newoptions.push({
                label: opt.sample_mark,
                value: opt.sample_mark + '--###TCRCOPS###--' + opt.sample_id,
              });
              newoptionsAll.push(opt);
            })
            setSampleOptions(newoptions)
            setSampleAllOptions(newoptionsAll)
            const certConfigData = filteredData?.cert_config_data;
            // Flatten all objects into one array and add basis to each object
            const updatedData = Object.values(certConfigData)
              .flat()
              .map(item => ({
                ...item
              }));
            const seen = new Set();

            const uniqueData = updatedData.filter(item => {
              const key = `${item.param_id}-${item.test_method}-${item.basis_code}`;
              return seen.has(key)
                ? false : seen.add(key)
                ;
            });
            setFormData((prevData) => {
              return {
                ...prevData,
                1: {
                  ...prevData[1],
                  "cert_config_id": filteredData?.cert_config_id,
                },
              };
            });
            setSetwiseParam(uniqueData);
          }

          // setSetwiseParam(updatedData)

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
      }
    }
  }
  const getSingleCommonfield = () => {

    if (['configured', 'completed'].includes(configCertStatus)) {
      // return 
      return (
        <RenderFields
          field={{
            width: 12,
            name: "cert_config_mark_no",
            label: "Samples",
            type: "label",
          }}
          sectionIndex={sectionIndex}
          fieldIndex={1 * 100 + 1}
          formData={customFormData}
          handleFieldChange={onCustomChangeHandler}
        />
      );
    }
    else {
      return (
        <RenderFields
          field={{
            width: 12,
            name: "configured_smpl",
            label: "Samples",
            type: "select",
            // options: sampleOptions,
            isCustomOptions: true,
            customOptions: sampleOptions,
            required: true,
            fieldWidth: 100,
            multiple: true,
            styleName: "configured_smpl_style"
          }}
          sectionIndex={sectionIndex}
          fieldIndex={1 * 100 + 1}
          formData={customFormData}
          handleFieldChange={onCustomChangeHandler}
          formErrors={formErrors} // Pass formErrors to RenderFields
          ///for render table only
          renderTable={true}
          tableIndex={sectionIndex}
          customName={""}
          disabledMarks={disabledMarks}
          hasSelectAll={false}

        // customOptions={sampleOptions}

        // masterOptions={updatedMasterOptions}
        // exludeOptions={selectedOptions}
        />
      );
    }

  };
  const [JRFID, setJrfID] = useState("");
  useEffect(() => {
    const targetSampleMark = customFormData[2]?.configured_smpl || [];

    // const result = sampleAllOptions.find(
    //   (item) => item.sample_mark === targetSampleMark
    // );
    let setIds = [];
    targetSampleMark.map((singleMark) => {
      singleMark = singleMark.split("--###TCRCOPS###--")[1]
      const result = sampleAllOptions.find((item) => {
        // let sampleMark = item.sample_mark;
        let sampleMark = item.sample_id;
        sampleMark = sampleMark.toString()
        // if (item.composite_mark) {
        //   sampleMark = item.composite_mark.replace(" (comp)", "");

        // }
        // else {
        //   sampleMark = item.sample_mark;
        // }

        // Compare the sampleMark with singleMark
        // singleMark = singleMark.split("--###TCRCOPS###--")[1]
        // singleMark = singleMark.replace(' (comp)', '');
        return sampleMark === singleMark;
      });
      // If a result is found, push the set_id into setIds array
      if (result) {
        if (!setIds.includes(result.set_id)) {
          setIds.push(result.set_id);
        }
      }
    });

    // const setId = result ? result.set_id : null;
    // const JRFId = result ? result.jrf_id : null;
    // setJrfID(JRFID);
    if (setIds.length > 0) {
      getSetWiseData(setIds);
    }
  }, [customFormData[2]?.configured_smpl]);

  const getSetWiseData = async (setId) => {
    let payload = {
      ji_id: EditRecordId,
      jis_id: EditSubRecordId,
      set_id: setId,
    };

    let res = await postDataFromApi(setwiseDataGetApi, payload);
    if (res.data.status === 200) {
      let combinedDetails;
      let paramdata = [];
      let groupData = [];

      // combinedDetails = [...paramDetails, ...groupDetails];

      // finalArr.push(paramDetails)
      // finalArr.push(groupDetails)
      // Iterate over the main data array
      res.data.data.forEach((singleData) => {
        singleData.forEach((singleSetData) => {
          let paramDetails = [];
          let groupDetails = [];

          // Collect unique parameters from `jila_set_paramjson`
          if (singleSetData.jila_set_paramjson.length > 0) {
            singleSetData.jila_set_paramjson.forEach((parameterdata) => {

              if (!paramdata.find((param) => param.param_id === parameterdata.param_id)) {
                paramdata.push(parameterdata);
              }
            });
          }

          paramDetails = singleSetData.jila_set_paramjson;

          // Collect unique parameters from `jila_set_groupjson`
          if (singleSetData?.jila_set_groupjson.length > 0) {
            singleSetData.jila_set_groupjson.forEach((group) => {
              group?.parameters.forEach((singleGroupParam) => {
                if (!groupData.find((param) => param.param_id === singleGroupParam.param_id)) {
                  groupData.push(singleGroupParam);
                }
              });
            });
          }

          groupDetails = singleSetData.jila_set_groupjson.flatMap(group => group.parameters);

          // Combine unique items from `paramdata` and `groupData` into `combinedDetails`
          combinedDetails = [
            ...paramdata,
            ...groupData
          ].filter((item, index, self) =>
            index === self.findIndex((param) => {
              // Log each condition and its result


              return (
                param.param_id === item.param_id &&
                // Check if both std_id values exist and are equal, or both are undefined
                (param?.standards?.[0]?.std_id === item?.standards?.[0]?.std_id ||
                  (param?.standards?.[0]?.std_id === undefined && item?.standards?.[0]?.std_id === undefined)) &&
                (param?.std_id === item?.std_id ||
                  (param?.std_id === undefined && item?.std_id === undefined)) &&
                param?.basis?.basis_code === item?.basis?.basis_code
              );

            })
          );



        });
      });


      setSetwiseParam(combinedDetails);
      combinedDetails.map((param, paramIndex) => {
        return param.basis.map((basisItem, basisIndex) => {
          if (formData[1]?.rpc_is_wght_avg?.[0] === "Weighted Avg.") {

            // const key = `rpc_is_total_smpl_lotno_${paramIndex}_${customFormData[2]?.configured_smpl}`;
            const key = "rpc_is_total_smpl_lotno_" + (param?.param_id) + "_" + (basisItem?.basis_code);

            const removeKey = "rpc_is_printindividual_" + (param?.param_id) + "_" + (basisItem?.basis_code);



            setCustomFormData((prevData) => ({
              ...prevData,
              0: {
                ...prevData[0],
                [key]: ["yes"],
                [removeKey]: ["no"],
              },
              1: {
                ...prevData[1],
                [key]: ["yes"],
                [removeKey]: ["no"],

              },
              2: {
                ...prevData[2],
                [key]: ["yes"],
                [removeKey]: ["no"],

              },
            }));


            // customFormData[2][key] = true;
            // customFormData[0][key] = true;
          }
          else if (formData[1]?.rpc_is_lot_no?.[0] === "Lot Wise") {


            // const key = "rpc_is_printindividual_" + customFormData[2]?.configured_smpl;
            const key = "rpc_is_printindividual_" + (param?.param_id) + "_" + (basisItem?.basis_code);
            const removeKey = "rpc_is_total_smpl_lotno_" + (param?.param_id) + "_" + (basisItem?.basis_code);



            setCustomFormData((prevData) => ({
              ...prevData,
              0: {
                ...prevData[0],
                [key]: ["yes"],
                [removeKey]: ["no"],
              },
              1: {
                ...prevData[1],
                [key]: ["yes"],
                [removeKey]: ["no"],

              },
              2: {
                ...prevData[2],
                [key]: ["yes"],
                [removeKey]: ["no"],

              },
            }));
            // customFormData[2][key] = true;
            // customFormData[0][key] = true;
          }

          const key = "rpc_is_avg_" + paramIndex + "_" + basisIndex;
          // const key = "rpc_is_avg_" + (param?.param_id) + "_" + (basisItem?.basis_code) + "_" + (param?.std_id || param?.standards[0].std_id);

          // // const key = `rpc_is_avg_${paramIndex}_${customFormData[2]?.configured_smpl}`;

          setCustomFormData((prevData) => {
            return {
              ...prevData,
              0: {
                ...prevData[0],
                [key]: "yes",
              },
              1: {
                ...prevData[1],
                [key]: "yes",
              },
              2: {
                ...prevData[2],
                [key]: "yes",
              },
            };
          });
        })
      });
    }
  };

  const updateConfiguredStatus = async (status, configID) => {
    let payload = {
      rpc_id: configCertStatusRPCID || formData[0]?.rpc_id,
      ji_id: EditRecordId,
      jis_id: EditSubRecordId,
      report_configuration: {
        status: status,
      },
    };

    let res = await putDataFromApi(reportConfigUpdateApi, payload);
    if (res.data.status === 200) {
      navigate(
        "/operation/vessel-ji-list/vessel-list/confirugation-certificate/" +
        encryptDataForURL(EditRecordId) +
        "/" +
        encryptDataForURL(EditSubRecordId) +
        "/" +
        encryptDataForURL(formData[0]?.rpc_id || configCertStatusRPCID) +
        "?OperationType=" +
        encryptDataForURL(OperationType) +
        "&ConfigID=" +
        encryptDataForURL(configID)
      );
    } else {
      toast.error(res.data.data.message || "Something Unexppected Occur");
    }
  };

  // const [totalSampleConfig, setTotalSampleConfig] = useState({});
  // useEffect(() => {
  //   if (!customFormData || !customFormData[0]) return;

  //   const resulting = {};

  //   Object.keys(customFormData[0]).forEach((key) => {
  //     const match = key.match(/_([^_]+)$/);

  //     if (match) {
  //       const identifier = match[1];
  //       if (!resulting[identifier]) resulting[identifier] = [];

  //       const modifiedKey = key.slice(0, key.lastIndexOf("_"));

  //       resulting[identifier].push({
  //         key: modifiedKey,
  //         value: customFormData[0][key],
  //       });
  //     }
  //   });

  //   // setTotalSampleConfig(resulting);
  // }, [customFormData]);

  const certificateConfig = async (isSave = "") => {
    /*
          Author : Yash Darshankar
          Date : 12-11-2024
          Description: Commented This Below Code.
   
          */
    // let sampleMarks = Object.keys(totalSampleConfig); // Extracts all keys from `resulting`

    // const lastValue = sampleMarks[sampleMarks.length - 1];
    // sampleMarks = lastValue.split(",");  // Split by commas
    let sampleMarks = customFormData[2]?.configured_smpl;



    // const config_data = sampleMarks.map((mark) => {
    //   // Loop through each sample mark for every param
    //   return setwiseParam.map((param, paramIndex) => {
    //     return {
    //       "param_id": param.param_id,
    //       "param_name": param.param_name,
    //       "cert_config_mark_no": mark, // Adds current sample mark
    //       "is_avg": customFormData[0]["rpc_is_avg_" + paramIndex + "_" + customFormData[2]?.configured_smpl]?.[0] === 'yes',
    //       "is_wt_avg": customFormData[0]["rpc_is_total_smpl_lotno_" + paramIndex + "_" + customFormData[2]?.configured_smpl]?.[0] === 'yes',
    //       "cert_config_is_print_individual": customFormData[0]?.["rpc_is_printindividual"]?.[0] === 'yes'
    //     };
    //   });
    // });
    // const flatConfigData = config_data.flat();

    const config_data = sampleMarks
      .map((mark) => {
        const spmark = mark.split('--###TCRCOPS###--');
        return setwiseParam.map((param, paramIndex) => {
          return param.basis.map((basisItem, basisIndex) => {
            return {
              param_id: param.param_id,
              // is_display: customFormData[0][
              //   "rpc_is_avg_" +
              //   paramIndex +
              //   "_" +
              //   customFormData[2]?.configured_smpl
              // ] === "yes",
              // is_display: customFormData[0][
              //   "rpc_is_avg_" + (param?.param_id) + "_" + (basisItem?.basis_code) + "_" + ((param?.std_id || param?.standards[0].std_id))
              // ] === "yes",
              is_display: customFormData[0][
                "rpc_is_avg_" + paramIndex + "_" + basisIndex
              ] === "yes",

              param_name: param.param_name,
              cert_config_mark_no: mark, // Adds current sample mark
              is_avg:
                customFormData[0][
                // "rpc_is_avg_" + (param?.param_id) + "_" + (basisItem?.basis_code) + "_" + ((param?.std_id || param?.standards[0].std_id))
                "rpc_is_avg_" + paramIndex

                ] === "yes",
              // is_wt_avg:
              //   customFormData[0][
              //   "rpc_is_total_smpl_lotno_" +
              //   paramIndex +
              //   "_" +
              //   customFormData[2]?.configured_smpl
              //   ]?.[0] === "yes",
              is_wt_avg:
                customFormData[0][
                "rpc_is_total_smpl_lotno_" + (param?.param_id) + "_" + (basisItem?.basis_code)
                ]?.[0] === "yes",

              // cert_config_is_print_individual:
              //   customFormData[0]?.["rpc_is_printindividual" + "_" + customFormData[2]?.configured_smpl]?.[0] === "yes",
              cert_config_is_print_individual:
                customFormData[0]?.["rpc_is_printindividual_" + (param?.param_id) + "_" + (basisItem?.basis_code)]?.[0] === "yes",

              basis_code: basisItem.basis_code,
              test_method: (param?.std_name || param?.standards?.[0]?.std_name),
              unit: param?.param_unit

            };
          })
        }).flat()
      }).flat();


    let cert_mark = []
    let cert_mark_id = []
    let cert_config_sampleids = []
    const structuredData = config_data.reduce((acc, item) => {
      let mark = item.cert_config_mark_no;
      const spmark = mark.split('--###TCRCOPS###--');
      mark = spmark[0]


      // Remove the '(comp)' substring, trim spaces, and remove quotes if present
      mark = mark.replace(/\(comp\)/gi, '').trim();
      if (mark.startsWith('"') && mark.endsWith('"')) {
        mark = mark.slice(1, -1);  // Remove the first and last character (quotes)
      }
      let markid = spmark[1]
      if (!cert_mark_id.includes(markid)) {
        cert_mark.push(mark);
        cert_mark_id.push(markid);
        const singleSample=sampleAllOptions.find((sample)=>sample.sample_id==spmark[1])
        cert_config_sampleids.push({
          sample_id: spmark[1],
          sample_mark: spmark[0],
          set_id: singleSample.set_id,
          jrf_id: singleSample.jrf_id,
        });
      }

      if (!acc[mark]) {
        acc[mark] = [];
      }
      acc[mark].push({
        param_id: item.param_id,
        param_name: item.param_name,
        // is_avg: item.is_avg,
        is_wt_avg: item.is_wt_avg,
        is_display: item.is_display,
        cert_config_is_print_individual: item.cert_config_is_print_individual,
        basis_code: item.basis_code,
        test_method: item.test_method,
        unit: item.unit

      });
      return acc;
    }, {});

    // console.log('cert_config_sampleids',cert_config_sampleids)
    const targetSampleMark = customFormData[2]?.configured_smpl;
    const result = sampleAllOptions.find((item) => {
      let sampleMark = item.sample_mark;

      if (item.composite_mark) {
        sampleMark = item.composite_mark.replace(" (comp)", "");
      }

      return sampleMark === targetSampleMark;
    });



    const setId = result ? result.set_id : null;
    const JrfId = result ? result.jrf_id : null;
    if (cert_mark?.length > 0) {
      let payload = {
        certificate_configuration: {
          cert_config_mark_no: cert_mark,
          cert_config_sampleids: cert_config_sampleids,
          // "cert_config_data": flatConfigData,
          cert_config_data: structuredData,
          fk_opslmsassignment_id: setId,
          fk_rpc_id: formData[0]?.rpc_id || configCertStatusRPCID, //formData[0].fk_rpc_id
          fk_jrf_id: JrfId,
          fk_jiid: EditRecordId,
          fk_jisid: EditSubRecordId,
          // "cert_config_is_print_individual": customFormData[0]?.["rpc_is_printindividual"]?.[0] === 'yes'
          // "cert_config_is_print_individual": customFormData[0]?.["rpc_is_printindividual_" + customFormData[2]?.configured_smpl]?.[0] === 'yes'
        },
      };
      let res;
      if (formData[1]?.cert_config_id) {
        payload.cert_config_id=formData[1]?.cert_config_id
        res = await putDataFromApi(certConfigUpdateApi, payload);
      }
      else {
        res = await postDataFromApi(certConfigCreateApi, payload);
      }
      if (res.data.status === 200) {
        if (res.data.data.cert_config_id) {
          if (!isSave) {
            updateConfiguredStatus("configured", res.data.data.cert_config_id);
          }
          else {
            getSampleOptions(res.data.data?.fk_rpc_id);
          }

        }
        else {
          alert("Config ID was not provided.");
        }
      }
      else {
        toast.error(res.data.message || "Oops! Something went wrong while trying to access the service. Please try again later.", {
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
      alert("No parameters are configured! Please select at least one sample.");
    }

  };

  return (
    <div key={sectionIndex} className="row my-2">
      <Card className="Scrollable configureTableCard">
        <CardBody>
          <CardTitle tag="h5">{section.title}</CardTitle>
          <div className="singleCommonFieldContainer configureTableCard">
            {isCalled && getSingleCommonfield()}
            {/* <div>
              <p>
                Configured Samples{" "}
                <span>{getConfiguredSampleLength() || "00"}</span>{" "}
              </p>
              <p>
                Samples To be Configured{" "}
                <span>{getToBeConfiguredSampleLength() || "00"}</span>{" "}
              </p>
            </div> */}
          </div>
          <table className="table table-white responsive borderless no-wrap align-middle renderTable JICertificate">
            <thead>
              <tr>
                <th>Parameters</th>
                <th>Test Method</th>
                <th>Basis</th>
                <th>Unit</th>
                <th>Print Individual Sample</th>
                <th>Display</th>
                <th>Wt. Avg</th>
              </tr>
            </thead>
            <tbody>
              {['configured', 'completed'].includes(configCertStatus) ?
                setwiseParam.map((param, paramIndex) => {
                  return (
                    <tr>
                      <td>{param?.param_name}</td>
                      <td>
                        {param?.test_method}
                      </td>
                      <td>{param?.basis_code}</td>

                      <td>{param.unit || "--"}</td>
                      <td>
                        {param.cert_config_is_print_individual ? "Yes" : "No"}

                      </td>
                      <td className={"rpc_is_avg_" + paramIndex}>
                        {param.is_display ? "Yes" : "No"}
                      </td>
                      <td>
                        {param.is_wt_avg ? "Yes" : "No"}

                      </td>
                    </tr>
                  );
                })
                :
                setwiseParam.map((param, paramIndex) => {
                  return (
                    param?.basis?.map((basisItem, basisIndex) => (
                      <tr>
                        <td>{param?.param_name}</td>
                        <td>
                          {param?.std_name || param?.standards?.[0]?.std_name}
                        </td>
                        {/* <td>{getBasisCode(param, setwiseParam)}</td> */}
                        <td>{basisItem?.basis_code}</td>

                        <td>{param.param_unit}</td>
                        <td>
                          <RenderFields
                            field={{
                              width: 3,
                              label: "",

                              // name: "rpc_is_printindividual_" + customFormData[2]?.configured_smpl,
                              name: "rpc_is_printindividual_" + (param?.param_id) + "_" + (basisItem?.basis_code),
                              type: "checkbox",
                              options: ["yes"],
                              fieldWidth: "50",
                              viewOnly: true,
                              isOptionLabelNotShow: true,
                            }}
                            sectionIndex={0}
                            fieldIndex={1 * 100 + 1}
                            formData={customFormData}
                            handleFieldChange={onCustomChangeHandler}
                            formErrors={formErrors} // Pass formErrors to RenderFields
                            ///for render table only
                            renderTable={true}
                            tableIndex={0}
                            customName={""}
                            masterOptions={updatedMasterOptions}
                            exludeOptions={selectedOptions}
                          />
                        </td>
                        <td className={"rpc_is_avg_" + paramIndex + "_" + basisIndex}>
                          <RenderFields
                            field={{
                              width: 2,
                              label: "",
                              // name:
                              //   "rpc_is_avg_" +
                              //   paramIndex +
                              //   "_" +
                              //   customFormData[2]?.configured_smpl,
                              // name: "rpc_is_avg_" + (param?.param_id) + "_" + (basisItem?.basis_code) + "_" + ((param?.std_id || param?.standards[0].std_id)),
                              name: "rpc_is_avg_" + paramIndex + "_" + basisIndex,
                              type: "radio",

                              options: ["yes", "No"],
                              fieldWidth: "100",
                              isOptionLabelNotShow: true,
                            }}
                            sectionIndex={0}
                            fieldIndex={1 * 100 + 1}
                            formData={customFormData}
                            handleFieldChange={onCustomChangeHandler}
                            formErrors={formErrors} // Pass formErrors to RenderFields
                            ///for render table only
                            renderTable={true}
                            tableIndex={0}
                            customName={""}
                            masterOptions={updatedMasterOptions}
                            exludeOptions={selectedOptions}
                            viewOnly={opsCertiView === "view"}
                            isNoLabel={true}
                          />
                        </td>
                        <td>
                          <RenderFields
                            field={{
                              width: 2,
                              label: "",
                              name:
                                "rpc_is_total_smpl_lotno_" + (param?.param_id) + "_" + (basisItem?.basis_code),
                              // name:
                              // "rpc_is_total_smpl_lotno_" +
                              // paramIndex +
                              // "_" +
                              // customFormData[2]?.configured_smpl,
                              type: "checkbox",

                              options: ["yes"],
                              fieldWidth: "50",
                              isOptionLabelNotShow: true,
                              viewOnly: true,
                            }}
                            sectionIndex={0}
                            fieldIndex={1 * 100 + 1}
                            formData={customFormData}
                            handleFieldChange={onCustomChangeHandler}
                            formErrors={formErrors} // Pass formErrors to RenderFields
                            ///for render table only
                            renderTable={true}
                            tableIndex={0}
                            customName={""}
                            masterOptions={updatedMasterOptions}
                            exludeOptions={selectedOptions}
                          />
                        </td>
                      </tr>
                    ))

                  );
                })}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <div className="submit_btns align-end configureCertificateButtons">
        {opsCertiView !== "view" && <>
          <button
            onClick={() =>
              !getLMSOperationActivity().includes(OperationType) ? navigate(
                `/operation/vessel-ji-list/vessel-list/${encryptDataForURL(EditRecordId)}`
              ) : navigate(
                `/operation/vessel-ji-list/vessel-list/confirugation-certificate-list/${encryptDataForURL(EditRecordId)}/${encryptDataForURL(EditSubRecordId)}?OperationType=${encryptDataForURL(OperationType)}`
              )
            }
            className="cancelBtn"
            type="button"
          >
            Back
          </button>
          <button
            onClick={() => certificateConfig(1)}
            className="submitBtn"
            type="button"
          >
            Save
          </button>
          <button
            onClick={() => certificateConfig()}
            className="submitBtn"
            type="button"
          >
            Post & Next
          </button>
        </> || null}
      </div>

      {isSubmit && openDeletePopup()}
    </div>
  );
};

RenderAssignmentTableSection.propTypes = {
  section: PropTypes.string,
  sectionIndex: PropTypes.number,
  formData: PropTypes.object,
  handleFieldChange: PropTypes.func,
  addRow: PropTypes.func,
  deleteRow: PropTypes.func,
  deleteColumn: PropTypes.func,
  formErrors: PropTypes.object,
  setFormData: PropTypes.func,
  popupMessages: PropTypes.object,
  pageType: PropTypes.string,
  action: PropTypes.string,
  masterOptions: PropTypes.arrayOf(PropTypes.object),
  saveClicked: PropTypes.bool,
  moduleType: PropTypes.string,
  setTableData: PropTypes.func,
  getAssignmentMasterData: PropTypes.func,
  setSaveClicked: PropTypes.func,
  tableData: PropTypes.arrayOf(PropTypes.object),
  getSampleIdsMasterData: PropTypes.func,
  setIsDisplayNewAddOption: PropTypes.func,
  isDisplayNewAddOption: PropTypes.bool,
  setIsOverlayLoader: PropTypes.func,
  isOverlayLoader: PropTypes.bool,
  useForComponent: PropTypes.string,
  OperationType: PropTypes.string,
  OperationTypeID: PropTypes.number,
  TMLID: PropTypes.string,
  editReordType: PropTypes.string,
};
export default RenderAssignmentTableSection;
