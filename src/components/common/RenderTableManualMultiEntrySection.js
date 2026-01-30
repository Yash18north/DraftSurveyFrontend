import React, { useEffect, useState } from "react";
import RenderFields from "./RenderFields";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import PropTypes from "prop-types";
import { getTotalCountBasedOnField, getVesselOperation } from "../../services/commonFunction";
import { toast } from "react-toastify";
const RenderTableManualMultiEntrySection = ({
  section,
  sectionIndex,
  formData,
  handleFieldChange,
  formErrors,
  tableData,
  setTableData,
  tabIndex,
  OperationType,
  viewOnly
}) => {
  const [allTableData, setAllTableData] = useState([]);
  const [updatedMasterOptions, setUpdatedMasterOptions] = useState([]);
  const [hasFieldChanged, setFieldsChange] = useState(false)
  // useEffect(()=>{
  //   let rowCountarr=[]
  //   for (let i = 0; i < section.rowsCount; i++) {
  //     rowCountarr.push({})
  //   }
  //   setAllTableData(rowCountarr)
  // },[])
  useEffect(() => {
    if (section.multipleTableExists) {
      let rowCountarr = []
      if (tableData[section.tableNumber] && tableData[section.tableNumber].length > 0) {
        // rowCountarr = tableData[section.tableNumber]
      }
      for (let i = 0; i < section.rowsCount; i++) {
        rowCountarr.push({
          hatch: 'Hatch-' + (i + 1),
          weight: tableData?.[section.tableNumber]?.[i]?.['weight'] || '',
        })
        if (OperationType === getVesselOperation("SV") && tabIndex === 0) {
          // // console.log('hat----','Hatch-' + (i + 1))
          // handleFieldChange(sectionIndex, 'hatch_' + i, 'Hatch-' + (i + 1));
        }
      }
      setAllTableData(rowCountarr)
    } else {
      if (tableData.length > 0) {
        setAllTableData(tableData);
      }
      else {
        let rowCountarr = []
        for (let i = 0; i < section.rowsCount; i++) {
          rowCountarr.push({})
        }
        setAllTableData(rowCountarr)
      }
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
  }, [allTableData, hasFieldChanged]);
  const onSingleFieldChange = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = ""
  ) => {
    if (OperationType === getVesselOperation("SV") && tabIndex === 0) {
      let spName = fieldName.split('_')
      const totalWeight = getTotalCountBasedOnField(allTableData, 'weight', 1, value, spName[1])
      //temporrary commented 07-02-2025
      // if (totalWeight > formData?.[0]?.ji_appointed_totalqty) {
      //   toast.error("Total Weight cannot exceed the Appointed Quantity", {
      //     position: "top-right",
      //     autoClose: 2000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light",
      //   });
      //   return
      // }
      //End Comment
    }
    handleFieldChange(sectionIndex, fieldName, value, type, isChecked);
  };
  const onSingleFieldBlur = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = ""
  ) => {
    let spName = fieldName.split("_");
    let ExistsData = allTableData;
    let payload = {};
    section.rows[0].map((field) => {
      payload[field.name] = formData["1"]?.[field.name + "_" + spName[spName.length - 1]];
    });
    ExistsData[spName[spName.length - 1]] = payload;
    setAllTableData(ExistsData);
    setTimeout(() => {
      setFieldsChange(!hasFieldChanged)
    }, 10)
  };
  const getCustomCellValues = (cell, rowIndex) => {
    if (cell.type === "date") {
      cell.noRestrictionApply = true
    }
    return cell;
  };
  return (
    <div key={sectionIndex} className="row my-2 mx-0 bg-white">
      <Card className="Scrollable">
        <CardBody>
          <CardTitle tag="h5">{section.title}</CardTitle>
          <table className="table table-white responsive borderless no-wrap mt-3 align-middle renderTable">
            <thead>
              <tr>
                {section.headers.map(
                  (header, headerIndex) =>
                    header.name !== "smpl_detail_smpl_qty_unit" && (
                      <th key={"headerIndex" + headerIndex}>
                        {header.label}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {allTableData.map((singleTableData, rowIndex) =>
                section.rows.map((row, rowIndex2) => (
                  <tr key={"rowIndex" + rowIndex} className="border-top">
                    {row.map(
                      (cell, cellIndex) => {
                        if (cell.name == "hatch") {
                          const newStaticValue = "Hatch-" + (rowIndex + 1)
                          cell.value = newStaticValue
                          cell.isStaticValue = true
                          cell.useForViewOnly = true
                        }
                        cell = getCustomCellValues(
                          cell,
                          rowIndex
                        )
                        return <td key={"cellIndex" + cellIndex}>
                          <span>
                            <RenderFields
                              field={{
                                ...cell,
                                defaultValue: (OperationType === getVesselOperation("SV") && tabIndex === 0 && cell.name == "hatch") ? 'hatch-' + (rowIndex + 1) : cell.defaultValue
                              }}
                              sectionIndex={sectionIndex}
                              fieldIndex={rowIndex * 100 + cellIndex}
                              formData={formData}
                              handleFieldChange={onSingleFieldChange}
                              formErrors={formErrors} // Pass formErrors to RenderFields
                              ///for render table only
                              renderTable={true}
                              tableIndex={rowIndex}
                              customName={cell.name + "_" + rowIndex}
                              masterOptions={updatedMasterOptions}
                              from="Table"
                              handleFieldBlur={onSingleFieldBlur}
                              viewOnly={viewOnly}
                            />
                          </span>
                        </td>
                      }
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="align-end-100 ">
            {OperationType === getVesselOperation("SV") && tabIndex === 0 && (
              <>
                {/*  <div className="supervision_total_voyage">
                <h6>
                <p>
                  Total Weight

                </p>
                <span> {getTotalCountBasedOnField(allTableData, 'weight') || 0}</span>
              </h6> */}
                <div
                  key={"Form-Accordion"}
                  className={" col-md-" + 6}
                >
                  <RenderFields
                    field={{
                      "name": "allTotalVallue",
                      "type": "text",
                      "label": "Total Weight",
                      "width": 3,
                      "fieldWidth": "50",
                      "readOnly": true,
                      "defaultValue": getTotalCountBasedOnField(allTableData, 'weight') || 0
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
      </Card>
    </div>
  );
};

RenderTableManualMultiEntrySection.propTypes = {
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

export default RenderTableManualMultiEntrySection;
