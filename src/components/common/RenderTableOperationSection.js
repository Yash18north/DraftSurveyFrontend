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
import { getSelectedOptionName } from "../../services/commonFunction";
import { assignmentPageHandleAction } from "./commonHandlerFunction/GroupAssignmentFunctions";
import { InwardPageHandleAction } from "./commonHandlerFunction/sampleInwardHandlerFunctions";
import { sampleVerificationHandler } from "./commonHandlerFunction/sampleVerificationHandlerFunctions";
import PropTypes from "prop-types";
import ModalInward from "./commonModalForms/modalInward";
import SampleVerificationDetals from "./commonModalForms/SampleVerificationDetals";
import {
  getJIsowandactivityData,
  getOPActivityData,
  getOpeartionType,
  getOPLoadingUnLoadingSourceData,
  getOPScopeWorkData,
  handleScopeOfWorkFunction,
} from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import {
  getAllSampleMarkList,
  handleTMLOperationCreateUpdate,
} from "./commonHandlerFunction/operations/TMLOperations";
const RenderTableOperationSection = ({
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
}) => {
  const [popupIndex, setPopupIndex] = useState(-1);
  const [isDisplayNewAddOption, setIsDisplayNewAddOption] = useState(true);

  const [popupOpenAssignment, setPopupOpenAssignment] = useState(false);
  const [isBtnclicked, setIsBtnClicked] = useState(false);
  const [sampleDetails, setSampleDetails] = useState([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewTableData, setViewTableData] = useState([]);
  const [inwardDataTable, setInwardDataTable] = useState([]);

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

  const [simpleInwardId, setSimpleInwardId] = useState("");
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
        tableData.map((row, rowIndex) => {
          let newFieldName = actualFieldName + "_" + rowIndex;
          if (!updatedFormData[sectionIndex][newFieldName]) {
            updatedFormData[sectionIndex][newFieldName] = value;
          }
        });

        setFormData(updatedFormData);
        return;
      }
    }
    handleFieldChange(sectionIndex, fieldName, value, type, isChecked);
  };

  useEffect(() => {
    setSimpleInwardId(formData[1]?.sampleInwardIdMain);
    setTimeout(() => {
      if (formData[1]?.sampleInwardIdMain) {
        getInwardTabledata(formData[1]?.sampleInwardIdMain);
      }
    }, 1000);
  }, [formData[1]?.sampleInwardIdMain]);
  useEffect(() => {
    setTimeout(() => {
      if (moduleType === "sampleverification" && testMemoId && !editableIndex) {
        getSampleLabCodeDetails(testMemoId);
      }
    }, 1000);
  }, [testMemoId]);
  useEffect(() => {
    if (testMemoId && !editableIndex && moduleType === "sampleverification") {
      getVerificationDetails(formData[0].sv_id, 1);
      setTimeout(() => {
        getSampleLabCodeDetails(testMemoId);
      }, 1000);
    }
  }, [editableIndex]);
  useEffect(() => {
    if (moduleType === "sampleinward") {
      setTimeout(() => {
        getSampleOptionData();
      }, 1000);
    }
  }, [masterOptions, selectedOptions]);

  useEffect(() => {
    if (moduleType == "jobinstruction" && !section.isUseForVessel) {
      // getOpeartionType(setUpdatedMasterOptions)
      getOPActivityData(setUpdatedMasterOptions);
      getOPScopeWorkData(setUpdatedMasterOptions);
      // getOPLoadingUnLoadingSourceData(setUpdatedMasterOptions)
    }
  }, []);
  useEffect(() => {
    if (formData[0]?.ji_id && !section.isUseForVessel) {
      getJIsowandactivityData(
        formData[0]?.ji_id,
        setTableData,
        "scope_of_work",
        formData,
        setFormData,
        section
      );
    } else if (formData[0]?.ji_id && OperationTypeID) {
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
        setIsDisplayNewAddOption
      );
    }
  }, [formData[0]?.ji_id, formData[0]?.fk_jiid, formData[0]?.fk_jisid]);
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
    InwardUnits.map((singleOpt) => {
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
  const onActionHandleClick = async (actionSelected) => {
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
        // getSampleLabCodeDetails,
        setPopupIndex,
        setEditableIndex,
        popupIndex,
        "",
        setIsOverlayLoader
      );
    } else if (moduleType === "jobinstruction") {
      if (section.isUseForVessel) {
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
          OperationTypeID
        );
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
          setFormData
        );
      }
    } else {
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
        setIsOverlayLoader,
        1
      );
    }
  };

  const getInwardTabledata = async (simpleId) => {
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
        tableData.map((singleInwardData, i) => {
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
        setTableData(res.data.data.sample_detail_data);
      } else if (pageType === "assignment") {
        let selectedSimpleIds = [];
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
      setTimeout(() => {
        getAllSampleMarkList(
          formData[0]?.fk_jiid,
          formData[0]?.fk_jisid,
          setTableData,
          formData,
          setFormData,
          section,
          "sampleInward",
          res.data.data.sample_detail_data,
          updatedFormData
        );
      }, 10);
      setFormData(updatedFormData);
    }
  };

  const getSampleLabCodeDetails = async (testMemoId) => {
    let payload = {
      test_memo_id: testMemoId,
    };
    let count = 0;
    let res = await postDataFromApi(getsamplelabcodeApi, payload);
    if (res.data.status === 200) {
      const updatedFormData = { ...formData };
      let SPTableData = [];
      res.data.data.forEach((singleData, i) => {
        if (!updatedFormData[sectionIndex]) {
          updatedFormData[sectionIndex] = {};
        }
        singleData?.["sample_details"].map((smlDetails, spID) => {
          SPTableData.push(smlDetails);
          const ExistsData = checkVerificationDataExists(
            smlDetails["sp_lab_smplcode"]
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
                  value = ExistsData[0].svd_smplweight.split(' / ');
                  value = value[0] + ' ' + value[1];
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
                [
                  "svd_stdsizeofsmpl",
                  "svd_abovesize",
                  "svd_belowsize",
                ].includes(columnName.name)
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
                  updatedFormData[sectionIndex][fieldName] = value;
                }
              } else {
                updatedFormData[sectionIndex][fieldName] = value;
              }
            });
          });
          count++;
        });
      });
      setFormData(updatedFormData);
      setTableData(SPTableData);
    }
  };

  const checkVerificationDataExists = (sp_lab_smplcode) => {
    if (formData["0"].sv_detail && formData["0"].sv_detail.length > 0) {
      return formData["0"].sv_detail.filter((singleData) => {
        return singleData.svd_smpllabcode === sp_lab_smplcode;
      });
    }
    return [];
  };

  const InwardCondition = moduleType === "sampleinward";
  // const IsVerification = moduleType === "sampleverification";
  const IsVerification = false;
  const [actionName, setActionName] = useState("");

  const handleCloseInwardPopup = () => {
    setPopupOpenAssignment(false);
    setPopupIndex("");
    setEditableIndex("");
    if (formData[1]?.sampleInwardIdMain) {
      getInwardTabledata(formData[1]?.sampleInwardIdMain);
    }
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
      // && !formData[0].jrf_is_ops
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

  const getCustomCellValues = (cell, rowIndex) => {
    if (cell.type === "doubleText") {
      // cell.name = cell.name + "_" + rowIndex;
      cell.secondName = cell.name + "_unit_" + rowIndex;
    }
    if (moduleType === "sampleverification") {
      if (
        [
          "svd_stdsizeofsmpl_unit",
          "svd_abovesize_unit",
          "svd_belowsize_unit",
        ].includes(cell.name)
      ) {
        if (GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) == "TPBPL") {
          cell.secondoptions = ["Ltr", "ml", "gm"];
        }
      }
    }
    if (cell.type === "date") {
      cell.noRestrictionApply = true
    }
    return cell;
  };
  const getSampleQtyText = (cell, rowIndex) => {
    let sampleQtyUnit = formData[sectionIndex][cell.name + "_" + rowIndex] ? formData[sectionIndex][cell.name + "_" + rowIndex] + " " + formData[sectionIndex][cell.name + "_unit" + "_" + rowIndex] : ''
    if (InwardCondition && ["Raw and Powdered Sample","Physical and Raw Sample", "Physical,Raw and Powdered Sample"].includes(formData[sectionIndex]["smpl_detail_smpl_condtion_" + rowIndex])) {
      if (["Physical,Raw and Powdered Sample"].includes(formData[sectionIndex]["smpl_detail_smpl_condtion_" + rowIndex])) {
        sampleQtyUnit=(formData[sectionIndex]["smpl_detail_smpl_physical_qty_" + rowIndex] || '') + " " + (formData[sectionIndex]["smpl_detail_smpl_physical_qty_unit" + "_" + rowIndex] || '')+' ,'+sampleQtyUnit
      }
      sampleQtyUnit += " ," + formData[sectionIndex]["smpl_detail_smpl_pwd_qty_" + rowIndex] + " " + formData[sectionIndex]["smpl_detail_smpl_pwd_qty_unit" + "_" + rowIndex]
    }
    return sampleQtyUnit
  }
  return (
    <div key={sectionIndex} className="row my-2 mx-0 bg-white">
      <Card className="Scrollable">
        {(simpleInwardId || pageType !== "inward") && (
          <CardBody>
            <CardTitle tag="h5">{section.title}</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              {/* Overview of the projects */}
            </CardSubtitle>
            <table className={`${'table table-white responsive borderless no-wrap mt-3 align-middle renderTable '} ${moduleType === "sampleinward" ? "inwardTable-th-td" : ''}`}>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  {section.headers.map(
                    (header, headerIndex) => {
                      if (header.name === "smpl_detail_smpl_qty") {
                        header.label = "Approx. Qty."
                      }
                      return header.name !== "smpl_detail_smpl_qty_unit" && (
                        <th key={"headerIndex" + headerIndex}>
                          {header.label}
                        </th>
                      )
                    }
                  )}
                  {action !== "View" ? <th>Action</th> : null}
                </tr>
              </thead>
              <tbody>
                {tableData.map((singleTableData, rowIndex) =>
                  section.rows.map((row, rowIndex2) => (
                    <tr key={"rowIndex" + rowIndex} className="border-top">
                      <td>{rowIndex + 1}</td>
                      {row.map(
                        (cell, cellIndex) =>
                          !["smpl_detail_smpl_qty_unit"].includes(
                            cell.name
                          ) && (
                            <td key={"cellIndex" + cellIndex}>
                              {(editableIndex === 0 && rowIndex === 0) ||
                                (editableIndex === rowIndex &&
                                  !InwardCondition) ||
                                IsVerification ? (
                                <span>
                                  <RenderFields
                                    field={getCustomCellValues(cell, rowIndex)}
                                    sectionIndex={sectionIndex}
                                    fieldIndex={rowIndex * 100 + cellIndex}
                                    formData={formData}
                                    handleFieldChange={handleFieldChange}
                                    formErrors={formErrors} // Pass formErrors to RenderFields
                                    ///for render table only
                                    renderTable={true}
                                    tableIndex={rowIndex}
                                    // viewOnly={popupIndex != rowIndex}
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
                              ) : cell.name == "smpl_detail_smpl_qty" ? getSampleQtyText(cell, rowIndex) : (
                                formData[sectionIndex][
                                cell.name + "_" + rowIndex
                                ]
                              )}
                            </td>
                          )
                      )}
                      <td>
                        <div className="actionColumn">
                          {action !== "View" ? (
                            <ActionOptionsTable
                              actions={
                                IsVerification
                                  ? VerificationSaveAction
                                  : (editableIndex === 0 && rowIndex === 0) ||
                                    editableIndex === rowIndex
                                    ? EditAction
                                    : editableIndex === 0 || editableIndex
                                      ? []
                                      : MainAction
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
                            />
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {isDisplayNewAddOption &&
                  moduleType !== "sampleverification" &&
                  action !== "View"
                  ? section.rows.map((row, rowIndex) => (
                    <tr key={"rowIndex" + rowIndex} className="border-top">
                      {!InwardCondition ? (
                        <>
                          <td>{rowIndex + 1 + tableData.length}</td>
                          {row.map(
                            (cell, cellIndex) =>
                              cell.name !== "smpl_detail_smpl_qty_unit" && (
                                <td key={"cellIndex" + cellIndex}>
                                  <RenderFields
                                    // field={cell}
                                    field={getCustomCellValues(cell, rowIndex)}
                                    sectionIndex={sectionIndex}
                                    fieldIndex={rowIndex * 100 + cellIndex}
                                    formData={formData}
                                    handleFieldChange={handleFieldChange}
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
                          )}
                          {!["sampleverification"].includes(moduleType) && (
                            <>
                              <td>
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
                                handleFieldChange={handleFieldChange}
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
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                  : null}
              </tbody>
            </table>
          </CardBody>
        )}
      </Card>
      {isViewOpen && (
        <SampleVerificationDetals
          setIsViewOpen={setIsViewOpen}
          viewTableData={viewTableData}
        />
      )}
    </div>
  );
};

RenderTableOperationSection.propTypes = {
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

export default RenderTableOperationSection;
