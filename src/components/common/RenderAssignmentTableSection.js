import React, { useEffect, useState } from "react";
import RenderFields from "./RenderFields";
import { Card, CardBody, CardSubtitle, CardTitle, Row } from "reactstrap";
import ActionOptionsTable from "./ActionOptionsTable.js";
import { getSelectedOptionName } from "../../services/commonFunction";
import {
  labGroupsStdBasisApi,
  labOPEGroupsStdBasisApi,
  labOPEparambasisApi,
  labparambasisApi,
  sampleDetailsAPI,
  sampleInwardDetailsGetAPI,
} from "../../services/api";
import {
  GetTenantDetails,
  postDataFromApi,
} from "../../services/commonServices";
import { toast } from "react-toastify";
import { assignmentPageHandleAction } from "./commonHandlerFunction/GroupAssignmentFunctions.js";
import PropTypes from "prop-types";
import DeleteConfirmation from "./DeleteConfirmation";
import Loader from "./OverlayLoading";
import {
  createQualityAnalysisHandler,
  deleteOPSExecData,
  getGroupParameterDataOperation,
  getJIsowandactivityData,
  getJIsowandactivityDataForVessel,
  getLabMasterDataForJI,
  getLabPramDetails,
  getSampleIdsLabMasterData,
  handleAssignLabToParameter,
  qualityAnalysisPageHandleAction,
  updateQualityAnalysis,
} from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import {
  createTMLAnalysisDetails,
  createTMLAnalysisPageHandleAction,
  getAllSampleAssignmentist,
  getAssignemtnLabDropdownData,
  getOPS3StepCheckLabWiseParameters,
} from "./commonHandlerFunction/operations/TMLOperations";
import { useSelector } from "react-redux";
import { getSvgAccordingToCondition } from "../../services/commonFunction";
import ConfirmationModal from "./ConfirmationModal";


