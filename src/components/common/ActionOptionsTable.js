import React, { useEffect, useState } from "react";
import DeleteConfirmation from "./DeleteConfirmation";
import PropTypes from "prop-types";
import SaveSVG from "../../assets/images/icons/SaveSVG.svg";
import EditSVG from "../../assets/images/icons/EditSVG.svg";
import DeleteSVG from "../../assets/images/icons/DeleteSVG.svg";
import { getRakeOperations, getSvgAccordingToCondition } from "../../services/commonFunction";
import { handlePurchaseReqTableDataDelete } from "./commonHandlerFunction/Purchase/PurchaseReq/PurchaseReqTableHandler";
import { handleGetPurchaseOrderTableData } from "./commonHandlerFunction/Purchase/PurchaseOrder/PurchaseOrderHandler";
import RenderTablePopup from "./commonModalForms/RenderTablePopup";
const ActionOptionsTable = ({
  actions,
  onActionHandleClick,
  editableIndex,
  newCreation,
  useFor,
  popupIndex,
  popupMessages,
  saveClicked,
  setPopupIndex,
  tableIndex,
  isCustomSave,
  tableData,
  setEditableIndex,
  getInwardTabledata,
  simpleInwardId,
  moduleType,
  setPopupOpenAssignment,
  InwardCondition,
  setActionName,
  setIsViewOpen,
  setViewTableData,
  singleData,
  getScopeOfWorkData,
  section,
  formData,
  getSampleMarkLisData,
  OperationTypeID,
  fromModule,
  setFormData,
  setPopupAddPurchaseReq,
  getAllListingData,
  setTableData,
  isCustomPopup,
  setIsCustomPopup,
  OperationType,
  handleFieldChange,
  setIsOverlayLoader,
  isCustomPopupModalShow
}) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [actionType, setActionType] = useState(false);

  // const isCustomPopupModalShow = [getRakeOperations('RK_SV')].includes(OperationType)

  const openDeletePopup = () => {
    let headingMsg;
    let titleMsg = "";
    if (actionType == "Edit") {
      onActionHandleClick(actionType);
      return;
    } else if (actionType == "Delete") {
      headingMsg = popupMessages?.delete?.headerMsg;
      titleMsg = popupMessages?.delete?.titleMsg;
    } else {
      headingMsg = popupMessages?.save?.headerMsg;
      titleMsg = popupMessages?.save?.titleMsg;
    }
    return (
      <DeleteConfirmation
        isOpen={isPopupOpen}
        handleClose={setIsPopupOpen}
        handleConfirm={() => {
          onActionHandleClick(actionType);
          setIsPopupOpen(false);
        }}
        popupMessage={titleMsg}
        popupHeading={headingMsg}
        saveClicked={saveClicked}
        actionType={actionType}
      />
    );
  };

  const onActionOptionclick = (action) => {
    try {

      if (isCustomSave) {
        setPopupIndex((prevIndex) =>
          prevIndex === tableData.length ? -1 : tableData.length
        );
        if (!InwardCondition) {
          setIsPopupOpen(true);
        } else {
          setPopupOpenAssignment(true);
        }
        setEditableIndex("");
        setActionType("customSave");
        setActionName("customSave");
      } else if (action.text === "Cancel") {
        if (fromModule !== "manualTable") {
          if (moduleType === "sampleinward") {
            getInwardTabledata(simpleInwardId);
          } else if (formData[0]?.ji_id && !section.isUseForVessel) {
            getScopeOfWorkData(1, editableIndex);
          } else if (formData[0]?.ji_id && OperationTypeID) {
            getSampleMarkLisData();
          }
        } else {
          const updatedFormData = { ...formData };
          if (!updatedFormData[1]) {
            updatedFormData[1] = {};
          }
          tableData.map((singleValue, index) => {
            section.headers.map((singleField) => {
              const fieldName = singleField.name;
              updatedFormData[1][fieldName + "_" + index] =
                singleValue[fieldName];
            });
          });
          setFormData(updatedFormData);
        }

        setPopupIndex("");
        setEditableIndex("");
      }
      else if (moduleType === "purchaseReq" && action.text === "Edit") {
        setPopupAddPurchaseReq(true)
        setEditableIndex(tableIndex);
        // handleGetPurchaseReqTableData(
        //   singleData,
        //   setFormData,
        //   tableIndex
        // )
      }
      else if (moduleType === "purchase" && action.text === "Edit") {
        setPopupAddPurchaseReq(true)
        setEditableIndex(tableIndex);
        // handleGetPurchaseOrderTableData(
        //   singleData,
        //   setFormData,
        //   tableIndex
        // )
      }
      else if (moduleType === "purchase" && action.text === "Delete") {
        setPopupIndex(tableIndex);
        setActionType(action.text);
        setIsPopupOpen(true);

        // handlePurchaseReqTableDataDelete(formData,tableIndex,setFormData,setTableData)
      }
      else if (moduleType === "purchaseReq" && action.text === "Delete") {
        setPopupIndex(tableIndex);
        setActionType(action.text);
        setIsPopupOpen(true);

        // handlePurchaseReqTableDataDelete(formData,tableIndex,setFormData,setTableData)
      }
      else if (action.text === "Edit" || action.text === "Save") {
        if (InwardCondition || (moduleType == "invoice" && action.text === "Edit")) {
          setActionName("Save");
          setPopupOpenAssignment(true);
          setEditableIndex(tableIndex);
          setPopupIndex(tableIndex);
        }
        else {
          setEditableIndex(tableIndex);
          setPopupIndex(tableIndex);
          setActionType(action.text);
          setIsPopupOpen(true);
          if (isCustomPopupModalShow) {
            setActionName("Save");
            setIsCustomPopup(true)
          }

        }
      }
      else if (action.text === "View") {
        if (moduleType === "sampleverification") {
          setIsViewOpen(true);
          setViewTableData(singleData.params_and_standards);
        }
        else {
          setEditableIndex(tableIndex);
          setPopupIndex(tableIndex);
          setActionType(action.text);
          setIsPopupOpen(true);
          if (isCustomPopupModalShow) {
            setActionName("Save");
            setIsCustomPopup(true)
          }
        }
      }
      else {
        setEditableIndex("");
        setPopupIndex(tableIndex);
        setActionType(action.text);
        setIsPopupOpen(true);
      }
    }
    finally {

    }
  };

  return (
    <div className="actionOptions">

      {actions.map((action, actionIndex) => (

        <button
          type="button"
          key={"action Options" + actionIndex}
          onClick={() => onActionOptionclick(action)}
          className={
            InwardCondition && action.text === "Save"
              ? "submitBtn moreWidth pdAdjust"
              : "invisible-button"
          }
          aria-label="action-button"
        >
          {!InwardCondition || useFor == "ops-sampleInward" ? (
            // <i className={action.icon} title={action.text}></i>
            getSvgAccordingToCondition(action)
          ) : action.text === "Save" && InwardCondition ? (
            "Add Sample +"
          ) : (
            // <i className={action.icon} title={action.text}></i>
            getSvgAccordingToCondition(action)
          )}
        </button>
      ))}
      {isPopupOpen && openDeletePopup()}
    </div>
  );
};

ActionOptionsTable.propTypes = {
  actions: PropTypes.array,
  onActionHandleClick: PropTypes.func,
  editableIndex: PropTypes.number,
  newCreation: PropTypes.bool,
  useFor: PropTypes.string,
  popupIndex: PropTypes.number,
  popupMessages: PropTypes.array,
  saveClicked: PropTypes.bool,
  setPopupIndex: PropTypes.func,
  tableIndex: PropTypes.number,
  isCustomSave: PropTypes.bool,
  tableData: PropTypes.array,
  setEditableIndex: PropTypes.func,
  getInwardTabledata: PropTypes.func,
  simpleInwardId: PropTypes.any,
  moduleType: PropTypes.string,
  setPopupOpenAssignment: PropTypes.func,
  InwardCondition: PropTypes.object,
  setActionName: PropTypes.func,
  setIsViewOpen: PropTypes.func,
  setisViewOpen: PropTypes.func,
  setViewTableData: PropTypes.func,
  singleData: PropTypes.object,
};

export default ActionOptionsTable;
