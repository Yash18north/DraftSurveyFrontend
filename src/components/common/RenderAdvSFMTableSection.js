import React, { useEffect, useState } from "react";
import RenderFields from "./RenderFields";
import { Button, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { ReactComponent as Trash } from "bootstrap-icons/icons/trash.svg";
import { ReactComponent as Tick } from "../../assets/images/icons/Tick.svg";
import PropTypes from "prop-types";

import { ReactComponent as DisabledTick } from "../../assets/images/icons/DisabledTick.svg";
import { ReactComponent as Calculator } from "../../assets/images/icons/Calculator.svg";
import { ReactComponent as CalculatorHover } from "../../assets/images/icons/calculatorHover.svg";

import {
  getTestMemoParamBasis,
  handleSingleDetailsCreateUpdate,
  handleSingleDetailsSPUpdate,
} from "./commonHandlerFunction/sfmHandlerFunctions";
import {
  GetTenantDetails,
  postDataFromApi,
} from "../../services/commonServices";
import { SFMSetCountApi } from "../../services/api";
import SFMCalculationForm from "./commonModalForms/SFMCalculationForm";
import { getSampleStatusCountsForTPI, getTPIParamBasis } from "./commonHandlerFunction/operations/TPIHandlerFunctions";
import { toast } from "react-toastify";
import { changeLanguage } from "i18next";

const RenderAdvSFMTableSection = ({
  section,
  sectionIndex,
  formData,
  handleFieldChange,

  deleteColumn,
  formErrors,
  groupAssignment,
  GAData,
  setGAData,
  showModalGA,
  setShowModalGA,
  setData,
  tabIndex,
  setFormData,
  viewOnly,
  activeTab,
  allFormulaList,
  moduleType,
  EditRecordId,
  OperationTypeID,
  setIsOverlayLoader,
  testMemoSetData
}) => {
  const Section = section;
  const rangeSet = 0;
  const range = [];
  const [paramBasisSetData, setParamBasisSetData] = useState([]);
  const [paramBasisData, setParamBasisData] = useState();
  const [basisCodeData, setBasisCodeData] = useState([]);
  const [basisCodeDataValue, setBasisCodeDataValue] = useState([]);
  const [testMemoId, setTestMemoId] = useState();
  const [isCalculateOpen, setIsCalculateOpen] = useState(false);
  const [updatedMasterOptions, setUpdatedMasterOptions] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isParamChanged, setIsParamChanged] = useState(true);
  /*
  Author: yash
  Date: 10/10/2021
  use: refactor this code to use useEffect
  */
  const smplDetailSmplId =
    formData[sectionIndex]?.["smpl_detail_smpl_id_" + tabIndex];
  const groupId = formData[sectionIndex]?.["group_id_" + tabIndex];

  useEffect(() => {
    if (smplDetailSmplId || groupId)
      getSFMParamBasis('', '', 1);
  }, [smplDetailSmplId, groupId]);
  useEffect(() => {
    let spTab = activeTab.split("-");
    if (spTab[1] == tabIndex) {
      if (moduleType === "jobinstruction") {
        getSampleStatusCountsForTPI(EditRecordId, OperationTypeID, setData.sample_set_id, setFormData, tabIndex);
      }
      else {
        // if (setData.sample_set_id) {
        //   getSampleStatusCounts(setData.sample_set_id, formData[0]?.["fk_tmid"], setIsOverlayLoader);
        // }
      }
    }
  }, [activeTab]);
  useEffect(() => {
    if (moduleType === "jobinstruction") {
      testMemoSetData.map((tab, tabIndex) => {
        getSampleStatusCountsForTPI(EditRecordId, OperationTypeID, setData.sample_set_id, setFormData, tabIndex);
      })
    }
  }, [testMemoSetData])

  const getSFMParamBasis = (isFromUpdate, prevFormData, isfromParamChanged) => {
    try {
      if (moduleType === "jobinstruction") {
        getTPIParamBasis(
          formData[sectionIndex]?.["smpl_detail_smpl_id_" + tabIndex],
          formData[sectionIndex]?.["group_id_" + tabIndex],
          tabIndex,
          setParamBasisData,
          setParamBasisSetData,
          setBasisCodeData,
          EditRecordId,
          OperationTypeID,
          setBasisCodeDataValue,
          setData.sample_set_id,
          setIsParamChanged,
          isfromParamChanged
        );
        getSampleStatusCountsForTPI(EditRecordId, OperationTypeID, setData.sample_set_id, setFormData, tabIndex);

      }
      else {
        getTestMemoParamBasis(
          formData[sectionIndex]?.["smpl_detail_smpl_id_" + tabIndex],
          formData[sectionIndex]?.["group_id_" + tabIndex],
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
        );
        if (isFromUpdate) {
          getSampleStatusCounts(setData.sample_set_id, formData[0]?.["fk_tmid"], setIsOverlayLoader, prevFormData);
        }
        // getSampleStatusCounts(setData.sample_set_id, formData[0]?.["fk_tmid"], setIsOverlayLoader);
      }
    }
    finally {
    }

  };
  const customHandleChange = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = "",
    isCustomInput
  ) => {
    setParamBasisData((prevFormData) => {
      return {
        ...prevFormData,
        [tabIndex]: {
          ...prevFormData[tabIndex],
          [fieldName]: value,
        },
      };
    });
  };
  const getSampleStatusCounts = async (smplValue, testmemoId, setIsOverlayLoader, prevFormData) => {
    if (smplValue && testmemoId) {
      try {
        const bodyToPass = {
          smpl_set_id: parseInt(smplValue),
          tm_id: parseInt(testmemoId), /// Done By Yash Need to Find tm_id
        };
        setIsOverlayLoader(true)
        let res = await postDataFromApi(SFMSetCountApi, bodyToPass);
        if (res?.data?.status === 200) {
          const responseData = res.data.data;
          // setFormData((prevFormData) => {
          //   return {
          //     ...prevFormData,
          //     ["tab_" + tabIndex]: {
          //       noFilledCount: responseData.remaining_count,
          //       filledCount: responseData.filled_count,
          //     },
          //   };
          // });
          const updatedFormData = { ...prevFormData }
          const tabKey = `tab_${tabIndex}`;

          // Ensure the tabKey exists in updatedFormData
          if (!updatedFormData[tabKey]) {
            updatedFormData[tabKey] = {};
          }

          // Assign values properly
          updatedFormData[tabKey]['noFilledCount'] = responseData.remaining_count;
          updatedFormData[tabKey]['filledCount'] = responseData.filled_count;
          setFormData(updatedFormData);
        } else {
          return [];
        }
      } catch (error) { }
      finally {
        setIsOverlayLoader(false)
      }
    }
  };

  const getCustomCellValues = (cell, paramIndex = "") => {
    if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1,formData[0]?.jrf_is_petro))) {
      if (
        basisCodeDataValue.includes(cell.name) &&
        basisCodeData.includes(cell.sublabel.replace(" ", "_"))
      ) {
        cell.tooltip = paramBasisSetData[paramIndex]?.param_detail?.param_sfm_input_type
        cell.type = "text";
        cell.characterLimit = "";
      } else if (cell.name === "param_unit") {
        cell.type = "select";
        cell.options = paramBasisData?.[tabIndex]?.['param_unit_options' + "_" + paramIndex + "_" + tabIndex]
      }
    }
    return cell;
  };
  const getExtranInput = (cellData, cellIndex, rowIndex, paramIndex) => {
    if (
      basisCodeDataValue.includes(cellData.name) &&
      basisCodeData.includes(cellData.sublabel.replace(" ", "_"))
    ) {
      let cell = {
        name: cellData.name + "-custom",
        type: "text",
        value: "",
        styleName: "InputNum",
        label: "",
        fieldWidth: "50",
        placeholder: "Enter Value",
        tooltip: paramBasisSetData[paramIndex]?.param_detail?.param_sfm_input_type
      };
      return (
        <td
          key={"cellIndex" + cellIndex}
          colSpan={cell.name === "group" ? range[rangeSet] : 1}
        >
          <div className="tick_box">
            <RenderFields
              field={getCustomCellValues(cell, 1)}
              sectionIndex={tabIndex}
              fieldIndex={rowIndex * 100 + cellIndex}
              formData={paramBasisData}
              handleFieldChange={(
                sectionIndex,
                fieldName,
                value,
                type,
                isChecked
              ) =>
                customHandleChange(
                  sectionIndex,
                  fieldName,
                  value,
                  type,
                  isChecked,
                  1
                )
              }
              handleFieldBlur={() =>
                handleSingleDetailsCreateUpdate(
                  tabIndex,
                  paramIndex,
                  cell.name,
                  paramBasisData,
                  getSFMParamBasis,
                  paramBasisSetData,
                  moduleType,
                  "",
                  setIsOverlayLoader,
                  setFormData,
                  formData

                )
              }
              formErrors={formErrors}
              GAData={GAData}
              setGAData={setGAData}
              showModalGA={showModalGA}
              setShowModalGA={setShowModalGA}
              customName={cell.name + "_" + paramIndex + "_" + tabIndex}
              viewOnly={
                viewOnly ||
                (
                  basisCodeDataValue.includes(cell.name) &&
                  paramBasisData[tabIndex][
                  cell.name + "_" + paramIndex + "_" + tabIndex
                  ] == "N/A")
              }
              centerAlign={true}
              masterOptions={updatedMasterOptions}
            />
          </div>
        </td>
      );
    }
  };
  const getSFMHeaderData = (isTboday) => {
    let actualHeader = [];
    let actualColumn = [];
    basisCodeDataValue.map((singlebase) => {
      let newString = singlebase.replace('value_', "")
      newString = newString.replace('_', " ")
      actualHeader.push({
        "label": "Values",
        "sublabel": newString.toUpperCase(),
        "name": singlebase,
        "type": "text",
        "required": true,
        "options": [],
        "placeholder": "Enter Parameter"
      })
      actualColumn.push({
        "name": singlebase,
        "sublabel": newString.toUpperCase(),
        "type": "number",
        "label": "",
        "styleName": "InputNum",
        "placeholder": "Enter Value",
        "characterLimit": 5
      })
    })
    actualHeader.push({
      "label": "Unit",
      "name": "results",
      "required": true,
      "type": "select",

      "options": [],
      "placeholder": "Enter Value"
    })
    actualColumn.push({
      "name": "param_unit",
      "type": "select",
      "value": "",
      "styleName": "InputNum",
      "label": "",
      "fieldWidth": "50",
      "placeholder": "Enter Value"
    })
    return isTboday ? actualColumn : actualHeader
  }
  return (
    <div key={sectionIndex} className="row my-2 mx-0 bg-white">
      <Card>
        {((formData[0]?.sfm_status && formData[0]?.sfm_status !== "pending") || moduleType == "jobinstruction" || viewOnly) && (
          <CardBody>
            <CardTitle tag="h5">{Section.title}</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6"></CardSubtitle>
            <div className="test_memo_selections">
              <div className="form-group my-2">
                <label style={{ width: `${25}%` }} htmlFor="Sample Id List">
                  Sample Id List
                </label>
                <div className={"w-50 d-inline-block mx-2 sample_code_list"}>
                  <select
                    className="form-control rounded-2"
                    name={"smpl_detail_smpl_id_" + tabIndex}
                    value={
                      formData[sectionIndex]?.[
                      "smpl_detail_smpl_id_" + tabIndex
                      ]
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        sectionIndex,
                        "smpl_detail_smpl_id_" + tabIndex,
                        e.target.value
                      )
                    }
                  >
                    <option value="">{"Select"}</option>

                    {setData.sample_ids?.length > 0 &&
                      setData.sample_ids?.map((option, optionIndex) => (
                        <option
                          key={"sampleInd-" + optionIndex}
                          value={moduleType === "jobinstruction" ? option?.fk_sample_mark_id : option?.fk_smpl_detail_id}
                        >
                          {moduleType === "jobinstruction" ? option?.ops_sp_lab_smplcode : option.sp_lab_smplcode}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              {
              GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) !== "TPBPL" &&
               (
                <div className="form-group my-2">
                  <label style={{ width: `${14}%` }} htmlFor="group">
                    Group :
                  </label>
                  <div className={"w-50 d-inline-block mx-2 sample_code_list"}>
                    <select
                      className="form-control rounded-2"
                      name={"group_id_" + tabIndex}
                      value={formData[sectionIndex]?.["group_id_" + tabIndex]}
                      onChange={(e) =>
                        handleFieldChange(
                          sectionIndex,
                          "group_id_" + tabIndex,
                          e.target.value
                        )
                      }
                    >
                      <option value="">{"Select"}</option>

                      {setData.groups == "Parameters" ? (
                        <option value={setData.groups}>Parameters</option>
                      ) : (
                        setData.groups?.map((option, optionIndex) => (
                          <option
                            key={"groups" + optionIndex}
                            value={
                              option == "Parameters" ? option : option?.group_id
                            }
                          >
                            {option == "Parameters"
                              ? option
                              : option.group_name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              )}
              <div className="form-group my-2 sfm_count">
                {/* <div>
                  Filled Samples{" "}
                  <span>
                    {formData["tab_" + tabIndex]?.["filledCount"] || "0"}
                  </span>
                </div>
                <div>
                  Remaining Samples{" "}
                  <span>
                    {formData["tab_" + tabIndex]?.["noFilledCount"] || "0"}
                  </span>
                </div> */}
                <div className="singleCommonFieldContainer singleCommonFieldContainer_calc">
                  <div>
                    <p> Filled Samples <span>{formData["tab_" + tabIndex]?.["filledCount"] || "0"}</span> </p>
                    <p>Remaining Samples <span>{formData["tab_" + tabIndex]?.["noFilledCount"] || "0"}</span> </p>
                  </div>

                </div>
                <div>
                  <button
                    type="button"
                    className="tick_icon"
                    onClick={() => setIsCalculateOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered ? <CalculatorHover /> : <Calculator />}
                  </button>
                </div>
              </div>
            </div>
            {
              isCalculateOpen && (
                <SFMCalculationForm
                  setIsCalculateOpen={setIsCalculateOpen}
                  allFormulaList={allFormulaList}
                />
              )
            }
            <div className="advtestMemoTableContainer">
              <table className="table table-white responsive borderless no-wrap mt-3 align-middle advTable advtestMemoTable">
                <thead className="head_of_table">
                  <tr className="border-top">
                    {Section.headers.map(
                      (header, headerIndex) =>
                      (
                        <>
                          <th
                            key={"header-Index" + headerIndex}
                            colSpan={header.colSpan ?? 1}
                            rowSpan={header.rowSpan ?? 1}
                          >
                            {header.label}
                            <h6 className="subHeading">
                              {header.sublabel
                                ? header.sublabel.replace("_", " ")
                                : header.sublabel}
                            </h6>
                            {!header.required && (
                              <Button
                                className="trash_btn"
                                onClick={() =>
                                  deleteColumn(sectionIndex, headerIndex)
                                }
                              >
                                <Trash />
                              </Button>
                            )}
                          </th>

                        </>
                      )
                    )}
                    {getSFMHeaderData().map((header, headerIndex) => (<th
                      key={"header-Index" + headerIndex}
                      colSpan={header.colSpan ?? 1}
                      rowSpan={header.rowSpan ?? 1}
                    >
                      {header.label}
                      <h6 className="subHeading">
                        {header.sublabel
                          ? header.sublabel.replace("_", " ")
                          : header.sublabel}
                      </h6>
                      {!header.required && (
                        <Button
                          className="trash_btn"
                          onClick={() =>
                            deleteColumn(sectionIndex, headerIndex)
                          }
                        >
                          <Trash />
                        </Button>
                      )}
                    </th>))}
                    {groupAssignment ? <th>Action</th> : null}
                  </tr>
                </thead>

                <tbody>
                  {isParamChanged && paramBasisSetData.map((paramdata, paramIndex) => {
                    return Section.rows.map((row, rowIndex) => (
                      <tr key={paramdata + rowIndex} className="border-top">
                        {row.map(
                          (cell, cellIndex) =>
                          (
                            <>
                              <td
                                key={"cellIndex" + cellIndex}
                                colSpan={
                                  cell.name === "group" ? range[rangeSet] : 1
                                }
                              >
                                <div className="tick_box">
                                  <RenderFields
                                    field={getCustomCellValues(cell, paramIndex)}
                                    sectionIndex={tabIndex}
                                    fieldIndex={rowIndex * 100 + cellIndex}
                                    formData={paramBasisData}
                                    handleFieldChange={customHandleChange}
                                    handleFieldBlur={() =>
                                      handleSingleDetailsSPUpdate(
                                        tabIndex,
                                        paramIndex,
                                        cell.name,
                                        paramBasisData
                                      )
                                    }
                                    formErrors={formErrors}
                                    GAData={GAData}
                                    setGAData={setGAData}
                                    showModalGA={showModalGA}
                                    setShowModalGA={setShowModalGA}
                                    customName={
                                      cell.name +
                                      "_" +
                                      paramIndex +
                                      "_" +
                                      tabIndex
                                    }
                                    viewOnly={
                                      viewOnly
                                    }
                                    centerAlign={true}
                                    tooltipTrue={""}
                                    masterOptions={updatedMasterOptions}
                                  />
                                </div>
                              </td>
                              {/*getExtranInput(
                                cell,
                                cellIndex,
                                rowIndex,
                                paramIndex
                              )*/}
                            </>
                          )
                        )}
                        {
                          getSFMHeaderData(1).map((cell, cellIndex) => (
                            <td
                              key={"cellIndex" + cellIndex}
                              colSpan={
                                cell.name === "group" ? range[rangeSet] : 1
                              }
                            >
                              <div className={cell.name === "param_unit" ?"tick_box_unit": "tick_box"}>
                                <RenderFields
                                  field={getCustomCellValues(cell, paramIndex)}
                                  sectionIndex={tabIndex}
                                  fieldIndex={rowIndex * 100 + cellIndex}
                                  formData={paramBasisData}
                                  handleFieldChange={customHandleChange}
                                  handleFieldBlur={(sectionIndex, fieldName, value) =>
                                    basisCodeDataValue.includes(cell.name)
                                      ? handleSingleDetailsCreateUpdate(
                                        tabIndex,
                                        paramIndex,
                                        cell.name,
                                        paramBasisData,
                                        getSFMParamBasis,
                                        paramBasisSetData,
                                        moduleType,
                                        "",
                                        setIsOverlayLoader,
                                        setFormData,
                                        formData
                                      )
                                      : handleSingleDetailsSPUpdate(
                                        tabIndex,
                                        paramIndex,
                                        cell.name,
                                        paramBasisData,
                                        getSFMParamBasis,
                                        formData,
                                        value
                                      )
                                  }
                                  formErrors={formErrors}
                                  GAData={GAData}
                                  setGAData={setGAData}
                                  showModalGA={showModalGA}
                                  setShowModalGA={setShowModalGA}
                                  customName={
                                    cell.name +
                                    "_" +
                                    paramIndex +
                                    "_" +
                                    tabIndex
                                  }
                                  viewOnly={
                                    viewOnly ||
                                    (
                                      basisCodeDataValue.includes(cell.name) &&
                                      paramBasisData[tabIndex][
                                      cell.name +
                                      "_" +
                                      paramIndex +
                                      "_" +
                                      tabIndex
                                      ] == "N/A")
                                    || (cell.name === "param_unit" && paramBasisData?.[tabIndex]?.['param_unit_options_' + paramIndex + "_" + tabIndex]?.length <= 1)
                                  }
                                  centerAlign={true}
                                  tooltipTrue={""}
                                  masterOptions={updatedMasterOptions}
                                />
                                {
                                  basisCodeDataValue.includes(cell.name) &&
                                  !viewOnly &&
                                  basisCodeData.includes(cell.sublabel.replace(" ", "_")) && (
                                    <button
                                      type="button"
                                      className="tick_icon"
                                      disabled={
                                        paramBasisData[tabIndex][
                                        cell.name +
                                        "_" +
                                        paramIndex +
                                        "_" +
                                        tabIndex
                                        ] === "N/A"
                                      }
                                      onClick={() => {
                                        handleSingleDetailsCreateUpdate(
                                          tabIndex,
                                          paramIndex,
                                          cell.name,
                                          paramBasisData,
                                          getSFMParamBasis,
                                          paramBasisSetData,
                                          moduleType,
                                          1,
                                          setIsOverlayLoader,
                                          setFormData,
                                          formData
                                        );
                                      }}
                                    >
                                      {paramBasisData[tabIndex][
                                        cell.name +
                                        "_icon" +
                                        "_" +
                                        paramIndex +
                                        "_" +
                                        tabIndex
                                      ] ? (
                                        <Tick />
                                      ) : (
                                        <DisabledTick />
                                      )}
                                    </button>
                                  )}
                              </div>
                            </td>
                          ))
                        }
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </CardBody >
        )}
      </Card >
    </div >
  );
};

RenderAdvSFMTableSection.propTypes = {
  section: PropTypes.string,
  sectionIndex: PropTypes.number,
  formData: PropTypes.object,
  handleFieldChange: PropTypes.func,
  deleteColumn: PropTypes.func,
  formErrors: PropTypes.object,
  groupAssignment: PropTypes.arrayOf(PropTypes.object),
  GAData: PropTypes.arrayOf(PropTypes.object),
  setGAData: PropTypes.func,
  showModalGA: PropTypes.bool,
  setShowModalGA: PropTypes.func,
  setData: PropTypes.func,
  tabIndex: PropTypes.number,
  setFormData: PropTypes.func,
  viewOnly: PropTypes.bool,
  activeTab: PropTypes.string,
  allFormulaList: PropTypes.arrayOf(PropTypes.object),
  moduleType: PropTypes.string,
  EditRecordId: PropTypes.string,
  OperationTypeID: PropTypes.number
};
export default RenderAdvSFMTableSection;