const RenderAssignmentTableSection = ({
  section,
  sectionIndex,
  formData,
  handleFieldChange,
  addRow,
  deleteRow,
  deleteColumn,
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
  setParameterDataTableMain,
  setJRFCreationType,
  setIsPopupOpen,
  isSingleSetOnly,
  labDropDownOptions,
  setLabDropDownOptions
}) => {
  useForComponent = section.vesselGroupParameter ? "" : useForComponent;
  // OperationType = section.vesselGroupParameter ? "" : OperationType;
  const session = useSelector((state) => state.session);
  const user = session.user;
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
      // is_group_param: GetTenantDetails(1, 1) == "TPBPL" ? "Parameter" : "Group",
      // is_group_param_name:
      //   GetTenantDetails(1, 1) == "TPBPL" ? "Parameter" : "Group",
      is_group_param: "Parameter",
      is_group_param_name:"Parameter",
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
  const [beforeLabWiseparameterDataTable, setBeforeLabWiseParameterDataTable] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [popupIndex, setPopupIndex] = useState(-1);
  const [editableIndex, setEditableIndex] = useState("");
  const [simpleInwardId, setSimpleInwardId] = useState("");
  const [groupParameteres, setGroupParameters] = useState([]);
  const [isGroupChanged, setIsGroupChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [finalParamDataSort, setFinalParamDataSort] = useState([]);
  const [operationAssignmentData, setOperationAssignmentData] = useState([]);
  const [extraFormData, setExtraFormData] = useState("");
  const [optionLoaded, setOptionLoaded] = useState(false);

  const [isLabAssignFailed, setIsLabAssignFailed] = useState(false);
  const [assignLabId, setAssignedLabId] = useState(false);
  const [failedParameters, setFailedParameters] = useState([]);
  const [AssignLabRowIndex, setAssignLabRowIndex] = useState('');
  useEffect(() => {
    setTimeout(() => {
      setSimpleInwardId(formData[1]?.sampleInwardIdMain);
      if (formData[1]?.sampleInwardIdMain) {
        getInwardTabledata(formData[1]?.sampleInwardIdMain);
      }
    }, 1000);
  }, [formData[1]?.sampleInwardIdMain]);
  useEffect(() => {
    setParameterDataTableMain(parameterDataTable);
  }, [parameterDataTable]);
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
              extraFieldChange,
              setBeforeLabWiseParameterDataTable
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
          // setIsDisplayNewAddOption(false);
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
          setLabDropDownOptions,
          "",
          "",
          null,
          operationStepNo == 3 ? "" : 1
        );
      }, 100);
    }
    else if (operationStepNo == 1) {
      getLabMasterDataForJI(setLabDropDownOptions)
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
        setIsOverlayLoader,
        "",
        "",
        setIsDisplayNewAddOption
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
    getOnloadFunction();
  }, [customFormData[sectionIndex].is_group_param, operationAssignmentData]);
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
        isCalled = await getGroupParameterDataOperation(
          formData[0].fk_commodityid,
          customFormData[sectionIndex].is_group_param.toLowerCase(),
          setUpdatedMasterOptions,
          operationAssignmentData,
          editReordType,
          OperationType,
          section.vesselGroupParameter,
          operationStepNo,
          extraFormData
        );
      }
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (extraFormData[1]?.smpl_filter_lab && operationStepNo == 1) {
      getOnloadFunction();
    }

  }, [extraFormData[1]?.smpl_filter_lab])
  const moveParamDetails = (index, islabIdSaved, deletableId = "") => {
    let isDeleted = false;
    if (islabIdSaved) {
      isDeleted = deleteOPSExecData(setIsOverlayLoader, deletableId);
    } else {
      isDeleted = true;
    }
    if (isDeleted) {
      setIsDisplayNewAddOption(false);
      let paramDetails = parameterDataTable;
      paramDetails.splice(index, 1);
      setParameterDataTable(paramDetails);
      paramDetails.map((paramaData, i) => {
        if (paramaData.is_group_param === "Group") {
          getSampleIdsLabMasterData(
            setUpdatedMasterOptions,
            updatedMasterOptions,
            formData[0].fk_commodityid,
            paramaData.smpl_set_groupjson,
            i,
            "Group"
          );
        } else {
          getSampleIdsLabMasterData(
            setUpdatedMasterOptions,
            updatedMasterOptions,
            formData[0].fk_commodityid,
            paramaData.smpl_set_paramjson,
            i,
            "parameter",
            paramaData.smpl_set_testmethodjson
          );
        }
      });
      setTimeout(() => {
        setIsDisplayNewAddOption(true);
      }, 10);
    }
  };

  const addNewParameterDetails = () => {
    let paramaData = customFormData[sectionIndex];
    paramaData.is_group_param_name = paramaData.is_group_param;
    if (
      !paramaData["smpl_set_paramjson"] &&
      !paramaData["smpl_set_groupjson"]
    ) {
      let errLabel = "";
      errLabel = "Groups of Parameter";
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
    }
    if (paramaData.is_group_param === "Group") {
      let isTestMethosErr = false;
      let isBasisErr = false;
      groupParameteres.some((param, gpIndex) => {
        let testMethodiId = paramaData["smpl_set_testmethodjson_" + gpIndex];
        let basisIdselect = paramaData["smpl_set_basisjson_" + gpIndex];
        if (testMethodiId === undefined || testMethodiId === "") {
          toast.error("All Test Methods are required", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          isTestMethosErr = true;
          return true;
        } else if (basisIdselect === undefined || basisIdselect.length === 0) {
          toast.error("All Basis are required", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          isBasisErr = true;
          return true;
        }
      });
      if (isBasisErr || isTestMethosErr) {
        return true;
      }
      let notRequiredFields = [
        "smpl_set_paramjson",
        "smpl_set_unit",
        "smpl_set_paramjson_name",
        "smpl_set_groupjson",
        "smpl_set_groupjson_name",
        "smpl_set_smpljson_name",
        "smpl_set_basisjson_name",
        "smpl_set_testmethodjson_name",
        "smpl_set_basisjson",
        "smpl_set_testmethodjson",
      ];
      if (moduleType !== "GroupAssignment" && !useForComponent) {
        notRequiredFields.push("smpl_set_smpljson");
        // notRequiredFields.push('is_set_for_JRF')
      }

      for (let obj in paramaData) {
        if (
          !notRequiredFields.includes(obj) &&
          (paramaData[obj] === undefined || !paramaData[obj].length)
        ) {
          const field = section.rows[0].filter((field, index) => {
            if (field.name === obj) {
              field.label = section.headers[index]
                ? section.headers[index].label
                : obj;
              return true;
            }
          });
          let errLabel = field.length ? field[0].errorlabel : obj;
          if (obj == "smpl_set_smpljson") {
            errLabel = "Samples";
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
        }
      }
    } else {
      // commented by DC
      let notRequiredFields = [
        "smpl_set_paramjson",
        "smpl_set_paramjson_name",
        "smpl_set_groupjson",
        "smpl_set_groupjson_name",
        "smpl_set_smpljson_name",
        "smpl_set_basisjson_name",
        "smpl_set_testmethodjson_name",
      ];
      // if (GetTenantDetails(1, 1) === "TPBPL") {
      //   notRequiredFields.push('smpl_set_basisjson')
      // }
      if (moduleType !== "GroupAssignment" && !useForComponent) {
        notRequiredFields.push("smpl_set_smpljson");
        // notRequiredFields.push('is_set_for_JRF')
      }
      for (let obj in paramaData) {
        if (
          !notRequiredFields.includes(obj) &&
          (paramaData[obj] === undefined || !paramaData[obj].length)
        ) {
          const field = section.rows[0].filter((field, index) => {
            if (field.name === obj) {
              field.label = section.headers[index]
                ? section.headers[index].label
                : obj;
              return true;
            }
          });
          let errLabel = field.length ? field[0].errorlabel : obj;
          if (obj == "smpl_set_smpljson") {
            errLabel = "Samples";
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
        }
      }
    }

    paramaData.smpl_set_basisjson_name = getSelectedOptionName(
      [],
      updatedMasterOptions,
      "smpl_set_basisjson",
      paramaData["smpl_set_basisjson"],
      "smpl_set_basisjson"
    );
    paramaData.smpl_set_testmethodjson_name = getSelectedOptionName(
      [],
      updatedMasterOptions,
      "smpl_set_testmethodjson",
      paramaData["smpl_set_testmethodjson"],
      "smpl_set_testmethodjson",
      1
    );
    if (paramaData.is_group_param === "Group") {
      let parameters = [];
      groupParameteres.map((param, gpIndex) => {
        let standards = [];
        let basiss = [];
        let stdId = paramaData["smpl_set_testmethodjson_" + gpIndex];
        let stdName = getSelectedOptionName(
          [],
          updatedMasterOptions,
          "smpl_set_testmethodjson_" + gpIndex,
          paramaData["smpl_set_testmethodjson_" + gpIndex],
          "smpl_set_testmethodjson_" + gpIndex,
          1,
          1
        );
        standards.push({
          std_id: stdId,
          std_name: stdName[0],
        });

        let basisId = paramaData["smpl_set_basisjson_" + gpIndex];
        let basisName = getSelectedOptionName(
          [],
          updatedMasterOptions,
          "smpl_set_basisjson_" + gpIndex,
          paramaData["smpl_set_basisjson_" + gpIndex],
          "smpl_set_basisjson_" + gpIndex,
          "",
          1
        );
        basisId.map((id, i) => {
          basiss.push({
            basis_id: id,
            basis_code: basisName[i],
          });
        });
        parameters.push({
          param_name: param.param_name,
          param_unit: paramaData["smpl_set_unit_" + gpIndex],
          param_id: param.param_id,
          standards: standards,
          basis: basiss,
        });
      });
      paramaData.groupJsonParameter = parameters;
    }
    if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1,formData[0]?.jrf_is_petro))) {
      masterOptions?.forEach((model, index) => {
        if (model.model === "smpl_set_paramjson") {
          const optionsData = model.data.filter(
            (single) => single.id === paramaData["smpl_set_paramjson"]
          );
          paramaData.param_sfm_input_type =
            optionsData.length > 0 ? optionsData[0].param_sfm_input_type : "";
        }
      });
    }
    let actualSampleMark = paramaData.smpl_set_smpljson
    if (operationStepNo == 3) {
      let newSampleMark = []

      paramaData.smpl_set_smpljson.filter((sampleMark) => {
        const spMark = sampleMark.split('--###TCRCOPS###--')
        newSampleMark.push(spMark[0])
      })
      paramaData.smpl_set_smpljson = newSampleMark
    }

    const newArray = [...parameterDataTable, paramaData];
    const actualLength = parameterDataTable.length;
    paramaData.smpl_set_smpljson = actualSampleMark
    setParameterDataTable(newArray);
    setBeforeLabWiseParameterDataTable(newArray);
    // setParameterDataTableMain(newArray);
    setGroupParameters([]);
    setCustomFormData(initialCustomData);
    if (moduleType == "jobinstruction" && !useForComponent && tableData.length > 0) {
      updateQualityAnalysis(newArray, setIsOverlayLoader, formData, tableData[0], setIsSubmit, setParameterDataTable)
    }
    setTimeout(() => {
      setCustomFormData((prevData) => {
        return {
          ...prevData,
          [sectionIndex]: {
            ...prevData[sectionIndex],
            smpl_set_smpljson: paramaData["smpl_set_smpljson"],
            // is_set_for_JRF: paramaData["is_set_for_JRF"],
            smpl_set_smpljson_name: paramaData["smpl_set_smpljson_name"],
          },
        };
      });
      if (section.vesselGroupParameter) {
        if (paramaData.is_group_param === "Group") {
          getSampleIdsLabMasterData(
            setUpdatedMasterOptions,
            updatedMasterOptions,
            formData[0].fk_commodityid,
            paramaData.smpl_set_groupjson,
            actualLength,
            "Group"
          );
        } else {
          getSampleIdsLabMasterData(
            setUpdatedMasterOptions,
            updatedMasterOptions,
            formData[0].fk_commodityid,
            paramaData.smpl_set_paramjson,
            actualLength,
            "parameter",
            paramaData.smpl_set_testmethodjson
          );
        }
      }
    }, 10);
    setTimeout(() => {
      if (operationStepNo == 1) {
        handleAssignLabToParameter(
          setParameterDataTable,
          newArray,
          newArray.length - 1,
          setIsLoading,
          setIsOverlayLoader,
          formData,
          OperationTypeID,
          extraFormData,
          user,
          1,
          setExtraFormData,
          setIsLabAssignFailed,
          setFailedParameters,
          setAssignLabRowIndex,
          setAssignedLabId
        );
      }
    }, 10)
  };
  const addNewSampleSetDetails = () => {
    if (parameterDataTable.length == 0 && !formData[0].jrf_is_ops) {
      toast.error("Please Add at least 1 parameter Details", {
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
    setIsSubmit(true);
  };
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
    if (moduleType === "GroupAssignment") {
      createAssignmentHandler(parameterDataTable);
    } else {
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
          finalParamDataSort
        );
      }
    }
  };

  const onCustomChangeHandler = (indexNo, name, value) => {
    if (name === "smpl_set_smpljson") {
      if (operationStepNo == 3) {
        const duplicateValue = []
        value.filter((singleVal) => {
          const sampleMarkSp = singleVal.split('--###TCRCOPS###--')
          if (!duplicateValue.includes(sampleMarkSp[0])) {
            if (!sampleDataTable.find((singleSet) => singleSet.jila_set_markjson.includes(sampleMarkSp[0]) && singleSet.fk_labid == extraFormData[1].smpl_filter_lab)) {
              duplicateValue.push(sampleMarkSp[0])
            }
          }
          return
        })
        if (value.length != duplicateValue.length) {
          toast.error("You cannot select the same sample mark twice for the same lab.", {
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
      }
    }
    setCustomFormData((prevData) => {
      return {
        ...prevData,
        [indexNo]: {
          ...prevData[indexNo],
          [name]: value,
        },
      };
    });
    if (name == "is_group_param") {
      setCustomFormData((prevData) => {
        return {
          ...prevData,
          [indexNo]: {
            ...prevData[indexNo],
            [name + "_name"]: value,
          },
        };
      });
    }
    if (
      customFormData[sectionIndex].is_group_param == "Parameter" &&
      name === "smpl_set_testmethodjson"
    ) {
      getGroupParameterMasterDataWithTestMethod(value);
    } else if (customFormData[sectionIndex].is_group_param == "Group") {
      let beforeLastPart = name.slice(0, name.lastIndexOf("_"));
      if (beforeLastPart === "smpl_set_testmethodjson") {
        let lastPart = name.slice(name.lastIndexOf("_") + 1);
        getGroupParameterMasterDataWithTestMethod(value, lastPart);
      }
    }
  };
  const onJRFTPIChangeHandler = (indexNo, name, value) => {
    setJRFTPIFormData((prevData) => {
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
      if (operationStepNo == 3) {
        operationAssignmentData.filter((singleData) => {
          singleData.jia_set_paramjson.map((paramdata) => {
            if (
              customFormData[sectionIndex]?.smpl_set_paramjson ==
              paramdata.param_id
            ) {
              let basiData = [];
              let basiDataName = [];
              paramdata.basis.map((basis) => {
                basiData.push(basis.basis_id);
                basiDataName.push(basis.basis_code);
              });
              setCustomFormData((prevData) => {
                return {
                  ...prevData,
                  [sectionIndex]: {
                    ...prevData[sectionIndex],
                    "smpl_set_basisjson": basiData,
                    "smpl_set_basisjson_name": basiDataName,
                    "smpl_set_testmethodjson": paramdata?.std_id,
                    "smpl_set_testmethodjson_name": paramdata?.std_name,
                    "smpl_set_unit": paramdata.param_unit,
                    smpl_set_paramjson_name: paramdata.param_name,
                  },
                };
              });
              return;
            }
          });
        });
      }
    }
  }, [customFormData[sectionIndex]?.smpl_set_paramjson]);
  useEffect(() => {
    if (customFormData[sectionIndex]?.smpl_set_groupjson) {
      getGroupParameterMasterData(
        customFormData[sectionIndex]?.smpl_set_groupjson
      );
    }
    if (operationStepNo == 3) {
      const updatedFormData = { ...customFormData };
      operationAssignmentData.filter((singleData) => {
        singleData.jia_set_groupjson.map((paramdata) => {
          if (
            paramdata.group_id ==
            customFormData[sectionIndex]?.smpl_set_groupjson
          ) {
            updatedFormData[sectionIndex]["smpl_set_groupjson_name"] =
              paramdata.group_name;
            paramdata.parameters.map((groupParam, gpindex) => {
              let basiData = [];
              let basiDataName = [];
              groupParam.basis.map((basis) => {
                basiData.push(basis.basis_id);
                basiDataName.push(basis.basis_code);
              });
              updatedFormData[sectionIndex]["smpl_set_basisjson_" + gpindex] =
                basiData;
              updatedFormData[sectionIndex][
                "smpl_set_basisjson_name_" + gpindex
              ] = basiDataName;
              updatedFormData[sectionIndex][
                "smpl_set_testmethodjson_" + gpindex
              ] = groupParam?.standards[0]?.std_id;
              updatedFormData[sectionIndex][
                "smpl_set_testmethodjson_name_" + gpindex
              ] = groupParam?.standards[0]?.std_name;
              updatedFormData[sectionIndex]["smpl_set_unit_" + gpindex] =
                groupParam?.param_unit;
            });
            setTimeout(() => {
              setCustomFormData(updatedFormData);
            }, 1000);
            return;
          }
        });
        return;
      });
    }
  }, [customFormData[sectionIndex]?.smpl_set_groupjson]);
  const getGroupParameterMasterData = async (value) => {
    if (operationStepNo == 1) {
      if (!extraFormData[1]?.smpl_filter_lab) {
        toast.error("Please select Lab first", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setCustomFormData((prevData) => {
          return {
            ...prevData,
            [sectionIndex]: {
              ...prevData[sectionIndex],
              smpl_set_paramjson: "",
              smpl_set_groupjson: "",
            },
          };
        });
        return;
      }
    }
    setIsGroupChanged(false);
    setGroupParameters([]);
    try {
      setIsLoading(true);
      let tempBody = {
      };
      if (operationStepNo != 1 && operationStepNo != 3) {
        tempBody.lab_id = formData[1]?.jrf_lab != "otherTpi" ? formData[1]?.jrf_lab : ""
      }
      else {
        tempBody.lab_id = extraFormData[1]?.smpl_filter_lab != "otherTpi" ? extraFormData[1]?.smpl_filter_lab : ''
      }

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
        let actualResponse = res.data.data;
        if (customFormData[sectionIndex].is_group_param !== "Parameter") {
          actualResponse.parameters.sort((a, b) => a.param_id - b.param_id);
        }
        let isExcludeOptions = false;
        let basisArr = [];
        let standardsArr = [];
        let standardsName = [];
        let parameterArr = [];
        let unitArr = [];
        let existingBasisCodes = [];
        if (
          moduleType === "jobinstruction" &&
          editReordType !== "analysis" &&
          !section.vesselGroupParameter
        ) {
          operationAssignmentData.map((singleData) => {
            if (customFormData[sectionIndex].is_group_param == "Parameter") {
              singleData.jia_set_paramjson.map((paramdata) => {
                if (paramdata.param_id === value) {
                  if (!standardsArr.includes(paramdata.std_id)) {
                    standardsArr.push(paramdata.std_id);
                    standardsName.push(paramdata.std_name);
                  }
                  paramdata.basis.map((method) => {
                    if (!basisArr.includes(method.basis_id)) {
                      basisArr.push(method.basis_id);
                      existingBasisCodes.push(method.basis_code);
                    }
                  });
                  if (!unitArr.includes(paramdata.param_unit)) {
                    unitArr.push(paramdata.param_unit);
                  }
                }
              });
            } else {
              singleData.jia_set_groupjson.map((paramdata) => {
                paramdata.parameters.map((singleParam) => {
                  if (!parameterArr.includes(singleParam.param_id)) {
                    parameterArr.push(singleParam.param_id);
                  }
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
              standardsArr.length > 0)
          ) {
            isExcludeOptions = true;
          }
        }
        if (customFormData[sectionIndex].is_group_param == "Group") {
          actualResponse.parameters = actualResponse.parameters.filter(
            (singleParam) => {
              if (
                isExcludeOptions &&
                !parameterArr.includes(singleParam.param_id)
              ) {
                return false;
              }
              return true;
            }
          );
          setGroupParameters(actualResponse.parameters);
          const existingFormData = customFormData[sectionIndex];
          setCustomFormData({
            [sectionIndex]: {
              smpl_set_basisjson: [],
              smpl_set_basisjson_name: [],
              is_group_param: "Group",
              is_group_param_name: "Group",
              smpl_set_paramjson: "",
              smpl_set_testmethodjson: "",
              smpl_set_unit: "",
              smpl_set_smpljson: existingFormData.smpl_set_smpljson,
              smpl_set_groupjson: existingFormData.smpl_set_groupjson,
              smpl_set_groupjson_name: actualResponse.group_name,
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
              if (operationStepNo == 1) {
                if (extraFormData[1]?.smpl_filter_lab !== "otherTpi" && group.lab_id != extraFormData[1]?.smpl_filter_lab) {
                  return false
                }
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
            if (operationStepNo != 3) {
              setCustomFormData((prevData) => {
                return {
                  ...prevData,
                  [sectionIndex]: {
                    ...prevData[sectionIndex],
                    ["smpl_set_basisjson_" + gpindex]:
                      basis.length == 1 && editReordType !== "analysis" && !section.vesselGroupParameter ? [basis[0].id] : [],
                    "smpl_set_basisjson_name":
                      basis.length == 1 && editReordType !== "analysis" && !section.vesselGroupParameter ? [basis[0].basis_code] : [],
                    ["smpl_set_testmethodjson_" + gpindex]:
                      standards.length == 1 && editReordType !== "analysis" && !section.vesselGroupParameter ? standards[0].id.toString() : "",
                    "smpl_set_testmethodjson_name":
                      standards.length == 1 && editReordType !== "analysis" && !section.vesselGroupParameter ? standards[0].std_name : "",
                    ["smpl_set_unit_" + gpindex]: unitspValue[0],
                  },
                };
              });
            }

            setUpdatedMasterOptions((prev) => [
              ...prev,
              groupsData,
              basisData,
              smlpUnits,
            ]);
            if (standards.length == 1) {
              if (operationStepNo != 3) {
                getGroupParameterMasterDataWithTestMethod(
                  standards[0].id.toString(),
                  gpindex,
                  groupParam.param_id
                );
              }

            }
            else if (operationStepNo == 3) {
              getGroupParameterMasterDataWithTestMethod(
                customFormData[1]['smpl_set_testmethodjson_' + gpindex],
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
          if (operationStepNo != 3) {
            setCustomFormData((prevData) => {
              return {
                ...prevData,
                [sectionIndex]: {
                  ...prevData[sectionIndex],
                  ["smpl_set_basisjson"]: [],
                  ["smpl_set_basisjson_name"]:
                    [],
                  "smpl_set_testmethodjson":
                    standards.length == 1 && editReordType !== "analysis" && !section.vesselGroupParameter ? standards[0].id.toString() : "",
                  "smpl_set_testmethodjson_name":
                    standards.length == 1 && editReordType !== "analysis" && !section.vesselGroupParameter ? standards[0].std_name : "",
                  "smpl_set_unit": unitspValue[0],
                  smpl_set_paramjson_name: actualResponse.param_name,
                },
              };
            });
          } else {
            setCustomFormData((prevData) => {
              return {
                ...prevData,
                [sectionIndex]: {
                  ...prevData[sectionIndex],
                  "smpl_set_basisjson": basisArr,
                  "smpl_set_basisjson_name": existingBasisCodes,
                  "smpl_set_testmethodjson":
                    standards.length > 0 ? standardsArr[0] : "",
                  "smpl_set_testmethodjson_name":
                    standardsName.length > 0 ? standardsName[0] : "",
                  "smpl_set_unit": unitArr.length > 0 ? unitArr[0] : "",
                },
              };
            });
          }
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
    if (operationStepNo != 3) {
      setCustomFormData((prevData) => {
        return {
          ...prevData,
          [sectionIndex]: {
            ...prevData[sectionIndex],
            ["smpl_set_basisjson"]: [],
            ["smpl_set_basisjson_name"]:
              [],
          },
        };
      });
    }
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
      if (operationStepNo == 3) {
        tempBody.lab_id = extraFormData[1]?.smpl_filter_lab != "otherTpi" ? extraFormData[1]?.smpl_filter_lab : ''
      }
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
        if (moduleType === "GroupAssignment") {
          if (GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) === "TPBPL") {
            setCustomFormData((prevData) => {
              return {
                ...prevData,
                [sectionIndex]: {
                  ...prevData[sectionIndex],
                  [customFormData[sectionIndex].is_group_param == "Group"
                    ? "smpl_set_basisjson_" + gpIndex
                    : "smpl_set_basisjson"]: basis.length == 1 ? [basis[0].id] : [],
                  ["smpl_set_basisjson_name"]:
                    basis.length == 1 ? [basis[0].basis_code] : [],
                },
              };
            });
          }
        }
      }
    } catch (error) { }
    setTimeout(() => {
      setIsLoading(false);
    }, [10]);
  };
  const createAssignmentHandler = async (parameterData) => {
    const isBulkData = formData[0].jrf_is_ops;
    let smpl_set_smpljson = [];
    let smpl_set_paramjson = [];
    let smpl_set_groupjson = [];
    let bulkSetData = [];
    if (isBulkData) {
      parameterData = sampleDataTable;
      parameterData.map((paramData, seqIndex) => {
        bulkSetData.push({
          smpl_set_testmethodjson: [],
          smpl_set_basisjson: [],
          smpl_set_smpljson: paramData.smpl_set_smpljson,
          smpl_set_paramjson: paramData.smpl_set_paramjson,
          smpl_set_groupjson: paramData.smpl_set_groupjson,
          tenant: GetTenantDetails(1),
        });
      });
    } else {
      let param_sequance_no = 0;
      parameterData.map((paramData, seqIndex) => {
        paramData.smpl_set_smpljson.map((sample) => {
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
        paramData.smpl_set_basisjson.map((basId, i) => {
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
            param_sfm_input_type: paramData.param_sfm_input_type,
          });
          param_sequance_no++;
        }
      });
    }
    const newMainPayload = {
      sample_inward_id: formData[1]?.sampleInwardIdMain,
      sample_set_data: isBulkData
        ? bulkSetData
        : {
          smpl_set_smpljson: smpl_set_smpljson,
          smpl_set_groupjson: smpl_set_groupjson,
          smpl_set_testmethodjson: [],
          smpl_set_basisjson: [],
          smpl_set_paramjson: smpl_set_paramjson,
          tenant: GetTenantDetails(1),
        },
    };

    setIsLoading(true);
    setIsOverlayLoader(true);
    const res = await postDataFromApi(sampleDetailsAPI, newMainPayload);
    if (res.data.status === 200) {
      getInwardTabledata(formData[1]?.sampleInwardIdMain);
      setParameterDataTable([]);
      setCustomFormData(initialCustomData);
      setIsSubmit(false);
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
    setIsLoading(false);
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
  const onActionHandleClick = async (actionSelected) => {
    if (moduleType !== "GroupAssignment") {
      if (
        moduleType === "jobinstruction" &&
        useForComponent === "OperationDetailsAssignment"
      ) {
        createTMLAnalysisPageHandleAction(
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
          setSampleDataTable,
          setSelectedOptions,
          OperationTypeID
        );
      } else {
        qualityAnalysisPageHandleAction(
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
        );
      }
    } else {
      assignmentPageHandleAction(
        actionSelected,
        tableData,
        simpleInwardId,
        setSaveClicked,
        getInwardTabledata,
        setEditableIndex,
        popupIndex,
        getSampleIdsMasterData,
        setIsOverlayLoader
      );
    }
  };
  const removeGroupParameter = (gpindex) => {
    if (gpindex > -1) {
      groupParameteres.splice(gpindex, 1);
    }
    setIsLoading(true);
    const updatedFormData = { ...customFormData };
    delete updatedFormData[1]["smpl_set_basisjson_" + groupParameteres.length];
    delete updatedFormData[1][
      "smpl_set_testmethodjson_" + groupParameteres.length
    ];
    setCustomFormData(updatedFormData);
    setTimeout(() => {
      groupParameteres.map((groupParam, gpindex) => {
        let standards = groupParam.standard || [];
        let basis = groupParam.basis || [];
        standards = standards.filter((group) => {
          group.name = group.std_name;
          group.id = group.std_id;
          return true;
        });
        basis = basis.filter((group) => {
          group.name = group.basis_code;
          group.id = group.basis_id;
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
            },
          };
        });
        setUpdatedMasterOptions((prev) => [...prev, groupsData, basisData]);
      });
      setGroupParameters(groupParameteres);
      setIsLoading(false);
    }, 10);
  };
  const getGroupParameterElement = (cell, rowIndex, cellIndex, type) => {
    if (!isGroupChanged) {
      return;
    }
    if (type !== "deleteIcon") {
      cell.customOptions = [];
    }
    let elementData = [];
    elementData = groupParameteres.map((groupParam, gpindex) => {
      if (type != "standard" && type !== "deleteIcon") {
        cell.multiple = true;
      }

      return type === "deleteIcon" ? (
        groupParameteres.length > 1 && (
          <div className="actionOptions deleteGroupParameter">
            <button
              type="button"
              onClick={() => removeGroupParameter(gpindex)}
              className="invisible-button"
              aria-label={"Delete"}
            >
              {/* <i className={"bi bi-trash"} title={"Delete"}></i> */}
              {getSvgAccordingToCondition({ text: "Delete" })}
            </button>
          </div>
        )
      ) : (
        <div className={type === "basis" ? "assignmentGroupParameter" : ""}>
          <RenderFields
            field={cell}
            sectionIndex={sectionIndex}
            fieldIndex={rowIndex * 100 + cellIndex}
            formData={customFormData}
            handleFieldChange={onCustomChangeHandler}
            formErrors={formErrors} // Pass formErrors to RenderFields
            ///for render table only
            renderTable={true}
            tableIndex={rowIndex}
            customName={cell.name + "_" + gpindex}
            masterOptions={updatedMasterOptions}
            from="Table"
          />
        </div>
      );
    });
    return elementData;
  };
  const getSelectedOptions = (name) => {
    let selectedIds = [];
    parameterDataTable.map((singleParam) => {
      if (singleParam[name]) {
        if (![1, 3].includes(operationStepNo) || moduleType !== "jobinstruction") {
          selectedIds.push(singleParam[name]);
        }
        // selectedIds.push(singleParam[name]);
      }
    });
    return selectedIds;
  };
  const getSingleParamData = (singleParamDetails, type) => {
    if (moduleType === "GroupAssignment") {
      if (type === "Parameter") {
        return singleParamDetails.smpl_set_paramjson;
      } else {
        return singleParamDetails.smpl_set_groupjson;
      }
    } else {
      if (OperationType) {
        if (type === "Parameter") {
          return singleParamDetails.jila_set_paramjson;
        } else {
          return singleParamDetails.jila_set_groupjson;
        }
      } else {
        if (type === "Parameter") {
          return singleParamDetails.jia_set_paramjson;
        } else {
          return singleParamDetails.jia_set_groupjson;
        }
      }
    }
  };

  const getSingleCommonfield = (isOPSStep3Filter) => {
    if (moduleType === "GroupAssignment") {
      return (
        <div key={"Form-Accordion"} className={"customMargin-16 col-md-" + 4}>
          <RenderFields
            field={{
              width: 4,
              name: "smpl_set_smpljson",
              label: "Samples",
              type: "select",
              options: [],
              required: true,
              fieldWidth: 75,
              multiple: true,
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
            masterOptions={updatedMasterOptions}
            exludeOptions={selectedOptions}
          />
        </div>
      );
    } else if (
      moduleType === "jobinstruction" &&
      useForComponent === "OperationDetailsAssignment"
    ) {
      if (operationStepNo == 5) {
        return (
          <Card className="addNewSetData">
            <CardBody>
              <Row>
                <div key={"Form-Accordion"} className={"col-md-" + 6}>
                  <RenderFields
                    field={{
                      width: 4,
                      name: "smpl_filter_lab",
                      label: "Assign Lab",
                      type: "select",
                      customOptions: labDropDownOptions,
                      fieldWidth: 50,
                      isCustomOptions: true,
                    }}
                    sectionIndex={sectionIndex}
                    fieldIndex={1 * 100 + 1}
                    formData={extraFormData}
                    handleFieldChange={extraFieldChange}
                    formErrors={formErrors} // Pass formErrors to RenderFields
                    ///for render table only
                    renderTable={true}
                    tableIndex={sectionIndex}
                    customName={""}
                    masterOptions={updatedMasterOptions}
                    exludeOptions={selectedOptions}
                  />
                </div>
              </Row>
            </CardBody>
          </Card>
        );
      } else if (operationStepNo == 3) {
        if (!isOPSStep3Filter) {
          return (
            <div key={"Form-Accordion"} className={"col-md-" + 6}>
              <RenderFields
                field={{
                  width: 4,
                  name: "smpl_set_smpljson",
                  label: "Samples",
                  type: "select",
                  options: [],
                  required: true,
                  fieldWidth: 50,
                  multiple: true,
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
                masterOptions={updatedMasterOptions}
                exludeOptions={selectedOptions}
              />
            </div>
          );
        } else {
          return (
            <Card className="addNewSetData">
              <CardBody>
                <Row>
                  <div key={"Form-Accordion"} className={"col-md-" + 6}>
                    <RenderFields
                      field={{
                        width: 4,
                        name: "smpl_filter_lab",
                        label: "Assign Lab",
                        type: "select",
                        customOptions: labDropDownOptions,
                        fieldWidth: 50,
                        isCustomOptions: true,
                        readOnly: parameterDataTable.length > 0
                      }}
                      sectionIndex={sectionIndex}
                      fieldIndex={1 * 100 + 1}
                      formData={extraFormData}
                      handleFieldChange={extraFieldChange}
                      formErrors={formErrors} // Pass formErrors to RenderFields
                      ///for render table only
                      renderTable={true}
                      tableIndex={sectionIndex}
                      customName={""}
                      masterOptions={updatedMasterOptions}
                      exludeOptions={selectedOptions}
                    />
                  </div>

                  <div key={"Form-Accordion"} className={"col-md-" + 6}>
                    <RenderFields
                      field={{
                        width: 4,
                        name: "smpl_filter_lot_composite",
                        label: "Composite / Lot",
                        type: "select",
                        options: ["Composite", "Lot", "Singular Composite"],
                        fieldWidth: 50,
                        readOnly: parameterDataTable.length > 0
                      }}
                      sectionIndex={sectionIndex}
                      fieldIndex={1 * 100 + 1}
                      formData={extraFormData}
                      handleFieldChange={extraFieldChange}
                      formErrors={formErrors} // Pass formErrors to RenderFields
                      ///for render table only
                      renderTable={true}
                      tableIndex={sectionIndex}
                      customName={""}
                      masterOptions={updatedMasterOptions}
                      exludeOptions={selectedOptions}
                    />
                  </div>
                </Row>
              </CardBody>
            </Card>
          );
        }
      }
    } else {
      return null;
    }
  };

  const handleAssignFailedClose = () => {
    setIsLabAssignFailed(false)
  }
  const handleAssignFailedConfirm = () => {
    const updatedExtraFormData = { ...extraFormData };
    if (!updatedExtraFormData[sectionIndex]) {
      updatedExtraFormData[sectionIndex] = {};
    }
    updatedExtraFormData[sectionIndex]["smpl_filter_lab"] = assignLabId;
    setExtraFormData(updatedExtraFormData);

    const updatedFormData = { ...customFormData };
    updatedFormData[sectionIndex]["smpl_set_groupjson"] = parameterDataTable[AssignLabRowIndex].smpl_set_groupjson;
    updatedFormData[sectionIndex]["smpl_set_groupjson_name"] = parameterDataTable[AssignLabRowIndex].smpl_set_groupjson_name;
    updatedFormData[sectionIndex]["smpl_filter_lab"] = assignLabId;
    parameterDataTable[AssignLabRowIndex].groupJsonParameter.filter((groupParam, gpindex) => {
      // if (failedParameters.find((singleparan) => singleparan.param_name === groupParam.param_name)) {
      //   return false;
      // }
      let basiData = [];
      let basiDataName = [];
      groupParam.basis.map((basis) => {
        basiData.push(basis.basis_id);
        basiDataName.push(basis.basis_code);
      });
      updatedFormData[sectionIndex]["smpl_set_basisjson_" + gpindex] =
        basiData;
      updatedFormData[sectionIndex][
        "smpl_set_basisjson_name_" + gpindex
      ] = basiDataName;
      updatedFormData[sectionIndex][
        "smpl_set_testmethodjson_" + gpindex
      ] = groupParam?.standards[0]?.std_id;
      updatedFormData[sectionIndex][
        "smpl_set_testmethodjson_name_" + gpindex
      ] = groupParam?.standards[0]?.std_name;
      updatedFormData[sectionIndex]["smpl_set_unit_" + gpindex] =
        groupParam?.param_unit;
    });
    setTimeout(() => {
      setCustomFormData(updatedFormData);
    }, 10);
    moveParamDetails(AssignLabRowIndex)
    setIsLabAssignFailed(false)
  }
  const handleGetFaileLabsData = () => {
    return (<>
      <Card className="Scrollable">
        <CardBody>
          <CardTitle tag="h5">Below parameter and test methods are not applicable for assign to you have selected lab,So you want to change it?</CardTitle>

          <table className="table table-white responsive borderless no-wrap align-middle renderTable rendertableAssignment">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Parameter</th>
                <th>Test Method Name</th>
              </tr>
            </thead>
            <tbody>
              {
                failedParameters.map((singleData, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{singleData?.param_name}</td>
                    <td>{singleData?.std_name}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>

        </CardBody>
      </Card>
    </>)
  }

  return (
    <div key={sectionIndex} className="row my-2">
      <ConfirmationModal isOpen={isLabAssignFailed} handleClose={handleAssignFailedClose} handleConfirm={handleAssignFailedConfirm} popupMessage={handleGetFaileLabsData()} popupHeading={"Assign Lab Failed"} popbuttons={{ no: "Cancel", yes: "Yes" }} />
      {operationStepNo == 5 && getSingleCommonfield()}
      {sampleDataTable.length > 0 && (
        <Card className="Scrollable addNewSetData ">
          <CardBody>
            <CardTitle tag="h5">{section.title}</CardTitle>

            <table className="table table-white responsive borderless no-wrap align-middle renderTable renderTableSetwise rendertableAssignment">
              <thead>
                <tr>
                  {!isSingleSetOnly && <th>Set No.</th>}
                  {operationStepNo == 3 && <th>Lab Name</th>}
                  {(moduleType !== "jobinstruction" ||
                    (moduleType === "jobinstruction" &&
                      useForComponent === "OperationDetailsAssignment")) && (
                      <th>Samples</th>
                    )}
                  {section.vesselGroupParameter && <th>Lab</th>}
                  {["jobinstruction"].includes(moduleType) && <th>Type</th>}
                  {section.headers.map((header, headerIndex) =>
                    header.name != "is_group_param" ? (
                      ["smpl_set_testmethodjson"].includes(header.name) &&
                        GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) !== "TPBPL" ? (
                        <>
                          <th key={"groups-header" + headerIndex}>Parameter</th>
                          <th key={"groups-header" + headerIndex}>
                            {header.label}
                          </th>
                        </>
                      ) : GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) === "TPBPL" &&
                        header.label === "Basis" ? null : (
                        <th key={"groups-header" + headerIndex}>
                          {GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) === "TPBPL"
                            ? header.label === "Is Groups or Parameter"
                              ? "Discipline Or Group"
                              : header.label === "Groups of Parameter"
                                ? "Parameter"
                                : header.label
                            : header.label}
                        </th>
                      )
                    ) : null
                  )}
                  {moduleType === "jobinstruction" &&
                    useForComponent === "OperationDetailsAssignment" &&
                    operationStepNo == "5" && <th>Select to Send</th>}
                  {
                    moduleType === "jobinstruction" &&
                      useForComponent ===
                      "OperationDetailsAssignment" &&
                      // operationStepNo == "5" && (
                      ['3', '5'].includes(operationStepNo) ? (<th>JRF / TPI</th>) : null
                  }
                  {action != "View" &&
                    !formData[0].jrf_is_ops &&
                    operationStepNo != 5 ? (
                    <th>Action</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {finalParamDataSort.map((singleSetData, setIndex) =>
                  singleSetData.map((paramData, setParamIndex) => {
                    let groupCount = 0;
                    getSingleParamData(sampleDataTable[setIndex], "Group").map(
                      (singleGroup) => {
                        groupCount += singleGroup.parameters.length;
                      }
                    );
                    let mainRowsPan = 1;
                    mainRowsPan =
                      getSingleParamData(sampleDataTable[setIndex], "Parameter")
                        .length +
                      getSingleParamData(sampleDataTable[setIndex], "Group")
                        .length +
                      groupCount;
                    return section.rows.map((row, rowIndex2) => (
                      <>
                        <tr key={"rowIndex" + rowIndex2}
                        // className="border-top"
                        >
                          {setParamIndex == 0 && (
                            <React.Fragment>
                              {!isSingleSetOnly && <td rowSpan={mainRowsPan}>{setIndex + 1}</td>}
                              {operationStepNo == 3 && (
                                <td rowSpan={mainRowsPan}>
                                  {
                                    sampleDataTable[setIndex]?.lab_detail ? sampleDataTable[setIndex]?.lab_detail
                                      ?.lab_name + ` (${sampleDataTable[setIndex]?.lab_detail
                                        ?.lab_code})` : "External Results"
                                  }
                                </td>
                              )}
                              {(moduleType !== "jobinstruction" ||
                                (moduleType === "jobinstruction" &&
                                  useForComponent ===
                                  "OperationDetailsAssignment")) && (
                                  <td rowSpan={mainRowsPan}>
                                    {useForComponent ===
                                      "OperationDetailsAssignment"
                                      ? Array.isArray(
                                        sampleDataTable[setIndex][
                                        "jila_set_markjson"
                                        ]
                                      )
                                        ? getSelectedOptionName(
                                          [],
                                          masterOptions,
                                          "jila_set_markjson",
                                          sampleDataTable[setIndex][
                                          "jila_set_markjson"
                                          ],
                                          "jila_set_markjson"
                                        )
                                        : sampleDataTable[setIndex][
                                        "jila_set_markjson"
                                        ]
                                      : Array.isArray(
                                        sampleDataTable[setIndex][
                                        "smpl_set_smpljson"
                                        ]
                                      )
                                        ? getSelectedOptionName(
                                          [],
                                          masterOptions,
                                          "smpl_set_smpljson",
                                          sampleDataTable[setIndex][
                                          "smpl_set_smpljson"
                                          ],
                                          "smpl_set_smpljson"
                                        )
                                        : sampleDataTable[setIndex][
                                        "smpl_set_smpljson"
                                        ]}
                                  </td>
                                )}
                            </React.Fragment>
                          )}
                          {paramData.param_type === "Group" ? (
                            <>
                              {section.vesselGroupParameter && (
                                <td rowSpan={paramData.parameters.length + 1}>
                                  <RenderFields
                                    field={{
                                      width: 2,
                                      label: "",
                                      name:
                                        "lab_id_" +
                                        sampleDataTable[setIndex]["jila_id"],
                                      type: "select",
                                      options: [],
                                    }}
                                    sectionIndex={0}
                                    fieldIndex={1 * 100 + 1}
                                    formData={JRFTPIFormData}
                                    handleFieldChange={onJRFTPIChangeHandler}
                                    formErrors={formErrors} // Pass formErrors to RenderFields
                                    ///for render table only
                                    renderTable={true}
                                    tableIndex={0}
                                    customName={""}
                                    masterOptions={updatedMasterOptions}
                                    exludeOptions={selectedOptions}
                                  />
                                </td>
                              )}
                              {["jobinstruction"].includes(moduleType) && <td rowSpan={paramData.parameters.length + 1}>
                                Group
                              </td>}

                              <td rowSpan={paramData.parameters.length + 1}>
                                {paramData["group_name"]}
                              </td>
                            </>
                          ) : (
                            <>
                              {section.vesselGroupParameter && (
                                <td>
                                  <RenderFields
                                    field={{
                                      width: 2,
                                      label: "",
                                      name:
                                        "lab_id_" +
                                        sampleDataTable[setIndex]["jila_id"],
                                      type: "select",
                                      options: [],
                                    }}
                                    sectionIndex={0}
                                    fieldIndex={1 * 100 + 1}
                                    formData={JRFTPIFormData}
                                    handleFieldChange={onJRFTPIChangeHandler}
                                    formErrors={formErrors} // Pass formErrors to RenderFields
                                    ///for render table only
                                    renderTable={true}
                                    tableIndex={0}
                                    customName={""}
                                    masterOptions={updatedMasterOptions}
                                    exludeOptions={selectedOptions}
                                  />
                                </td>
                              )}
                              {["jobinstruction"].includes(moduleType) && <td>Parameter</td>}
                              {
                                row.map((cell, cellIndex) =>
                                  cell.subname != "group_id" &&
                                    cell.subname != "isGroup" ? (
                                    ["smpl_set_testmethodjson"].includes(
                                      cell.name
                                    ) ? (
                                      <>
                                        {GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) !== "TPBPL" && (
                                          <td>--</td>
                                        )}
                                        <td key={"cellIndex" + cellIndex}>
                                          {cell.subname == "basis"
                                            ? paramData[cell.subname].map(
                                              (basecode, index) =>
                                                (index != 0 ? "," : "") +
                                                basecode.basis_code
                                            )
                                            : paramData[cell.subname]}
                                        </td>
                                      </>
                                    ) : GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) === "TPBPL" &&
                                      cell.subname === "basis" ? null : (
                                      <td key={"cellIndex" + cellIndex}>
                                        {cell.subname == "basis"
                                          ? paramData[cell.subname].map(
                                            (basecode, index) =>
                                              (index != 0 ? "," : "") +
                                              basecode.basis_code
                                          )
                                          : paramData[cell.subname]}
                                      </td>
                                    )
                                  ) : null
                                )
                              }
                              {setParamIndex == 0 &&
                                moduleType === "jobinstruction" &&
                                useForComponent ===
                                "OperationDetailsAssignment" &&
                                // operationStepNo == "5" && (
                                ['3', '5'].includes(operationStepNo) && (
                                  <td rowSpan={mainRowsPan}>
                                    {(!sampleDataTable[setIndex][
                                      "jila_for_tpi"
                                    ] &&
                                      !sampleDataTable[setIndex][
                                      "jila_for_jrf"
                                      ] &&
                                      action !== "opsView" && (
                                        <RenderFields
                                          field={{
                                            width: 2,
                                            label: "",
                                            name:
                                              "is_set_for_JRF_" +
                                              sampleDataTable[setIndex][
                                              "jila_id"
                                              ],
                                            defaultValue: "Yes",
                                            type: "checkbox",
                                            options: ["Yes"],
                                            isOptionLabelNotShow: true,
                                          }}
                                          sectionIndex={0}
                                          fieldIndex={1 * 100 + 1}
                                          formData={JRFTPIFormData}
                                          handleFieldChange={
                                            onJRFTPIChangeHandler
                                          }
                                          formErrors={formErrors} // Pass formErrors to RenderFields
                                          ///for render table only
                                          renderTable={true}
                                          tableIndex={0}
                                          customName={""}
                                          masterOptions={updatedMasterOptions}
                                          exludeOptions={selectedOptions}
                                        />
                                      )) ||
                                      (sampleDataTable[setIndex]["jila_for_tpi"]
                                        ? "TPI-" + sampleDataTable[setIndex]?.[
                                        "tpi_number"
                                        ]
                                        : "JRF-" + sampleDataTable[setIndex][
                                        "jrf_number"
                                        ])}
                                  </td>
                                )}
                              {setParamIndex == 0 &&
                                action != "View" &&
                                action != "opsView" &&
                                operationStepNo != 5 &&
                                //  !(sampleDataTable[setIndex][
                                //   "jila_for_tpi"
                                // ] ||
                                //   sampleDataTable[setIndex][
                                //   "jila_for_jrf"
                                //   ]) && 
                                (
                                  <td rowSpan={mainRowsPan}>
                                    {
                                      !(sampleDataTable[setIndex][
                                        "jila_for_tpi"
                                      ] ||
                                        sampleDataTable[setIndex][
                                        "jila_for_jrf"
                                        ]) ? (<>
                                          <div className="actionColumn">
                                            <ActionOptionsTable
                                              actions={
                                                (editableIndex === 0 &&
                                                  setIndex === 0) ||
                                                  editableIndex === setIndex
                                                  ? EditAction
                                                  : editableIndex === 0 ||
                                                    editableIndex
                                                    ? []
                                                    : MainAction
                                              }
                                              onActionHandleClick={
                                                onActionHandleClick
                                              }
                                              setPopupIndex={setPopupIndex}
                                              useFor="Edit"
                                              editableIndex={editableIndex}
                                              popupIndex={popupIndex}
                                              popupMessages={popupMessages}
                                              saveClicked={saveClicked}
                                              tableIndex={setIndex}
                                              isCustomSave={0}
                                              setEditableIndex={setEditableIndex}
                                              getInwardTabledata={
                                                getInwardTabledata
                                              }
                                              simpleInwardId={simpleInwardId}
                                              moduleType={moduleType}
                                            />
                                          </div>
                                        </>) : null
                                    }
                                  </td>
                                )}


                            </>
                          )}
                        </tr>
                        {paramData.param_type === "Group" &&
                          paramData.parameters.map((basecode, index) => (
                            <tr>
                              {row.map((cell, cellIndex) =>
                                cell.subname != "group_id" &&
                                  cell.subname != "isGroup" &&
                                  cell.subname != "param_name" ? (
                                  ["smpl_set_testmethodjson"].includes(
                                    cell.name
                                  ) ? (
                                    <>
                                      <td>{basecode.param_name}</td>
                                      <td key={"cellIndex" + cellIndex}>
                                        {basecode.standards.map(
                                          (std, i) =>
                                            (i != 0 ? "," : "") + std.std_name
                                        )}
                                      </td>
                                    </>
                                  ) : cell.name === "smpl_set_unit" ? (
                                    <td>{basecode.param_unit}</td>
                                  ) : (
                                    <td key={"cellIndex" + cellIndex}>
                                      {cell.subname == "basis" ||
                                        cell.subname == "std_name"
                                        ? cell.subname == "basis"
                                          ? basecode.basis.map(
                                            (base, i) =>
                                              (i != 0 ? "," : "") +
                                              base.basis_code
                                          )
                                          : // : basecode.standards.std_name
                                          basecode.standards.map(
                                            (std, i) =>
                                              (i != 0 ? "," : "") +
                                              std.std_name
                                          )
                                        : cell.subname == "param_name"
                                          ? paramData["group_name"]
                                          : paramData[cell.subname]}
                                    </td>
                                  )
                                ) : null
                              )}
                              {setParamIndex == 0 &&
                                index == 0 &&
                                moduleType === "jobinstruction" &&
                                useForComponent ===
                                "OperationDetailsAssignment" &&
                                // operationStepNo == "5" && (
                                ["3", "5"].includes(operationStepNo) && (
                                  <td rowSpan={mainRowsPan - 1}>
                                    {(!sampleDataTable[setIndex][
                                      "jila_for_tpi"
                                    ] &&
                                      !sampleDataTable[setIndex][
                                      "jila_for_jrf"
                                      ] &&
                                      action !== "opsView" && (
                                        <RenderFields
                                          field={{
                                            width: 2,
                                            label: "",
                                            name:
                                              "is_set_for_JRF_" +
                                              sampleDataTable[setIndex][
                                              "jila_id"
                                              ],
                                            defaultValue: "Yes",
                                            type: "checkbox",
                                            options: ["Yes"],
                                            isOptionLabelNotShow: true,
                                          }}
                                          sectionIndex={0}
                                          fieldIndex={1 * 100 + 1}
                                          formData={JRFTPIFormData}
                                          handleFieldChange={
                                            onJRFTPIChangeHandler
                                          }
                                          formErrors={formErrors} // Pass formErrors to RenderFields
                                          ///for render table only
                                          renderTable={true}
                                          tableIndex={0}
                                          customName={""}
                                          masterOptions={updatedMasterOptions}
                                          exludeOptions={selectedOptions}
                                        />
                                      )) ||
                                      (sampleDataTable[setIndex]["jila_for_tpi"]
                                        ? "TPI-" + sampleDataTable[setIndex]?.[
                                        "tpi_number"
                                        ]
                                        : "JRF-" + sampleDataTable[setIndex][
                                        "jrf_number"
                                        ])}
                                  </td>
                                )}
                              {setParamIndex == 0 &&
                                index == 0 &&
                                action != "View" &&
                                action != "opsView" &&
                                operationStepNo != 5 &&
                                // !(sampleDataTable[setIndex][
                                //   "jila_for_tpi"
                                // ] ||
                                //   sampleDataTable[setIndex][
                                //   "jila_for_jrf"
                                //   ]) && 
                                (
                                  <td rowSpan={mainRowsPan - 1}>
                                    {
                                      !(sampleDataTable[setIndex][
                                        "jila_for_tpi"
                                      ] ||
                                        sampleDataTable[setIndex][
                                        "jila_for_jrf"
                                        ]) ?
                                        (<div className="actionColumn">
                                          <ActionOptionsTable
                                            actions={
                                              (editableIndex === 0 &&
                                                setIndex === 0) ||
                                                editableIndex === setIndex
                                                ? EditAction
                                                : editableIndex === 0 ||
                                                  editableIndex
                                                  ? []
                                                  : MainAction
                                            }
                                            onActionHandleClick={
                                              onActionHandleClick
                                            }
                                            setPopupIndex={setPopupIndex}
                                            useFor="Edit"
                                            editableIndex={editableIndex}
                                            popupIndex={popupIndex}
                                            popupMessages={popupMessages}
                                            saveClicked={saveClicked}
                                            tableIndex={setIndex}
                                            isCustomSave={0}
                                            setEditableIndex={setEditableIndex}
                                            getInwardTabledata={getInwardTabledata}
                                            simpleInwardId={simpleInwardId}
                                            moduleType={moduleType}
                                          />
                                        </div>) : null
                                    }
                                  </td>
                                )}

                            </tr>
                          ))}
                      </>
                    ));
                  })
                )}
              </tbody>
            </table>

          </CardBody>
        </Card>
      )}

      {formData[0].jrf_is_ops &&
        !formData[0]?.sample_set_data?.length &&
        moduleType === "GroupAssignment" && (
          <div className="button_container">
            <button
              type="button"
              className="submitBtn btn btn-primary"
              onClick={() => {
                addNewSampleSetDetails();
              }}
            >
              Submit Set
            </button>
          </div>
        )}
      {moduleType !== "sampleverification" && action != "View" && operationStepNo != 5 && moduleType === "jobinstruction" && !(operationStepNo == 3 && action === "opsView") && getSingleCommonfield(1)}
      {isDisplayNewAddOption &&
        moduleType !== "sampleverification" &&
        action != "View" &&
        operationStepNo != 5 &&
        !(operationStepNo == 3 && action === "opsView") && (
          <>
            <Card
              className="Scrollable addNewSetData"
              style={{ position: "relative" }}
            >
              <CardBody>
                <CardTitle tag="h5">{section.title}</CardTitle>
                <CardSubtitle
                  className="mb-2 text-muted"
                  tag="h6"
                ></CardSubtitle>
                {isLoading && <Loader />}
                {getSingleCommonfield()}
                <table className="table table-white responsive borderless no-wrap align-middle renderTable rendertableAssignment">
                  {moduleType == "jobinstruction" && !useForComponent && tableData.length > 0 ? null : <thead>
                    <tr>
                      <th>Sr. No.</th>
                      {section.vesselGroupParameter && <th>Lab</th>}
                      {section.headers.map((header, headerIndex) =>
                        ["smpl_set_testmethodjson"].includes(header.name) &&
                          GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) !== "TPBPL" ? (
                          <>
                            <th
                              key={"headerIndex" + headerIndex}
                            >
                              Parameter
                            </th>
                            <th key={"headerIndex" + headerIndex}>
                              {header.label}
                            </th>
                          </>
                        ) : GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) === "TPBPL" &&
                          header.label === "Basis" ? null : (
                          <th key={"headerIndex" + headerIndex}>
                            {GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) === "TPBPL"
                              ? header.label === "Is Groups or Parameter"
                                ? "Discipline Or Group"
                                : header.label === "Groups of Parameter"
                                  ? "Parameter"
                                  : header.label
                              : header.label}
                          </th>
                        )
                      )}
                      {action != "View" ? <th>Action</th> : null}
                    </tr>
                  </thead>}
                  <tbody>
                    {parameterDataTable.map((paramData, rowIndex) =>
                      section.rows.map((row, rowIndex2) =>
                        paramData.is_group_param == "Group" ? (
                          <>
                            <tr
                              key={"rowIndex" + rowIndex}
                            // className="border-top"
                            >
                              <td
                                rowSpan={
                                  paramData.groupJsonParameter.length + 1
                                }
                              >
                                {rowIndex + 1}
                              </td>
                              {section.vesselGroupParameter && (
                                <td
                                  rowSpan={
                                    paramData.groupJsonParameter.length + 1
                                  }
                                >
                                  <RenderFields
                                    field={{
                                      width: 2,
                                      label: "",
                                      name: paramData.labIdSaved ? "lab_id_" + paramData?.ops_exec_la_id : "lab_id_" + rowIndex,
                                      type: paramData.labIdSaved ? "label" : "select",
                                      options: [],
                                      readOnly: paramData.labIdSaved,
                                      isStaticValue: paramData.labIdSaved,
                                      value: paramData.labIdSaved ? paramData?.lab_detail?.lab_name : ""
                                    }}
                                    sectionIndex={0}
                                    fieldIndex={1 * 100 + 1}
                                    formData={extraFormData}
                                    handleFieldChange={(indexNo, name, value) => {
                                      extraFieldChange(indexNo, name, value)
                                      getOPS3StepCheckLabWiseParameters(paramData.smpl_set_groupjson, formData?.[0]?.fk_commodityid, value, rowIndex, parameterDataTable, setParameterDataTable, beforeLabWiseparameterDataTable, operationStepNo)
                                    }}
                                    formErrors={formErrors} // Pass formErrors to RenderFields
                                    ///for render table only
                                    renderTable={true}
                                    tableIndex={0}
                                    customName={""}
                                    masterOptions={updatedMasterOptions}
                                    exludeOptions={selectedOptions}
                                  />
                                </td>
                              )}
                              {row.map((cell, cellIndex) =>
                                cell.name == "smpl_set_paramjson" ||
                                  cell.name == "smpl_set_groupjson" ? (
                                  (cell.name == "smpl_set_groupjson" &&
                                    paramData.is_group_param == "Group") ||
                                    (cell.name == "smpl_set_paramjson" &&
                                      paramData.is_group_param == "Parameter") ? (
                                    <td
                                      key={"cellIndex" + cellIndex}
                                      rowSpan={
                                        paramData.groupJsonParameter.length + 1
                                      }
                                    >
                                      {paramData[cell.name + "_name"]}
                                    </td>
                                  ) : null
                                ) : [
                                  "smpl_set_testmethodjson",
                                  "smpl_set_basisjson",
                                  "smpl_set_unit",
                                ].includes(cell.name) ? null : (
                                  <td
                                    key={"cellIndex" + cellIndex}
                                    rowSpan={
                                      paramData.groupJsonParameter.length + 1
                                    }
                                  >
                                    {paramData[cell.name + "_name"] ??
                                      paramData[cell.name]}
                                  </td>
                                )
                              )}
                            </tr>
                            {paramData.groupJsonParameter.map(
                              (groupParam, gpIndex) => (
                                <tr
                                  key={"rowIndex" + rowIndex}
                                // className="border-top"
                                >
                                  {row.map((cell, cellIndex) =>
                                    [
                                      "smpl_set_testmethodjson",
                                      "smpl_set_basisjson",
                                      "smpl_set_unit",
                                    ].includes(cell.name) ? (
                                      ["smpl_set_testmethodjson"].includes(
                                        cell.name
                                      ) ? (
                                        <>
                                          <td key={"cellIndex" + cellIndex}>
                                            {groupParam.param_name}
                                          </td>
                                          <td key={"cellIndex" + cellIndex}>
                                            {groupParam.standards.map(
                                              (std, i) =>
                                                (i != 0 ? "," : "") +
                                                std.std_name
                                            )}
                                          </td>
                                        </>
                                      ) : cell.name === "smpl_set_unit" ? (
                                        <td key={"cellIndex" + cellIndex}>
                                          {paramData[cell.name + "_" + gpIndex]}
                                        </td>
                                      ) : (
                                        <td key={"cellIndex" + cellIndex}>
                                          {groupParam.basis.map(
                                            (base, i) =>
                                              (i != 0 ? "," : "") +
                                              base.basis_code
                                          )}
                                        </td>
                                      )
                                    ) : null
                                  )}
                                  {gpIndex == 0 && (
                                    <td
                                      rowSpan={
                                        paramData.groupJsonParameter.length
                                      }
                                    >
                                      <div className="actionColumn">
                                        {action != "View" &&
                                          action !== "opsView" ? (
                                          <div className="actionOptions">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                moveParamDetails(
                                                  rowIndex,
                                                  paramData.labIdSaved,
                                                  paramData.ops_exec_la_id
                                                );
                                              }}
                                              className="invisible-button"
                                              aria-label={"Delete"}
                                            >
                                              {/* <i
                                                className={"bi bi-trash"}
                                                title={"Delete"}
                                              ></i> */}
                                              {getSvgAccordingToCondition({ text: "Delete" })}

                                            </button>
                                            {section.vesselGroupParameter &&
                                              !paramData.labIdSaved &&
                                              action !== "opsView" && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    handleAssignLabToParameter(
                                                      setParameterDataTable,
                                                      parameterDataTable,
                                                      rowIndex,
                                                      setIsLoading,
                                                      setIsOverlayLoader,
                                                      formData,
                                                      OperationTypeID,
                                                      extraFormData,
                                                      user,
                                                      "",
                                                      setExtraFormData,
                                                      setIsLabAssignFailed,
                                                      setFailedParameters,
                                                      setAssignLabRowIndex,
                                                      setAssignedLabId
                                                    );
                                                  }}
                                                  className="invisible-button"
                                                  aria-label={"Save"}
                                                >
                                                  <i
                                                    className={"bi bi-floppy2"}
                                                    title={"Save"}
                                                  ></i>
                                                </button>
                                              )}
                                          </div>
                                        ) : null}
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              )
                            )}
                          </>
                        ) : (
                          <tr
                            key={"rowIndex" + rowIndex}
                          // className="border-top"
                          >
                            <td>{rowIndex + 1}</td>
                            {section.vesselGroupParameter && (
                              <td>
                                <RenderFields
                                  field={{
                                    width: 2,
                                    label: "",
                                    name: paramData.labIdSaved ? "lab_id_" + paramData?.ops_exec_la_id : "lab_id_" + rowIndex,
                                    type: paramData.labIdSaved ? "label" : "select",
                                    options: [],
                                    readOnly: paramData.labIdSaved,
                                    isStaticValue: paramData.labIdSaved,
                                    value: paramData.labIdSaved ? paramData?.lab_detail?.lab_name : ""
                                  }}
                                  sectionIndex={0}
                                  fieldIndex={1 * 100 + 1}
                                  formData={extraFormData}
                                  handleFieldChange={extraFieldChange}
                                  formErrors={formErrors} // Pass formErrors to RenderFields
                                  ///for render table only
                                  renderTable={true}
                                  tableIndex={0}
                                  customName={""}
                                  masterOptions={updatedMasterOptions}
                                  exludeOptions={selectedOptions}
                                />
                              </td>
                            )}
                            {row.map((cell, cellIndex) =>
                              cell.name == "smpl_set_paramjson" ||
                                cell.name == "smpl_set_groupjson" ? (
                                (cell.name == "smpl_set_groupjson" &&
                                  paramData.is_group_param == "Group") ||
                                  (cell.name == "smpl_set_paramjson" &&
                                    paramData.is_group_param == "Parameter") ? (
                                  <td key={"cellIndex" + cellIndex}>
                                    {paramData[cell.name + "_name"]}
                                  </td>
                                ) : null
                              ) : cell.name == "smpl_set_unit" ? (
                                <td key={"cellIndex" + cellIndex}>
                                  {paramData[cell.name]}
                                </td>
                              ) : paramData.is_group_param == "Group" &&
                                [
                                  "smpl_set_testmethodjson",
                                  "smpl_set_basisjson",
                                ].includes(cell.name) ? (
                                ["smpl_set_testmethodjson"].includes(
                                  cell.name
                                ) ? (
                                  <>
                                    <td key={"cellIndex" + cellIndex}>
                                      {paramData.groupJsonParameter.map(
                                        (param) => param.param_name
                                      )}
                                    </td>
                                    <td key={"cellIndex" + cellIndex}>
                                      {paramData.groupJsonParameter.map(
                                        (param, index) =>
                                          param.standards.map(
                                            (std, i) =>
                                              (index != 0 || i != 0
                                                ? ","
                                                : "") + std.std_name
                                          )
                                      )}
                                    </td>
                                  </>
                                ) : (
                                  <td key={"cellIndex" + cellIndex}>
                                    {paramData.groupJsonParameter.map(
                                      (param, index) =>
                                        param.basis.map(
                                          (base, i) =>
                                            (index != 0 || i != 0 ? "," : "") +
                                            base.basis_code
                                        )
                                    )}
                                  </td>
                                )
                              ) : ["smpl_set_testmethodjson"].includes(
                                cell.name
                              ) ? (
                                <>
                                  {GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) !== "TPBPL" && (
                                    <td key={"cellIndex" + cellIndex}>--</td>
                                  )}
                                  <td key={"cellIndex" + cellIndex}>
                                    {paramData[cell.name + "_name"]}
                                  </td>
                                </>
                              ) : GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) === "TPBPL" &&
                                cell.name === "smpl_set_basisjson" ? null : (
                                <td key={"cellIndex" + cellIndex}>
                                  {paramData[cell.name + "_name"] ??
                                    paramData[cell.name]}
                                </td>
                              )
                            )}
                            <td>
                              <div className="actionColumn">
                                {action != "View" && action !== "opsView" ? (
                                  <div className="actionOptions">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        moveParamDetails(
                                          rowIndex,
                                          paramData.labIdSaved,
                                          paramData.ops_exec_la_id
                                        );
                                      }}
                                      className="invisible-button"
                                      aria-label={"Delete"}
                                    >
                                      {/* <i
                                        className={"bi bi-trash"}
                                        title={"Delete"}
                                      ></i> */}
                                      {getSvgAccordingToCondition({ text: "Delete" })}

                                    </button>
                                    {section.vesselGroupParameter &&
                                      !paramData.labIdSaved &&
                                      action !== "opsView" && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleAssignLabToParameter(
                                              setParameterDataTable,
                                              parameterDataTable,
                                              rowIndex,
                                              setIsLoading,
                                              setIsOverlayLoader,
                                              formData,
                                              OperationTypeID,
                                              extraFormData,
                                              user,
                                              "",
                                              setExtraFormData,
                                              setIsLabAssignFailed,
                                              setFailedParameters,
                                              setAssignLabRowIndex,
                                              setAssignedLabId
                                            );
                                          }}
                                          className="invisible-button"
                                          aria-label={"Save"}
                                        >
                                          <i
                                            className={"bi bi-floppy2"}
                                            title={"Save"}
                                          ></i>
                                        </button>
                                      )}
                                  </div>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    )}
                    {action !== "opsView" &&
                      section.rows.map((row, rowIndex) => {
                        return (
                          <tr
                            key={"rowIndex" + rowIndex}
                          // className="border-top"
                          >
                            <td>{moduleType == "jobinstruction" && !useForComponent && tableData.length > 0 ? '' : (rowIndex + 1 + parameterDataTable.length)}</td>
                            {section.vesselGroupParameter && <td>
                              <RenderFields
                                field={{
                                  width: 4,
                                  name: "smpl_filter_lab",
                                  label: "",
                                  type: "select",
                                  customOptions: labDropDownOptions,
                                  fieldWidth: 50,
                                  isCustomOptions: true,
                                }}
                                sectionIndex={sectionIndex}
                                fieldIndex={1 * 100 + 1}
                                formData={extraFormData}
                                handleFieldChange={extraFieldChange}
                                formErrors={formErrors} // Pass formErrors to RenderFields
                                ///for render table only
                                renderTable={true}
                                tableIndex={sectionIndex}
                                customName={""}
                                masterOptions={updatedMasterOptions}
                                exludeOptions={selectedOptions}
                              />
                            </td>}
                            {row.map((cell, cellIndex) => {
                              if (
                                GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) == "TPBPL" &&
                                cell.name === "is_group_param"
                              ) {
                                cell.type = "label";
                              }
                              if (
                                GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) == "TPBPL" &&
                                cell.name === "smpl_set_basisjson"
                              ) {
                                return null;
                              }
                              return cell.name == "smpl_set_paramjson" ||
                                cell.name == "smpl_set_groupjson" ? (
                                (cell.name == "smpl_set_groupjson" &&
                                  customFormData[sectionIndex].is_group_param ==
                                  "Group") ||
                                  (cell.name == "smpl_set_paramjson" &&
                                    customFormData[sectionIndex].is_group_param ==
                                    "Parameter") ? (
                                  <td
                                    key={"cellIndex" + cellIndex}
                                    className={
                                      cell.type === "radio"
                                        ? "radio_adjust"
                                        : null
                                    }
                                  >
                                    <RenderFields
                                      field={cell}
                                      sectionIndex={sectionIndex}
                                      fieldIndex={rowIndex * 100 + cellIndex}
                                      formData={customFormData}
                                      handleFieldChange={onCustomChangeHandler}
                                      formErrors={formErrors} // Pass formErrors to RenderFields
                                      ///for render table only
                                      renderTable={true}
                                      tableIndex={rowIndex}
                                      customName={cell.name}
                                      masterOptions={updatedMasterOptions}
                                      from="Table"
                                      exludeOptions={getSelectedOptions(
                                        cell.name
                                      )}
                                    />
                                  </td>
                                ) : null
                              ) : !(
                                customFormData[sectionIndex].is_group_param ==
                                "Group" &&
                                [
                                  "smpl_set_testmethodjson",
                                  "smpl_set_basisjson",
                                  "smpl_set_unit",
                                ].includes(cell.name)
                              ) ? (
                                ["smpl_set_testmethodjson"].includes(
                                  cell.name
                                ) ? (
                                  <>
                                    {GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) !== "TPBPL" && (
                                      <td>-</td>
                                    )}
                                    <td
                                      key={"cellIndex" + cellIndex}
                                      className={
                                        cell.name === "is_group_param"
                                          ? "radio_adjust"
                                          : null
                                      }
                                    >
                                      {" "}
                                      <RenderFields
                                        field={cell}
                                        sectionIndex={sectionIndex}
                                        fieldIndex={rowIndex * 100 + cellIndex}
                                        formData={customFormData}
                                        handleFieldChange={
                                          onCustomChangeHandler
                                        }
                                        formErrors={formErrors} // Pass formErrors to RenderFields
                                        ///for render table only
                                        renderTable={true}
                                        tableIndex={rowIndex}
                                        customName={cell.name}
                                        masterOptions={updatedMasterOptions}
                                        from="Table"
                                      />
                                    </td>
                                  </>
                                ) : (
                                  <td
                                    key={"cellIndex" + cellIndex}
                                    className={
                                      cell.type === "radio"
                                        ? "radio_adjust"
                                        : null
                                    }
                                  >
                                    {" "}
                                    <RenderFields
                                      field={cell}
                                      sectionIndex={sectionIndex}
                                      fieldIndex={rowIndex * 100 + cellIndex}
                                      formData={customFormData}
                                      handleFieldChange={onCustomChangeHandler}
                                      formErrors={formErrors} // Pass formErrors to RenderFields
                                      ///for render table only
                                      renderTable={true}
                                      tableIndex={rowIndex}
                                      customName={cell.name}
                                      masterOptions={updatedMasterOptions}
                                      from="Table"
                                    />
                                  </td>
                                )
                              ) : ["smpl_set_testmethodjson"].includes(
                                cell.name
                              ) ? (
                                <>
                                  <td>
                                    {groupParameteres.map(
                                      (groupParam, gpindex) => (
                                        <RenderFields
                                          field={{
                                            name: "smpl_param",
                                            subname: "smpl_param",
                                            type: "label",
                                            required: true,
                                            fieldWidth: 100,
                                            errorlabel: "Test Method",
                                            isStaticValue: true,
                                            value: groupParam.param_name,
                                          }}
                                          sectionIndex={sectionIndex}
                                          fieldIndex={rowIndex * 100 + gpindex}
                                          formData={customFormData}
                                          handleFieldChange={
                                            onCustomChangeHandler
                                          }
                                          formErrors={formErrors} // Pass formErrors to RenderFields
                                          ///for render table only
                                          renderTable={true}
                                          tableIndex={rowIndex}
                                          customName={"smpl_param_" + gpindex}
                                          masterOptions={updatedMasterOptions}
                                          from="Table"
                                        />
                                      )
                                    )}
                                  </td>
                                  <td>
                                    {getGroupParameterElement(
                                      cell,
                                      rowIndex,
                                      cellIndex,
                                      "standard"
                                    )}
                                  </td>
                                </>
                              ) : ["smpl_set_unit"].includes(cell.name) ? (
                                <td>
                                  {groupParameteres.map(
                                    (groupParam, gpindex) => (
                                      <RenderFields
                                        field={{
                                          name: "smpl_set_unit",
                                          subname: "smpl_set_unit",
                                          type: "select",
                                          required: true,
                                          fieldWidth: 100,
                                          errorlabel: "Test Method",
                                        }}
                                        sectionIndex={sectionIndex}
                                        fieldIndex={rowIndex * 100 + gpindex}
                                        formData={customFormData}
                                        handleFieldChange={
                                          onCustomChangeHandler
                                        }
                                        formErrors={formErrors} // Pass formErrors to RenderFields
                                        ///for render table only
                                        renderTable={true}
                                        tableIndex={rowIndex}
                                        customName={"smpl_set_unit_" + gpindex}
                                        masterOptions={updatedMasterOptions}
                                        from="Table"
                                      />
                                    )
                                  )}
                                </td>
                              ) : GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) !== "TPBPL" ? (
                                <td className={"groupBasisTd"}>
                                  {getGroupParameterElement(
                                    cell,
                                    rowIndex,
                                    cellIndex,
                                    "basis"
                                  )}
                                </td>
                              ) : null;
                            })}
                            <td>
                              {customFormData[sectionIndex].is_group_param ==
                                "Group" &&
                                getGroupParameterElement(
                                  "",
                                  "",
                                  "",
                                  "deleteIcon"
                                )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>

                <div className="button_container">
                  {!section.vesselGroupParameter &&
                    editReordType !== "analysis" &&
                    parameterDataTable.length > 0 && (
                      <button
                        type="button"
                        className="submitBtn btn btn-primary"
                        onClick={() => {
                          addNewSampleSetDetails();
                        }}
                      >
                        Submit Set
                      </button>
                    )}
                  {action !== "opsView" && (
                    <button
                      type="button"
                      className="submitBtn btn btn-primary"
                      onClick={() => {
                        addNewParameterDetails();
                      }}
                    >
                      <i className="bi bi-plus-circle customAdd"></i> Add
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>
          </>
        )}
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
