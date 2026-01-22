import React, { useEffect, useState } from "react";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import PropTypes from "prop-types";
import RenderFields from "./RenderFields";
import { getPlantOperations, getVesselOperation } from "../../services/commonFunction";

const RenderConfigureTable = ({
  section,
  sectionIndex,
  formData,
  handleFieldChange,
  formErrors,
  setFormData,
  viewOnly,
  actionClicked,
  configCertStatusRPCID,
  handleCertificateSave,
  opsCertiView,
  sequence,
  setSequence,
  OperationType
}) => {

  const conditionOfisSubCheckbox = (field) => {
    if ((formData[1]?.rpc_is_lot_no?.length > 0 &&
      ["rpc_is_lotwise_wght_avg", "rpc_is_lotwise_qty", "rpc_is_lotwise_smpl_mark", "rpc_is_lotwise_sample_qty", "rpc_is_lotwise_lot_no", "rpc_is_annexure"].includes(field.name))) {
      return false;
    }
    else if ((formData[1]?.rpc_is_wght_avg?.length > 0 &&
      ["rpc_is_appendix", "rpc_is_wt_sample_mark"].includes(field.name))) {
      return false;
    }

    else if ((formData[1]?.rpc_is_sample_specs?.length > 0 &&
      ["rpc_is_smpl_spec_lotno", "rpc_is_qty", "rpc_is_smpl_mark", "rpc_is_dos", "rpc_is_smpl_qty", "rpc_is_smpl_wghtorunit", "rpc_is_smpl_type"].includes(field.name))) {
      return false;
    }

    else if ((formData[1]?.rpc_is_other_config?.length > 0 &&
      ["rpc_is_size_analysis", "rpc_is_dual_port", "rpc_is_dual_port_combined", "rpc_is_eis_format", "rpc_weighted_certno", "rpc_is_other_remark", "rpc_is_other_work_dt"].includes(field.name))) {
      return false;
    }
    else if ((formData[1]?.rpc_is_sequence?.length > 0 &&
      ["rpc_weight_avg_seq", "rpc_lotwise_seq", "rpc_sample_spec_seq", "rpc_is_sequence_size_analysis"].includes(field.name))) {
      if (field.name === "rpc_weight_avg_seq" && formData[1]?.rpc_is_wght_avg?.length > 0) {
        return false;
      }
      else if (field.name === "rpc_lotwise_seq" && formData[1]?.rpc_is_lot_no?.length > 0) {
        return false;
      }
      else if (field.name === "rpc_sample_spec_seq" && formData[1]?.rpc_is_sample_specs?.length > 0) {
        return false;
      }
      else if (field.name === "rpc_is_sequence_size_analysis") {
        return false;
      }
      else {
        return true
      }
    }
    else if ((formData[1]?.rpc_is_size_analysis?.length > 0 &&
      ["rpc_is_smpl_sa_lowise", "rpc_is_sa_weighted_avg"].includes(field.name))) {
      return false;
    }
    else {
      return true;
    }

  }


  const conditionOfHeaderisSubCheckbox = (field) => {
    if (field.name === "rpc_is_wght_avg" || field.name === "rpc_is_lot_no") {
      return false
    }
    else {
      return false
      // return true
    }
  }

  useEffect(() => {
    if (formData[1]?.rpc_is_wght_avg?.length === 0) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          1: {
            ...prevFormData[1],
            rpc_is_appendix: [],
            rpc_weight_avg_seq: [],
            rpc_is_wt_sample_mark: []
          },
        };
      });
    }
    else if (formData[1]?.rpc_is_lot_no?.length === 0) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          1: {
            ...prevFormData[1],
            rpc_is_lotwise_wght_avg: [],
            rpc_is_lotwise_qty: [],
            rpc_is_lotwise_smpl_mark: [],
            rpc_is_lotwise_sample_qty: [],
            rpc_lotwise_seq: [],
            rpc_is_lotwise_lot_no: [],
            rpc_is_annexure: []
          },
        };
      });
    }
    else if (formData[1]?.rpc_is_sample_specs?.length === 0) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          1: {
            ...prevFormData[1],
            rpc_is_smpl_spec_lotno: [],
            rpc_is_qty: [],
            rpc_is_smpl_mark: [],
            rpc_is_dos: [],
            rpc_is_smpl_qty: [],
            rpc_is_smpl_wghtorunit: [],
            rpc_is_smpl_type: [],
            rpc_sample_spec_seq: []
          },
        };
      });
    }
    else if (formData[1]?.rpc_is_other_config?.length === 0) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          1: {
            ...prevFormData[1],
            rpc_is_size_analysis: [],
            rpc_is_dual_port: [],
            rpc_is_dual_port_combined: [],
            rpc_is_eis_format: [],
            rpc_weighted_certno: [],
            rpc_is_other_remark: [],
            rpc_is_other_work_dt: [],
          },
        };
      });
    }
    else if (formData[1]?.rpc_is_sequence?.length === 0) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          1: {
            ...prevFormData[1],
            rpc_weight_avg_seq: [],
            rpc_lotwise_seq: [],
            rpc_sample_spec_seq: [],
            rpc_is_sequence_size_analysis: [],
          },
        };
      });
    }
    else if (formData[1]?.rpc_is_size_analysis?.length === 0) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          1: {
            ...prevFormData[1],
            rpc_is_smpl_sa_lowise: [],
            rpc_is_sa_weighted_avg: []
          },
        };
      });
    }

  }, [formData[1]?.rpc_is_wght_avg, formData[1]?.rpc_is_lot_no, formData[1]?.rpc_is_sample_specs, formData[1]?.rpc_is_size_analysis, formData[1]?.rpc_is_sequence, formData[1]?.rpc_is_other_config, formData[1]?.rpc_is_size_analysis])


  const handleSequenceCondition = (str) => {
    if (formData[1]?.[str]?.length) {
      setSequence((prev) =>
        prev.includes(str) ? prev : [...prev, str]
      );
    } else {
      setSequence((prev) =>
        prev.filter((item) => item !== str)
      );
    }
  };

  useEffect(() => {
    handleSequenceCondition("rpc_weight_avg_seq");
    handleSequenceCondition("rpc_lotwise_seq");
    handleSequenceCondition("rpc_sample_spec_seq");
  }, [formData[1]?.rpc_weight_avg_seq, formData[1]?.rpc_lotwise_seq, formData[1]?.rpc_sample_spec_seq])

  return (
    <div key={sectionIndex} className="configureTableRow row my-2">
      <Card className="Scrollable configureTableCard">
        <CardBody>
          <CardTitle tag="h5" className="section_heading">{section.title}</CardTitle>

          <table className="table table-white responsive borderless no-wrap align-middle configureTable">
            <thead>
              <tr>
                {section.header.map((header, headerIndex) => (
                  <th key={"headerIndex-" + headerIndex}>
                    <RenderFields
                      field={header}
                      sectionIndex={1}
                      fieldIndex={1}
                      formData={formData}
                      handleFieldChange={handleFieldChange}
                      formErrors={formErrors}
                      viewOnly={viewOnly || opsCertiView === "view"}
                      actionClicked={actionClicked}
                      isSubCheckbox={conditionOfHeaderisSubCheckbox(header)}
                      isNoLabel={true}
                    />
                  </th>
                ))}
              </tr>

            </thead>
            <tbody>
              {section.body.map((body, bodyIndex) => (
                <tr key={"bodyIndex-" + bodyIndex}>
                  {body.map((bodyField, bodyFieldIndex) => {
                    if (bodyField.name === "rpc_is_dual_port_combined") {
                      if (
                        !(formData[0]?.ji_dual_port_seq == "Second" &&
                          formData[0]?.ji_is_dual_port === "Yes")
                      ) {

                        return
                      }
                    }
                    else if (['rpc_weighted_certno', 'rpc_is_eis_format'].includes(bodyField.name)) {
                      if (!['VL'].includes(formData[0]?.operation_type?.operation_type_code)) {
                        return <><td></td></>
                      }
                    }
                    if (bodyField.name === "rpc_is_lotwise_lot_no") {
                      let newTitle = bodyField.options;
                      if (['TR', 'TRUCK'].includes(formData[0]?.operation_type?.operation_type_code.toUpperCase()) || OperationType === getPlantOperations('TR')) {
                        newTitle = ["Truck No."]
                      }
                      else if (OperationType === getVesselOperation('VL_BQA')) {
                        newTitle = ["Barge Name"]
                      }
                      bodyField = {
                        ...bodyField,
                        isCustomLabels: true,
                        customLabels: newTitle
                      }
                    }
                    return (
                      <td>
                        <RenderFields
                          field={bodyField}
                          sectionIndex={1}
                          fieldIndex={1}
                          formData={formData}
                          handleFieldChange={handleFieldChange}
                          formErrors={formErrors}
                          viewOnly={viewOnly || opsCertiView === "view"}
                          actionClicked={actionClicked}
                          specialType={"configured"}
                          isSubCheckbox={conditionOfisSubCheckbox(bodyField)}
                          isNoLabel={true}
                          sequence={sequence}
                        />
                      </td>
                    )
                  }
                  )
                  }
                </tr>
              ))}
            </tbody>

          </table>
          {opsCertiView !== "view" && <div className="operationCertificateBtns align-end">
            {configCertStatusRPCID || formData[0]?.rpc_id ? (
              <button
                type="button"
                className="saveBtn View_Details "
                onClick={() => handleCertificateSave("Edit")}
              >
                Update
              </button>
            ) : (
              <button
                type="button"
                className="saveBtn View_Details "
                onClick={() => handleCertificateSave("Save")}
              >
                Save
              </button>
            )}
          </div> || null}
        </CardBody>
      </Card>
    </div >
  );
};

RenderConfigureTable.propTypes = {
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
export default RenderConfigureTable;
