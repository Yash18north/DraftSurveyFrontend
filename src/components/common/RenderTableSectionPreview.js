import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { ReactComponent as Trash } from "bootstrap-icons/icons/trash.svg";
import { sampleInwardDetailsGetAPI } from "../../services/api";

import {
  GetTenantDetails,
  postDataFromApi,
} from "../../services/commonServices";
import { getSelectedOptionName } from "../../services/commonFunction";
import PropTypes from "prop-types";
import { getJIAssignmentData, getJIsowandactivityData } from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import { getAllSampleAssignmentist } from "./commonHandlerFunction/operations/TMLOperations";
import { useLocation } from "react-router-dom";
import { decryptDataForURL } from "../../utills/useCryptoUtils";

const RenderTableSection = ({
  section,
  sectionIndex,
  formData,
  deleteColumn,
  setFormData,
  pageType,
  masterOptions,
  isSubPreview,
  setSimpaleInwardResponse,
  simpleInwardResponse,
  tabIndex,
  moduleType,
  OperationTypeID,
  isSingleParamOnly,
  isUseForViwOnly,
  isPopup,
  isSingleSetOnly
}) => {
  const [sampleDataTable, setSampleDataTable] = useState([]);
  const [simpleInwardId, setSimpleInwardId] = useState("");
  const [finalParamDataSort, setFinalParamDataSort] = useState([]);

  useEffect(() => {
    if (!isUseForViwOnly) {
      if (moduleType === "sampleinward") {
        setSimpleInwardId(formData[1]?.sampleInwardIdMain);
        setTimeout(() => {
          getInwardTabledata(formData[1]?.sampleInwardIdMain);
        }, 1000);
      } else if (moduleType === "jobinstruction") {
        if (section.moduleType === "VesselListOperationAssignment") {
          getAllSampleAssignmentist(
            formData[0]?.ji_id,
            OperationTypeID,
            setSampleDataTable,
            formData,
            setFormData,
            section,
            setFinalParamDataSort,
            null,
            null,
            null,
            null,
            moduleType
          );
        } else {
          getJIsowandactivityData(
            formData[0]?.ji_id,
            setSampleDataTable,
            "quality_analysis",
            formData,
            setFormData,
            section,
            setFinalParamDataSort
          );
        }
      } else if (section.moduleType === "JRFOperationAssignment") {
        if (
          (formData[0]?.fk_jiid, formData[0]?.fk_jisid && formData[0]?.fk_jisid)
        ) {
          getAllSampleAssignmentist(
            formData[0]?.fk_jiid,
            formData[0]?.fk_jisid,
            setSampleDataTable,
            formData,
            setFormData,
            section,
            setFinalParamDataSort,
            null,
            null,
            null,
            null,
            moduleType
          );
        }
      }
    }
    else {
      if (formData[0]?.ji_id) {

        getJIAssignmentData(formData[0]?.jiqualityanalysis, setSampleDataTable, setFinalParamDataSort)
      }
    }
  }, [
    formData[1]?.sampleInwardIdMain,
    formData[0]?.ji_id,
    formData[0]?.fk_jiid,
    formData[0]?.fk_jisid,
  ]);
  useEffect(() => {
    if (isSubPreview && simpleInwardResponse?.sample_set_data) {
      setSampleDataTable(simpleInwardResponse.sample_set_data);
    }
  }, [simpleInwardResponse]);

  const getInwardTabledata = async (simpleId) => {
    let payload = {
      smpl_inwrd_id: simpleId,
    };
    let res = await postDataFromApi(sampleInwardDetailsGetAPI, payload);
    if (res?.data?.status === 200) {
      const updatedFormData = { ...formData };
      let selectedSimpleIds = [];
      res.data.data.sample_set_data.forEach((singleInwardData, i) => {
        singleInwardData.smpl_set_smpljson.forEach((simpleId) => {
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
          combinedArray.push({ paramType: "Group", ...value });
        }
        for (const [key, value] of Object.entries(
          singleParamaSet.smpl_set_paramjson
        )) {
          value.param_type = "Parameter";
          combinedArray.push({ paramType: "Parameter", ...value });
        }
        combinedArray = combinedArray.sort(
          (a, b) => a.sequanceNo - b.sequanceNo
        );
        FinalCombinedArray.push(combinedArray);
      });
      setFinalParamDataSort(FinalCombinedArray);
      setSampleDataTable(res.data.data.sample_set_data);

      setSimpleInwardId(res.data.data.smpl_inwrd_id);
      updatedFormData[0]["smpl_status"] = res.data.data.smpl_status;
      updatedFormData[0]["smpl_inwrd_No"] = res.data.data.smpl_inward_number;
      updatedFormData[0]["inward_msfm_number"] =
        res.data.data.inward_msfm_number;
      setFormData(updatedFormData);
    }
  };
  const getSingleParamData = (singleParamDetails, type) => {
    if (moduleType === "GroupAssignment" || moduleType === "sampleinward") {
      if (type === "Parameter") {
        return singleParamDetails.smpl_set_paramjson;
      } else {
        return singleParamDetails.smpl_set_groupjson;
      }
    } else {
      if (
        section.moduleType === "JRFOperationAssignment" ||
        section.moduleType === "VesselListOperationAssignment"
      ) {
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
  const getSingleSampleData = (singleParamDetails) => {
    if (moduleType === "GroupAssignment" || moduleType === "sampleinward") {
      return singleParamDetails.smpl_set_smpljson;
    } else {
      if (section.moduleType === "JRFOperationAssignment") {
        return singleParamDetails.jila_set_markjson;
      } else {
        return singleParamDetails.jila_set_markjson;
      }
    }
  };
  const location = useLocation();

  const getClassName = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const isFullDetails = decryptDataForURL(params.get("isFullDetails"));
    if (isFullDetails) {
      return "main_form subSection_main_form row";
    }
    return "row my-2 mx-0 bg-white previewRow";
  };

  return (
    <div key={sectionIndex} className={getClassName()}>
      <Card className="Scrollable">
        {(simpleInwardId || pageType !== "inward") && sampleDataTable.length ? (
          <CardBody>
            <CardTitle tag="h5" className="section_heading">{section.title}</CardTitle>
            <table className="table table-white responsive borderless no-wrap mt-3 align-middle renderTable previewRenderTable renderTableSetwise">
              {sampleDataTable.map((tablerow, rowIndex) =>
                section.rows.map((row, rowIndex2) => (
                  <React.Fragment key={"rowIndex2" + rowIndex2}>
                    {rowIndex === 0 && (
                      <thead>
                        {(!isSingleParamOnly && !isSingleSetOnly) && (
                          <tr>
                            <td colSpan={row.length + 2}>
                              <CardTitle tag="h5" className="section_heading">
                                Set {rowIndex + 1}
                              </CardTitle>
                            </td>
                          </tr>
                        )}
                        <tr>
                          {!isSingleSetOnly && <th>Sr.</th>}
                          {(["jrf", "inwardChecklist"].includes(moduleType) && formData[0].jrf_is_ops) && <th>Lab Name</th>}
                          {section.headers.map((header, headerIndex) => {
                            if (!['jobinstruction'].includes(moduleType)) {
                              if (header.label == "Type") {
                                return null
                              }
                            }
                            if (["Test Method"].includes(header.label) &&
                              GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) !== "TPBPL") {
                              return (
                                <>
                                  <th key={"headerIndex" + headerIndex}>
                                    Parameter
                                  </th>
                                  <th key={"headerIndex" + headerIndex}>
                                    {header.label}
                                  </th>
                                </>
                              )
                            }

                            return GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL" &&
                              header.label === "Basis" ? null : (
                              <>
                                {/* {["Test Method"].includes(header.label) &&
                                  GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) !== "TPBPL" ? (
                                  <th key={"headerIndex" + headerIndex}>
                                    Parameter
                                  </th>
                                ) : null} */}
                                <th key={"headerIndex" + headerIndex}>
                                  {GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL"
                                    ? (header.label === "Is Groups or Parameter"
                                      ? "Discipline Or Group"
                                      : header.label === "Groups of Parameter"
                                        ? "Parameter"
                                        : header.label)
                                    : header.label}
                                  {!header.required && (
                                    <button
                                      className="trash_btn"
                                      onClick={() =>
                                        deleteColumn(sectionIndex, headerIndex)
                                      }
                                    >
                                      <Trash variant="text-danger" />
                                    </button>
                                  )}
                                </th>
                              </>
                            )
                          }

                          )}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {!isSingleParamOnly && rowIndex !== 0 && (
                        <tr>
                          <td colSpan={row.length + 2}>
                            <CardTitle tag="h5" className="section_heading">
                              Set {rowIndex + 1}
                            </CardTitle>
                          </td>
                        </tr>
                      )}
                      <React.Fragment key={"rowIndex" + rowIndex}>
                        {
                          // finalParamDataSort.map((singleSetData, setIndex) =>
                          finalParamDataSort[rowIndex].map(
                            (paramData, setParamIndex) => {
                              let groupCount = 0;
                              getSingleParamData(
                                sampleDataTable[rowIndex],
                                "Group"
                              ).map((singleGroup) => {
                                groupCount += singleGroup.parameters.length;
                              });
                              let mainRowsPan = 1;
                              mainRowsPan =
                                getSingleParamData(
                                  sampleDataTable[rowIndex],
                                  "Parameter"
                                ).length +
                                getSingleParamData(
                                  sampleDataTable[rowIndex],
                                  "Group"
                                ).length +
                                groupCount;

                              return section.rows.map((row, rowIndex2) => (
                                <>
                                  <tr
                                    key={"rowIndex" + rowIndex2}
                                    className="border-top"
                                  >
                                    {setParamIndex == 0 && (
                                      <React.Fragment>
                                        {!isSingleSetOnly && <td rowSpan={mainRowsPan}>
                                          {rowIndex + 1}
                                        </td>}
                                        {
                                          (["jrf", "inwardChecklist"].includes(moduleType) && formData[0].jrf_is_ops) && (
                                            <td rowSpan={mainRowsPan}>
                                              {
                                                sampleDataTable[rowIndex]?.lab_detail ? sampleDataTable[rowIndex]?.lab_detail
                                                  ?.lab_name + ` (${sampleDataTable[rowIndex]?.lab_detail
                                                    ?.lab_code})` : "External Results"
                                              }
                                            </td>
                                          )
                                        }

                                        {!isSingleSetOnly && <td rowSpan={mainRowsPan}>
                                          {Array.isArray(
                                            // sampleDataTable[setIndex]["smpl_set_smpljson"]
                                            getSingleSampleData(
                                              sampleDataTable[rowIndex]
                                            )
                                          )
                                            ? getSelectedOptionName(
                                              [],
                                              masterOptions,
                                              "smpl_set_smpljson",
                                              getSingleSampleData(
                                                sampleDataTable[rowIndex]
                                              ),
                                              "smpl_set_smpljson"
                                            )
                                            : getSingleSampleData(
                                              sampleDataTable[rowIndex]
                                            )}
                                        </td>}
                                      </React.Fragment>
                                    )}
                                    {paramData.param_type === "Group" ? (
                                      <>
                                        {['jobinstruction'].includes(moduleType) && <td
                                          rowSpan={
                                            paramData.parameters.length + 1
                                          }
                                        >
                                          Group
                                        </td>}
                                        <td
                                          rowSpan={
                                            paramData.parameters.length + 1
                                          }
                                        >
                                          {paramData["group_name"]}
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        {['jobinstruction'].includes(moduleType) && <td>Parameter</td>}
                                        {row.map((cell, cellIndex) =>
                                          cell.subname != "group_id" &&
                                            cell.subname != "isGroup" ? (
                                            [
                                              "smpl_set_testmethodjson",
                                            ].includes(cell.name) ? (
                                              <>
                                                {GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) !==
                                                  "TPBPL" && <td>--</td>}
                                                <td
                                                  key={"cellIndex" + cellIndex}
                                                >
                                                  {cell.subname == "basis"
                                                    ? paramData[
                                                      cell.subname
                                                    ].map(
                                                      (basecode, index) =>
                                                        (index != 0
                                                          ? ","
                                                          : "") +
                                                        basecode.basis_code
                                                    )
                                                    : paramData[cell.subname]}
                                                </td>

                                              </>
                                            ) : GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) ===
                                              "TPBPL" &&
                                              cell.subname ===
                                              "basis" ? null : (
                                              <td key={"cellIndex" + cellIndex}>
                                                {cell.subname == "basis"
                                                  ? paramData[cell.subname].map(
                                                    (basecode, index) =>
                                                      (index != 0
                                                        ? ","
                                                        : "") +
                                                      basecode.basis_code
                                                  )
                                                  : paramData[cell.subname]}
                                              </td>
                                            )
                                          ) : null
                                        )}
                                      </>
                                    )}
                                  </tr>
                                  {paramData.param_type === "Group" &&
                                    paramData.parameters.map(
                                      (basecode, index) => (
                                        <tr>
                                          {row.map((cell, cellIndex) =>
                                            cell.subname != "group_id" &&
                                              cell.subname != "isGroup" &&
                                              cell.subname != "param_name" ? (
                                              [
                                                "smpl_set_testmethodjson",
                                              ].includes(cell.name) ? (
                                                <>
                                                  <td>{basecode.param_name}</td>
                                                  <td
                                                    key={
                                                      "cellIndex" + cellIndex
                                                    }
                                                  >
                                                    {basecode.standards.map(
                                                      (std, i) =>
                                                        (i != 0 ? "," : "") +
                                                        std.std_name
                                                    )}
                                                  </td>
                                                </>
                                              ) : cell.name ===
                                                "smpl_set_unit" ? (
                                                <td>{basecode.param_unit}</td>
                                              ) : (
                                                <td
                                                  key={"cellIndex" + cellIndex}
                                                >
                                                  {cell.subname == "basis" ||
                                                    cell.subname == "std_name"
                                                    ? cell.subname == "basis"
                                                      ? basecode.basis.map(
                                                        (base, i) =>
                                                          (i != 0
                                                            ? ","
                                                            : "") +
                                                          base.basis_code
                                                      )
                                                      : // : basecode.standards.std_name
                                                      basecode.standards.map(
                                                        (std, i) =>
                                                          (i != 0
                                                            ? ","
                                                            : "") +
                                                          std.std_name
                                                      )
                                                    : cell.subname ==
                                                      "param_name"
                                                      ? paramData["group_name"]
                                                      : paramData[cell.subname]}
                                                </td>
                                              )
                                            ) : null
                                          )}
                                        </tr>
                                      )
                                    )}
                                </>
                              ));
                            }
                          )
                          // )
                        }
                      </React.Fragment>
                    </tbody>
                  </React.Fragment>
                ))
              )}
            </table>
          </CardBody>
        ) : null}
      </Card>
    </div>
  );
};

RenderTableSection.propTypes = {
  section: PropTypes.object.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  formData: PropTypes.object.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  pageType: PropTypes.string.isRequired,
  masterOptions: PropTypes.object.isRequired,
  isSubPreview: PropTypes.bool.isRequired,
  setSimpaleInwardResponse: PropTypes.func.isRequired,
  simpleInwardResponse: PropTypes.object.isRequired,
  tabIndex: PropTypes.number,
  moduleType: PropTypes.string,
  OperationTypeID: PropTypes.number,
};

export default RenderTableSection;
