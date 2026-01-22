import React, { useState, useEffect } from "react";
import RenderFields from "./RenderFields";
import ActionOptionsTable from "./ActionOptionsTable";
import { getActivityCode, getRakeOperations, getSelectedOptionName, getStackOperations, getSvgAccordingToCondition, getTruckOperations, getUniqueData, getVesselOperation } from "../../services/commonFunction";
import {
  decryptDataForURL,
  encryptDataForURL,
} from "../../utills/useCryptoUtils";
import PropTypes from "prop-types";
import ModalInvoice from "./commonModalForms/InvoiceModalInward";
import { getOPActivityData } from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import { type } from "os";
import { includes } from "lodash";

const RenderTableSectionActivity = ({
  getCustomCellValues,
  customOptions,
  editableIndex,
  InwardCondition,
  IsVerification,
  onCustomChangeHandler,
  updatedMasterOptions,
  onSingleFieldChange,
  VerificationSaveAction,
  EditAction,
  MainAction,
  onActionHandleClick,
  setPopupIndex,
  popupIndex,
  setEditableIndex,
  getInwardTabledata,
  simpleInwardId,
  setPopupOpenAssignment,
  setActionName,
  setIsViewOpen,
  isViewOpen,
  setViewTableData,
  getScopeOfWorkData,
  getSampleMarkLisData,
  moduleType,
  section,
  action,
  tableData,
  sectionIndex,
  formData,
  setFormData,
  formErrors,
  masterOptions,
  popupMessages,
  saveClicked,
  OperationTypeID,
  saveAction,
  plusAction,
  handleFieldChange,
  viewOnly,
  filteredOptions,
  setFilteredOptions,
  actionName,
  handleCloseInwardPopup,
  isBtnclicked,
  setIsOverlayLoader,
  isOverlayLoader,
  popupOpenAssignment,
  user
}) => {
  const [isShowAdditionalActivity, setIshowAdditionalActivity] = useState(false)
  const groupedTableData = Object.values(
    tableData?.reduce((acc,
      { ivd_rate_group,
        activitymaster,
        ivd_ref_nos,
        ivd_cc_ids,
        ivd_ref_no,
        ivd_cc_id,
        ivd_status,
        ivd_id,
        fk_cc_id,
        fk_cc_number,
        ...rest }) => {
      if (ivd_status === "rejected") return acc;
      if (!acc[ivd_rate_group]) {
        acc[ivd_rate_group] = { ivd_rate_group, activities: [], ...rest, ivd_ref_nos: [], ivd_cc_ids: [], ivd_ref_no, ivd_cc_id };
      }
      acc[ivd_rate_group]?.activities?.push({ ...activitymaster, ivd_id, fk_cc_id, fk_cc_number });
      acc[ivd_rate_group]?.ivd_ref_nos?.push(...(Array.isArray(ivd_ref_nos) ? ivd_ref_no : [ivd_ref_no]));
      acc[ivd_rate_group]?.ivd_cc_ids?.push(...(Array.isArray(ivd_cc_ids) ? ivd_cc_id : [ivd_cc_id]));
      acc[ivd_rate_group]?.ivd_cc_ids?.push(...(Array.isArray(ivd_cc_ids) ? ivd_cc_id : [ivd_cc_id]));
      // acc[ivd_rate_group]?.ivd_ref_no =  ivd_ref_no;
      // acc[ivd_rate_group]?.ivd_cc_id =  ivd_cc_id;
      return acc;
    }, {})
  );
  useEffect(() => {
    setIshowAdditionalActivity(false)
  }, [formData[0]?.is_recordChanged])

  useEffect(() => {
    if (isShowAdditionalActivity) {
      getOPActivityData(setFilteredOptions, 9, null, null, null, null, formData[0]?.invoice_details, 1)
      // const lastQuantityDetailsData = formData[0]?.invoice_details?.find((item) => [getVesselOperation('QA'), getRakeOperations('QA'), getStackOperations('QA'), getTruckOperations('QS')].includes(getActivityCode(item.activitymaster.am_code).toLowerCase()))
      const lastQuantityDetailsData = groupedTableData[0]
      let updatedFormData = { ...formData };
      if (!updatedFormData[1]) {
        updatedFormData[1] = {};
      }
      updatedFormData[1]['ivd_ref_nos_' + `${groupedTableData.length}`] = lastQuantityDetailsData['ivd_ref_no'];
      updatedFormData[1]['fk_cc_number_' + `${groupedTableData.length}`] = lastQuantityDetailsData['fk_cc_number'];
      updatedFormData[1]['fk_cc_id_' + `${groupedTableData.length}`] = lastQuantityDetailsData['fk_cc_id'];
      updatedFormData[1]['fk_ic_id_' + `${groupedTableData.length}`] = lastQuantityDetailsData['fk_ic_id'];
      // section.rows.forEach((row) => {
      //   row.forEach((columnName) => {
      //     if (columnName.name !== "fk_activity_id") {
      //       const fieldName = `${columnName.name}_${groupedTableData.length}`;
      //       if (columnName.name === "ivd_ref_nos") {
      //         updatedFormData[1][fieldName] = lastQuantityDetailsData['ivd_ref_no'];
      //         updatedFormData[1]['fk_cc_id_' + `${groupedTableData.length}`] = lastQuantityDetailsData['fk_cc_id'];
      //       }
      //       else {
      //         updatedFormData[1][fieldName] = lastQuantityDetailsData[columnName.name];
      //       }
      //     }
      //   });
      // });
      setFormData(updatedFormData)
    }
  }, [isShowAdditionalActivity, formData[0]?.is_recordChanged])
  const getActivitiesNames = (activities, type) => {
    let amNames;
    amNames = activities.map(item => item.am_name + `${item.fk_cc_number ? '-' + item.fk_cc_number : ''}`);
    if (type == "string") {
      amNames = amNames.join(" , ")
    }
    return amNames;

  }

  const getActivitiesIDNames = (activities, type) => {
    let amNames = activities.reduce((acc, item) => {
      if (!acc.some(obj => obj.id === item.am_id)) {
        // const extract_jis_id = item.am_name.match(/\d+/)?.[0] || null;
        const extract_jis_id = item.JISID?.[0];
        acc.push({ id: extract_jis_id, name: item.am_name });
      }
      return acc;
    }, []);

    if (type === "string") {
      amNames = amNames.map(obj => `${obj.name} `).join(" , ");
    }

    return amNames;
  };

  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  const Status = decryptDataForURL(params.get("status"));
  const Type = decryptDataForURL(params.get("type"));
  useEffect(() => {
    let transformedData = []
    if (Type == "IC" || formData[0]?.im_is_regular == "external" || user?.role == "LR") {
      transformedData = formData[0]?.invoice_details?.map((item) => ({
        ...item,
        id: item.fk_ic_id,
        name: item?.activitymaster?.am_name + (item.ivd_ref_no ? '-' + " (" + item.ivd_ref_no + ")" : ''),
      }));

    }
    else {
      if (Type !== "Advance" && (Type === "CC" || (formData[0]?.im_is_regular?.toLowerCase() == "regular" && !formData[0]?.im_is_manual_with_regular))) {
        transformedData = formData[0]?.invoice_details?.map((item) => ({
          ...item,
          id: item.fk_cc_id,
          name: item.activitymaster.am_name + (item.fk_cc_number ? '-' + item.fk_cc_number : ''),
        }));
      }
      else {
        transformedData = formData[0]?.invoice_details?.map((item) => ({
          ...item,
          id: item.fk_jis_id,
          name: item.activitymaster.am_name,
        }));
      }
    }

    // if (Status == "Edit") {
    //   transformedData = transformedData?.filter((data) => {
    //     return data.ivd_status === "Completed"
    //   })
    // }

    // formData[0]?.invoice_details?.map((item) => {

    //   if (transformedData.length == 0 || transformedData.find((trItem) => trItem.fk_ic_id != item.fk_ic_id)) {
    //     transformedData.push({
    //       id: item.fk_jis_id,
    //       fk_ic_id: item.fk_ic_id,
    //       name: item.activitymaster.am_name,
    //     })
    //   }
    // });
    if (Type == "IC" || formData[0]?.im_is_regular == "external" || user?.role == "LR") {
      const filteredTableIDS = tableData.reduce((acc, item) => {
        if (item?.ivd_status === "Completed") {
          acc.push(item?.ivd_ref_no);
        }
        return acc;
      }, []);
      const finalFilteredData = transformedData?.filter((item) => {
        const extract_ref = item.name.match(/\(([^)]+)\)/)?.[1] || null;
        return !filteredTableIDS.includes(extract_ref);
      });
      setFilteredOptions(finalFilteredData ? finalFilteredData : []);
    }
    else {
      const filteredTableIDS = tableData.reduce((acc, item) => {
        if (Type !== "Advance" && (Type === "CC" || (formData[0]?.im_is_regular?.toLowerCase() == "regular" && !formData[0]?.im_is_manual_with_regular))) {
          if (item?.ivd_status === "Completed") {
            acc.push(item?.fk_cc_id);
          }
        }
        else {
          if (item?.ivd_status === "Completed") {
            acc.push(item?.fk_jis_id);
          }
        }
        return acc;
      }, []);

      const finalFilteredData = transformedData?.filter((item) =>
        !filteredTableIDS.includes(item.id)
      );
      setFilteredOptions(finalFilteredData ? finalFilteredData : []);
    }
  }, [tableData, viewOnly]);
  const getTotalActivity = () => {
    let quantityCount = 0;
    let lotsArray = [];
    groupedTableData.map((singleData) => {
      if (!lotsArray.includes(singleData.ivd_id))
        quantityCount = parseFloat(quantityCount) + parseFloat(singleData.ivd_activitytotal);
    });
    return quantityCount.toFixed(2)
  }

  useEffect(() => {
    if (moduleType === "invoice") {
      if (formData[1]?.['activities_' + groupedTableData?.length]) {
        const existsData = filteredOptions.find((item) => formData[1]?.['activities_' + groupedTableData?.length].includes(item.id))
        if (existsData) {
          let updatedFormData = { ...formData };
          if (!updatedFormData[1]) {
            updatedFormData[1] = {};
          }
          // if (!updatedFormData[1]['ivd_rate_' + `${groupedTableData.length}`] && !updatedFormData[1]['ivd_qty_' + `${groupedTableData.length}`]) {
          if (existsData?.activitymaster?.jis_rate?.[0]) {
            updatedFormData[1]['ivd_rate_' + `${groupedTableData.length}`] = existsData?.activitymaster?.jis_rate?.[0]
          }
          if (existsData?.activitymaster?.jis_unit?.[0]) {
            updatedFormData[1]['ivd_rate_unit_' + `${groupedTableData.length}`] = existsData?.activitymaster?.jis_unit?.[0]
          }

          // }
          setFormData(updatedFormData)
        }
      }
    }
  }, [formData[1]?.['activities_' + groupedTableData?.length]])
  return (
    <>
      <table className={`${'table table-white responsive borderless no-wrap mt-3 align-middle renderTable renderTableActivity '} ${moduleType === "sampleinward" ? "inwardTable-th-td" : ''} `}>
        <thead>
          <tr>
            <th className="sr_no_style">Sr. No.</th>
            {section.headers?.map(
              (header, headerIndex) => {
                if (header.name == "fk_cc_number" && (Type == "IC" || formData[0]?.im_is_regular == "external" || user?.role == "LR")) {
                  return <th key={"headerIndex" + headerIndex} className={"activityTd " + (header.type === "icon" ? "activityIcon" : "")}>
                    Test Report No.
                  </th>
                }

                return <th key={"headerIndex" + headerIndex} className={"activityTd " + (header.type === "icon" ? "activityIcon" : "")}>
                  {header.label}
                </th>
              }
            )}
            {action !== "View" && !decryptDataForURL(params.get("isCourier")) ? (
              <th>Action</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {groupedTableData?.map((singleTableData, rowIndex) =>
            section.rows.map((row, rowIndex2) => (
              <tr key={"rowIndex" + rowIndex} className="border-top">
                <td className="sr_no_style">{rowIndex + 1}</td>
                {row.map((cell, cellIndex) => {
                  cell = getCustomCellValues(cell, rowIndex);
                  if (section.isUseForManPower) {
                    if (cell.name === "fk_activity_id") {
                      cell.customOptions = customOptions;
                      cell.isCustomOptions = true;
                    }
                  }

                  return (
                    (
                      <td key={"cellIndex" + cellIndex}>
                        {(editableIndex === 0 && rowIndex === 0) ||
                          (editableIndex === rowIndex &&
                            !InwardCondition) ||
                          IsVerification ? (
                          <span>
                            {cell.name == "fk_activitymaster" ?
                              <RenderFields
                                field={{
                                  name: "activities",
                                  customName: "activities",
                                  multiple: true,
                                  type: "select",
                                  styleName: "selectCompWidth",

                                }}
                                sectionIndex={sectionIndex}
                                fieldIndex={rowIndex * 100 + cellIndex}
                                formData={formData}
                                handleFieldChange={onCustomChangeHandler}
                                formErrors={formErrors}
                                renderTable={true}
                                tableIndex={rowIndex}
                                // customName={cell.name + "_" + rowIndex}
                                customName={"activities" + "_" + rowIndex}
                                masterOptions={[{
                                  model: "activities",
                                  data: getActivitiesIDNames(singleTableData["activities"], singleTableData),
                                }]}
                                from="Table"
                              />
                              :
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
                            }

                          </span>
                        )
                          : ["ivd_scope_description"].includes(cell.name) ? (
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
                          ) : ["ivd_ref_nos", "ivd_cc_ids"].includes(cell.name) ? (
                            (getUniqueData(singleTableData[cell.name]) || []).join(", ")
                          ) :
                            Array.isArray(
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
                            )
                              : cell.name == "fk_activitymaster" ? (
                                getActivitiesNames(singleTableData["activities"], "string")
                              )
                                :
                                (
                                  (singleTableData[cell.name])
                                )
                        }
                      </td>
                    )
                  );
                })}
                <td>
                  <div className="actionColumn">
                    {(action !== "View" && action != "opsView" && !decryptDataForURL(params.get("isCourier"))) ? (
                      <>
                        {popupOpenAssignment && (
                          <ModalInvoice
                            section={section}
                            sectionIndex={sectionIndex}
                            formData={formData}
                            setFormData={setFormData}
                            handleFieldChange={onCustomChangeHandler}
                            formErrors={formErrors}
                            tableData={groupedTableData}
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
                            onCustomChangeHandler={onCustomChangeHandler}
                            getActivitiesIDNames={getActivitiesIDNames}
                          />
                        )}
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
                          onActionHandleClick={(e) => {
                            onActionHandleClick(e, groupedTableData, singleTableData?.is_additional_status)
                          }}
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
                        />
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))
          )}
          {
            action != "opsView" &&
              action !== "View" && filteredOptions?.length > 0 && !isShowAdditionalActivity
              ? section.rows?.map((row, rowIndex) => (
                <tr key={"rowIndex" + rowIndex} className="border-top">
                  {(
                    <>
                      <td>{groupedTableData?.length + 1}</td>
                      {row?.map((cell, cellIndex) => {
                        cell = getCustomCellValues(cell);
                        // if (Type == "IC" && cell.name == "ivd_cc_ids") {
                        //   return null
                        // }
                        return (
                          (
                            <td key={"cellIndex" + cellIndex}>

                              {cell.name !== "fk_activitymaster" ?
                                <RenderFields
                                  field={cell}
                                  sectionIndex={sectionIndex}
                                  fieldIndex={rowIndex * 100 + cellIndex}
                                  formData={formData}
                                  handleFieldChange={onCustomChangeHandler}
                                  formErrors={formErrors}
                                  renderTable={true}
                                  tableIndex={rowIndex}

                                  customName={
                                    cell.name + "_" + groupedTableData?.length
                                  }
                                  masterOptions={updatedMasterOptions}
                                  from="Table"
                                />
                                :
                                <RenderFields
                                  field={{
                                    name: "activities",
                                    customName: "activities",
                                    multiple: true,
                                    type: "select",
                                    styleName: "selectCompWidth"
                                  }}
                                  sectionIndex={sectionIndex}
                                  fieldIndex={rowIndex * 100 + cellIndex}
                                  formData={formData}
                                  handleFieldChange={onCustomChangeHandler}
                                  formErrors={formErrors}
                                  renderTable={true}
                                  tableIndex={rowIndex}
                                  // customName={cell.name + "_" + rowIndex}
                                  // customName={"activities" + "_" + rowIndex}
                                  customName={
                                    "activities" + "_" + groupedTableData?.length
                                  }
                                  masterOptions={[{
                                    model: "activities",
                                    data: filteredOptions,
                                  }]}
                                  from="Table"
                                />
                              }

                            </td>
                          )
                        );
                      })}
                      <td>
                        <div className="actionColumn">
                          <ActionOptionsTable
                            actions={
                              InwardCondition
                                ? plusAction
                                : saveAction
                            }
                            onActionHandleClick={(e) => onActionHandleClick(e, groupedTableData)}
                            setPopupIndex={setPopupIndex}
                            newCreation={1}
                            popupMessages={popupMessages}
                            saveClicked={saveClicked}
                            isCustomSave={1}
                            tableData={groupedTableData}
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
                          />
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
              : null}
          {
            action != "opsView" &&
              action !== "View" && filteredOptions?.length > 0 && isShowAdditionalActivity
              ? section.rows?.map((row, rowIndex) => (
                <tr key={"rowIndex" + rowIndex} className="border-top">
                  {(
                    <>
                      <td>{groupedTableData?.length + 1}</td>
                      {row?.map((cell, cellIndex) => {
                        cell = getCustomCellValues(cell);
                        // if (Type == "IC" && cell.name == "ivd_cc_ids") {
                        //   return null
                        // }
                        if (cell.name === "ivd_ref_nos") {
                          let options = []
                          groupedTableData.map((singleData) => {
                            if (!options.includes(singleData.ivd_ref_no)) {
                              options.push(singleData.ivd_ref_no)
                            }
                          })
                          if (options.length > 1) {
                            cell = {
                              ...cell,
                              options: options,
                              type: "select",
                              readOnly: false
                            }
                          }
                        }
                        else if (cell.name === "fk_cc_number") {
                          let options = []
                          groupedTableData.map((singleData) => {
                            if (!options.includes(singleData.fk_cc_number) && singleData.ivd_ref_no === formData[1]?.['ivd_ref_nos_' + groupedTableData.length]) {
                              options.push(singleData.fk_cc_number)
                            }
                          })
                          if (options.length > 1) {
                            cell = {
                              ...cell,
                              options: options,
                              type: "select",
                              readOnly: false,
                              defaultValue: options.includes(formData[1]?.['fk_cc_number_' + groupedTableData.length]) ? formData[1]?.['fk_cc_number_' + groupedTableData.length] : options[0]
                            }
                          }
                          else {
                            cell = {
                              ...cell,
                              defaultValue: options.includes(formData[1]?.['fk_cc_number_' + groupedTableData.length]) ? formData[1]?.['fk_cc_number_' + groupedTableData.length] : options[0]
                            }
                          }
                        }
                        return (
                          (
                            <td key={"cellIndex" + cellIndex}>

                              {cell.name !== "fk_activitymaster" ?
                                <RenderFields
                                  field={cell}
                                  sectionIndex={sectionIndex}
                                  fieldIndex={rowIndex * 100 + cellIndex}
                                  formData={formData}
                                  handleFieldChange={onCustomChangeHandler}
                                  formErrors={formErrors}
                                  renderTable={true}
                                  tableIndex={rowIndex}

                                  customName={
                                    cell.name + "_" + groupedTableData?.length
                                  }
                                  masterOptions={updatedMasterOptions}
                                  from="Table"
                                />
                                :
                                <RenderFields
                                  field={{
                                    name: "activities",
                                    customName: "activities",
                                    multiple: true,
                                    type: "select",
                                    styleName: "selectCompWidth"
                                  }}
                                  sectionIndex={sectionIndex}
                                  fieldIndex={rowIndex * 100 + cellIndex}
                                  formData={formData}
                                  handleFieldChange={onCustomChangeHandler}
                                  formErrors={formErrors}
                                  renderTable={true}
                                  tableIndex={rowIndex}
                                  // customName={cell.name + "_" + rowIndex}
                                  // customName={"activities" + "_" + rowIndex}
                                  customName={
                                    "activities" + "_" + groupedTableData?.length
                                  }
                                  masterOptions={[{
                                    model: "activities",
                                    data: filteredOptions,
                                  }]}
                                  from="Table"
                                />
                              }

                            </td>
                          )
                        );
                      })}
                      <td>
                        <div className="actionColumn">
                          <ActionOptionsTable
                            actions={
                              InwardCondition
                                ? plusAction
                                : saveAction
                            }
                            onActionHandleClick={(e) => onActionHandleClick(e, groupedTableData, 1)}
                            setPopupIndex={setPopupIndex}
                            newCreation={1}
                            popupMessages={popupMessages}
                            saveClicked={saveClicked}
                            isCustomSave={1}
                            tableData={groupedTableData}
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
                          />
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
              : null}

        </tbody>
      </table>


      <div className="submitBtn_container plusButtonContainer">
        {
          (action != "opsView" &&
            action !== "View" && !decryptDataForURL(params.get("isCourier")) &&
            // (formData[0]?.invoice_details?.find((item) => [getVesselOperation('QA'), getRakeOperations('QA'), getStackOperations('QA'), getTruckOperations('QS')].includes(getActivityCode(item.activitymaster.am_code).toLowerCase()))) &&
            !isShowAdditionalActivity) && groupedTableData.length > 0 ? ((
              <div className="submitBtn_container">
                <button
                  type="button"
                  onClick={() => setIshowAdditionalActivity(true)}
                  className="submitBtn plusBtn"
                >
                  +
                </button>
              </div>
            ))
            :
            <div></div>

        }
        <RenderFields
          field={{
            "name": "im_total_act",
            "type": "text",
            "label": "Total :",
            "width": 3,
            "fieldWidth": "50",
            "readOnly": true,
            "defaultValue": getTotalActivity()
          }}
          sectionIndex={0}
          fieldIndex={0 * 100 + 0}
          formData={formData}
          handleFieldChange={onCustomChangeHandler}
          formErrors={formErrors}
          renderTable={true}
          tableIndex={0}
        />
      </div>
    </>
  );
};

RenderTableSectionActivity.propTypes = {
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

export default RenderTableSectionActivity;
