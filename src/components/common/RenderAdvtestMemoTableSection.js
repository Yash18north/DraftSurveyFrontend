import React, { useEffect, useState } from "react";
import RenderFields from "./RenderFields";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { getTestMemoParamBasis } from "./commonHandlerFunction/testMemoFunctionHandler";
import { GetTenantDetails } from "../../services/commonServices";
import PropTypes from "prop-types";

const RenderAdvtestMemoTableSection = ({
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
  setIsOverlayLoader
}) => {
  const [Section, setSection] = useState(section);

  const [rangeSet, setRangeSet] = useState(0);
  const [range, setRange] = useState([]);
  const [parambasissetData, setParamBasissetData] = useState([]);
  const [parambasisData, setParamBasisData] = useState();
  const [basisCodeData, setBasisCodeData] = useState([]);
  const [basisCodeDataValue, setBasisCodeDataValue] = useState([]);
  const [isParamChanged, setIsParamChanged] = useState(true);
  useEffect(() => {
    getTestMemoParamBasis(
      formData[sectionIndex]?.["smpl_detail_smpl_id_" + tabIndex],
      formData[sectionIndex]?.["group_id_" + tabIndex],
      tabIndex,
      setParamBasisData,
      setParamBasissetData,
      setBasisCodeData,
      setIsOverlayLoader,
      setBasisCodeDataValue,
      setIsParamChanged,
      formData
    );
  }, [
    formData[sectionIndex]?.["smpl_detail_smpl_id_" + tabIndex],
    formData[sectionIndex]?.["group_id_" + tabIndex],
  ]);

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
        "type": "label",
        "label": "",
        "placeholder": "Enter Condition of Sample"
      })
    })
    actualHeader.push({
      "label": "Unit",
      "name": "results",
      "type": "select",
      "required": true,
      "fieldWidth": "50",

      "options": [],
      "placeholder": "Enter Parameter"
    })
    actualColumn.push({
      "name": "param_unit",
      "type": "label",
      "value": "",
      "fieldWidth": "50",
      "label": "",
      "placeholder": "Enter Condition of Sample"
    })
    return isTboday ? actualColumn : actualHeader
  }
  return (
    <>
      <div key={sectionIndex} className="row my-2 mx-0 bg-white">
        <Card>
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
                    <option value="">{"select"}</option>

                    {setData.sample_ids?.length > 0 &&
                      setData.sample_ids?.map((option, optionIndex) => (
                        <option
                          key={"optionIndex" + optionIndex}
                          value={option?.smpl_inwrd_detail_id}
                        >
                          {option.smpl_detail_smpl_id}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              {
                GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) !== "TPBPL" && (
                  <div className="form-group my-2">
                    <label style={{ width: `${15}%` }} htmlFor="group">
                      Group
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
                        <option value="">{"select"}</option>

                        {setData.groups == "Parameters" ? (
                          <option value={setData.groups}>{setData.groups}</option>
                        ) : (
                          setData.groups?.map((option, optionIndex) => (
                            <option
                              key={"optionIndex" + optionIndex}
                              value={
                                option == "Parameters" ? option : option?.group_id
                              }
                            >
                              {option == "Parameters" ? option : option.group_name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>)
              }
            </div>
            <div className="advtestMemoTableContainer">
              <table className="table table-white responsive borderless no-wrap mt-3 align-middle advTable advtestMemoTable">
                <thead className="head_of_table">
                  <tr className="border-top">
                    {Section.headers.map(
                      (header, headerIndex) =>
                        (header.name != "non_scope" ||
                          (header.name == "non_scope" &&
                            ['results', 'certified', 'verified'].includes(formData[0]?.["status"]))) &&
                        (
                          <th
                            key={"headerIndex" + headerIndex}
                            colSpan={header.colSpan ?? 1}
                            rowSpan={header.rowSpan ?? 1}
                          >
                            {header.label}
                            <h6 className="subHeading">{header.sublabel}</h6>
                          </th>
                        )
                    )}
                    {
                      getSFMHeaderData().map((header, headerIndex) => (
                        <th
                          key={"headerIndex" + headerIndex}
                          colSpan={header.colSpan ?? 1}
                          rowSpan={header.rowSpan ?? 1}
                        >
                          {header.label}
                          <h6 className="subHeading">{header.sublabel}</h6>
                        </th>
                      ))
                    }
                    {groupAssignment ? <th>Action</th> : null}
                  </tr>
                </thead>

                <tbody>
                  {isParamChanged && parambasissetData.map((paramdata, paramIndex) => {
                    return Section.rows.map((row, rowIndex) => (
                      <tr key={paramdata + rowIndex} className="border-top">
                        {row.map(
                          (cell, cellIndex) =>

                            (cell.name != "non_scope" ||
                              (cell.name == "non_scope" &&
                                ['results', 'certified', 'verified'].includes(formData[0]?.["status"]))) &&
                            (
                              <td
                                key={"cellIndex" + cellIndex}
                                colSpan={
                                  cell.name === "group" ? range[rangeSet] : 1
                                }
                              >
                                <div className="tick_box">
                                  <RenderFields
                                    field={cell}
                                    sectionIndex={tabIndex}
                                    fieldIndex={rowIndex * 100 + cellIndex}
                                    formData={parambasisData}
                                    handleFieldChange={handleFieldChange}
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
                                    viewOnly={true}
                                    centerAlign={true}
                                    tooltipTrue={true}
                                  />
                                </div>
                              </td>
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
                              <div className="tick_box">
                                <RenderFields
                                  field={cell}
                                  sectionIndex={tabIndex}
                                  fieldIndex={rowIndex * 100 + cellIndex}
                                  formData={parambasisData}
                                  handleFieldChange={handleFieldChange}
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
                                  viewOnly={true}
                                  centerAlign={true}
                                  tooltipTrue={true}
                                />
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
          </CardBody>
        </Card>
      </div>
    </>
  );
};
RenderAdvtestMemoTableSection.propTypes = {
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
  tabIndex: PropTypes.number
};
export default RenderAdvtestMemoTableSection;
