import React, { useState } from "react";
import RenderFields from "../RenderFields";
import PropTypes from "prop-types";

import { Row } from "react-bootstrap";
import OverlayLoading from "../OverlayLoading";
import { checkSampleIdAvailibility } from "../commonHandlerFunction/sampleInwardHandlerFunctions";
import { GetTenantDetails } from "../../../services/commonServices";
import { ToastContainer } from "react-toastify";

const ModalInward = ({
  section,
  sectionIndex,
  formData,
  handleFieldChange,
  formErrors,
  tableData,
  updatedMasterOptions,
  setPopupOpenAssignment,
  onActionHandleClick,
  actionName,
  handleCloseInwardPopup,
  editableIndex,
  isBtnclicked,
  isOverlayLoader,
  setIsOverlayLoader,
}) => {
  const [isSampleIdAvailable, setIsSampleIdAvailable] = useState(
    actionName === "Save"
  );
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
  const getCustomCellValues = (cell) => {
    if (cell.name == "smpl_detail_smpl_qty_unit") {
      cell.type = "text";
      if (
        ["Raw and Powdered Sample", "Physical and Raw Sample", "Physical,Raw and Powdered Sample"].includes(formData[1]?.["smpl_detail_smpl_condtion" + "_" + (actionName === "Save" ? editableIndex : tableData.length)])) {
        cell.label = "Raw Sample Quantity Unit";
        cell.placeholder = "Raw Sample Quantity Unit";
      } else {
        cell.label = "Sample Quantity Unit";
        cell.placeholder = "Sample Quantity Unit";
      }
    }
    if (cell.name == "smpl_detail_smpl_qty") {
      if (["Raw and Powdered Sample", "Physical and Raw Sample", "Physical,Raw and Powdered Sample"].includes(formData[1]?.["smpl_detail_smpl_condtion" + "_" + (actionName === "Save" ? editableIndex : tableData.length)])) {
        cell.label = "Approximate Quantity of Received Raw Sample";
        cell.placeholder = "Approximate Quantity of Raw Received Sample";
      } else {
        cell.label = "Approximate Quantity of Received Sample";
        cell.placeholder = "Enter Approximate Quantity of Received Sample";
      }
    } else if (cell.name == "smpl_detail_dos") {
      cell.readOnly = true;
    }
    else if (cell.name === "smpl_detail_seal_number") {
      cell.required = true;
      cell.readOnly = false;
      if (
        ["Unsealed", "Intact"].includes(formData[1]?.["smpl_detail_pkging_condition" + "_" + (actionName === "Save" ? editableIndex : tableData.length)])
      ) {
        cell.required = false;
        cell.readOnly = true;
      }
      // }
    } else if (
      cell.name === "smpl_detail_sample_mark" &&
      formData[0]?.jrf_is_ops
    ) {
      cell.type = "label";
    } 
    else if (cell.name == "smpl_detail_smpl_condtion") {
      if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL") {
        cell.options = ["Liquids", "Semi Solid", "Gaseous"];
      }
    }
    return cell;
  };
  const handleCustomFieldChange = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = ""
  ) => {
    let lastname =
      "_" + (actionName === "Save" ? editableIndex : tableData.length);
    let actualName = fieldName.split(lastname)[0];
    if (actualName === "sample_id") {
      checkSampleIdAvailibility(
        value,
        setIsOverlayLoader,
        setIsSampleIdAvailable
      );
    }
    handleFieldChange(sectionIndex, fieldName, value, type, isChecked);
  };
  const addExtraNewFields = (rowIndex) => {
    let sampleType = "Powder"
    if (["Physical and Raw Sample"].includes(formData[1]?.["smpl_detail_smpl_condtion" + "_" + (actionName === "Save" ? editableIndex : tableData.length)])) {
      sampleType = "Physical"
    }
    let cellFields = [
      {
        name: "smpl_detail_smpl_pwd_qty",
        width: 6,
        label: `Approximate Quantity of Received ${sampleType} Sample`,
        type: "text",
        required: true,
        fieldWidth: "100",
        placeholder: `Approximate Quantity of Received ${sampleType} Sample`,
      },
      {
        name: "smpl_detail_smpl_pwd_qty_unit",
        width: 6,
        label: `${sampleType} Sample Quantity Unit`,
        placeholder: `${sampleType} Sample Quantity Unit`,
        type: "text",
        required: true,
        fieldWidth: "100",
      },
    ];
    if (["Physical,Raw and Powdered Sample"].includes(formData[1]?.["smpl_detail_smpl_condtion" + "_" + (actionName === "Save" ? editableIndex : tableData.length)])) {
      cellFields.push({
        name: "smpl_detail_smpl_physical_qty",
        width: 6,
        label: "Approximate Quantity of Received Physical Sample",
        type: "text",
        required: true,
        fieldWidth: "100",
        placeholder: "Approximate Quantity of Received Physical Sample",
      },
        {
          name: "smpl_detail_smpl_physical_qty_unit",
          width: 6,
          label: "Physical Sample Quantity Unit",
          placeholder: "Physical Sample Quantity Unit",
          type: "text",
          required: true,
          fieldWidth: "100",
        })
    }
    return cellFields.map((cell, cellIndex) => (
      <div
        className={"col-md-" + cell?.width}
        key={"Modal-Header-" + cellIndex}
      >
        <RenderFields
          field={getCustomCellValues(cell)}
          sectionIndex={sectionIndex}
          fieldIndex={rowIndex * 100 + cellIndex}
          formData={formData}
          handleFieldChange={handleCustomFieldChange}
          formErrors={formErrors} // Pass formErrors to RenderFields
          renderTable={true}
          tableIndex={rowIndex}
          customName={
            cell.name +
            "_" +
            (actionName === "Save" ? editableIndex : tableData.length)
          }
          masterOptions={updatedMasterOptions}
          upperClass="popupUpperClass"
        />
      </div>
    ));
  };
  return (
    <div className="popupSearchContainerBG">

      <div className="popupInwardModal popupWidthAdjustmentInward">
        {/* <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /> */}
        <div className="rejectSearchCross">
          <button
            onClick={handleCloseInwardPopup}
            className="nonNativeButton2"
            aria-label="Reject Button"
          >
            <i className="bi bi-x-lg h4"></i>
          </button>
        </div>

        {section.rows.map((row, rowIndex) => (
          <>
            <Row className="autoWidthImportant">
              <h2 className="modalHeader">Sample Inward Details</h2>
              {isOverlayLoader && <OverlayLoading />}
              {section.headers.map((cell, cellIndex) => (
                <>
                  <div
                    className={"col-md-" + cell?.width}
                    key={"Modal-Header-" + cellIndex}
                  >
                    <RenderFields
                      field={getCustomCellValues(cell)}
                      sectionIndex={sectionIndex}
                      fieldIndex={rowIndex * 100 + cellIndex}
                      formData={formData}
                      handleFieldChange={handleCustomFieldChange}
                      formErrors={formErrors} // Pass formErrors to RenderFields
                      renderTable={true}
                      tableIndex={rowIndex}
                      customName={
                        cell.name +
                        "_" +
                        (actionName === "Save" ? editableIndex : tableData.length)
                      }
                      masterOptions={updatedMasterOptions}
                      upperClass="popupUpperClass"
                    />
                  </div>
                  {
                    cell.name === "smpl_detail_smpl_condtion" && (
                      <div
                        className={"col-md-" + cell?.width}
                        key={"Modal-Header-" + cellIndex}
                      ></div>
                    ) || null
                  }
                </>
              ))}
              {["Raw and Powdered Sample", "Physical and Raw Sample", "Physical,Raw and Powdered Sample"].includes(formData[1]?.["smpl_detail_smpl_condtion" + "_" + (actionName === "Save" ? editableIndex : tableData.length)]) && addExtraNewFields(rowIndex)}
            </Row>
          </>
        ))}
        <div className="popupInwardButtonsContainer">
          <div className="popupSearchButtons">
            <button type="button" onClick={handleCloseInwardPopup}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!isSampleIdAvailable || isBtnclicked}
              onClick={() => {
                onActionHandleClick(actionName);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
ModalInward.propTypes = {
  section: PropTypes.object, // Adjust if you know the exact shape
  sectionIndex: PropTypes.number,
  formData: PropTypes.object, // Adjust if you know the exact shape
  handleFieldChange: PropTypes.func,
  formErrors: PropTypes.object, // Adjust if you know the exact shape
  tableData: PropTypes.array, // Adjust if you know the type of elements
  updatedMasterOptions: PropTypes.object, // Adjust if you know the exact shape
  setPopupOpenAssignment: PropTypes.func,
  onActionHandleClick: PropTypes.func,
  actionName: PropTypes.string, // Adjust if you expect different types
  handleCloseInwardPopup: PropTypes.func,
  editableIndex: PropTypes.number,
  isBtnclicked: PropTypes.bool,
  isOverlayLoader: PropTypes.bool,
  setIsOverlayLoader: PropTypes.func,
};
export default ModalInward;
