import React, { useEffect, useState } from "react";
import RenderFields from "./RenderFields";
import { Button, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

import {
  consortiumDeleteApi,
  getsamplelabcodeApi,
  sampleInwardDetailsGetAPI,
  testReportDetailsApi,
} from "../../services/api";

import { postDataFromApi } from "../../services/commonServices";
import ActionOptionsTable from "./ActionOptionsTable";
import {
  getFormatedDate,
  getRakeOperations,
  getSelectedOptionName,
  getVesselOperation,
  getTruckOperations,
  getPlantOperations,
  getTotalCountBasedOnField,
  getTextWithouHtml
} from "../../services/commonFunction";
import { assignmentPageHandleAction } from "./commonHandlerFunction/GroupAssignmentFunctions";
import { InwardPageHandleAction } from "./commonHandlerFunction/sampleInwardHandlerFunctions";
import { sampleVerificationHandler } from "./commonHandlerFunction/sampleVerificationHandlerFunctions";
import PropTypes from "prop-types";
import ModalInward from "./commonModalForms/modalInward";
import SampleVerificationDetals from "./commonModalForms/SampleVerificationDetals";
import { toast } from "react-toastify";
import {
  getAllSampleMarkListDataForDD,
  getSingleSampleCollectionData,
  getSingleSizeAnalysisData,
  OperationSizeAnalysisCreateDataFunction,
  totalTannange,
  totalTannangeBalance
} from "./commonHandlerFunction/operations/TMLOperations";
import { all } from "axios";
import RenderTablePopup from "./commonModalForms/RenderTablePopup";

const RenderTableSetAllManualSection = ({
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
  viewOnly,
  OperationType,
  tabIndex,
  operationStepNo,
  OperationTypeID,
  setActiveTab,
  tableLength,
  setTableLength,
  checkShowButtonConditon,
  operationMode
}) => {
  const [popupIndex, setPopupIndex] = useState(-1);
  const [isDisplayNewAddOption, setIsDisplayNewAddOption] = useState(true);

  const [popupOpenAssignment, setPopupOpenAssignment] = useState(false);
  const [isBtnclicked, setIsBtnClicked] = useState(false);
  const [sampleDetails, setSampleDetails] = useState([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewTableData, setViewTableData] = useState([]);
  const [allTableData, setAllTableData] = useState([]);
  const [simpleInwardId, setSimpleInwardId] = useState("");
  const [editableIndex, setEditableIndex] = useState("");
  const [updatedMasterOptions, setUpdatedMasterOptions] = useState([]);
  const [actualMasterOptions, setActualMasterOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isShowContents, setIsShowContents] = useState(false);
  const [isCustomPopup, setIsCustomPopup] = useState(false);
  const isCustomPopupModalShow = section?.isSeperatePopupOpen
  let totalTannangeBal = 0;
  let actualTannantbal = 0;
  if ((OperationType === getVesselOperation("SV") && tabIndex === 7) || operationStepNo == 6) {
    let fieldName = 'total_tonnage'
    if (operationStepNo == 6) {
      fieldName = 'sample_qty'
    }
    totalTannangeBal = totalTannangeBalance(allTableData, formData, fieldName)
    actualTannantbal = totalTannange(allTableData, formData)
  }
  useEffect(() => {
    if ((OperationType === getVesselOperation("SV") && tabIndex === 7) || operationStepNo == 6) {
      if (totalTannangeBal <= 0) {
        // setIsDisplayNewAddOption(false)
      }
      else {
        setIsDisplayNewAddOption(true)
      }
    }
  }, [totalTannangeBal])
  useEffect(() => {

    if (section.multipleTableExists) {
      setAllTableData(
        tableData[section.tableNumber] ? tableData[section.tableNumber] : []
      );
    } else {
      setAllTableData(tableData);
    }
  }, [tableData]);
  useEffect(() => {
    if (formData[1]?.["opsvsv_id"]) {
      if (section.multipleTableExists) {
        setAllTableData(
          tableData[section.tableNumber] ? tableData[section.tableNumber] : []
        );
      } else {
        setAllTableData(tableData);
      }
    }
  }, [formData[1]?.["opsvsv_id"]]);
  useEffect(() => {
    if (section.multipleTableExists) {
      const newtabledata = tableData;
      newtabledata[section.tableNumber] = allTableData;

      setTableData(newtabledata);
    } else {
      // setTableData(allTableData)
    }
  }, [allTableData, editableIndex]);
  useEffect(() => {
    if (!section.multipleTableExists) {
      setTableData(allTableData);
    }
  }, [popupIndex]);
  useEffect(() => {
    if (moduleType === "jobinstruction") {
      if (operationStepNo == 4) {
        getAllSampleMarkListDataForDD(formData[0]?.ji_id, OperationTypeID, setIsOverlayLoader, setActualMasterOptions)
        getSingleSizeAnalysisData(
          OperationTypeID,
          formData,
          setTableData,
          setIsOverlayLoader,
          setFormData
        );
      }
      else if (operationStepNo == 6) {
        if (formData[0]?.ji_id) {
          getSingleSampleCollectionData(
            OperationTypeID,
            formData,
            setTableData,
            setIsOverlayLoader,
            setFormData
          );
        }

      }
    }
  }, [formData[0]?.ji_id]);
  useEffect(() => {
    setIsShowContents(true)
  }, [])
  useEffect(() => {
    if (allTableData.length > 0) {
      if (operationStepNo !== 4) {
        setFormData((prevData) => {
          section.rows[0].map((field, i) => {
            prevData[1][field.name + '_' + allTableData.length] = allTableData[allTableData.length - 1][field.name]
          })
          return {
            ...prevData,
            [1]: {
              ...prevData[1]
            },
          };
        });
      }
    }


  }, [allTableData.length])
  useEffect(() => {
    if (OperationType === getRakeOperations("QAss") && tabIndex === 1) {
      gettotalLotQuantity()
    }
  }, [allTableData.length, editableIndex])
  const gettotalLotQuantity = () => {
    let valume_in_cubic_mtr = 0;
    let measurement_qty_in_mt = 0;
    allTableData.forEach((singleData, indextab) => {
      const valumnValue = formData[1]?.['valume_in_cubic_mtr_' + indextab] !== undefined ? formData[1]?.['valume_in_cubic_mtr_' + indextab] : singleData.valume_in_cubic_mtr
      const measurementValue = formData[1]?.['measurement_qty_in_mt_' + indextab] !== undefined ? formData[1]?.['measurement_qty_in_mt_' + indextab] : singleData.measurement_qty_in_mt
      valume_in_cubic_mtr = parseFloat(valume_in_cubic_mtr) + parseFloat(valumnValue);
      measurement_qty_in_mt = parseFloat(measurement_qty_in_mt) + parseFloat(measurementValue);
    });
    setTimeout(() => {
      const updatedFormData = { ...formData };
      if (!updatedFormData[0]) {
        updatedFormData[0] = {};
      }
      updatedFormData[0]['all_valume_in_cubic_mtr'] = valume_in_cubic_mtr.toFixed(3)
      updatedFormData[0]['all_measurement_qty_in_mt'] = measurement_qty_in_mt.toFixed(3)
      setFormData(updatedFormData)
    }, 10)
  }
  let EditAction = [
    {
      icon: "bi bi-floppy2",
      text: "Save",
    },
    // {
    //   icon: "bi bi-trash",
    //   text: "Delete",
    // },
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

  const onSingleFieldChange = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = "",
    isOptionsDetails,
    optionDetails,
  ) => {
    let beforeLastPart = fieldName.slice(0, fieldName.lastIndexOf("_"));
    beforeLastPart = ['tr_os_total_qty'].includes(fieldName) ? fieldName : beforeLastPart
    let lastIndex = fieldName.split('_')
    lastIndex = lastIndex[lastIndex.length - 1]
    if (['cc_in_mt', 'area_in_sq_mtr', 'loaded_height_in_mtr', 'tr_os_total_qty', 'rk_density'].includes(beforeLastPart)) {
      value = value ? parseFloat(value).toFixed(3) : 0
    }
    let spName = fieldName.split("_");
    let newRowIndex = spName[spName.length - 1]
    let volume = parseFloat(formData["1"]?.["area_in_sq_mtr" + "_" + newRowIndex]) *
      parseFloat(formData["1"]?.["loaded_height_in_mtr" + "_" + newRowIndex]);
    const newFieldName = fieldName.replace(/_\d+$/, "");
    if (['loaded_height_in_mtr', 'area_in_sq_mtr', 'rk_density'].includes(newFieldName)) {
      // let MeasureVolume = volume * parseFloat(formData[1]?.density);
      let MeasureVolume = volume * parseFloat(formData["1"]?.["rk_density" + "_" + newRowIndex]);
      volume = volume ? parseFloat(volume).toFixed(3) : 0;
      MeasureVolume = MeasureVolume ? parseFloat(MeasureVolume).toFixed(3) : 0;
      handleFieldChange(sectionIndex, "valume_in_cubic_mtr" + "_" + newRowIndex, volume, type, isChecked);
      handleFieldChange(sectionIndex, "measurement_qty_in_mt" + "_" + newRowIndex, MeasureVolume, type, isChecked);
    }
    // else if (newFieldName === "seal_number") {
    //   let count = formData["1"]?.["seal_number" + "_" + newRowIndex]?.split(",").length;
    //   handleFieldChange(sectionIndex, "seal_number_count" + "_" + newRowIndex, count?.toString(), type, isChecked);

    // }
    if (operationStepNo == 4) {
      if (['group_no'].includes(beforeLastPart)) {
        if (value > (tableData.length + 1)) {
          value = tableData.length + 1
        }
        const existgrp = tableData.find((singleData) => singleData[beforeLastPart] == value)
        if (existgrp) {
          handleFieldChange(sectionIndex, "qty_" + lastIndex, existgrp?.qty, type, isChecked);
          handleFieldChange(sectionIndex, "size_analysis_" + lastIndex, existgrp?.size_analysis, type, isChecked);
          // handleFieldChange(sectionIndex, "pa_sample_mark_" + lastIndex, existgrp?.pa_sample_mark, type, isChecked);
        }
        else {
          // handleFieldChange(sectionIndex, "pa_sample_mark_" + lastIndex, '', type, isChecked);
        }
      }
      else if (['size_analysis'].includes(beforeLastPart)) {
        if (tableData.find((singleData) => singleData[beforeLastPart] == value && singleData['group_no'] != formData[1]['group_no_' + lastIndex])) {
          toast.error("This Parameter Name Already Exist for other group", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return false
        }
      }
      else if (['pa_sample_mark_id'].includes(beforeLastPart)) {
        if (isOptionsDetails) {
          handleFieldChange(sectionIndex, "pa_sample_mark_" + lastIndex, optionDetails?.name);
        }
      }
    }
    handleFieldChange(sectionIndex, fieldName, value, type, isChecked);
  };
  const [uniqueTruck, setUniqueTruck] = useState([]);
  const onActionHandleClick = async (actionSelected) => {
    let ExistsData = allTableData;
    if (actionSelected === "Save" || actionSelected === "customSave") {
      setIsBtnClicked(true);
      let newRowIndex = editableIndex;
      if (actionSelected === "customSave") {
        newRowIndex = allTableData.length;
      }

      let payload = {};
      section.rows[0].map((field) => {
        if (tabIndex === 7 && field.name === "unit") {
          payload[field.name] = "MT";
        }
        else if (field.type === "doubleText") {
          payload[field.name] = (formData["1"]?.[field.name + "_" + newRowIndex] || "")
          payload[field.secondName] = (formData["1"]?.[field.secondName] || "")
        }
        else {
          payload[field.name] = formData["1"]?.[field.name + "_" + newRowIndex];
        }
        payload[field.name] = typeof payload[field.name] === "string"
          ? payload[field.name].replace(/\\t/g, "")
          : payload[field.name] ?? "";
        if (field.type === "doubleText") {
          payload[field.secondName] = typeof payload[field.secondName] === "string"
            ? payload[field.secondName].replace(/\\t/g, "")
            : payload[field.secondName] ?? "";
        }
      });
      let nonRequiredFields = [];
      if (OperationType === getVesselOperation("SV")) {
        if (tabIndex === 7) {
          nonRequiredFields.push(
            'remarks',
            'unit',
            "dms_barge_type",
            "dms_barge_name",
            "dms_loading_commence",
            "dms_loading_completed",
            "dms_tonnage",
            "dms_total_tonnage",
            "dms_above_10_mesh",
            "dms_100_mesh")
        }
        if (tabIndex === 5) {
          nonRequiredFields=[]
          section.rows[0].map((field)=>{
            if(!['barge_detail_loading_name'].includes(field.name)){
              nonRequiredFields.push(field.name)
            }
          })
        }
        else if (tabIndex === 6) {
          nonRequiredFields=[]
          section.rows[0].map((field)=>{
            if(!['barge_detail_unloading_name'].includes(field.name)){
              nonRequiredFields.push(field.name)
            }
          })
        }
      }
      if (['TR', 'TRUCK'].includes(operationMode.toUpperCase()) || OperationType === getPlantOperations('TR')) {
        if (operationStepNo == 6) {
          nonRequiredFields.push('lot_no')
        }
        nonRequiredFields = [
          ...nonRequiredFields,
          "truck_gross_weight",
          "tare_weight",
          "net_weight",
          "truck_supplier",
          "truck_transporter",
          "truck_mines",
          "truck_no_of_truck",
          "truck_form_l_no",
          "truck_source"
        ]
      }
      for (let obj in payload) {
        const field = section.rows[0].filter((field, index) => {
          if (field.name === obj) {
            field.label = section.headers[index].label;
            return true;
          }
          return false;
        });
        let errLabel = field ? field[0]?.label : "";
        // if (obj === "no_of_truck") {
        //   if ((uniqueTruck).includes(payload[obj])) {
        //     toast.error("This Truck Number Already Exist", {
        //       position: "top-right",
        //       autoClose: 2000,
        //       hideProgressBar: false,
        //       closeOnClick: true,
        //       pauseOnHover: true,
        //       draggable: true,
        //       progress: undefined,
        //       theme: "light",
        //     });
        //     return false
        //   }
        //   else {
        //     setUniqueTruck((prevTrucks) => [...prevTrucks, payload[obj]]);
        //   }
        // }
        if (
          (payload[obj] === undefined || payload[obj] === "") &&
          !nonRequiredFields.includes(obj)
        ) {
          if (field.length > 0) {
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
        }

        else if (field[0]?.pattern && !(payload[obj].match(field[0]?.pattern))) {
          toast.error(errLabel + " Doesn't Match the Pattern", {
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
      if (operationStepNo == 4) {
        payload['pa_sample_mark'] = formData[1]["pa_sample_mark_" + newRowIndex]
        if (tableData.find((singleData) => singleData['size_analysis'] == payload['size_analysis'] && singleData['group_no'] != payload['group_no'])) {
          toast.error("This Parameter Name Already Exist for other group", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return false
        }
      }



      if ((OperationType === getVesselOperation("SV") && tabIndex === 7) || operationStepNo == 6) {
        let isOverQty = false;
        let fieldName = 'total_tonnage'
        if (operationStepNo == 6) {
          fieldName = 'sample_qty'
        }
        if (actionSelected === "customSave") {
          if ((parseFloat(totalTannangeBal) - parseFloat(formData[1][fieldName + '_' + newRowIndex])) < 0) {
            isOverQty = true
          }
        }
        else {
          let beforeinputamount = parseFloat(totalTannangeBal) + parseFloat(ExistsData[newRowIndex][fieldName]);
          const newAfterdeductValue = parseFloat(beforeinputamount) - parseFloat(formData[1][fieldName + '_' + newRowIndex])
          if (newAfterdeductValue < 0) {
            isOverQty = true
          }
        }
      }
      if (actionSelected === "Save") {
        ExistsData[newRowIndex] = payload;
        setTableLength(tableLength + 1)
      } else {
        ExistsData.push(payload);
        setTableLength(tableLength + 1)
      }
      setAllTableData(ExistsData);
      setPopupOpenAssignment(false);
      setPopupIndex("");
      setEditableIndex("");
      setIsBtnClicked(false);
      setIsOverlayLoader(false);
      setSaveClicked(false);
      setIsCustomPopup(false)
    } else if (actionSelected === "Delete") {
      let newRowIndex = popupIndex;
      ExistsData = allTableData;
      ExistsData.splice(newRowIndex, 1);
      setAllTableData(ExistsData);
      setPopupOpenAssignment(false);
      setPopupIndex("");
      setEditableIndex("");
      setIsBtnClicked(false);
      setIsOverlayLoader(false);
      setSaveClicked(false);
      setTableLength(tableLength - 1)
      setIsCustomPopup(false)
    } else if (actionSelected === "Cancel") {
      setEditableIndex("");
      setIsCustomPopup(false)
    }

    if (actionSelected === "Save" || actionSelected === "customSave" || actionSelected === "Delete") {
      if (operationStepNo == 4) {
        OperationSizeAnalysisCreateDataFunction(
          formData,
          setIsOverlayLoader,
          setIsOverlayLoader,
          OperationType,
          OperationTypeID,
          null,
          ExistsData,
          operationStepNo,
          "",
          false,
          "",
          "",
          1,
          setAllTableData,
          setFormData
        )
      }
    }
  };
  const [actionName, setActionName] = useState("");

  const getCustomCellValues = (cell, rowIndex, isNewAdd) => {
    if (cell.type === "doubleText") {
      cell.secondName = cell.name + "_unit_" + rowIndex;
    }
    if (cell.type === "date") {
      cell.noRestrictionApply = true
    }
    if (operationStepNo == 4) {
      if (cell.name === "qty") {
        // if (tableData.find((singleData) => singleData['group_no'] == formData[1]?.['group_no_' + tableData.length])) {
        //   cell.readOnly = true
        // }
        // else {
        //   cell.readOnly = false;
        // }
      }
      else if (cell.name === "pa_sample_mark_id") {
        let filteroption = []
        let selectedfilteroption = []

        actualMasterOptions?.forEach((model, index) => {
          if (model.model === 'pa_sample_mark_id') {
            filteroption = []
            filteroption = []
            model.data.map((option) => {
              if (tableData.find((singleData) => singleData['pa_sample_mark_id'] === option.name)) {
                // selectedfilteroption.push(option.name)
              }
              filteroption.push(option.name)
            });
            return
          }
        });
        // if (tableData.find((singleData) => singleData['group_no'] == formData[1]?.['group_no_' + tableData.length])) {
        //   cell.readOnly = true
        // }
        // else {
        if (rowIndex === tableData.length && isNewAdd) {
          filteroption = filteroption.filter((opt) => !selectedfilteroption.includes(opt))
        }
        cell.readOnly = false;
        // }
        // cell.options = filteroption
        cell.options = []
        cell.type = 'select'
      }
    }
    if (moduleType == "internalcertificate") {
      if (cell.name === "sa_sample_id") {
        cell.options = formData[0]?.sample_inward_detail?.map((singleSample) => {
          return singleSample?.smpl_detail_smpl_id
        })
      }
    }
    return cell;
  };
  const [sampleOptions, setSampleOptions] = useState([]);
  useEffect(() => {
    if ([getTruckOperations('OS'), getTruckOperations('CS')].includes(OperationType)) {
      const totalQuantity = allTableData
        .map(item => parseFloat(item.quantity.replace(/\s*MT/, '')))
        .reduce((sum, qty) => sum + qty, 0);
      let noOfTruck = 0
      if (OperationType === getTruckOperations('CS')) {
        allTableData.map((singleRec) => {
          noOfTruck = noOfTruck + parseInt(singleRec.no_of_truck || 0)
        })
      }

      setFormData((prevData) => {
        return {
          ...prevData,
          [1]: {
            ...prevData[1],
            ["tr_os_no_of_trucks"]: allTableData?.length || '0',
            ["tr_cs_no_of_trs"]: noOfTruck,
            ["tr_os_total_qty"]: parseFloat(totalQuantity).toFixed(3) || '0',
            ["tr_cs_total_qty"]: parseFloat(totalQuantity).toFixed(3) || '0',
          },
        };
      });
    }
  }, [allTableData.length])

  const getSingleOSCommonfield = () => {
    return (
      <>
        <RenderFields
          field={{
            width: 12,
            name: "tr_os_no_of_trucks",
            label: "Number of Trucks",
            type: "text",
            placeholder: "Enter Number of Trucks",
            // options: sampleOptions,
            isCustomOptions: true,
            customOptions: sampleOptions,
            value: 0,
            required: true,
            fieldWidth: 100,
            multiple: true,
            defaultValue: 0,
            readOnly: true
          }}
          sectionIndex={1}
          fieldIndex={1 * 100 + 1}
          formData={formData}
          handleFieldChange={handleFieldChange}
          formErrors={formErrors}
          renderTable={true}
          tableIndex={sectionIndex}
          customName={""}
        />
        <RenderFields
          field={{
            width: 12,
            name: "tr_os_total_qty",
            label: "Total Quantity",
            placeholder: "Enter Total Quantity",
            type: "text",
            // options: sampleOptions,
            isCustomOptions: true,
            customOptions: sampleOptions,
            required: true,
            fieldWidth: 100,
            value: 0,
            multiple: true,
            defaultValue: 0,
            readOnly: true
          }}
          sectionIndex={1}
          fieldIndex={1 * 100 + 1}
          formData={formData}
          handleFieldChange={handleFieldChange}
          formErrors={formErrors}
          renderTable={true}
          tableIndex={sectionIndex}
          customName={""}
          handleFieldBlur={onSingleFieldChange}
        />
      </>
    );
  };

  const getSingleCSCommonfield = () => {
    return (
      <>
        <RenderFields
          field={{
            width: 12,
            name: "tr_cs_no_of_trs",
            label: "Number of Trucks",
            type: "text",
            // options: sampleOptions,
            isCustomOptions: true,
            customOptions: sampleOptions,
            required: true,
            fieldWidth: 100,
            multiple: true,
            value: 0,
            defaultValue: 0,
            readOnly: true
          }}
          sectionIndex={1}
          fieldIndex={1 * 100 + 1}
          formData={formData}
          handleFieldChange={handleFieldChange}
          formErrors={formErrors}
          renderTable={true}
          tableIndex={sectionIndex}
          customName={""}
        />
        <RenderFields
          field={{
            width: 12,
            name: "tr_cs_total_qty",
            label: "Total Quantity",
            type: "text",
            // options: sampleOptions,
            isCustomOptions: true,
            customOptions: sampleOptions,
            required: true,
            fieldWidth: 100,
            multiple: true,
            value: 0,
            defaultValue: 0,
            readOnly: true
          }}
          sectionIndex={1}
          fieldIndex={1 * 100 + 1}
          formData={formData}
          handleFieldChange={handleFieldChange}
          formErrors={formErrors}
          renderTable={true}
          tableIndex={sectionIndex}
          customName={""}
        />
      </>
    );
  };
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
  if (isCustomPopupModalShow && viewOnly) {
    MainAction = [{
      icon: "bi bi-eye",
      text: "View",
    }]
  }
  return isShowContents && checkShowButtonConditon() && (
    <div key={sectionIndex} className="row my-2 mx-0 bg-white manualTable">
      {isCustomPopupModalShow && !viewOnly &&
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
        </div>}
      <Card className="Scrollable ">
        {(simpleInwardId || pageType !== "inward") && (
          <CardBody>
            <CardTitle tag="h5">{section.title}</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              {/* Overview of the projects */}
            </CardSubtitle>
            {(OperationType === getTruckOperations("OS")) && <div className="singleCommonFieldContainer">
              {getSingleOSCommonfield()}
            </div>}
            {OperationType === getTruckOperations("CS") && <div className="singleCommonFieldContainer">
              {getSingleCSCommonfield()}
            </div>}
            <div className={isCustomPopupModalShow ? "manualTableSection" : ""}>


              <table className="table table-white responsive borderless no-wrap mt-3 align-middle renderTable">
                <thead>
                  <tr>
                    {!section.isNoIndexNo && (<th>Sr. No.</th>) || null}
                    {section.headers.map(
                      (header, headerIndex) =>
                        header.name !== "smpl_detail_smpl_qty_unit" && !header.isHideTable && (
                          <th key={"headerIndex" + headerIndex}>
                            {header.label}
                          </th>
                        )
                    )}
                    {(action?.toLowerCase() !== "view" && !viewOnly && action != "opsView") || isCustomPopupModalShow ? (
                      <th className="list_th_action actioncol">Action</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {allTableData.map((singleTableData, rowIndex) =>
                    section.rows.map((row, rowIndex2) => (
                      <tr key={"rowIndex" + rowIndex} className="border-top">

                        {!section.isNoIndexNo && (<td className="srNoPad">{rowIndex + 1}</td>) || null}
                        {row.map(
                          (cell, cellIndex) => {

                            if (operationStepNo == 4) {
                              if (cell.name === "size_analysis") {
                                cell = {
                                  ...cell,
                                  readOnly: tableData.find((singleData) => singleData['group_no'] == formData[1]?.['group_no_' + rowIndex])
                                }
                              }
                            }
                            return cell.name !== "smpl_detail_smpl_qty_unit" && !cell.isHideTable && (
                              <td key={"cellIndex" + cellIndex}>
                                {(editableIndex === 0 && rowIndex === 0) ||
                                  editableIndex === rowIndex
                                  ? cell.name !== "smpl_detail_smpl_qty_unit" && (
                                    <span>

                                      <RenderFields
                                        field={getCustomCellValues(
                                          cell,
                                          rowIndex
                                        )}
                                        sectionIndex={sectionIndex}
                                        fieldIndex={rowIndex * 100 + cellIndex}
                                        formData={formData}
                                        handleFieldChange={handleFieldChange}
                                        formErrors={formErrors} // Pass formErrors to RenderFields
                                        ///for render table only
                                        renderTable={true}
                                        tableIndex={rowIndex}
                                        customName={cell.name + "_" + rowIndex}
                                        masterOptions={actualMasterOptions}
                                        from="Table"
                                        handleFieldBlur={onSingleFieldChange}
                                      />
                                    </span>
                                  )
                                  : Array.isArray(
                                    formData[sectionIndex][
                                    cell.name + "_" + rowIndex
                                    ]
                                  ) || cell.fieldtype === "object"
                                    ? getSelectedOptionName(
                                      cell.options,
                                      actualMasterOptions,
                                      cell.name,
                                      formData[sectionIndex][
                                      cell.name + "_" + rowIndex
                                      ],
                                      cell.name + "_" + rowIndex,
                                      cell.fieldtype === "object"
                                    )
                                    : cell.type === "date"
                                      ? getFormatedDate(
                                        formData[sectionIndex][
                                        cell.name + "_" + rowIndex
                                        ],
                                        1, "", "", cell.showTimeSelect
                                      )
                                      : cell.type === "doubleText"
                                        ? singleTableData[cell.name] + " " + (singleTableData[cell.name + "_unit_" + 0] || "")
                                        : <span className="srNoPad"> {getTextWithouHtml(formData[sectionIndex][
                                          cell.name + "_" + rowIndex
                                        ])}</span>}
                              </td>
                            )
                          }
                        )}
                        <td className="list_th_action actioncol">
                          <div className="actionColumn">
                            {(action?.toLowerCase() !== "view" && !viewOnly && action != "opsView") || isCustomPopupModalShow ? (
                              <ActionOptionsTable
                                actions={
                                  (editableIndex === 0 && rowIndex === 0) ||
                                    editableIndex === rowIndex
                                    ? EditAction
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
                                simpleInwardId={simpleInwardId}
                                moduleType={moduleType}
                                setPopupOpenAssignment={setPopupOpenAssignment}
                                setActionName={setActionName}
                                setIsViewOpen={setIsViewOpen}
                                isViewOpen={isViewOpen}
                                singleData={singleTableData}
                                setViewTableData={setViewTableData}
                                fromModule="manualTable"
                                setFormData={setFormData}
                                formData={formData}
                                tableData={allTableData}
                                section={section}
                                isCustomPopupModalShow={isCustomPopupModalShow}
                                isCustomPopup={isCustomPopup}
                                setIsCustomPopup={setIsCustomPopup}
                              />
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {isDisplayNewAddOption &&
                    moduleType !== "sampleverification" &&
                    action?.toLowerCase() !== "view" &&
                    !viewOnly && action != "opsView" && !isCustomPopupModalShow
                    ? section.rows.map((row, rowIndex) => (
                      <tr key={"rowIndex" + rowIndex} className="border-top">
                        {!section.isNoIndexNo && (<td className="srNoPad">{rowIndex + 1 + allTableData.length}</td>) || null}
                        {row.map(
                          (cell, cellIndex) => {
                            if (operationStepNo == 4) {
                              if (cell.name === "size_analysis") {
                                cell = {
                                  ...cell,
                                  readOnly: tableData.find((singleData) => singleData['group_no'] == formData[1]?.['group_no_' + tableData.length])
                                }
                              }
                            }
                            return cell.name !== "smpl_detail_smpl_qty_unit" && (
                              <td key={"cellIndex" + cellIndex}>
                                <RenderFields
                                  field={getCustomCellValues(
                                    cell,
                                    tableData.length,
                                    1
                                  )}
                                  sectionIndex={sectionIndex}
                                  fieldIndex={rowIndex * 100 + cellIndex}
                                  formData={formData}
                                  handleFieldChange={handleFieldChange}
                                  formErrors={formErrors} // Pass formErrors to RenderFields
                                  ///for render table only
                                  renderTable={true}
                                  tableIndex={rowIndex}
                                  customName={
                                    cell.name + "_" + allTableData.length
                                  }
                                  masterOptions={actualMasterOptions}
                                  from="Table"
                                  handleFieldBlur={onSingleFieldChange}
                                />
                              </td>
                            )
                          }
                        )}{" "}
                        <td className="list_th_action actioncol">
                          <div className="actionColumn">
                            <ActionOptionsTable
                              actions={saveAction}
                              onActionHandleClick={onActionHandleClick}
                              setPopupIndex={setPopupIndex}
                              newCreation={1}
                              popupMessages={popupMessages}
                              saveClicked={saveClicked}
                              isCustomSave={1}
                              tableData={allTableData}
                              setEditableIndex={setEditableIndex}
                              setPopupOpenAssignment={setPopupOpenAssignment}
                              setActionName={setActionName}
                              fromModule="manualTable"
                              setFormData={setFormData}
                              formData={formData}
                              section={section}
                              isCustomPopupModalShow={isCustomPopupModalShow}
                              isCustomPopup={isCustomPopup}
                              setIsCustomPopup={setIsCustomPopup}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                    : null}
                </tbody>
              </table>
            </div>
            {OperationType === getVesselOperation("SV") && tabIndex === 7 && (
              <div className="supervision_total_voyage">
                <h6>
                  <p>
                    Total Tonnage {formData[0].ji_is_loading === "Loading" ? "loading on" : "Discharge from"} Vessel{" "}

                  </p>
                  <span>{actualTannantbal}</span>
                </h6>
                <h6>
                  <p>Balance Quantity To Be {formData[0].ji_is_loading === "Loading" ? "loaded" : "Discharged"} </p>
                  <span>{totalTannangeBal > 0 ? totalTannangeBal : 0}</span>

                </h6>
              </div>
            )}
            <div className="align-end-100 ">
              {OperationType === getRakeOperations("QAss") && tabIndex === 1 && (
                <>
                  <div
                    key={"Form-Accordion"}
                    className={" col-md-" + 3}
                  >
                    <RenderFields
                      field={{
                        "name": "all_valume_in_cubic_mtr",
                        "type": "label",
                        "label": "Total Volumne",
                        "fieldWidth": "100",
                        "readOnly": true,
                        "defaultValue": getTotalCountBasedOnField(allTableData, 'valume_in_cubic_mtr') || 0
                      }}
                      sectionIndex={0}
                      fieldIndex={0 * 100 + 0}
                      formData={formData}
                      handleFieldChange={onSingleFieldChange}
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
                        "name": "all_measurement_qty_in_mt",
                        "type": "label",
                        "label": "Total Measurement",
                        "fieldWidth": "100",
                        "readOnly": true,
                        headerLength: "35%"
                      }}
                      sectionIndex={0}
                      fieldIndex={0 * 100 + 0}
                      formData={formData}
                      handleFieldChange={onSingleFieldChange}
                      formErrors={formErrors} // Pass formErrors to RenderFields
                      ///for render table only
                      renderTable={true}
                      tableIndex={0}
                    />
                  </div>
                </>
              )}
            </div>
          </CardBody>
        )}
      </Card>
      {
        isCustomPopup && (
          <RenderTablePopup
            section={section}
            // sectionIndex={sectionIndex}
            sectionIndex={sectionIndex}
            formData={formData}
            handleFieldChange={handleFieldChange}
            formErrors={formErrors}
            tableData={section.multipleTableExists ? allTableData : tableData}
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
            allFieldDisabled={action?.toLowerCase() == "view" || viewOnly || action === "opsView"}
            tabIndex={tabIndex}
          />)
      }
      {isViewOpen && (
        <SampleVerificationDetals
          setIsViewOpen={setIsViewOpen}
          viewTableData={viewTableData}
        />
      )}
    </div>
  );
};

RenderTableSetAllManualSection.propTypes = {
  section: PropTypes.string,
  sectionIndex: PropTypes.number,
  formData: PropTypes.object,
  handleFieldChange: PropTypes.func,
  addRow: PropTypes.func,
  deleteRow: PropTypes.func,
  deleteColumn: PropTypes.func,
  formErrors: PropTypes.object,
  setFormData: PropTypes.func,
  popupMessages: PropTypes.arrayOf(PropTypes.string),
  pageType: PropTypes.string,
  action: PropTypes.string,
  masterOptions: PropTypes.arrayOf(PropTypes.object),
  saveClicked: PropTypes.bool,
  setSaveClicked: PropTypes.func,
  setTableData: PropTypes.func,
  tableData: PropTypes.arrayOf(PropTypes.object),
  moduleType: PropTypes.string,
  setSimpaleInwardResponse: PropTypes.func,
  simpleInwardResponse: PropTypes.object,
  groupDefaultValue: PropTypes.any,
  testMemoId: PropTypes.string,
  getVerificationDetails: PropTypes.func,
  getSampleIdsMasterData: PropTypes.func,
  setIsOverlayLoader: PropTypes.func,
  isOverlayLoader: PropTypes.bool,
  OperationType: PropTypes.string,
  tabIndex: PropTypes.string,
};

export default RenderTableSetAllManualSection;
