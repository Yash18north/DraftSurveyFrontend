import React, { useEffect, useState } from "react";
import RenderFields from "./RenderFields";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

import {
  getsamplelabcodeApi,
  sampleInwardDetailsGetAPI,
} from "../../services/api";

import {
  GetTenantDetails,
  postDataFromApi,
} from "../../services/commonServices";
import ActionOptionsTable from "./ActionOptionsTable";
import { getFormatedDate, getLMSOperationActivity, getPlantOperations, getRakeOperations, getSelectedOptionName, getStackOperations, getTextWithouHtml, getTotalCountForTable, getTotalHoursInTimeFormat, getTotalValues, gettwoFieldsTotalValues, getVesselOperation } from "../../services/commonFunction";
import { assignmentPageHandleAction } from "./commonHandlerFunction/GroupAssignmentFunctions";
import { InwardPageHandleAction } from "./commonHandlerFunction/sampleInwardHandlerFunctions";
import { sampleVarificationDetailsBulkCreate, sampleVerificationHandler } from "./commonHandlerFunction/sampleVerificationHandlerFunctions";
import PropTypes from "prop-types";
import ModalInward from "./commonModalForms/modalInward";
import SampleVerificationDetals from "./commonModalForms/SampleVerificationDetals";
import {
  getActivityListDatabyji,
  getAllManPowerData,
  getJIsowandactivityData,
  getOPActivityData,
  getOpeartionType,
  getOPLoadingUnLoadingSourceData,
  getOPScopeWorkData,
  handleManPowerCreateUpdate,
  handleScopeOfWorkFunction,
} from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import {
  getAllInvoiceDetailsData,
  handleInvoiceDetailsCreateUpdate,
} from "./commonHandlerFunction/InvoiceHandlerFunctions";
import {
  getAllSampleMarkList,
  getLotCompositeData,
  handleExportSampleMakrList,
  handleTMLOperationCreateUpdate,
} from "./commonHandlerFunction/operations/TMLOperations";
import { useLocation } from "react-router-dom";
import {
  decryptDataForURL,
  encryptDataForURL,
} from "../../utills/useCryptoUtils";
import RenderTableSectionActivity from "./RenderTableSectionActivity";
import { Button } from "react-bootstrap";
import { handleGetPurchaseReqTableData, handlePurchaseReqTableDataDelete } from "./commonHandlerFunction/Purchase/PurchaseReq/PurchaseReqTableHandler";
import PopUpPurchaseReq from "./PopUpPurchaseReq";
import { getAllStackSupervissionData, StackSupervissionCreateDataFunction } from "./commonHandlerFunction/operations/StackHandlerFunctions";
import { getAllRakeSupervissionData, RakeSupervissionCreateDataFunction } from "./commonHandlerFunction/operations/RakeHandlerOperation";
import RenderTablePopup from "./commonModalForms/RenderTablePopup";
import PurchaseTotal from "./PurchaseTotal";

const RenderTableSection = ({
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
  setSaveClicked,
  setTableData,
  tableData,
  moduleType,
  moduleSubType,
  setSimpaleInwardResponse,
  simpleInwardResponse,
  groupDefaultValue,
  testMemoId,
  getVerificationDetails,
  getSampleIdsMasterData,
  setIsOverlayLoader,
  isOverlayLoader,
  OperationType,
  OperationTypeID,
  operationStepNo,
  isUseForViwOnly,
  checkShowButtonConditon,
  operationMode,
  activityID,
  OpsActivityName,
  EditRecordId,
  cc_ids = "",
  viewOnly,
  setSimpleInwardId,
  simpleInwardId,
  setShowModal,
  getAllListingData,
  handleSubmit,
  navigate,
  tab,
  popupAddPurchaseReq,
  setPopupAddPurchaseReq,
  user
}) => {
  const [popupIndex, setPopupIndex] = useState(-1);
  const [isDisplayNewAddOption, setIsDisplayNewAddOption] = useState(true);

  const [popupOpenAssignment, setPopupOpenAssignment] = useState(false);
  // const [popupAddPurchaseReq, setPopupAddPurchaseReq] = useState(false)
  const [isBtnclicked, setIsBtnClicked] = useState(false);
  const [sampleDetails, setSampleDetails] = useState([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewTableData, setViewTableData] = useState([]);
  const [customOptions, setCustomOptions] = useState([]);
  const [isLoadedData, setIsLoadedData] = useState(false);
  const [isCIDuplicate, setISCIDuplicate] = useState(false);
  const [isCustomPopup, setIsCustomPopup] = useState(false);

  let VerificationSaveAction = [
    {
      icon: "bi bi-floppy2",
      text: "Save",
    },
  ];
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
  let saveAction = [
    {
      icon: "bi bi-floppy2",
      text: "Save",
    },
  ];
  let plusAction = [
    {
      icon: "bi bi-plus-circle-fill",
      text: "Save",
    },
  ];
  let purchaseReqAction = [
    {
      icon: "bi bi-pen",
      text: "Edit",
    },

    {
      icon: "bi bi-trash",
      text: "Delete",
    }
  ]
  const purchase_req =
    [
      {
        width: 3,
        label: "Total",
        name: "po_total_amt",
        type: "text",
        sortName: "po_total_amt",
        fieldName: "po_total_amt",
        placeholder: "Total",
        readOnly: true,

      },
      {
        width: 3,
        label: "GST",
        name: "po_gst",
        type: formData[0]?.po_status === "Posted" ? "label" : "text",
        sortName: "po_gst",
        fieldName: "po_gst",
        placeholder: " Enter GST"
      },
      {
        width: 3,
        label: "Total GST",
        name: "po_total_gst",
        type: "text",
        sortName: "po_total_gst",
        fieldName: "po_total_gst",
        readOnly: true,
        upperClass: "total-gstcss"
      }
    ]


  const getPoTotalcount = () => {


    const items = tableData;

    const totalAmt = items.reduce((sum, item, index) => {

      return sum + parseFloat(formData[1]?.['prd_total_' + index] || 0);
    }, 0);

    return totalAmt

  }
  if (pageType === "assignment") {
    MainAction.splice(0, 1);
  }

  if (moduleType === "sampleverification") {
    MainAction.splice(1, 1);
    MainAction.push({
      icon: "bi bi-eye",
      text: "View",
    });
  }
  if (
    moduleType === "jobinstruction" &&
    formData[0]?.ji_id &&
    OperationTypeID &&
    operationStepNo == 2 && !section.isUseForActivity
  ) {
    // MainAction.splice(0, 1);
  }

  // const [simpleInwardId, setSimpleInwardId] = useState("");
  const [editableIndex, setEditableIndex] = useState("");
  const [updatedMasterOptions, setUpdatedMasterOptions] = useState([]);
  const [actualMasterOptions, setActualMasterOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const onSingleFieldChange = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = ""
  ) => {
    if (moduleType === "sampleverification") {
      let spName = fieldName.split("_");
      if (spName[spName.length - 1] === "0") {
        const updatedFormData = { ...formData };
        if (!updatedFormData[sectionIndex]) {
          updatedFormData[sectionIndex] = {};
        }
        updatedFormData[sectionIndex][fieldName] = value;
        let actualFieldName = fieldName.replace(
          "_" + spName[spName.length - 1],
          ""
        );
        tableData?.map((row, rowIndex) => {
          let newFieldName = actualFieldName + "_" + rowIndex;
          if (!updatedFormData[sectionIndex][newFieldName]) {
            if (['svd_abovesize', 'svd_belowsize', 'svd_remark'].includes(actualFieldName)) {
              if ((parseFloat(updatedFormData[sectionIndex]['svd_abovesize_' + spName[spName.length - 1]]) + parseFloat(updatedFormData[sectionIndex]['svd_belowsize_' + spName[spName.length - 1]])) === 100) {
                updatedFormData[sectionIndex]['svd_belowsize_' + rowIndex] = updatedFormData[sectionIndex]['svd_belowsize_' + spName[spName.length - 1]];
                updatedFormData[sectionIndex]['svd_abovesize_' + rowIndex] = updatedFormData[sectionIndex]['svd_abovesize_' + spName[spName.length - 1]];
              }
              updatedFormData[sectionIndex]['svd_remark_' + rowIndex] = updatedFormData[sectionIndex]['svd_remark_' + spName[spName.length - 1]]
            }
            else {
              updatedFormData[sectionIndex][newFieldName] = value;
            }
          }
        });
        setFormData(updatedFormData);
        return;
      }
    }
    else if (moduleType === "jobinstruction") {
      let beforeLastPart = fieldName.slice(0, fieldName.lastIndexOf("_"));
      if (operationMode.toUpperCase() === "TR") {
        if (['jism_quantity'].includes(beforeLastPart)) {
          value = value ? parseFloat(value).toFixed(3) : 0
        }
      }
    }
    handleFieldChange(sectionIndex, fieldName, value, type, isChecked);
  };
  const onCustomChangeHandler = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = ""
  ) => {
    let beforeLastPart = fieldName.slice(0, fieldName.lastIndexOf("_"));
    if (beforeLastPart === "manual_duplicate_entry") {
      value = value ? parseInt(value) : 0
      if (value > 50) {
        return
      }
    }
    handleFieldChange(sectionIndex, fieldName, value, type, isChecked);

    if (beforeLastPart === "fk_activitymasterid") {
      let lastPart = fieldName.slice(fieldName.lastIndexOf("_") + 1);
      getOPScopeWorkData(setUpdatedMasterOptions, value, lastPart);
      handleFieldChange(
        sectionIndex,
        "fk_scopeworkid_" + lastPart,
        "",
        type,
        isChecked
      );
    } else if (
      beforeLastPart === "jism_is_composite" &&
      value === "Composite"
    ) {
      let lastPart = fieldName.slice(fieldName.lastIndexOf("_") + 1);
      getLotCompositeData(
        setUpdatedMasterOptions,
        lastPart,
        formData,
        OperationTypeID
      );
    }
    // else if (beforeLastPart === "jis_qty" || beforeLastPart === "jis_rate") {
    //   let lastPart = fieldName.slice(fieldName.lastIndexOf("_") + 1);
    //   gettwoFieldsTotalValues('jis_qty_' + lastPart, 'jis_rate_' + lastPart, fieldName, value, formData, setFormData, 'jis_total_rate_' + lastPart, sectionIndex)
    // }
    else if (beforeLastPart === "jism_composite_lot_nos") {
      let lastPart = fieldName.slice(fieldName.lastIndexOf("_") + 1);
      let totalQty = 0;
      let existLot = [];
      tableData.filter((singleData) => {
        if (value.includes(singleData.jism_id)) {
          if (!existLot.includes(singleData.jism_id)) {
            existLot.push(singleData.jism_id)
            totalQty += parseFloat(singleData.jism_quantity)
          }
        }
      })
      handleFieldChange(
        sectionIndex,
        "jism_quantity_" + lastPart,
        totalQty
      );
    }
    else if (['vessel_mp_duty_in', 'vessel_mp_duty_out'.includes(beforeLastPart)]) {
      let lastPart = fieldName.slice(fieldName.lastIndexOf("_") + 1);
      let totalhrs = '';
      if (beforeLastPart === "vessel_mp_duty_in") {
        totalhrs = getTotalHoursInTimeFormat(value, formData?.[1]?.['vessel_mp_duty_out_' + lastPart])
      }
      else {
        totalhrs = getTotalHoursInTimeFormat(formData?.[1]?.['vessel_mp_duty_in_' + lastPart], value)
      }
      handleFieldChange(
        sectionIndex,
        "vessel_mp_total_duty_hours_" + lastPart,
        totalhrs
      );
    }
  };
  useEffect(() => {
    if (!isUseForViwOnly) {
      setSimpleInwardId(formData[1]?.sampleInwardIdMain);
      setTimeout(() => {
        if (formData[1]?.sampleInwardIdMain) {
          getInwardTabledata(formData[1]?.sampleInwardIdMain);
        }
      }, 1000);
    }
  }, [formData[1]?.sampleInwardIdMain]);
  useEffect(() => {
    try {
      if (!isUseForViwOnly) {
        setIsOverlayLoader(true)
        setTimeout(() => {
          if (
            moduleType === "sampleverification" &&
            testMemoId &&
            !editableIndex && action !== "View"
          ) {
            getSampleLabCodeDetails(testMemoId);
          }
          else {
            setIsOverlayLoader(false)
          }
        }, 10);
      }
    }
    catch (ex) { }
  }, [testMemoId]);
  useEffect(() => {
    if (!isUseForViwOnly) {
      setTimeout(() => {
        if (
          moduleType === "sampleverification" &&
          testMemoId &&
          !editableIndex && action === "View"
        ) {
          if (formData[0].sv_id
            && formData[0].status !== "verified"
          ) {
            getSampleLabCodeDetails(testMemoId);
          }
          else {
            let updatedFormData = { ...formData };
            if (!updatedFormData[sectionIndex]) {
              updatedFormData[sectionIndex] = {};
            }
            const sortData = formData[0].sv_detail.sort((a, b) => a.svd_id - b.svd_id)
            sortData.map((svData, count) => {
              section.rows.forEach((row) => {
                row.forEach((columnName) => {
                  const fieldName = `${columnName.name}_${count}`;
                  let value;
                  if (columnName.name === "sp_lab_smplcode") {
                    value = svData.svd_smpllabcode;
                  } else if (columnName.name === "sample_quantity") {
                    value = svData.svd_smplweight;
                  } else {
                    value = svData[columnName.name];
                  }
                  updatedFormData[sectionIndex][fieldName] = value;
                });
                updatedFormData[sectionIndex]['sv_smpl_detail_smpl_condtion_' + count] = svData.svd_sample_condition;
                updatedFormData[sectionIndex]['smpl_detail_is_raw_and_powdered_' + count] = svData.svd_is_raw_and_powdered;
                updatedFormData[sectionIndex]['smpl_detail_is_physical_raw_and_powdered_' + count] = svData.svd_is_physical_raw_and_powdered;
              });
            })
            setFormData(updatedFormData);
            setTableData(formData[0].sv_detail);
          }
        }
      }, 1000);
    }
  }, [formData?.[0]?.sv_id]);
  useEffect(() => {
    if (!isUseForViwOnly) {
      if (testMemoId && !editableIndex && moduleType === "sampleverification") {
        getVerificationDetails(formData[0].sv_id, 1);
        setTimeout(() => {
          getSampleLabCodeDetails(testMemoId);
        }, 1000);
      }
    }
  }, [editableIndex]);
  useEffect(() => {
    if (!isUseForViwOnly) {
      if (moduleType === "sampleinward") {
        setTimeout(() => {
          getSampleOptionData();
        }, 1000);
      }
    }
  }, [masterOptions, selectedOptions]);

  useEffect(() => {
    if (!isUseForViwOnly) {
      if (moduleType == "jobinstruction" && !section.isUseForVessel) {
        if (formData[0]?.fk_operationtypetid && isLoadedData) {
          getOPActivityData(
            setUpdatedMasterOptions,
            formData[0]?.fk_operationtypetid,
            section.isMainPage,
            setTableData,
            formData,
            setFormData,
            tableData
          );
        }
      }
    }
  }, [formData[0]?.fk_operationtypetid, isLoadedData]);
  useEffect(() => {
    if (['jobinstruction'].includes(moduleType)) {
      if (operationStepNo == 2 && !section.isUseForActivity) {
        // setISCIDuplicate(true)
      }

    }
  }, [moduleType])
  const getScopeOfWorkData = (isCancelled = "", indexNo) => {
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
      isCancelled,
      indexNo,
      '',
      '',
      setIsLoadedData
    );
  };
  const getSampleMarkLisData = () => {
    if (section.isUseForActivity) {
      if (getStackOperations('ST_SV') === OperationType) {
        getAllStackSupervissionData(
          formData[0]?.ji_id,
          setTableData,
          formData,
          setFormData,
          section,
          OperationTypeID
        );
      }
      else if (getRakeOperations('RK_SV') === OperationType) {
        getAllRakeSupervissionData(
          formData[0]?.ji_id,
          setTableData,
          formData,
          setFormData,
          section,
          OperationTypeID
        );
      }

    }
    else {
      getAllSampleMarkList(
        formData[0]?.ji_id,
        OperationTypeID,
        setTableData,
        formData,
        setFormData,
        section,
        null,
        null,
        null,
        setIsDisplayNewAddOption,
        OperationType
      );
    }
  };
  useEffect(() => {
    if (!isUseForViwOnly && !section.isUseForManPower) {
      if (formData[0]?.ji_id && !section.isUseForVessel) {
        getScopeOfWorkData();
      } else if (formData[0]?.ji_id && OperationTypeID) {
        // if (!['RAKE'].includes(operationMode)) {
        getSampleMarkLisData();
        // }
      } else if (formData[0]?.fk_jiid && formData[0]?.fk_jisid) {
        getAllSampleMarkList(
          formData[0]?.fk_jiid,
          formData[0]?.fk_jisid,
          setTableData,
          formData,
          setFormData,
          section,
          moduleType
        );
      }
    }
  }, [formData[0]?.ji_id, formData[0]?.fk_jiid, formData[0]?.fk_jisid]);
  useEffect(() => {
    if (!isUseForViwOnly && !section.isUseForManPower) {
      if (formData[0]?.ji_id && OperationTypeID) {
        if (formData?.[0]?.rake_qas_id || formData?.[0]?.rake_qan_id) {
          getSampleMarkLisData();
        }
      }
    }
  }, [formData?.[0]?.rake_qas_id, formData?.[0]?.rake_qan_id])
  useEffect(() => {
    if (formData[0]?.ji_id && section.isUseForManPower) {
      getAllManPowerData(
        formData[0]?.ji_id,
        setTableData,
        formData,
        setFormData,
        section,
        activityID,
        OpsActivityName
      );
      getActivityListDatabyji(
        formData[0]?.ji_id,
        setCustomOptions,
        setIsDisplayNewAddOption
      );
    }
  }, [formData[0]?.ji_id]);

  useEffect(() => {
    if (moduleType == "invoice") {
      getAllInvoiceDetailsData(
        setTableData,
        formData,
        setFormData,
        section,
        activityID,
        OpsActivityName,
        EditRecordId,
        setIsOverlayLoader
      );
    }

  }, []);

  const getSampleOptionData = () => {
    if (actualMasterOptions.length === 0) {
      setActualMasterOptions(masterOptions);
    }
    let simplaMasterData = actualMasterOptions?.find((model, index) => {
      if (model.model === "smpl_set_smpljson") {
        return model;
      }
    });
    let newMasterOptions = masterOptions;
    const InwardUnits = formData[1]?.jrf_commodity_detail?.cmd_unit || [];
    let unitoptions = [];
    InwardUnits?.map((singleOpt) => {
      unitoptions.push({
        name: singleOpt.cu_name,
        id: singleOpt.cu_symbol,
      });
    });
    if (InwardUnits.length === 0) {
      unitoptions.push({
        name: "GM",
        id: "gm",
      });
    }
    newMasterOptions.push({
      model: "smpl_detail_smpl_qty_unit",
      data: unitoptions,
    });
    if (simplaMasterData) {
      let notSelectedOptions = simplaMasterData?.data.filter((simpleId) => {
        return !selectedOptions.includes(simpleId.name);
      });
      const bodyToPass = {
        model: "smpl_set_smpljson",
        data: notSelectedOptions,
      };
      let isExists = false;
      let filterData = newMasterOptions.filter((model) => {
        if (model.model === "smpl_set_smpljson") {
          model.data = notSelectedOptions;
          isExists = true;
        }
        return true;
      });
      if (isExists) {
        newMasterOptions = filterData;
      } else {
        newMasterOptions.push(bodyToPass);
      }

      if (notSelectedOptions.length === 0) {
        setIsDisplayNewAddOption(false);
      } else {
        setIsDisplayNewAddOption(true);
      }
    }
    setUpdatedMasterOptions(newMasterOptions);
  };
  const onActionHandleClick = async (actionSelected, groupedTableData, isAdditional) => {
    try {
      if (pageType === "assignment") {
        assignmentPageHandleAction(
          actionSelected,
          editableIndex,
          tableData,
          simpleInwardId,
          formData,
          setSaveClicked,
          getInwardTabledata,
          setPopupIndex,
          setEditableIndex,
          popupIndex,
          section,
          "",
          updatedMasterOptions,
          getSampleIdsMasterData
        );
      } else if (moduleType === "sampleverification") {
        sampleVerificationHandler(
          actionSelected,
          editableIndex,
          tableData,
          formData[0]?.fk_testmemo_id,
          formData,
          section,
          setSaveClicked,
          setPopupIndex,
          setEditableIndex,
          popupIndex,
          "",
          setIsOverlayLoader
        );
      } else if (moduleType === "jobinstruction") {
        if (section.isUseForManPower) {
          handleManPowerCreateUpdate(
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
          );
        } else if (section.isUseForVessel) {
          if (section.isUseForActivity) {
            if (OperationType === getStackOperations('ST_SV')) {
              StackSupervissionCreateDataFunction(
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
                OperationTypeID
              )
            }
            else if (OperationType === getRakeOperations('RK_SV')) {
              RakeSupervissionCreateDataFunction(
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
                OperationTypeID,
                setIsCustomPopup
              )
            }
          }
          else {
            handleTMLOperationCreateUpdate(
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
              OperationType,
              OperationTypeID,
              getAllSampleMarkList,
              setIsDisplayNewAddOption,
              setIsCustomPopup
            );
          }
        }
        else if (section.isUseForActivity) {
        } else {
          handleScopeOfWorkFunction(
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
          );
        }
      } else if (moduleType === "invoice") {
        handleInvoiceDetailsCreateUpdate(
          actionSelected,
          actionSelected == "Delete" ? popupIndex : editableIndex,
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
          OpsActivityName,
          activityID,
          cc_ids,
          filteredOptions,
          groupedTableData,
          isAdditional,
          user
        );
      }
      else if (moduleType === "purchaseReq") {

        handlePurchaseReqTableDataDelete(formData, setPopupIndex,
          setEditableIndex, popupIndex, setFormData, setTableData, "")
      }
      else if (moduleType === "purchase") {
        handlePurchaseReqTableDataDelete(formData, setPopupIndex,
          setEditableIndex, popupIndex, setFormData, setTableData, "purchase")
      }
      else {
        InwardPageHandleAction(
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
          setIsOverlayLoader
        );
      }
    }
    finally {
      // setIsCustomPopup(false)
    }
  };

  const getInwardTabledata = async (simpleId) => {
    setIsOverlayLoader(true);
    let payload = {
      smpl_inwrd_id: simpleId,
    };
    let res = await postDataFromApi(sampleInwardDetailsGetAPI, payload);
    if (res.data.status === 200) {
      const updatedFormData = { ...formData };
      if (tableData.length === 0) {
        section.rows.forEach((row) => {
          row.forEach((columnName) => {
            if (columnName.name !== "sample_id") {
              if (columnName.name != "smpl_detail_smpl_qty_unit") {
                if (columnName.name !== "smpl_detail_smpl_qty") {
                  let fieldNamerm = `${columnName.name}_0`;
                  let newfieldNamerm = `${columnName.name}_${res.data.data.sample_detail_data.length}`;
                  updatedFormData[sectionIndex][newfieldNamerm] =
                    updatedFormData[sectionIndex][fieldNamerm];

                  if (updatedFormData[sectionIndex][fieldNamerm]) {
                    delete updatedFormData[sectionIndex][fieldNamerm];
                  }
                } else {
                  let fieldNamerm = `${columnName.name}_0`;
                  let fieldNamermunit = `${columnName.name}_unit_0`;
                  let newfieldNamerm = `${columnName.name}_${res.data.data.sample_detail_data.length}`;
                  let newfieldNamermunit = `${columnName.name}_unit_${res.data.data.sample_detail_data.length}`;
                  updatedFormData[sectionIndex][newfieldNamerm] =
                    updatedFormData[sectionIndex][fieldNamerm];
                  updatedFormData[sectionIndex][newfieldNamermunit] =
                    updatedFormData[sectionIndex][fieldNamermunit];

                  if (updatedFormData[sectionIndex][fieldNamerm]) {
                    delete updatedFormData[sectionIndex][fieldNamerm];
                    delete updatedFormData[sectionIndex][fieldNamermunit];
                  }
                }
              }
            }
          });
        });
      } else {
        tableData?.map((singleInwardData, i) => {
          section.rows.forEach((row) => {
            row.forEach((columnName) => {
              if (columnName.name !== "sample_id") {
                if (columnName.name != "smpl_detail_smpl_qty_unit") {
                  if (columnName.name === "smpl_detail_smpl_qty") {
                    let fieldNamerm = `${columnName.name}_${i}`;
                    let fieldNamermunit = `${columnName.name}_unit_${i}`;
                    if (updatedFormData[sectionIndex][fieldNamerm]) {
                      delete updatedFormData[sectionIndex][fieldNamerm];
                      delete updatedFormData[sectionIndex][fieldNamermunit];
                    }
                    if (tableData.length - 1 === i) {
                      fieldNamerm = `${columnName.name}_${tableData.length}`;
                      fieldNamermunit = `${columnName.name}_unit_${tableData.length}`;
                      if (
                        tableData.length !==
                        res.data.data.sample_detail_data.length
                      ) {
                        let newfieldNamermunit = `${columnName.name}_unit_${res.data.data.sample_detail_data.length}`;
                        let newfieldNamerm = `${columnName.name}_${res.data.data.sample_detail_data.length}`;
                        updatedFormData[sectionIndex][newfieldNamerm] =
                          updatedFormData[sectionIndex][fieldNamerm];
                        updatedFormData[sectionIndex][newfieldNamermunit] =
                          updatedFormData[sectionIndex][fieldNamermunit];
                      }

                      if (updatedFormData[sectionIndex][fieldNamerm]) {
                        delete updatedFormData[sectionIndex][fieldNamerm];
                        delete updatedFormData[sectionIndex][fieldNamermunit];
                      }
                    }
                  } else {
                    let fieldNamerm = `${columnName.name}_${i}`;
                    if (updatedFormData[sectionIndex][fieldNamerm]) {
                      delete updatedFormData[sectionIndex][fieldNamerm];
                    }
                    if (tableData.length - 1 === i) {
                      fieldNamerm = `${columnName.name}_${tableData.length}`;
                      if (
                        tableData.length !==
                        res.data.data.sample_detail_data.length
                      ) {
                        let newfieldNamerm = `${columnName.name}_${res.data.data.sample_detail_data.length}`;
                        updatedFormData[sectionIndex][newfieldNamerm] =
                          updatedFormData[sectionIndex][fieldNamerm];
                      }

                      if (updatedFormData[sectionIndex][fieldNamerm]) {
                        delete updatedFormData[sectionIndex][fieldNamerm];
                      }
                    }
                  }
                }
              }
            });
          });
        });
      }

      if (pageType === "inward") {
        res.data.data.sample_detail_data.forEach((singleInwardData, i) => {
          if (!updatedFormData[sectionIndex]) {
            updatedFormData[sectionIndex] = {};
          }
          section.rows.forEach((row) => {
            row.forEach((columnName) => {
              if (columnName.name !== "smpl_detail_smpl_qty_unit") {
                const fieldName = `${columnName.name}_${i}`;
                const value =
                  columnName.name === "sample_id"
                    ? singleInwardData["smpl_detail_smpl_id"]
                    : singleInwardData[columnName.name];
                if (columnName.name === "smpl_detail_smpl_qty") {
                  let spValue = value.split(" / ");
                  updatedFormData[sectionIndex][fieldName] = spValue[0];
                  updatedFormData[sectionIndex][
                    `${columnName.name}_unit_${i}`
                  ] = spValue.length > 1 ? spValue[1] : "";
                } else {
                  if (columnName.name === "smpl_detail_dos") {
                    updatedFormData[sectionIndex][fieldName] = value;
                  } else {
                    updatedFormData[sectionIndex][fieldName] = value;
                  }
                }
              }
            });
          });
          if (["Raw and Powdered Sample", "Physical and Raw Sample", "Physical,Raw and Powdered Sample"].includes(singleInwardData['smpl_detail_smpl_condtion'])) {
            updatedFormData[sectionIndex]['smpl_detail_smpl_pwd_qty_' + i] = singleInwardData.smpl_detail_smpl_pwd_qty;
            updatedFormData[sectionIndex]['smpl_detail_smpl_pwd_qty_unit_' + i] = singleInwardData.smpl_detail_smpl_pwd_qty_unit;
            if (["Physical,Raw and Powdered Sample"].includes(singleInwardData['smpl_detail_smpl_condtion'])) {
              updatedFormData[sectionIndex]['smpl_detail_smpl_physical_qty_' + i] = singleInwardData.smpl_detail_smpl_physical_qty;
              updatedFormData[sectionIndex]['smpl_detail_smpl_physical_qty_unit_' + i] = singleInwardData.smpl_detail_smpl_physical_qty_unit;
            }
          }
          updatedFormData[sectionIndex]["smpl_inwrd_detail_id_" + i] =
            singleInwardData.smpl_inwrd_detail_id;
        });
        setTableData(res.data.data.sample_detail_data);
      } else if (pageType === "assignment") {
        let selectedSimpleIds = [];
        res.data.data.sample_set_data.forEach((singleInwardData, i) => {
          singleInwardData.smpl_set_smpljson?.map((simpleId) => {
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
        setSelectedOptions(selectedSimpleIds);
        setTableData(res.data.data.sample_set_data);
      }
      setSimpleInwardId(res.data.data.smpl_inwrd_id);
      updatedFormData[0]["smpl_status"] = res.data.data.smpl_status;
      updatedFormData[0]["smpl_inwrd_No"] = res.data.data.smpl_inward_number;
      updatedFormData[0]["smpl_detail_dos"] = res.data.data.smpl_dos;
      updatedFormData[0]["sample_detail_data"] =
        res.data.data.sample_detail_data;
      updatedFormData[0]["inward_msfm_number"] =
        res.data.data.inward_msfm_number;
      updatedFormData[0]["smpl_detail_recpt_mode"] =
        res.data.data.smpl_receipt_mode;
      updatedFormData[1][
        "smpl_detail_dos_" + res.data.data.sample_detail_data.length
      ] = res.data.data.smpl_dos;
      updatedFormData[1][
        "smpl_detail_recpt_mode_" + res.data.data.sample_detail_data.length
      ] = res.data.data.smpl_receipt_mode;
      setFormData(updatedFormData);
    }
    setIsOverlayLoader(false);
  };

  const getSampleLabCodeDetails = async (testMemoId) => {
    try {
      setIsOverlayLoader(true)
      let payload = {
        test_memo_id: testMemoId,
      };
      let count = 0;
      let res = await postDataFromApi(getsamplelabcodeApi, payload);
      if (res.data.status === 200) {
        let updatedFormData = { ...formData };
        let SPTableData = [];
        res.data.data.forEach((singleData, i) => {
          if (!updatedFormData[sectionIndex]) {
            updatedFormData[sectionIndex] = {};
          }
          let multipleVerificationValue = 0;
          let verificationData = getVerificationDataFunc(
            singleData,
            SPTableData,
            updatedFormData,
            count
          );
          SPTableData = verificationData.SPTableData;
          updatedFormData = verificationData.updatedFormData;
          count = verificationData.count;

        });
        setFormData(updatedFormData);
        setTimeout(() => {
          if (formData["0"]?.sv_detail && formData["0"]?.sv_detail?.length === 0) {
            sampleVarificationDetailsBulkCreate(SPTableData, updatedFormData, setIsOverlayLoader, getVerificationDetails, getSampleLabCodeDetails, testMemoId)
          }
          else {
            setTableData(SPTableData);
          }
        }, 10)
      }
    }
    finally {
      setIsOverlayLoader(false)
    }
  };
  const getVerificationDataFunc = (
    singleData,
    SPTableData,
    updatedFormData,
    count,
    isDuplicate
  ) => {
    singleData?.["sample_details"]?.map((smlDetails, spID) => {
      isDuplicate = "";
      const ExistsData = checkVerificationDataExists(
        smlDetails["sp_lab_smplcode"],
        isDuplicate
      );
      if (ExistsData.length > 0) {
        updatedFormData[sectionIndex]["svd_id_" + count] =
          ExistsData[0]["svd_id"];
      }
      section.rows.forEach((row) => {
        row.forEach((columnName) => {
          const fieldName = `${columnName.name}_${count}`;
          let value;
          if (ExistsData.length > 0) {
            if (columnName.name === "sp_lab_smplcode") {
              value = ExistsData[0].svd_smpllabcode;
            } else if (columnName.name === "sample_quantity") {
              value = ExistsData[0].svd_smplweight;
            } else {
              value = ExistsData[0][columnName.name];
            }
          } else {
            if (updatedFormData[sectionIndex][fieldName]) {
              value = updatedFormData[sectionIndex][fieldName];
            } else {
              value = smlDetails[columnName.name]
                ? smlDetails[columnName.name]
                : "";
            }
            if (columnName.name === "sample_quantity") {
              value = value.split(' / ')
              if (value.length > 1) {
                value = value.join(' ')
              }
              else {
                value = value[0]
              }

            }
          }
          if (
            ["svd_stdsizeofsmpl", "svd_abovesize", "svd_belowsize"].includes(
              columnName.name
            )
          ) {
            let unitValue = "";
            if (value) {
              value = value.toString();
              let spUnitValue = value.split(" ");
              unitValue = spUnitValue.length > 1 ? spUnitValue[1] : "";
              value = spUnitValue[0];
            }

            if (
              updatedFormData[sectionIndex][columnName.name + "_unit_" + count]
            ) {
              updatedFormData[sectionIndex][
                columnName.name + "_unit_" + count
              ] =
                updatedFormData[sectionIndex][
                columnName.name + "_unit_" + count
                ];
            } else {
              updatedFormData[sectionIndex][
                columnName.name + "_unit_" + count
              ] = unitValue;
            }
            if (updatedFormData[sectionIndex][fieldName]) {
              updatedFormData[sectionIndex][fieldName] =
                updatedFormData[sectionIndex][fieldName];
            } else {
              updatedFormData[sectionIndex][fieldName] = value || "";
            }
          } else {
            if (isDuplicate && columnName.name === "sample_quantity" && ExistsData.length === 0) {
              updatedFormData[sectionIndex][fieldName] =
                smlDetails["smpl_detail_smpl_pwd_qty"] +
                " " +
                smlDetails["smpl_detail_smpl_pwd_qty_unit"];
            } else {
              updatedFormData[sectionIndex][fieldName] = updatedFormData[sectionIndex][fieldName] || value;
            }
          }
        });
      });
      updatedFormData[sectionIndex]['smpl_detail_is_raw_and_powdered_' + count] = smlDetails.smpl_detail_is_raw_and_powdered;
      updatedFormData[sectionIndex]['smpl_detail_is_physical_raw_and_powdered_' + count] = smlDetails.smpl_detail_is_physical_raw_and_powdered;
      updatedFormData[sectionIndex]['sv_smpl_detail_smpl_condtion_' + count] = smlDetails.smpl_detail_smpl_condtion;
      if (["Raw and Powdered Sample", "Physical and Raw Sample", "Physical,Raw and Powdered Sample"].includes(smlDetails.smpl_detail_smpl_condtion)) {
        updatedFormData[sectionIndex]['sv_smpl_detail_smpl_condtion_' + count] = "Raw Sample"
      }
      SPTableData.push({ ...smlDetails, isDuplicate: false });
      isDuplicate = smlDetails.smpl_detail_is_raw_and_powdered;
      if (isDuplicate) {
        count++;
        const ExistsData = checkVerificationDataExists(
          smlDetails["sp_lab_smplcode"],
          isDuplicate
        );
        if (ExistsData.length > 0) {
          updatedFormData[sectionIndex]["svd_id_" + count] =
            ExistsData[0]["svd_id"];
        }
        section.rows.forEach((row) => {
          row.forEach((columnName) => {
            const fieldName = `${columnName.name}_${count}`;
            let value;
            if (ExistsData.length > 0) {
              if (columnName.name === "sp_lab_smplcode") {
                value = ExistsData[0].svd_smpllabcode;
              } else if (columnName.name === "sample_quantity") {
                value = ExistsData[0].svd_smplweight;
              } else {
                value = ExistsData[0][columnName.name];
              }
            } else {
              if (updatedFormData[sectionIndex][fieldName]) {
                value = updatedFormData[sectionIndex][fieldName];
              } else {
                value = smlDetails[columnName.name]
                  ? smlDetails[columnName.name]
                  : "";
              }
            }
            if (
              ["svd_stdsizeofsmpl", "svd_abovesize", "svd_belowsize"].includes(
                columnName.name
              )
            ) {
              let unitValue = "";
              if (value) {
                value = value.toString();
                let spUnitValue = value.split(" ");
                unitValue = spUnitValue.length > 1 ? spUnitValue[1] : "";
                value = spUnitValue[0];
              }

              if (
                updatedFormData[sectionIndex][
                columnName.name + "_unit_" + count
                ]
              ) {
                updatedFormData[sectionIndex][
                  columnName.name + "_unit_" + count
                ] =
                  updatedFormData[sectionIndex][
                  columnName.name + "_unit_" + count
                  ];
              } else {
                updatedFormData[sectionIndex][
                  columnName.name + "_unit_" + count
                ] = unitValue;
              }
              if (updatedFormData[sectionIndex][fieldName]) {
                updatedFormData[sectionIndex][fieldName] =
                  updatedFormData[sectionIndex][fieldName];
              } else {
                updatedFormData[sectionIndex][fieldName] = value || "";
              }
            } else {
              if (isDuplicate && columnName.name === "sample_quantity" && ExistsData.length === 0) {
                updatedFormData[sectionIndex][fieldName] =
                  smlDetails["smpl_detail_smpl_pwd_qty"] +
                  " " +
                  smlDetails["smpl_detail_smpl_pwd_qty_unit"];
              } else {
                updatedFormData[sectionIndex][fieldName] = updatedFormData[sectionIndex][fieldName] || value;
              }
            }
          });
        });
        updatedFormData[sectionIndex]['smpl_detail_is_raw_and_powdered_' + count] = true;
        // updatedFormData[sectionIndex]['sv_smpl_detail_smpl_condtion_' + count] = smlDetails.smpl_detail_smpl_condtion;
        updatedFormData[sectionIndex]['sv_smpl_detail_smpl_condtion_' + count] = "Powdered Sample";
        if (["Physical and Raw Sample"].includes(smlDetails.smpl_detail_smpl_condtion)) {
          updatedFormData[sectionIndex]['sv_smpl_detail_smpl_condtion_' + count] = "Physical Sample";
        }
        SPTableData.push({ ...smlDetails, isDuplicate: true });
      }
      isDuplicate = smlDetails.smpl_detail_is_physical_raw_and_powdered;
      if (isDuplicate) {
        count++;
        const ExistsData = checkVerificationDataExists(
          smlDetails["sp_lab_smplcode"],
          isDuplicate, 1
        );
        if (ExistsData.length > 0) {
          updatedFormData[sectionIndex]["svd_id_" + count] =
            ExistsData[0]["svd_id"];
        }
        section.rows.forEach((row) => {
          row.forEach((columnName) => {
            const fieldName = `${columnName.name}_${count}`;
            let value;
            if (ExistsData.length > 0) {
              if (columnName.name === "sp_lab_smplcode") {
                value = ExistsData[0].svd_smpllabcode;
              } else if (columnName.name === "sample_quantity") {
                value = ExistsData[0].svd_smplweight;
              } else {
                value = ExistsData[0][columnName.name];
              }
            } else {
              if (updatedFormData[sectionIndex][fieldName]) {
                value = updatedFormData[sectionIndex][fieldName];
              } else {
                value = smlDetails[columnName.name]
                  ? smlDetails[columnName.name]
                  : "";
              }
            }
            if (
              ["svd_stdsizeofsmpl", "svd_abovesize", "svd_belowsize"].includes(
                columnName.name
              )
            ) {
              let unitValue = "";
              if (value) {
                value = value.toString();
                let spUnitValue = value.split(" ");
                unitValue = spUnitValue.length > 1 ? spUnitValue[1] : "";
                value = spUnitValue[0];
              }

              if (
                updatedFormData[sectionIndex][
                columnName.name + "_unit_" + count
                ]
              ) {
                updatedFormData[sectionIndex][
                  columnName.name + "_unit_" + count
                ] =
                  updatedFormData[sectionIndex][
                  columnName.name + "_unit_" + count
                  ];
              } else {
                updatedFormData[sectionIndex][
                  columnName.name + "_unit_" + count
                ] = unitValue;
              }
              if (updatedFormData[sectionIndex][fieldName]) {
                updatedFormData[sectionIndex][fieldName] =
                  updatedFormData[sectionIndex][fieldName];
              } else {
                updatedFormData[sectionIndex][fieldName] = value || "";
              }
            } else {
              if (isDuplicate && columnName.name === "sample_quantity" && ExistsData.length === 0) {
                updatedFormData[sectionIndex][fieldName] =
                  smlDetails["smpl_detail_smpl_physical_qty"] +
                  " " +
                  smlDetails["smpl_detail_smpl_physical_qty_unit"];
              } else {
                updatedFormData[sectionIndex][fieldName] = updatedFormData[sectionIndex][fieldName] || value;
              }
            }
          });
        });
        updatedFormData[sectionIndex]['smpl_detail_is_raw_and_powdered_' + count] = true;
        updatedFormData[sectionIndex]['smpl_detail_is_physical_raw_and_powdered_' + count] = true;
        // updatedFormData[sectionIndex]['sv_smpl_detail_smpl_condtion_' + count] = smlDetails.smpl_detail_smpl_condtion;
        updatedFormData[sectionIndex]['sv_smpl_detail_smpl_condtion_' + count] = "Physical Sample";
        SPTableData.push({ ...smlDetails, isDuplicate: true });
      }
      count++;
    });
    return {
      SPTableData: SPTableData,
      updatedFormData: updatedFormData,
      count: count,
    };
  };

  const checkVerificationDataExists = (sp_lab_smplcode, isDuplicate, isPhysical) => {
    if (formData["0"].sv_detail && formData["0"].sv_detail.length > 0) {
      let count = 0;
      return formData["0"].sv_detail.filter((singleData, i) => {
        if (isDuplicate) {
          if (singleData.svd_smpllabcode === sp_lab_smplcode) {
            if (isPhysical) {
              if (count === 2) {
                return true
              }
            }
            else if (count === 1) {
              return true;
            }
            count++;
            return false;
          }
        }
        return singleData.svd_smpllabcode === sp_lab_smplcode;
      });
    }
    return [];
  };

  const InwardCondition = moduleType === "sampleinward";
  const purchaseCondition = ['purchaseReq', 'purchase'].includes(moduleType)

  const IsVerification = false;
  const [actionName, setActionName] = useState("");

  const handleCloseInwardPopup = () => {
    setPopupOpenAssignment(false);
    setPopupIndex("");
    setEditableIndex("");
  };

  useEffect(() => {
    if (
      formData[1]?.[
      "smpl_detail_pkging_condition" +
      "_" +
      (actionName === "Save" ? editableIndex : tableData.length)
      ] &&
      ["Unsealed", "Intact"].includes(formData[1]?.[
        "smpl_detail_pkging_condition" +
        "_" +
        (actionName === "Save" ? editableIndex : tableData.length)
      ])
      // &&
      // !formData[0].jrf_is_ops
    ) {
      const updatedFormData = { ...formData };
      updatedFormData[1][
        "smpl_detail_seal_number" +
        "_" +
        (actionName === "Save" ? editableIndex : tableData.length)
      ] = "NA";
      setFormData(updatedFormData);
    } else if (
      formData[1]?.[
      "smpl_detail_pkging_condition" +
      "_" +
      (actionName === "Save" ? editableIndex : tableData.length)
      ] &&
      formData[1]?.[
      "smpl_detail_pkging_condition" +
      "_" +
      (actionName === "Save" ? editableIndex : tableData.length)
      ] === "Sealed"
      // && !formData[0].jrf_is_ops
    ) {
      const updatedFormData = { ...formData };
      updatedFormData[1][
        "smpl_detail_seal_number" +
        "_" +
        (actionName === "Save" ? editableIndex : tableData.length)
      ] = "";
      setFormData(updatedFormData);
    }
  }, [
    formData[1]?.[
    "smpl_detail_pkging_condition" +
    "_" +
    (actionName === "Save" ? editableIndex : tableData.length)
    ],
  ]);

  const getCustomCellValues = (cell, rowIndex = "custom") => {
    if (cell.type === "doubleText") {
      cell.secondName = cell.name + "_unit_" + rowIndex;
    }
    if (moduleType === "sampleverification") {
      if (
        [
          "svd_stdsizeofsmpl",
          "svd_abovesize",
          "svd_belowsize",
        ].includes(cell.name)
      ) {
        cell.firstType = "number"
        if (formData[1]['sv_smpl_detail_smpl_condtion_' + rowIndex] === "Physical Sample") {
          cell.firstType = "text"
          cell.characterLimit = "20"
        }
      }
      if (
        [
          "svd_stdsizeofsmpl_unit",
          "svd_abovesize_unit",
          "svd_belowsize_unit",
        ].includes(cell.name)
      ) {
        if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL") {
          cell.secondoptions = ["Ltr", "ml", "gm"];
        }
      }
    } else if (moduleType === "jobinstruction") {
      rowIndex = rowIndex === "custom" ? tableData.length : rowIndex;
      if (cell.name === "jism_lot_no") {
        if (formData[1]?.["jism_is_composite_" + rowIndex] === "Composite") {
          cell.type = "select";
          cell.multiple = true;
          cell.name = "jism_composite_lot_nos";
        }
      } else if (cell.name === "jism_composite_lot_nos") {
        if (["Lot", "Singular Composite"].includes(formData[1]?.["jism_is_composite_" + rowIndex])) {
          cell.type = "text";
          cell.name = "jism_lot_no";
        }
      }
      else if (cell.name === "jism_quantity") {
        if (formData[1]?.["jism_is_composite_" + rowIndex] === "Composite") {
          cell.readOnly = true
        }
        else {
          cell.readOnly = false
        }
        if (["TR"].includes(formData[0]?.fk_operationtypetid_code)) {
          cell.label = "Truck Quantity"
        }
      }
      else if (cell.name === "vessel_mp_duty_out") {
        if (!formData[1]?.["vessel_mp_duty_in_" + rowIndex]) {
          cell.readOnly = true;
        }
        else {
          cell.readOnly = false;
          cell.minTime = formData[1]?.["vessel_mp_duty_in_" + rowIndex]
        }
      }
      else if (cell.name === "fk_activitymasterid") {
        if (["DS", "TL"].includes(formData[0]?.fk_operationtypetid_code)) {
          const existSvData = tableData.find((singleData) => ["SV"].includes(singleData?.activity_master?.activity_code))
          if (existSvData) {
            cell.exludeOptions = [existSvData['fk_activitymasterid']]
          }
        }
      }
      if (cell.name === "jism_lot_no") {
        if (['TR', 'TRUCK'].includes(operationMode.toUpperCase()) || OperationType === getPlantOperations('TR')) {
          cell.label = "Truck No.";
          // cell.pattern = "^[A-Z]{2}\\s?\\d{1,2}\\s?[A-Z]{0,2}\\s?\\d{1,4}\\s?[A-Z]{0,2}$"
          // cell.tooltip = "Eg. MH14BH1234"
          cell.Capitalize = true
        }
        else {
          cell.label = "Lot Wise";
          cell.pattern = ""
          cell.tooltip = ""
          cell.Capitalize = false
        }
      }
    }
    else if (moduleType === "invoice") {
      if (cell.name === "ivd_rate_unit") {
        cell.options = [
          "Day",
          "Lumpsum",
          "Sample",
          "MT",
          "Nos",
          "Hatch",
          "Certificate",
          "Vessel",
          "Size",
          "Person",
          "Night",
          "Shift",
          "Machine",
          "Location",
          "Stack",
          "Lot",
          "Consignment",
          "Truck",
          "Rake",
          "Barge",
          "Container",
          "Shipment",
          "Survey",
          "Seals",
          "Hold",
          "Bags",
          "Mines",
          "Month",
          "Visit",
          "Courier",
          "PCS",
          "Shifting",
          "TML",
          "Parameter",
          "Cubic Meter"
        ]
      }
    }
    if (['operationCertificate', 'jobinstruction', 'vesselJICertificate'].includes(moduleType)) {
      if (cell.type === "date") {
        cell.noRestrictionApply = true
      }
    }

    return cell;
  };
  const location = useLocation();
  const getClassName = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const isFullDetails = decryptDataForURL(params.get("isFullDetails"));
    if (isFullDetails) {
      return "main_form subSection_main_form row";
    }
    return "row my-2 mx-0 bg-white";
  };

  const getCheckValidationForActionbtn = (singleTableData) => {
    if (['jobinstruction'].includes(moduleType) && section.isMainPage) {
      if (!(["tasked"].includes(singleTableData.status)) || singleTableData.isAdditionalJIS) {
        return true;
      }
    }
    else if (['jobinstruction'].includes(moduleType) && operationStepNo === 2 && !section.isUseForActivity) {
      if (singleTableData.jism_is_jrf || singleTableData.jism_is_tpi || singleTableData.jism_is_set_created) {
        // return true
      }
    }
    return false
  }

  useEffect(() => {
    if (operationStepNo == 2 && !section.isUseForActivity) {
      const updatedFormData = { ...formData };
      if (!updatedFormData[sectionIndex]) {
        updatedFormData[sectionIndex] = {};
      }
      section.rows[0]?.map((field) => {
        if (field.name !== "jism_marknumber") {
          if (field.name === "jism_is_composite") {
            updatedFormData[sectionIndex][`${field.name}_${tableData.length}`] = "Lot"
          }
          else {
            if (tableData.length > 0) {
              let actlength = tableData.length - (tableData?.[tableData.length]?.['jism_is_composite'] ? 2 : 1)
              updatedFormData[sectionIndex][`${field.name}_${tableData.length}`] = tableData?.[actlength]?.[field.name] || ''
            }
            else {
              updatedFormData[sectionIndex][`${field.name}_0`] = ''
            }
          }
        }
      })
      setFormData(updatedFormData)

    }
  }, [tableData.length])
  useEffect(() => {
    if (['jobinstruction'].includes(moduleType) &&
      formData[0]?.ji_id &&
      OperationTypeID && !editableIndex &&
      operationStepNo == 2 && !section.isUseForActivity) {
      gettotalLotQuantity()
    }
  }, [tableData.length, editableIndex])
  const [filteredOptions, setFilteredOptions] = useState([]);
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  const Status = decryptDataForURL(params.get("status"));
  // console.log('params.get("isInsurance")',params.get("isInsurance"))
  const isInsurance = decryptDataForURL(params.get("isInsurance"));
  // if (Status == "Edit") {
  //   MainAction.splice(1, 2);
  // }

  const gettotalLotQuantity = () => {
    let quantityCount = 0;
    let lotsArray = [];
    let balanceQty = formData[0]?.ji_totalqty ? parseFloat(formData[0]?.ji_totalqty) : 0;
    tableData.forEach((singleData, indextab) => {
      if (!singleData.jism_is_composite) {
        // if (!lotsArray.includes(singleData.jism_lot_no))
        // const jismQty=singleData.jism_quantity
        const jismQty = formData[1]?.['jism_quantity_' + indextab] || singleData.jism_quantity
        quantityCount = parseFloat(quantityCount) + parseFloat(jismQty);
        balanceQty = parseFloat(balanceQty) - parseFloat(jismQty);
        lotsArray.push(singleData.jism_lot_no)
      }
    });
    setTimeout(() => {
      const updatedFormData = { ...formData };
      if (!updatedFormData[0]) {
        updatedFormData[0] = {};
      }
      updatedFormData[0]['allTotalVallue'] = quantityCount.toFixed(3)
      updatedFormData[0]['allBalanceVallue'] = balanceQty && balanceQty > 0 ? balanceQty.toFixed(3) : 0
      setFormData(updatedFormData)
    }, 10)
  }

  const handleCloseCustomPopup = () => {
    const updatedFormData = { ...formData };
    if (!updatedFormData[sectionIndex]) {
      updatedFormData[sectionIndex] = {};
    }
    // tableData.map((singleValue, index) => {
    //   section.headers.map((singleField) => {
    //     const fieldName = singleField.name;
    //     updatedFormData[sectionIndex][fieldName + "_" + index] =
    //       singleValue[fieldName];
    //   });
    // });
    section.headers.map((singleField) => {
      const fieldName = singleField.name;
      updatedFormData[sectionIndex][fieldName + "_" + tableData.length] = ""
    });
    setFormData(updatedFormData);
    setIsCustomPopup(false);
    setPopupIndex("");
    setEditableIndex("");
  };
  // const isCustomPopupModalShow = [getRakeOperations('RK_SV')].includes(OperationType)
  const isCustomPopupModalShow = section?.isSeperatePopupOpen
  const getHeaderTileConditonWise = (header) => {
    if (['jobinstruction'].includes(moduleType) && operationStepNo === 2 && !section.isUseForActivity) {
      if (header.name === "jism_lot_no") {
        header.label = "Lot Wise"
        if (['TR', 'TRUCK'].includes(operationMode.toUpperCase()) || OperationType === getPlantOperations('TR')) {
          header.label = "Truck No."
        }
        else if (OperationType === getVesselOperation('VL_BQA')) {
          header.label = "Barge Name"
        }
      }
      else if (header.name === "jism_sampling_date") {
        header.label = "Date of Sampling";
        if (OperationType === getVesselOperation('VL_BQA')) {
          header.label = "Date of Brage Loading";
          if (formData[0].ji_is_loading === "Loading") {
            header.label = "Date of Barge UnLoading";
          }
        }
      }
    }
    return header.label
  }
  const getSampleQtyText = (cell, rowIndex) => {
    let sampleQtyUnit = formData[sectionIndex][cell.name + "_" + rowIndex] + " " + formData[sectionIndex][cell.name + "_unit" + "_" + rowIndex]
    if (InwardCondition && ["Raw and Powdered Sample", "Physical and Raw Sample", "Physical,Raw and Powdered Sample"].includes(formData[sectionIndex]["smpl_detail_smpl_condtion_" + rowIndex])) {
      sampleQtyUnit += " ," + formData[sectionIndex]["smpl_detail_smpl_pwd_qty_" + rowIndex] + " " + formData[sectionIndex]["smpl_detail_smpl_pwd_qty_unit" + "_" + rowIndex]
    }
    return sampleQtyUnit
  }
  return checkShowButtonConditon && checkShowButtonConditon() && (
    <div key={sectionIndex} className={getClassName()}>
      {isCustomPopupModalShow && !viewOnly && action != "opsView" &&
        action !== "View" &&
        <div className="addBtnPurchaseReq" style={{ justifyContent: "end" }}>
          <Button
            className="submitBtn addStickyBtn"
            onClick={() => {
              setIsCustomPopup(true)
              setEditableIndex(tableData.length)
              setEditableIndex("");
              setActionName("customSave")
            }}
          >Add
          </Button>
          {/* {
            ['jobinstruction'].includes(moduleType) && getLMSOperationActivity().includes(OperationType) && (
              <Button
            className="submitBtn addStickyBtn"
                onClick={() => handleExportSampleMakrList(OperationType,OperationTypeID,setIsOverlayLoader)}
              >
                Export
              </Button>
            )
          } */}
        </div>}
      <Card className={`Scrollable ${getRakeOperations('RK_SV') === OperationType ? 'rendertablesection' : ''}`}>
        {(simpleInwardId || pageType !== "inward") && (
          <CardBody >
            {/* Srushti */}
            {
              moduleType === "purchaseReq" && formData[0].req_id && !viewOnly && ["Saved"].includes(formData[0]?.req_status) ?

                <div className="addBtnPurchaseReq">
                  {section.title && <CardTitle tag="h5" className="section_headingPurchase">{section.title}</CardTitle>}
                  <Button
                    className="submitBtn addStickyBtn"
                    onClick={() => {
                      setPopupAddPurchaseReq(true)
                      setEditableIndex("")
                    }}
                  >Add
                  </Button>
                </div>
                :
                section.title && <CardTitle tag="h5" className="section_heading">{section.title}</CardTitle>
            }
            {/* {moduleType === "invoice" && !['View'].includes(Status) && getActivity()} */}
            {moduleType == "invoice" ?
              (<RenderTableSectionActivity
                getCustomCellValues={getCustomCellValues}
                customOptions={customOptions}
                editableIndex={editableIndex}
                InwardCondition={InwardCondition}
                IsVerification={IsVerification}
                onCustomChangeHandler={onCustomChangeHandler}
                updatedMasterOptions={updatedMasterOptions}
                onSingleFieldChange={onSingleFieldChange}
                VerificationSaveAction={VerificationSaveAction}
                EditAction={EditAction}
                MainAction={MainAction}
                onActionHandleClick={onActionHandleClick}
                setPopupIndex={setPopupIndex}
                popupIndex={popupIndex}
                setEditableIndex={setEditableIndex}
                getInwardTabledata={getInwardTabledata}
                simpleInwardId={simpleInwardId}
                setPopupOpenAssignment={setPopupOpenAssignment}
                setActionName={setActionName}
                setIsViewOpen={setIsViewOpen}
                isViewOpen={isViewOpen}
                setViewTableData={setViewTableData}
                getScopeOfWorkData={getScopeOfWorkData}
                getSampleMarkLisData={getSampleMarkLisData}
                moduleType={moduleType}
                section={section}
                action={action}
                tableData={tableData}
                sectionIndex={sectionIndex}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                masterOptions={masterOptions}
                popupMessages={popupMessages}
                saveClicked={saveClicked}
                OperationTypeID={OperationTypeID}
                saveAction={saveAction}
                plusAction={plusAction}
                handleFieldChange={handleFieldChange}
                viewOnly={viewOnly}
                filteredOptions={filteredOptions}
                setFilteredOptions={setFilteredOptions}
                actionName={actionName}
                handleCloseInwardPopup={handleCloseInwardPopup}
                isBtnclicked={isBtnclicked}
                setIsOverlayLoader={setIsOverlayLoader}
                isOverlayLoader={isOverlayLoader}
                popupOpenAssignment={popupOpenAssignment}
                user={user}
              />)
              :
              (<div className={isCustomPopupModalShow ? "manualTableSection" : ""}><table className={`table table-white responsive borderless no-wrap mt-3 align-middle ${getRakeOperations('RK_SV') === OperationType ? "renderRakeSupervision" : "renderTable"
                } ${moduleType === "sampleinward"
                  ? "inwardTable-th-td"
                  : moduleType === "purchaseReq"
                    ? "purchase-scroll-table"
                    : ""
                }`}>
                <thead>
                  <tr>
                    {
                      ['purchaseReq', 'purchase'].includes(moduleType) ? "" : <th>Sr. No.</th>
                    }

                    {section.headers.map(

                      (header, headerIndex) => {
                        if (header.name === "smpl_detail_smpl_qty") {
                          header.label = "Approx. Qty."
                        }
                        if ((isCustomPopupModalShow && !header.isShowTable) || header.isInsuranceField) {
                          return null
                        }
                        return header.name !== "smpl_detail_smpl_qty_unit" && (
                          <th key={"headerIndex" + headerIndex}
                            className={`${moduleType === "purchaseReq"
                              ? ["prd_tech_specification", "prd_remark", "prd_miscellaneous_items", "prd_specification"].includes(header.name)
                                ? "tdPurchaseDetailandRemark"
                                : "tdPurchase"
                              : moduleType === "purchase"
                                ? "tdPurchaseOrder"
                                : ""}`}>
                            {/* {header.label} */}
                            {getHeaderTileConditonWise(header)}
                          </th>
                        )
                      }
                    )}

                    {!['opsView', "View"].includes(action) ||
                      (moduleType === "sampleverification" && action === "View" && formData[0].status !== "verified") ? (
                      <>
                        {isCIDuplicate && <th>Sample Count</th>}
                        <th className={`actionColForIntCert ${moduleType === "purchaseReq" ? "tdPurchaseActions" : ""}`}>Action</th>
                      </>
                    ) : null}
                  </tr >
                </thead >
                <tbody className={`${moduleType === "purchaseReq" ? "cardbodyPurchase" : ""}`}>

                  {tableData.map((singleTableData, rowIndex) => {
                    let sampleVerificationAction = [{
                      icon: "bi bi-eye",
                      text: "View",
                    }]
                    if (moduleType === "sampleverification") {
                      if (formData[0]?.sv_detail.length >= rowIndex) {
                        sampleVerificationAction = MainAction
                      }
                    }
                    let newAction = MainAction
                    if (['jobinstruction'].includes(moduleType) && operationStepNo === 2 && !section.isUseForActivity) {
                      if (singleTableData.jism_is_composite) {
                        newAction = MainAction.filter((singleAction) => singleAction.text === "Delete")
                      }
                      if (singleTableData.jism_is_jrf || singleTableData.jism_is_tpi || singleTableData.jism_is_set_created) {
                        newAction = newAction.filter((singleAction) => singleAction.text === "Edit")
                      }
                    }

                    return (

                      section.rows.map((row, rowIndex2) => (

                        <tr key={"rowIndex" + rowIndex} className="border-top">
                          {
                            ['purchaseReq', 'purchase'].includes(moduleType) ? "" : <td >{rowIndex + 1}</td>
                          }


                          {row.map((cell, cellIndex) => {
                            cell = getCustomCellValues(cell, rowIndex);
                            if (section.isUseForManPower) {
                              if (cell.name === "fk_activity_id") {
                                cell.customOptions = customOptions;
                                cell.isCustomOptions = true;
                              }
                            }
                            if (cell.name === "prd_item_code") {
                              cell = {
                                ...cell,
                                name: "prd_item_code_text"
                              }
                            }
                            if (['jobinstruction'].includes(moduleType)) {
                              if (operationStepNo == 2 && !section.isUseForActivity) {
                                if (!["jism_quantity", "jism_truck_no"].includes(cell.name) && !(cell.isExternalJson)) {
                                  cell = {
                                    ...cell,
                                    readOnly: true,
                                    isDisabledField: true
                                  }
                                }
                                else {
                                  cell = {
                                    ...cell,
                                    readOnly: false,
                                    isDisabledField: false
                                  }
                                }

                              }
                            }
                            if ((isCustomPopupModalShow && !cell.isShowTable) || cell.isInsuranceField) {
                              return null
                            }
                            return (

                              !["smpl_detail_smpl_qty_unit"].includes(
                                cell.name
                              ) && (
                                <td key={"cellIndex" + cellIndex} className={`${moduleType === "purchaseReq"
                                  ? ["prd_tech_specification", "prd_remark"].includes(cell.name)
                                    ? "tdPurchaseDetailandRemark"
                                    : "tdPurchase"
                                  : moduleType === "purchase"
                                    ? "tdPurchaseOrder"
                                    : ""}`}>

                                  {(editableIndex === 0 && rowIndex === 0) ||
                                    (editableIndex === rowIndex &&
                                      !InwardCondition) ||
                                    IsVerification ? (
                                    <span>

                                      <RenderFields
                                        field={{
                                          ...cell,
                                          secondName:
                                            cell.name + "_unit_" + rowIndex,
                                        }}
                                        sectionIndex={sectionIndex}
                                        fieldIndex={rowIndex * 100 + cellIndex}
                                        formData={formData}
                                        handleFieldChange={onCustomChangeHandler}
                                        formErrors={formErrors} // Pass formErrors to RenderFields
                                        ///for render table only
                                        renderTable={true}
                                        tableIndex={rowIndex}
                                        customName={cell.name + "_" + rowIndex}
                                        masterOptions={updatedMasterOptions}
                                        from="Table"
                                        handleFieldBlur={onSingleFieldChange}
                                      />


                                    </span>
                                  ) : Array.isArray(

                                    formData[sectionIndex][
                                    cell.name + "_" + rowIndex
                                    ]
                                  ) ? (

                                    getSelectedOptionName(
                                      cell.options,
                                      masterOptions,
                                      cell.name,
                                      formData[sectionIndex][
                                      cell.name + "_" + rowIndex
                                      ],
                                      cell.name + "_" + rowIndex
                                    )
                                  ) : cell.name == "smpl_detail_smpl_qty" ? getSampleQtyText(cell, rowIndex) : formData["1"]?.["svd_id_" + rowIndex] ||
                                    ["sp_lab_smplcode", "sample_quantity"].includes(
                                      cell.name
                                    ) ? (
                                    [
                                      "svd_stdsizeofsmpl",
                                      "svd_abovesize",
                                      "svd_belowsize",
                                    ].includes(cell.name) ?
                                      getSampleQtyText(cell, rowIndex) : (
                                        formData[sectionIndex][
                                        cell.name + "_" + rowIndex
                                        ]
                                      )
                                  ) : InwardCondition ? (
                                    formData[sectionIndex][
                                    cell.name + "_" + rowIndex
                                    ]
                                  ) : cell.type === "select" ? (cell.isActualFeldValue ? singleTableData[cell.subModuleData][cell.subModulefield] :
                                    getSelectedOptionName(
                                      cell.options,
                                      updatedMasterOptions,
                                      cell.name,
                                      formData[sectionIndex][
                                      cell.name + "_" + rowIndex
                                      ],
                                      cell.name + "_" + rowIndex,
                                      1,
                                      "",
                                      cell.isCustomOptions,
                                      cell.customOptions
                                    )
                                  )
                                    // : ["jis_rate"].includes(cell.name) ? (
                                    //   formData[sectionIndex][
                                    //   cell.name + "_" + rowIndex
                                    //   ] +
                                    //   " " +
                                    //   (formData[sectionIndex][
                                    //     cell.name + "_unit_" + rowIndex
                                    //   ] || "")
                                    // ) 
                                    : cell.type === "date" || (moduleType === "purchaseReq" && cell.name === "prd_requested_delivery_date") ? getFormatedDate(
                                      formData[sectionIndex][
                                      cell.name + "_" + rowIndex
                                      ],
                                      1, "", "", cell.showTimeSelect
                                    ) : cell.name === "jism_is_composite" && singleTableData?.jism_jsonb_front?.jism_is_lot_composite ? "Singular Composite" : (
                                      getTextWithouHtml(formData[sectionIndex][
                                        cell.name + "_" + rowIndex
                                      ])
                                    )}
                                </td>
                              )
                            );
                          })}
                          {isCIDuplicate && action !== "View" && action != "opsView" && <td>1</td>}
                          <td className={`actionColForIntCert  ${moduleType === "purchaseReq" ? "tdPurchaseActions" : moduleType === "purchase" ? "tdPurchaseOrder" : ""}`}>

                            <div className="actionColumn">

                              {((action !== "View" && action != "opsView") || isInsurance) ? getCheckValidationForActionbtn(singleTableData) ? null : (

                                <ActionOptionsTable
                                  actions={
                                    IsVerification
                                      ? VerificationSaveAction
                                      : (editableIndex === 0 && rowIndex === 0) ||
                                        editableIndex === rowIndex
                                        ? EditAction
                                        : editableIndex === 0 || editableIndex
                                          ? []
                                          : ['sampleverification'].includes(moduleType) ? sampleVerificationAction : purchaseCondition && ["Sent for Approval", "Posted"].includes(formData[0]?.req_status) ? [] : (purchaseCondition || moduleType === "purchase")
                                            ? purchaseReqAction
                                            : newAction
                                  }
                                  onActionHandleClick={onActionHandleClick}
                                  setPopupIndex={setPopupIndex}
                                  useFor="Edit"
                                  editableIndex={editableIndex}
                                  popupIndex={popupIndex}
                                  popupMessages={popupMessages}
                                  saveClicked={saveClicked}
                                  tableIndex={rowIndex}
                                  isCustomSave={0}
                                  setEditableIndex={setEditableIndex}
                                  getInwardTabledata={getInwardTabledata}
                                  simpleInwardId={simpleInwardId}
                                  moduleType={moduleType}
                                  setPopupOpenAssignment={setPopupOpenAssignment}
                                  InwardCondition={InwardCondition}
                                  setActionName={setActionName}
                                  setIsViewOpen={setIsViewOpen}
                                  isViewOpen={isViewOpen}
                                  singleData={singleTableData}
                                  setViewTableData={setViewTableData}
                                  getScopeOfWorkData={getScopeOfWorkData}
                                  section={section}
                                  formData={formData}
                                  getSampleMarkLisData={getSampleMarkLisData}
                                  OperationTypeID={OperationTypeID}
                                  setPopupAddPurchaseReq={setPopupAddPurchaseReq}
                                  setFormData={setFormData}
                                  getAllListingData={getAllListingData}
                                  setTableData={setTableData}
                                  isCustomPopup={isCustomPopup}
                                  setIsCustomPopup={setIsCustomPopup}
                                  OperationType={OperationType}
                                  handleFieldChange={handleFieldChange}
                                  setIsOverlayLoader={setIsOverlayLoader}
                                  isCustomPopupModalShow={isCustomPopupModalShow}
                                />

                              ) : moduleType === "sampleverification" &&
                                action === "View" && formData[0].status !== "verified" ? (
                                <ActionOptionsTable
                                  actions={[
                                    {
                                      icon: "bi bi-eye",
                                      text: "View",
                                    },
                                  ]}
                                  onActionHandleClick={onActionHandleClick}
                                  setPopupIndex={setPopupIndex}
                                  useFor="Edit"
                                  editableIndex={editableIndex}
                                  popupIndex={popupIndex}
                                  popupMessages={popupMessages}
                                  saveClicked={saveClicked}
                                  tableIndex={rowIndex}
                                  isCustomSave={0}
                                  setEditableIndex={setEditableIndex}
                                  getInwardTabledata={getInwardTabledata}
                                  simpleInwardId={simpleInwardId}
                                  moduleType={moduleType}
                                  setPopupOpenAssignment={setPopupOpenAssignment}
                                  InwardCondition={InwardCondition}
                                  setActionName={setActionName}
                                  setIsViewOpen={setIsViewOpen}
                                  isViewOpen={isViewOpen}
                                  singleData={singleTableData}
                                  setViewTableData={setViewTableData}
                                  getScopeOfWorkData={getScopeOfWorkData}
                                  section={section}
                                  formData={formData}
                                  getSampleMarkLisData={getSampleMarkLisData}
                                  OperationTypeID={OperationTypeID}
                                  setTableData={setTableData}
                                  OperationType={OperationType}
                                  setIsOverlayLoader={setIsOverlayLoader}
                                  isCustomPopupModalShow={isCustomPopupModalShow}
                                />
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  }
                  )}
                  {isDisplayNewAddOption &&
                    action != "opsView" &&
                    moduleType !== "sampleverification" &&
                    action !== "View" && !purchaseCondition && !isCustomPopupModalShow
                    ? section.rows.map((row, rowIndex) => (
                      <tr key={"rowIndex" + rowIndex} className="border-top">
                        {!InwardCondition ? (
                          <>
                            {
                              purchaseCondition && row.data || !purchaseCondition && moduleType !== "sampleverification" ? <td>{rowIndex + 1 + tableData.length}</td> : null
                            }

                            {row.map((cell, cellIndex) => {
                              cell = getCustomCellValues(cell);
                              if (section.isUseForManPower) {
                                if (cell.name === "fk_activity_id") {
                                  cell.customOptions = customOptions;
                                  cell.isCustomOptions = true;
                                }
                              }
                              return (
                                cell.name !== "smpl_detail_smpl_qty_unit" && (
                                  <td key={"cellIndex" + cellIndex}>

                                    <RenderFields
                                      field={cell}
                                      sectionIndex={sectionIndex}
                                      fieldIndex={rowIndex * 100 + cellIndex}
                                      formData={formData}
                                      handleFieldChange={onCustomChangeHandler}
                                      formErrors={formErrors} // Pass formErrors to RenderFields
                                      ///for render table only
                                      renderTable={true}
                                      tableIndex={rowIndex}
                                      customName={
                                        cell.name + "_" + tableData.length
                                      }
                                      masterOptions={updatedMasterOptions}
                                      from="Table"
                                    />
                                  </td>
                                )
                              );
                            })}
                            {!["sampleverification" && "purchaseReq", "purchase"].includes(moduleType) && (
                              <>
                                {
                                  isCIDuplicate && <td>
                                    <RenderFields
                                      field={{
                                        "name": "manual_duplicate_entry",
                                        "type": "number",
                                        "label": "Sample Count",
                                        "placeholder": "Sample Count",
                                        "width": 6,
                                        "fieldWidth": "75"
                                      }}
                                      sectionIndex={sectionIndex}
                                      fieldIndex={rowIndex * 100 + 0}
                                      formData={formData}
                                      handleFieldChange={onCustomChangeHandler}
                                      formErrors={formErrors} // Pass formErrors to RenderFields
                                      ///for render table only
                                      renderTable={true}
                                      tableIndex={rowIndex}
                                      customName={
                                        'manual_duplicate_entry' + "_" + tableData.length
                                      }
                                      masterOptions={updatedMasterOptions}
                                      from="Table"
                                      handleFieldBlur={onSingleFieldChange}
                                    />
                                  </td>}
                                <td className="actionColForIntCert">
                                  <div className="actionColumn">

                                    <ActionOptionsTable
                                      actions={
                                        InwardCondition
                                          ? plusAction
                                          : saveAction
                                      }
                                      onActionHandleClick={onActionHandleClick}
                                      setPopupIndex={setPopupIndex}
                                      newCreation={1}
                                      popupMessages={popupMessages}
                                      saveClicked={saveClicked}
                                      isCustomSave={1}
                                      tableData={tableData}
                                      setEditableIndex={setEditableIndex}
                                      setPopupOpenAssignment={
                                        setPopupOpenAssignment
                                      }
                                      InwardCondition={InwardCondition}
                                      setActionName={setActionName}
                                      getScopeOfWorkData={getScopeOfWorkData}
                                      section={section}
                                      formData={formData}
                                      getSampleMarkLisData={
                                        getSampleMarkLisData
                                      }
                                      OperationTypeID={OperationTypeID}
                                      setTableData={setTableData}
                                      isCustomPopup={isCustomPopup}
                                      setIsCustomPopup={setIsCustomPopup}
                                      OperationType={OperationType}
                                      handleFieldChange={handleFieldChange}
                                      setIsOverlayLoader={setIsOverlayLoader}
                                      isCustomPopupModalShow={isCustomPopupModalShow}
                                    />
                                  </div>

                                </td>

                              </>
                            )}

                          </>
                        ) : (
                          <>

                            <td></td>
                            {row.map((cell, cellIndex) => (
                              <td></td>
                            ))}{" "}
                            <td>

                              {popupOpenAssignment && (
                                <ModalInward
                                  section={section}
                                  sectionIndex={sectionIndex}
                                  formData={formData}
                                  handleFieldChange={onCustomChangeHandler}
                                  formErrors={formErrors}
                                  tableData={tableData}
                                  updatedMasterOptions={updatedMasterOptions}
                                  setPopupOpenAssignment={
                                    setPopupOpenAssignment
                                  }
                                  onActionHandleClick={onActionHandleClick}
                                  actionName={actionName}
                                  handleCloseInwardPopup={
                                    handleCloseInwardPopup
                                  }
                                  editableIndex={editableIndex}
                                  isBtnclicked={isBtnclicked}
                                  setIsOverlayLoader={setIsOverlayLoader}
                                  isOverlayLoader={isOverlayLoader}
                                />
                              )}


                              <div className="actionColumn">

                                <ActionOptionsTable
                                  actions={
                                    InwardCondition ? plusAction : saveAction
                                  }
                                  onActionHandleClick={onActionHandleClick}
                                  setPopupIndex={setPopupIndex}
                                  newCreation={1}
                                  popupMessages={popupMessages}
                                  saveClicked={saveClicked}
                                  isCustomSave={1}
                                  tableData={tableData}
                                  setEditableIndex={setEditableIndex}
                                  setPopupOpenAssignment={
                                    setPopupOpenAssignment
                                  }
                                  InwardCondition={InwardCondition}
                                  setActionName={setActionName}
                                  getScopeOfWorkData={getScopeOfWorkData}
                                  section={section}
                                  formData={formData}
                                  getSampleMarkLisData={getSampleMarkLisData}
                                  OperationTypeID={OperationTypeID}
                                  setTableData={setTableData}
                                  isCustomPopup={isCustomPopup}
                                  setIsCustomPopup={setIsCustomPopup}
                                  OperationType={OperationType}
                                  handleFieldChange={handleFieldChange}
                                  setIsOverlayLoader={setIsOverlayLoader}
                                  isCustomPopupModalShow={isCustomPopupModalShow}
                                />
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                    : null}

                </tbody>
              </table >
              </div>)}

            <div className="align-end-100 ">
              {['jobinstruction'].includes(moduleType) &&
                formData[0]?.ji_id &&
                OperationTypeID &&
                operationStepNo == 2 && !section.isUseForActivity &&
                (
                  <>
                    <div
                      key={"Form-Accordion"}
                      className={" col-md-" + 3}
                    >
                      <RenderFields
                        field={{
                          "name": "allBalanceVallue",
                          "type": "label",
                          "label": "Balance Qty.",
                          "width": 3,
                          "fieldWidth": "50"
                        }}
                        sectionIndex={0}
                        fieldIndex={0 * 100 + 0}
                        formData={formData}
                        handleFieldChange={onCustomChangeHandler}
                        formErrors={formErrors} // Pass formErrors to RenderFields
                        ///for render table only
                        renderTable={true}
                        tableIndex={0}
                      />
                    </div>
                    <div
                      key={"Form-Accordion"}
                      className={" col-md-" + 3}
                    >
                      <RenderFields
                        field={{
                          "name": "allTotalVallue",
                          "type": "label",
                          "label": "Total Lot Qty.",
                          "width": 3,
                          "fieldWidth": "50"
                        }}
                        sectionIndex={0}
                        fieldIndex={0 * 100 + 0}
                        formData={formData}
                        handleFieldChange={onCustomChangeHandler}
                        formErrors={formErrors} // Pass formErrors to RenderFields
                        ///for render table only
                        renderTable={true}
                        tableIndex={0}
                      />
                    </div>

                  </>
                )
              }

            </div>
            <div className={`${moduleType === "purchase" ? "align-end-purchase" : "align-end-100"}`}>
              {
                ["purchase"].includes(moduleType) && <div className="total-purchase">
                  {purchase_req.map((pr_field) => {
                    if (pr_field.name === "po_total_amt") {
                      pr_field = {
                        ...pr_field,
                        defaultValue: getPoTotalcount()
                      }
                    }
                    return (<RenderFields
                      field={pr_field}
                      sectionIndex={1}
                      fieldIndex={0 * 100 + 0}
                      formData={formData}
                      handleFieldChange={onCustomChangeHandler}
                      formErrors={formErrors} // Pass formErrors to RenderFields
                      ///for render table only
                      renderTable={true}
                      tableIndex={0}
                    />)
                  }
                  )}

                </div>
              }

            </div>
          </CardBody >
        )}
      </Card >
      {
        popupAddPurchaseReq && (
          <PopUpPurchaseReq
            setPopupAddPurchaseReq={setPopupAddPurchaseReq}
            popupAddPurchaseReq={popupAddPurchaseReq}
            formData={formData}
            handleFieldChange={handleFieldChange}
            formErrors={formErrors}
            tab={tab}
            sectionIndex={sectionIndex}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            navigate={navigate}
            setFormData={setFormData}
            editableIndex={editableIndex}
            setEditableIndex={setEditableIndex}
            setTableData={setTableData}
            moduleType={moduleType}
            tableData={tableData}
          />)
      }

      {
        isViewOpen && (
          <SampleVerificationDetals
            setIsViewOpen={setIsViewOpen}
            viewTableData={viewTableData}
          />
        )
      }
      {
        isCustomPopup && (
          <RenderTablePopup
            section={section}
            sectionIndex={sectionIndex}
            formData={formData}
            handleFieldChange={onCustomChangeHandler}
            formErrors={formErrors}
            tableData={tableData}
            updatedMasterOptions={updatedMasterOptions}
            setPopupOpenAssignment={
              setPopupOpenAssignment
            }
            onActionHandleClick={onActionHandleClick}
            actionName={actionName}
            handleCloseCustomPopup={
              handleCloseCustomPopup
            }
            editableIndex={editableIndex}
            isBtnclicked={isBtnclicked}
            setIsOverlayLoader={setIsOverlayLoader}
            isOverlayLoader={isOverlayLoader}
            getCustomCellValues={getCustomCellValues}
            moduleType={moduleType}
            operationStepNo={operationStepNo}
            OperationType={OperationType}
          />)
      }

    </div >
  );
};

RenderTableSection.propTypes = {
  section: PropTypes.object.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  formData: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  addRow: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  popupMessages: PropTypes.object.isRequired,
  pageType: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  masterOptions: PropTypes.object.isRequired,
  saveClicked: PropTypes.bool.isRequired,
  setSaveClicked: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
  tableData: PropTypes.array.isRequired,
  moduleType: PropTypes.string.isRequired,
  setSimpaleInwardResponse: PropTypes.func.isRequired,
  simpleInwardResponse: PropTypes.object.isRequired,
  groupDefaultValue: PropTypes.string.isRequired,
  testMemoId: PropTypes.string.isRequired,
  getVerificationDetails: PropTypes.func.isRequired,
  getSampleIdsMasterData: PropTypes.func.isRequired,
  setIsOverlayLoader: PropTypes.func,
  isOverlayLoader: PropTypes.bool,
  OperationType: PropTypes.string,
  OperationTypeID: PropTypes.number,
};

export default RenderTableSection;
