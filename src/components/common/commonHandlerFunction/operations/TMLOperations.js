import { toast } from "react-toastify";
import {
  createDSApi,
  createHHApi,
  createSVApi,
  deleteTMLAnalysisDeleteApi,
  getAssignemtnLabDropdownApi,
  getDSApi,
  getHHApi,
  getLabWiseSetAssignmentData,
  getLastStepAssignmentData,
  getlotnodropdownApi,
  getScopeworkSingleDataApi,
  getScopeworkUpdateApi,
  getSVApi,
  jobinstructionUpdateApi,
  labGroupsStdBasisApi,
  opsSizeAnalysisCreateApi,
  opsSizeAnalysisGetApi,
  opsSizeAnalysisUpdateApi,
  TMLAnalysisDataCreateApi,
  TMLAnalysisDataListApi,
  TMLDataCreateApi,
  TMLDataDeleteApi,
  TMLDatagetAllApi,
  TMLDataUpdateApi,
  updateDSApi,
  updateHHApi,
  updateSVApi,
  dailyReportPDFApi,
  masterUploadApi,
  folderCreateApi,
  documentCreateApi,
} from "../../../../services/api";
import {
  deleteDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../../services/commonServices";
import { encryptDataForURL } from "../../../../utills/useCryptoUtils";
import {
  getChangeOnShipsValue,
  getDisplacementDifferenceCalc,
  getTotalValues,
  getLMSOperationTML,
  getWithoutSizeAnalysisActivity,
  getOperationActivityUrl,
  getVesselOperation,
  getLMSOperationActivity,
  getSampleCollectionActivity,
  getRakeCollectionActivity,
  getMaxParamSeqAssing,
  getFormatedDate
} from "../../../../services/commonFunction";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";

export const handleTMLOperationCreateUpdate = async (
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
  OperationTypeID,
  getAllSampleMarkList,
  setIsDisplayNewAddOption,
  setIsCustomPopup
) => {
  try {
    setIsOverlayLoader(true)
    if (actionSelected === "Save" || actionSelected === "customSave") {
      setIsBtnClicked(true);
      let newRowIndex = editableIndex;
      if (actionSelected === "customSave") {
        newRowIndex = tableData?.length;
      }
      let extraJsonData = {};
      if (OperationType != getVesselOperation("TML")) {
        // extraJsonData["jism_composite_lot"] =
        //   formData["1"]?.["jism_composite_lot_" + newRowIndex];
        // if (OperationType === "Pre-Shipment (PSI)") {
        //   extraJsonData["jism_lot_no"] =
        //     formData["1"]?.["jism_lot_no_" + newRowIndex];
        // }
      }
      extraJsonData["jism_sampling_date"] = formData["1"]?.["jism_sampling_date_" + newRowIndex];
      extraJsonData["jism_truck_no"] = formData["1"]?.["jism_truck_no_" + newRowIndex];
      extraJsonData["jism_sample_quantity"] = formData["1"]?.["jism_sample_quantity_" + newRowIndex];
      extraJsonData["jism_is_lot_composite"] = formData["1"]?.["jism_is_composite_" + newRowIndex] === "Singular Composite";
      section.rows[0].map((field, index) => {
        if (field.isExternalJson) {
          extraJsonData[field.name] = formData["1"]?.[field.name + '_' + newRowIndex];
        }
      })
      let quantityCount = 0;
      let lotsArray = [];
      tableData.map((singleData, indextab) => {
        if (!singleData.jism_is_composite) {
          if (!lotsArray.includes(singleData.jism_lot_no))
            quantityCount = quantityCount + parseInt(singleData.jism_quantity);
          lotsArray.push(singleData.jism_lot_no)
        }
      });
      if (formData["1"]?.["jism_is_composite_" + newRowIndex] !== "Composite") {
        if (!lotsArray.includes(formData["1"]?.["jism_lot_no_" + newRowIndex])) {
          quantityCount =
            quantityCount +
            parseInt(formData["1"]?.["jism_quantity_" + newRowIndex]);
        }
      }
      //temporrary commented 07-02-2025
      // if (quantityCount > formData[0].ji_appointed_totalqty) {
      //   toast.error("You can't add quantity more then total quantity", {
      //     position: "top-right",
      //     autoClose: 2000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light",
      //   });
      //   setIsBtnClicked(false);
      //   return;
      // }
      //End comment
      let payload = {
        jism_lots: {
          fk_jiid: formData[0].ji_id,
          fk_jisid: OperationTypeID,
          jism_jimode: "Vessel",
          jism_jisubmode: OperationType,
          jism_sample_qty: formData["1"]?.["jism_sample_qty_" + newRowIndex],
          // jism_sealnumber: formData["1"]?.["jism_sealnumber_" + newRowIndex],
          jism_marknumber: formData["1"]?.["jism_marknumber_" + newRowIndex],
          jism_client_sample_mark: formData["1"]?.["jism_client_sample_mark_" + newRowIndex],
          jism_quantity: formData["1"]?.["jism_quantity_" + newRowIndex],
          jism_sampleweight: formData["1"]?.["jism_sampleweight_" + newRowIndex],
          jism_sampletype: formData["1"]?.["jism_sampletype_" + newRowIndex],
          jism_sampleunit: formData["1"]?.["jism_sampleunit_" + newRowIndex],
          jism_is_composite:
            formData["1"]?.["jism_is_composite_" + newRowIndex] === "Composite"
              ? true
              : false,
          jism_jsonb_front: extraJsonData,
          tenant: GetTenantDetails(1)
        },
      };
      if (formData["1"]?.["jism_is_composite_" + newRowIndex] === "Composite") {
        payload.jism_lots.jism_composite_lot_nos =
          formData["1"]?.["jism_composite_lot_nos_" + newRowIndex];
      } else {
        payload.jism_lots.jism_lot_no =
          formData["1"]?.["jism_lot_no_" + newRowIndex];
      }
      let nonRequiredFields = [
        "jism_jsonb_front",
        "jism_marknumber",
        "jism_client_sample_mark"
        // "jism_composite_lot_nos",
        // "jism_lot_no",
        // "jism_sealnumber"
      ];
      if (formData["1"]?.["jism_is_composite_" + newRowIndex] === "Composite") {
        nonRequiredFields.push('jism_lot_no')
      }
      else {
        nonRequiredFields.push('jism_composite_lot_nos')
      }
      // if (['TR', 'TRUCK'].includes(formData[0]?.operation_type?.operation_type_name)) {
      nonRequiredFields.push('jism_lot_no')
      // }
      for (let obj in payload.jism_lots) {
        if (
          (payload["jism_lots"][obj] === undefined ||
            payload["jism_lots"][obj] === "") &&
          !nonRequiredFields.includes(obj)
        ) {
          const field = section.rows[0].filter((field, index) => {
            if (field.name === obj) {
              field.label = section.headers[index].label;
              return true;
            }
            return false;
          });

          if (field.length > 0) {
            let errLabel = field ? field[0].label : "";
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
        else if (
          // ['jism_marknumber', 'jism_sealnumber'].includes(obj) &&
          [].includes(obj) &&
          payload["jism_lots"][obj].length > 15
        ) {
          const field = section.rows[0].filter((field, index) => {
            if (field.name === obj) {
              field.label = section.headers[index].label;
              return true;
            }
            return false;
          });
          let errLabel = field.length ? field[0].label : obj;
          toast.error("Please ensure the " + errLabel + " is no longer than 15 characters.", {
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
          return
        }
        else if (['jism_lot_no'].includes(obj) && formData["1"]?.["jism_is_composite_" + newRowIndex] != "Composite") {
          const field = section.rows[0].filter((field, index) => {
            if (field.name === obj) {
              field.label = section.headers[index].label;
              return true;
            }
            return false;
          });
          if (payload["jism_lots"][obj]) {
            if (field.length > 0 && field[0]?.pattern && !(payload["jism_lots"][obj].match(field[0]?.pattern))) {
              let errLabel = field.length ? field[0].label : obj;
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

        }
      }

      for (let obj in payload?.jism_lots?.jism_jsonb_front) {
        const field = section.rows[0].filter((field, index) => {
          if (field.name === obj) {
            field.label = section.headers[index].label;
            return true;
          }
          return false;
        });
        let errLabel = field ? field[0]?.label : "";
        if (payload?.jism_lots?.jism_jsonb_front?.[obj]) {
          if ((field[0]?.pattern && !(payload?.jism_lots?.jism_jsonb_front?.[obj]?.match(field[0]?.pattern)))) {
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
      }

      let res;
      if (actionSelected !== "customSave") {
        let newMainPayload = {};
        newMainPayload.jism_id = tableData[editableIndex].jism_id;
        newMainPayload.ji_samplemark_data = payload.jism_lots;
        if (formData["1"]?.["jism_is_composite_" + newRowIndex] === "Composite") {
          delete newMainPayload.ji_samplemark_data.jism_composite_lot_nos
        }
        res = await putDataFromApi(TMLDataUpdateApi, newMainPayload);
      } else {
        let newMainPayload = {};
        newMainPayload.ji_samplemark_data = payload.jism_lots;
        newMainPayload.ji_samplemark_data.manual_duplicate_entry = formData["1"]?.["manual_duplicate_entry_" + newRowIndex] ? parseInt(formData["1"]?.["manual_duplicate_entry_" + newRowIndex]) : 1;
        res = await postDataFromApi(TMLDataCreateApi, newMainPayload);
      }
      if (res.data.status === 200) {
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
        setPopupOpenAssignment(false);
        setPopupIndex("");
        setEditableIndex("");
        setIsBtnClicked(false);
        if (setIsCustomPopup) {
          setIsCustomPopup(false)
        }
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setIsBtnClicked(false);
        toast.error(res.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setSaveClicked(false);
    } else if (actionSelected === "Delete") {
      setSaveClicked(true);
      let payload = {
        jism_id: tableData[popupIndex]?.jism_id,
      };
      let res = await deleteDataFromApi(TMLDataDeleteApi, payload);
      if (res.data.status === 200) {
        const updatedFormData = { ...formData };
        if (!updatedFormData[1]) {
          updatedFormData[1] = {};
        }
        section.rows[0].map((field) => {
          delete updatedFormData[1][`${field.name}_${popupIndex}`]
        })
        getAllSampleMarkList(
          updatedFormData[0]?.ji_id,
          OperationTypeID,
          setTableData,
          updatedFormData,
          setFormData,
          section,
          null,
          null,
          null,
          setIsDisplayNewAddOption
        );
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setSaveClicked(false);
    } else if (actionSelected === "Cancel") {
      setEditableIndex("");
    }
  } catch (ex) {
    console.log('ee', ex)
  }
  finally {
    setIsOverlayLoader(false)
  }
};

export const OperationCreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  status,
  isNavigate,
  JRFData,
  operationStepNo,
  isNotShowMessages = "",
  jrfCreationType,
  operationMode,
  isExternal
) => {
  let payloadData = {
    status: !isExternal && formData[1]?.ops_status === "posted" ? "posted" : status,
  };

  let res;
  setIsOverlayLoader(true);
  let MainData = {
    ji_scopeofwork: payloadData,
    jis_id: OperationTypeID,
  };
  if (!isExternal && JRFData && JRFData.length > 0) {
    if (jrfCreationType === "postOther") {
      MainData["for_tpi"] = {
        jila_id: JRFData,
      };
    }
    else {
      MainData["for_jrf"] = {
        jila_id: JRFData,
      };
    }
  }
  res = await putDataFromApi(getScopeworkUpdateApi, MainData);
  if (res?.data?.status === 200) {
    if (isExternal) {
      setIsOverlayLoader(false);
      setIsPopupOpen(false);
      return
    }
    if (!isNotShowMessages) {
      toast.success(res?.data?.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    if (["postOther", 'postJRF'].includes(jrfCreationType)) {
      isNavigate = false
    }
    if (isNavigate) {
      const redirectUrl = getOperationActivityUrl(operationMode)
      if (operationStepNo == 1) {
        navigate(
          `${redirectUrl}${encryptDataForURL(
            formData[0].ji_id
          )}/${encryptDataForURL("analysis")}/${encryptDataForURL(
            OperationTypeID
          )}?OperationType=${encryptDataForURL(
            OperationType
          )}&operationId=${encryptDataForURL(
            OperationTypeID
          )}&operationStepNo=${encryptDataForURL(3)}` + "&operationMode=" + encryptDataForURL(operationMode)
        );
        setTimeout(() => {
          window.location.reload();
        }, 10);
        return;
      }
      else if (operationStepNo == 2) {
        navigate(
          redirectUrl +
          encryptDataForURL(formData[0]?.["ji_id"]) +
          "/" +
          encryptDataForURL(OperationType) +
          "?OperationType=" +
          encryptDataForURL(OperationType) +
          "&operationId=" +
          encryptDataForURL(OperationTypeID) +
          "&operationStepNo=" +
          encryptDataForURL(1) + "&operationMode=" + encryptDataForURL(operationMode)
        );
        setTimeout(() => {
          window.location.reload();
        }, 10);
        return;
      } else if (operationStepNo == 3) {

        if (status === "input-completed") {
          navigate(
            redirectUrl +
            encryptDataForURL(formData[0]?.["ji_id"]) +
            "?action=" +
            encryptDataForURL("View") +
            "&status=" +
            encryptDataForURL("accepted") + "&operationMode=" + encryptDataForURL(operationMode)
          );
          return
        }
        if (
          getWithoutSizeAnalysisActivity().includes(
            OperationType
          )
        ) {
          navigate(
            redirectUrl +
            encryptDataForURL(formData[0]?.["ji_id"]) +
            "?action=" +
            encryptDataForURL("View") +
            "&status=" +
            encryptDataForURL("accepted") + "&operationMode=" + encryptDataForURL(operationMode)
          );
          return;
        } else {
          navigate(
            redirectUrl +
            encryptDataForURL(formData[0]?.["ji_id"]) +
            "/" +
            encryptDataForURL(OperationType) +
            "?OperationType=" +
            encryptDataForURL(OperationType) +
            "&operationId=" +
            encryptDataForURL(OperationTypeID) +
            "&operationStepNo=" +
            encryptDataForURL(4) + "&operationMode=" + encryptDataForURL(operationMode)
          );
        }
      } else if (operationStepNo == 4) {
        navigate(
          redirectUrl +
          encryptDataForURL(formData[0]?.["ji_id"]) +
          "?action=" +
          encryptDataForURL("View") +
          "&status=" +
          encryptDataForURL("accepted") + "&operationMode=" + encryptDataForURL(operationMode)
        );
        return;
      } else if (operationStepNo == 5) {
        if (status === "input-completed") {
          navigate(
            redirectUrl +
            encryptDataForURL(formData[0]?.ji_id)
          );
          return;
        }
        return;
      }
      else if (operationStepNo == 6) {
        navigate(
          redirectUrl +
          encryptDataForURL(formData[0]?.["ji_id"]) +
          "/" +
          encryptDataForURL(OperationType) +
          "?OperationType=" +
          encryptDataForURL(OperationType) +
          "&operationId=" +
          encryptDataForURL(OperationTypeID) +
          "&operationStepNo=" +
          encryptDataForURL(2) + "&operationMode=" + encryptDataForURL(operationMode)
        );
        window.location.reload();
        return
      }
      else if (operationStepNo == 7) {
        navigate(
          redirectUrl +
          encryptDataForURL(formData[0]?.["ji_id"]) +
          "/" +
          encryptDataForURL(OperationType) +
          "?OperationType=" +
          encryptDataForURL(OperationType) +
          "&operationId=" +
          encryptDataForURL(OperationTypeID) +
          "&operationStepNo=" +
          encryptDataForURL(6) + "&operationMode=" + encryptDataForURL(operationMode)
        );
        setTimeout(() => {
          window.location.reload();
        }, 10);
        return;
      } else {
        navigate(
          `${redirectUrl}${encryptDataForURL(
            formData[0].ji_id
          )}/${encryptDataForURL("analysis")}/${encryptDataForURL(
            OperationTypeID
          )}?OperationType=${encryptDataForURL(
            OperationType
          )}&operationId=${encryptDataForURL(
            OperationTypeID
          )}&operationStepNo=${encryptDataForURL(3)}` + "&operationMode=" + encryptDataForURL(operationMode)
        );
        return;
      }
    } else {
      setIsPopupOpen(false);
      setIsOverlayLoader(false);
      return true;
    }
  } else {
    toast.error(res.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  setIsPopupOpen(false);
  setIsOverlayLoader(false);
};


export const vesselListBackFunctionality = (
  formData,
  OperationType,
  OperationTypeID,
  navigate,
  operationStepNo,
  action,
  operationMode
) => {
  const redirectUrl = getOperationActivityUrl(operationMode)
  if (operationStepNo == 2) {
    if (getSampleCollectionActivity().includes(OperationType)) {
      navigate(
        redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "/" +
        encryptDataForURL(OperationType) +
        "?OperationType=" +
        encryptDataForURL(OperationType) +
        "&operationId=" +
        encryptDataForURL(OperationTypeID) +
        "&operationStepNo=" +
        encryptDataForURL(6) +
        (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
      );
      setTimeout(() => {
        window.location.reload();
      }, 10);
      return;
    }
    else {
      navigate(
        redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "?action=" +
        encryptDataForURL("View") +
        "&status=" +
        encryptDataForURL("accepted") +
        (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
      );
      return
    }
  } else if (operationStepNo == 3) {
    navigate(
      redirectUrl +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "/" +
      encryptDataForURL(OperationType) +
      "?OperationType=" +
      encryptDataForURL(OperationType) +
      "&operationId=" +
      encryptDataForURL(OperationTypeID) +
      "&operationStepNo=" +
      encryptDataForURL(1) +
      (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
    );
    setTimeout(() => {
      window.location.reload();
    }, 10);
    return;
  } else if (operationStepNo == 1) {
    if (!getLMSOperationActivity().includes(OperationType)) {
      navigate(
        redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "?action=" +
        encryptDataForURL("View") +
        "&status=" +
        encryptDataForURL("accepted") +
        (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
      );

    }
    else {
      navigate(
        redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "/" +
        encryptDataForURL(OperationType) +
        "?OperationType=" +
        encryptDataForURL(OperationType) +
        "&operationId=" +
        encryptDataForURL(OperationTypeID) +
        "&operationStepNo=" +
        encryptDataForURL(2) +
        (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
      );

      setTimeout(() => {
        window.location.reload();
      }, 10);
      return;
    }

  } else if (operationStepNo == 4) {
    navigate(
      redirectUrl + `${encryptDataForURL(
        formData[0].ji_id
      )}/${encryptDataForURL("analysis")}/${encryptDataForURL(
        OperationTypeID
      )}?OperationType=${encryptDataForURL(
        OperationType
      )}&operationId=${encryptDataForURL(
        OperationTypeID
      )}&operationStepNo=${encryptDataForURL(3)}` + "&operationMode=" + encryptDataForURL(operationMode) + (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "")
    );
    return;
  } else if (operationStepNo == 5) {
    window.location.reload();
    return;
  }
  else if (operationStepNo == 6) {
    if (getRakeCollectionActivity().includes(OperationType)) {
      navigate(
        redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "/" +
        encryptDataForURL(OperationType) +
        "?OperationType=" +
        encryptDataForURL(OperationType) +
        "&operationId=" +
        encryptDataForURL(OperationTypeID) +
        "&operationStepNo=" +
        encryptDataForURL(7) +
        (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
      );
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }
    else {
      navigate(
        redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "?action=" +
        encryptDataForURL("View") +
        "&status=" +
        encryptDataForURL("accepted") +
        (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
      );
    }
    return
  }
  else if (operationStepNo == 7) {
    navigate(
      redirectUrl +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "?action=" +
      encryptDataForURL("View") +
      "&status=" +
      encryptDataForURL("accepted") +
      (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
    );
  } else {

    navigate(
      redirectUrl +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "?action=" +
      encryptDataForURL("View") +
      "&status=" +
      encryptDataForURL("accepted") +
      (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
    );
  }
};
export const vesselListNextFunctionality = (
  formData,
  OperationType,
  OperationTypeID,
  navigate,
  operationStepNo,
  action,
  operationMode,
  isTabClicked
) => {
  const redirectUrl = getOperationActivityUrl(operationMode)
  if (isTabClicked) {
    if ([3].includes(operationStepNo)) {
      navigate(
        `${redirectUrl}${encryptDataForURL(
          formData[0].ji_id
        )}/${encryptDataForURL("analysis")}/${encryptDataForURL(
          OperationTypeID
        )}?OperationType=${encryptDataForURL(
          OperationType
        )}&operationId=${encryptDataForURL(
          OperationTypeID
        )}&operationStepNo=${encryptDataForURL(operationStepNo)}` + "&operationMode=" + encryptDataForURL(operationMode) +
        (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "")
      );
    }
    else {
      navigate(
        redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "/" +
        encryptDataForURL(OperationType) +
        "?OperationType=" +
        encryptDataForURL(OperationType) +
        "&operationId=" +
        encryptDataForURL(OperationTypeID) +
        "&operationStepNo=" +
        encryptDataForURL(operationStepNo) +
        (action === "opsView"
          ? "&action=" + encryptDataForURL("opsView")
          : "") + "&operationMode=" + encryptDataForURL(operationMode)
      );
    }
    setTimeout(() => {
      window.location.reload();
    }, 10);
    return;
  }
  else if (operationStepNo == 1) {
    navigate(
      `${redirectUrl}${encryptDataForURL(
        formData[0].ji_id
      )}/${encryptDataForURL("analysis")}/${encryptDataForURL(
        OperationTypeID
      )}?OperationType=${encryptDataForURL(
        OperationType
      )}&operationId=${encryptDataForURL(
        OperationTypeID
      )}&operationStepNo=${encryptDataForURL(3)}` + "&operationMode=" + encryptDataForURL(operationMode) +
      (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "")
    );
    setTimeout(() => {
      window.location.reload();
    }, 10);
    return;
  }
  else if (operationStepNo == 2) {
    navigate(
      redirectUrl +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "/" +
      encryptDataForURL(OperationType) +
      "?OperationType=" +
      encryptDataForURL(OperationType) +
      "&operationId=" +
      encryptDataForURL(OperationTypeID) +
      "&operationStepNo=" +
      encryptDataForURL(1) + "&operationMode=" + encryptDataForURL(operationMode) +
      (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "")
    );
    setTimeout(() => {
      window.location.reload();
    }, 10);
    return;
  } else if (operationStepNo == 3) {
    if (
      getWithoutSizeAnalysisActivity().includes(
        OperationType
      )
    ) {
      navigate(
        redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "?action=" +
        encryptDataForURL("View") +
        "&status=" +
        encryptDataForURL("accepted") +
        (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
      );
      return
    } else {
      navigate(
        redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "/" +
        encryptDataForURL(OperationType) +
        "?OperationType=" +
        encryptDataForURL(OperationType) +
        "&operationId=" +
        encryptDataForURL(OperationTypeID) +
        "&operationStepNo=" +
        encryptDataForURL(4) +
        (action === "opsView"
          ? "&action=" + encryptDataForURL("opsView")
          : "") + "&operationMode=" + encryptDataForURL(operationMode)
      );
      window.location.reload();
      return;
    }
  } else if (operationStepNo == 4) {
    navigate(
      redirectUrl +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "?action=" +
      encryptDataForURL("View") +
      "&status=" +
      encryptDataForURL("accepted") +
      (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
    );
    return
  } else if (operationStepNo == 5) {
    return;
  } else if (operationStepNo == 6) {
    navigate(
      redirectUrl +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "/" +
      encryptDataForURL(OperationType) +
      "?OperationType=" +
      encryptDataForURL(OperationType) +
      "&operationId=" +
      encryptDataForURL(OperationTypeID) +
      "&operationStepNo=" +
      encryptDataForURL(2) +
      (action === "opsView"
        ? "&action=" + encryptDataForURL("opsView")
        : "") + "&operationMode=" + encryptDataForURL(operationMode)
    );
    window.location.reload();
    return;
  }
  else if (operationStepNo == 7) {
    navigate(
      redirectUrl +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "/" +
      encryptDataForURL(OperationType) +
      "?OperationType=" +
      encryptDataForURL(OperationType) +
      "&operationId=" +
      encryptDataForURL(OperationTypeID) +
      "&operationStepNo=" +
      encryptDataForURL(6) +
      (action === "opsView"
        ? "&action=" + encryptDataForURL("opsView")
        : "") + "&operationMode=" + encryptDataForURL(operationMode)
    );
    window.location.reload();
    return;
  } else {
    navigate(
      redirectUrl + `${encryptDataForURL(
        formData[0].ji_id
      )}/${encryptDataForURL("analysis")}/${encryptDataForURL(
        OperationTypeID
      )}?OperationType=${encryptDataForURL(
        OperationType
      )}&operationId=${encryptDataForURL(
        OperationTypeID
      )}&operationStepNo=${encryptDataForURL(3)}` +
      (action === "opsView" ? "&action=" + encryptDataForURL("opsView") : "") + "&operationMode=" + encryptDataForURL(operationMode)
    );
    return;
  }
};
export const vesselListCancelFunctionality = (
  formData,
  navigate,
  operationMode
) => {
  const redirectUrl = getOperationActivityUrl(operationMode)
  navigate(
    redirectUrl +
    encryptDataForURL(formData[0]?.["ji_id"])
  );
};
//vesselListCancelFunctionality

export const createTMLAnalysisDetails = async (
  parameterData,
  setIsLoading,
  setIsOverlayLoader,
  setParameterDataTable,
  setCustomFormData,
  setIsSubmit,
  formData,
  initialCustomData,
  OperationTypeID,
  finalParamDataSort
) => {
  let smpl_set_smpljson = [];
  let smpl_set_smpljson_ids = [];
  let smpl_set_paramjson = [];
  let smpl_set_groupjson = [];

  let maxParamSeq = getMaxParamSeqAssing(finalParamDataSort)
  let param_sequance_no = 0;
  parameterData.map((paramData, seqIndex) => {
    parameterData[parameterData.length - 1].smpl_set_smpljson.map((sample) => {
      const spMark = sample.split('--###TCRCOPS###--')
      sample = spMark[0]
      if (!smpl_set_smpljson.includes(sample)) {
        smpl_set_smpljson.push(sample);
        smpl_set_smpljson_ids.push({
          "sample_id": spMark[1],
          "sample_mark": sample
        });
      }
    });
    let basis = [];
    let basiscodes = [];
    if (paramData.smpl_set_basisjson_name.length > 0) {
      basiscodes = paramData.smpl_set_basisjson_name.split(",");
    } else {
      basiscodes = [];
    }
    paramData.smpl_set_basisjson.map((basId, i) => {
      basis.push({
        basis_id: basId,
        basis_code: basiscodes[i],
      });
    });
    if (paramData["is_group_param"] == "Group") {
      let parameters = [];
      const groupParamJson = paramData.groupJsonParameter.filter(
        (singleparam) => {
          singleparam.param_sequence = param_sequance_no;
          singleparam.set_wise_param_sequence = parseInt(maxParamSeq) + parseInt(param_sequance_no) + 1
          param_sequance_no++;
          return true;
        }
      );
      smpl_set_groupjson.push({
        group_id: paramData.smpl_set_groupjson,
        group_name: paramData.smpl_set_groupjson_name,
        parameters: groupParamJson,
        sequanceNo: seqIndex,
        is_set_for_JRF: parameterData[parameterData.length - 1].is_set_for_JRF,
      });
    } else {
      smpl_set_paramjson.push({
        param_id: paramData.smpl_set_paramjson,
        param_name: paramData.smpl_set_paramjson_name,
        std_id: paramData.smpl_set_testmethodjson,
        std_name: paramData.smpl_set_testmethodjson_name,
        basis: basis,
        sequanceNo: seqIndex,
        param_unit: paramData.smpl_set_unit,
        is_set_for_JRF: parameterData[parameterData.length - 1].is_set_for_JRF,
        param_sequence: param_sequance_no,
        set_wise_param_sequence: parseInt(maxParamSeq) + parseInt(param_sequance_no) + 1,

      });
      param_sequance_no++;
    }
  });
  const newMainPayload = {
    ji_lms_assignment: {
      fk_jiid: formData[0].ji_id,
      fk_jisid: OperationTypeID,
      jism_jimode: "Vessel",
      fk_labid: formData[1]?.["smpl_filter_lab"] !== "otherTpi" ? formData[1]?.["smpl_filter_lab"] : "",
      jila_for_jrf: false,
      jila_for_tpi: false,
      // jila_for_jrf: parameterData[parameterData.length - 1].is_set_for_JRF === "Yes" ? true : false,
      // jila_for_tpi: parameterData[parameterData.length - 1].is_set_for_JRF === "Yes" ? false : true,
      jila_set_markjson: smpl_set_smpljson,
      jila_set_smpljson_ids: smpl_set_smpljson_ids,
      jila_set_groupjson: smpl_set_groupjson,
      jila_set_paramjson: smpl_set_paramjson,
      tenant: GetTenantDetails(1),
    },
  };
  setIsLoading(true);
  setIsOverlayLoader(true);
  const res = await postDataFromApi(TMLAnalysisDataCreateApi, newMainPayload);
  if (res.data.status === 200) {
    setParameterDataTable([]);
    setCustomFormData(initialCustomData);
    setIsSubmit(false);
    setIsOverlayLoader(false);
    toast.success(res.data.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else {
    toast.error(res.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  setIsOverlayLoader(false);
  setIsLoading(false);
};

export const getAllSampleMarkList = async (
  ji_id,
  OperationTypeID,
  setTableData,
  formData,
  setFormData,
  section,
  useFor = "",
  existingData,
  updatedFormData,
  setIsDisplayNewAddOption,
  OperationType
) => {
  try {
    const bodyData = {
      ji_id: ji_id,
      jis_id: OperationTypeID,
    };
    if (
      ["sampleInward", "jrf", "inwardChecklist", "GroupAssignment"].includes(
        useFor
      )
    ) {
      bodyData.jrf_id = formData[0]?.jrf_id;
    }
    let res = await postDataFromApi(TMLDatagetAllApi, bodyData);
    if (res?.data?.status === 200 && res.data.data) {
      const responseData = res.data.data;
      if (!updatedFormData) {
        updatedFormData = { ...formData };
      }
      let i = 0;
      let quantityCount = 0;
      let assignedLots = [];
      let actualLot = [];
      const actualResponseData = responseData.filter((singleInwardData) => {
        if (!singleInwardData.jism_is_composite) {
          quantityCount =
            quantityCount + parseInt(singleInwardData.jism_quantity);
          actualLot.push(singleInwardData.jism_lot_no);
        } else {

          if (!Array.isArray(
            singleInwardData.composite_lot_nos
          )) {
            // singleInwardData.jism_composite_lot_nos = singleInwardData.jism_composite_lot_nos.split(',')
            singleInwardData.jism_composite_lot_nos = singleInwardData.composite_lot_nos.split(',')
          }
          singleInwardData.composite_lot_nos.map((lot) => {
            assignedLots.push(lot);
          });
        }

        if (
          [
            "sampleInward",
            "jrf",
            "inwardChecklist",
            "GroupAssignment",
          ].includes(useFor)
        ) {
          if (!singleInwardData.jism_is_jrf) {
            return false;
          }
        }
        if (useFor == "sampleInward") {
          const filterData = existingData.filter((existingData) => {
            return (
              singleInwardData["jism_id"] == existingData.fk_ji_sample_marks_id
            );
          });
          if (filterData.length) {
            singleInwardData = filterData[0]
            section.rows.forEach((row) => {
              row.forEach((columnName) => {
                if (columnName.name !== "smpl_detail_smpl_qty_unit") {
                  const fieldName = `${columnName.name}_${i}`;
                  const value =
                    columnName.name === "sample_id"
                      ? singleInwardData["smpl_detail_smpl_id"]
                      : singleInwardData[columnName.name];
                  if (columnName.name === "smpl_detail_smpl_qty") {
                    let spValue = value ? value.split(" / ") : '';
                    updatedFormData[1][fieldName] = spValue[0];
                    updatedFormData[1][
                      `${columnName.name}_unit_${i}`
                    ] = spValue.length > 1 ? spValue[1] : "";
                  } else {
                    if (columnName.name === "smpl_detail_dos") {
                      updatedFormData[1][fieldName] = value;
                    } else {
                      updatedFormData[1][fieldName] = value;
                    }
                  }
                }
              });
            });
            if (["Raw and Powdered Sample", "Physical and Raw Sample", "Physical,Raw and Powdered Sample"].includes(singleInwardData['smpl_detail_smpl_condtion'])) {
              updatedFormData[1]['smpl_detail_smpl_pwd_qty_' + i] = singleInwardData.smpl_detail_smpl_pwd_qty;
              updatedFormData[1]['smpl_detail_smpl_pwd_qty_unit_' + i] = singleInwardData.smpl_detail_smpl_pwd_qty_unit;
              if (["Physical,Raw and Powdered Sample"].includes(singleInwardData['smpl_detail_smpl_condtion'])) {
                updatedFormData[1]['smpl_detail_smpl_physical_qty_' + i] = singleInwardData.smpl_detail_smpl_physical_qty;
                updatedFormData[1]['smpl_detail_smpl_physical_qty_unit_' + i] = singleInwardData.smpl_detail_smpl_physical_qty_unit;
              }
            }
            updatedFormData[1]["smpl_inwrd_detail_id_" + i] =
              singleInwardData.smpl_inwrd_detail_id;
            i++;
            return true;
          }
        }
        if (!updatedFormData[1]) {
          updatedFormData[1] = {};
        }
        for (let obj in singleInwardData.jism_jsonb_front) {
          singleInwardData[obj] = singleInwardData.jism_jsonb_front[obj];
        }
        section.rows.forEach((row) => {
          row.forEach((columnName) => {
            const fieldName = `${columnName.name}_${i}`;
            const value =
              columnName.name === "sample_id"
                ? singleInwardData["smpl_detail_smpl_id"]
                : useFor == "sampleInward"
                  ? singleInwardData[columnName.subname]
                  : singleInwardData[columnName.name];

            if (columnName.name === "smpl_detail_smpl_qty") {
              let spValue = value ? value.split(" ") : [];
              if (spValue.length > 0) {
                updatedFormData[1][fieldName] = spValue[0];
                updatedFormData[1][`${columnName.name}_unit_${i}`] =
                  spValue.length > 1 ? spValue[1] : "";
              }
              else {
                updatedFormData[1][fieldName] = updatedFormData[1][fieldName]
                if (!updatedFormData[1][fieldName]) {
                  if (updatedFormData[1]['smpl_detail_smpl_qty_0']) {
                    updatedFormData[1][fieldName] = updatedFormData[1]['smpl_detail_smpl_qty_0']
                  }
                }
              }
            } else if (columnName.name === "smpl_detail_smpl_qty_unit") {
              updatedFormData[1][fieldName] = updatedFormData[1][fieldName]
              if (!updatedFormData[1][fieldName]) {
                if (updatedFormData[1]['smpl_detail_smpl_qty_unit_0']) {
                  updatedFormData[1][fieldName] = updatedFormData[1]['smpl_detail_smpl_qty_unit_0']
                }
              }
            } else if (columnName.name === "smpl_detail_seal_number") {
              // updatedFormData[1][fieldName] = singleInwardData[
              //   "jism_sealnumber"
              // ]
              //   ? singleInwardData["jism_sealnumber"]
              //   : "NA";
            } else if (columnName.name === "smpl_detail_pkging_condition") {
              // updatedFormData[1][fieldName] = singleInwardData[
              //   "jism_sealnumber"
              // ]
              //   ? "Sealed"
              //   : "Unsealed";
            } else if (columnName.name === "smpl_detail_smpl_condtion") {
              updatedFormData[1][fieldName] = updatedFormData[1][fieldName]
              if (!updatedFormData[1][fieldName]) {
                if (updatedFormData[1]['smpl_detail_smpl_condtion_0']) {
                  updatedFormData[1][fieldName] = updatedFormData[1]['smpl_detail_smpl_condtion_0']
                }
              }
            } else {
              if (columnName.name === "smpl_detail_dos") {
                updatedFormData[1][fieldName] = formData[0]["smpl_detail_dos"];
              } else if (columnName.name === "jism_is_composite") {
                updatedFormData[1][fieldName] = value ? "Composite" : "Lot";
                if (value) {
                  if (Array.isArray(
                    singleInwardData.composite_lot_nos
                  )) {
                    // updatedFormData[1]["jism_composite_lot_nos_" + i] =singleInwardData["jism_composite_lot_nos"].join(", ");
                    if (singleInwardData.composite_lot_nos.length > 0) {
                      updatedFormData[1]["jism_composite_lot_nos_" + i] = singleInwardData["composite_lot_nos"].join(", ");
                    }
                    else {
                      updatedFormData[1]["jism_composite_lot_nos_" + i] = singleInwardData["jism_composite_lot_nos"].join(", ");
                    }
                  }
                  else {
                    updatedFormData[1]["jism_composite_lot_nos_" + i] = singleInwardData["composite_lot_nos"] || "";
                  }
                }
              }
              else if (columnName.name === "jism_composite_lot_nos") {
                if (!singleInwardData["jism_is_composite"]) {
                  updatedFormData[1]["jism_composite_lot_nos_" + i] =
                    singleInwardData["jism_lot_no"];
                }

              } else if (columnName.name === "smpl_detail_recpt_mode") {
                updatedFormData[1][fieldName] =
                  formData[0]["smpl_detail_recpt_mode"];
              }
              else if (columnName.name === "manual_duplicate_entry") {
                updatedFormData[1][fieldName] = 1;
              } else {
                updatedFormData[1][fieldName] = value;
              }
            }
          });
        });

        updatedFormData[1]["fk_ji_sample_marks_id_" + i] =
          singleInwardData["jism_id"];
        i++;
        return true;
      });
      if (setIsDisplayNewAddOption && actualResponseData.length > 0) {
        if (assignedLots.length === actualLot.length) {
          // setIsDisplayNewAddOption(false);
        } else if (OperationType === getVesselOperation("TML")) {
          if (responseData.length >= 1) {
            // setIsDisplayNewAddOption(false);
          } else {
            setIsDisplayNewAddOption(true);
          }
        } else {
          setIsDisplayNewAddOption(true);
        }
        // if (formData[0].ji_appointed_totalqty <= quantityCount) {
        //   setIsDisplayNewAddOption(false);
        // } else {
        //   setIsDisplayNewAddOption(true);
        // }
      }
      setFormData(updatedFormData);
      setTableData(actualResponseData);
    }
  } catch (error) {
    // console.log('err---', error)
  }
};

export const getAllSampleAssignmentist = async (
  ji_id,
  OperationTypeID,
  setTableData,
  formData,
  setFormData,
  section,
  setFinalParamDataSort,
  setSampleDataTable,
  setSelectedOptions,
  isForDropdown,
  setOperationAssignmentData,
  useFor = "",
  setIsOverlayLoader,
  isLabWiseFilter,
  labId,
  setIsDisplayNewAddOption
) => {
  try {
    if (setIsOverlayLoader) {
      setIsOverlayLoader(true);
    }
    const bodyData = {
      ji_id: ji_id,
      jis_id: OperationTypeID,
    };
    let res;
    if (isLabWiseFilter) {
      bodyData.lab_id = labId === "otherTpi" ? "" : labId;
      bodyData.context = labId === "otherTpi" ? "otherTpi" : "";
      res = await postDataFromApi(getLabWiseSetAssignmentData, bodyData);
    } else {
      if (
        [
          "jrf",
          "sampleinward",
          "inwardChecklist",
          "LMSAssignment",
          "GroupAssignment",
        ].includes(useFor)
      ) {
        bodyData.jrf_id = formData[0]?.jrf_id;
      }
      res = await postDataFromApi(TMLAnalysisDataListApi, bodyData);
    }

    if (res?.data?.status === 200 && res.data.data) {
      const responseData = res.data.data;
      if (isForDropdown) {
        setOperationAssignmentData(responseData);
      }
      const newArray = responseData;
      let FinalCombinedArray = [];
      let selectedSimpleIds = [];
      let RFTPIFormData = formData;
      const newExistData = newArray.filter((singleParamaSet, index) => {
        if (
          [
            "jrf",
            "sampleinward",
            "inwardChecklist",
            "LMSAssignment",
            "GroupAssignment",
          ].includes(useFor)
        ) {
          if (!singleParamaSet.jila_for_jrf) {
            return false;
          }
        }
        const samplmarkids = [];
        singleParamaSet.jila_set_markjson.map((simpleId, index) => {
          if (useFor === "LMSAssignment") {
            const filterdata = formData[0]?.sample_detail_data.filter(
              (singledata) => {
                return singledata.smpl_detail_sample_mark === simpleId;
              }
            );
            if (filterdata.length > 0) {
              selectedSimpleIds.push(filterdata[0].smpl_detail_smpl_id);
              samplmarkids.push(filterdata[0].smpl_detail_smpl_id);
            }
          } else {
            let sampleMarkId = singleParamaSet.jila_set_smpljson_ids ? singleParamaSet.jila_set_smpljson_ids?.filter((singleSampleId) => singleSampleId.sample_mark === simpleId) : []
            sampleMarkId = sampleMarkId.length > 0 ? sampleMarkId[0].sample_id : ""
            selectedSimpleIds.push(simpleId + '--###TCRCOPS###--' + sampleMarkId);
          }
        });
        if (useFor === "LMSAssignment") {
          newArray[index].smpl_set_smpljson = samplmarkids;
          newArray[index].smpl_set_groupjson =
            singleParamaSet.jila_set_groupjson;
          newArray[index].smpl_set_paramjson =
            singleParamaSet.jila_set_paramjson;
          delete newArray[index].jila_set_paramjson;
          delete newArray[index].jila_set_groupjson;
          delete newArray[index].jila_set_markjson;
          let combinedArray = [];
          for (const [key, value] of Object.entries(
            singleParamaSet.smpl_set_groupjson
          )) {
            value.param_type = "Group";
            combinedArray.push({ ...value });
          }
          for (const [key, value] of Object.entries(
            singleParamaSet.smpl_set_paramjson
          )) {
            value.param_type = "Parameter";
            combinedArray.push({ ...value });
          }
          combinedArray = combinedArray.sort(
            (a, b) => a.sequanceNo - b.sequanceNo
          );
          FinalCombinedArray.push(combinedArray);
        } else {
          if (useFor === "OperationDetailsAssignment") {
            if (!RFTPIFormData[0]) {
              RFTPIFormData[0] = {};
            }
            RFTPIFormData[0] = {};
            if (singleParamaSet.jila_for_jrf || singleParamaSet.jila_for_tpi) {
              RFTPIFormData[0]["is_set_for_JRF_" + singleParamaSet.jila_id] = [
                "created",
              ];
            } else {
              RFTPIFormData[0]["is_set_for_JRF_" + singleParamaSet.jila_id] =
                formData[0]["is_set_for_JRF_" + singleParamaSet.jila_id]
                  ? formData[0]["is_set_for_JRF_" + singleParamaSet.jila_id]
                  : ["Yes"];
            }
          }
          let combinedArray = [];
          for (const [key, value] of Object.entries(
            singleParamaSet.jila_set_groupjson
          )) {
            value.param_type = "Group";
            combinedArray.push({ ...value });
          }
          for (const [key, value] of Object.entries(
            singleParamaSet.jila_set_paramjson
          )) {
            value.param_type = "Parameter";
            combinedArray.push({ ...value });
          }
          combinedArray = combinedArray.sort(
            (a, b) => a.sequanceNo - b.sequanceNo
          );
          FinalCombinedArray.push(combinedArray);
        }
        return true;
      });
      if (useFor === "OperationDetailsAssignment") {
        setFormData(RFTPIFormData);
      }
      if (setSelectedOptions) {
        setSelectedOptions(selectedSimpleIds);
      }
      setFinalParamDataSort(FinalCombinedArray);
      if (setSampleDataTable) {
        setSampleDataTable(newExistData);
      }
      setTableData(newExistData);
    }
    else {
      setFinalParamDataSort([]);
      setTableData([]);
      if (useFor === "OperationDetailsAssignment") {
        setFormData({});
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (setIsOverlayLoader) {
      setIsOverlayLoader(false);
    }
  }
};

export const createTMLAnalysisPageHandleAction = async (
  actionSelected,
  tableData,
  setSaveClicked,
  setEditableIndex,
  popupIndex,
  setIsOverlayLoader,
  setTableData,
  formData,
  setFormData,
  section,
  setFinalParamDataSort,
  setSampleDataTable,
  setSelectedOptions,
  OperationTypeID
) => {
  if (actionSelected == "Delete") {
    setSaveClicked(true);
    setIsOverlayLoader(true);
    let payload = {
      jila_id: tableData[popupIndex]?.jila_id,
    };
    let res = await deleteDataFromApi(deleteTMLAnalysisDeleteApi, payload);
    if (res.data.status === 200) {
      getAllSampleAssignmentist(
        formData[0]?.ji_id,
        OperationTypeID,
        setTableData,
        formData,
        setFormData,
        section,
        setFinalParamDataSort,
        setSampleDataTable,
        setSelectedOptions
      );
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(res.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setSaveClicked(false);
    setIsOverlayLoader(false);
  } else if (actionSelected === "Cancel") {
    setEditableIndex("");
  }
};

export const Operation_HH_CreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  subTableData,
  submitType,
  operationMode
) => {
  let res;
  setIsOverlayLoader(true);
  let ops_vessel_hh = {
    fk_jiid: formData[0].ji_id,
    fk_jisid: OperationTypeID,
    opsvhh_data: subTableData,
    status: submitType === "post" ? "posted" : "in-process",
    tenant: GetTenantDetails(1),
  };

  if (formData[1].opsvhh_id) {
    let MainData = {
      opsvhh_id: formData[1].opsvhh_id,
      ops_vessel_hh: ops_vessel_hh,
    };
    res = await putDataFromApi(updateHHApi, MainData);
  } else {
    let MainData = {
      ops_vessel_hh: ops_vessel_hh,
    };
    res = await postDataFromApi(createHHApi, MainData);
  }
  if (res?.data?.status === 200) {
    toast.success(res?.data?.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    OperationCreateDataFunction(
      formData,
      setIsOverlayLoader,
      setIsPopupOpen,
      OperationType,
      OperationTypeID,
      navigate,
      submitType === "post" ? "posted" : "in-process",
      "",
      [],
      "",
      1,
      "",
      operationMode
    );
    const redirectUrl = getOperationActivityUrl(operationMode)
    navigate(
      `${redirectUrl}${encryptDataForURL(
        formData[0].ji_id
      )}`
    );
    return;
  } else {
    toast.error(res.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  setIsPopupOpen(false);
  setIsOverlayLoader(false);
};
export const totalTannange = (subTableData, formData) => {
  // let totalCount = 0;

  // subTableData.map((singleData) => {
  //   totalCount = totalCount + parseInt(singleData["total_tonnage"]);
  // });
  // return formData?.[0]?.ji_appointed_totalqty;
  return formData?.[0]?.ji_totalqty;
};

export const totalTannangeBalance = (subTableData, formData, fieldName = "") => {
  let totalCount = 0;

  subTableData.map((singleData) => {
    totalCount = totalCount + parseInt(singleData[fieldName]);
  });
  // return formData[0]?.ji_appointed_totalqty - totalCount;
  return formData[0]?.ji_totalqty - totalCount;
};

export const Operation_Supervision_CreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  subTableData,
  submitType,
  operationMode,
  isforSandReport = "",
  activeTab,
  setActiveTab,
  setSubTableData,
  setFormData,
  formConfig,
  isNextClick,
  generateCertificate
) => {
  // return
  let res;

  const baseFields = [
    "vessel_berth_name",
    "vessel_berth_type",
    'vl_info_remark',
    "vessel_arrived",
    "vessel_arrived_remark",
    "vessel_birthed",
    "vessel_birthed_remark",
    "initial_draught_survey",
    "initial_draught_survey_remark",
    "discharge_completed",
    "discharge_completed_remark",
    "discharge_commenced",
    "discharge_commenced_remark",
    "final_draught_survey",
    "final_draught_survey_remark",
    "end_initial_draught_survey",
    "end_initial_draught_survey_remark",
    "end_final_draught_survey",
    "end_final_draught_survey_remark",
    "intrim_draught_survey",
    "intrim_draught_survey_remark",
    "end_intrim_draught_survey",
    "end_intrim_draught_survey_remark",
    //barge activity
    "date_of_eosp",
    "date_of_nor_tendered",
    "date_of_vessel_anxhchor_aweigh",
    "date_of_drop_anchor",
    "date_of_custom_board",
    "date_of_custom_cleared",
  ];

  const maxIndex = formData[1]['opsvsv_vesselInfoCount'] ? formData[1]['opsvsv_vesselInfoCount'] : 1;
  let isValideCondition = true;
  let errorMsg = ""
  let requiredFields = []
  if (activeTab === "1-2") {
    requiredFields = []
  }
  const opsvsv_vesselinfo = Array.from({ length: maxIndex }, (_, index) => {
    const entry = {};
    baseFields.forEach((field) => {

      const fieldKey = `${field}_${index}`;
      entry[field] = formData[1][fieldKey] || null;
      if (requiredFields.includes(field)) {
        if (!formData[1][fieldKey]) {
          isValideCondition = false;
          let fieldSp = field.split('_').join(' ')
          errorMsg = fieldSp + ' is Required'
        }
      }
      else if (field == "discharge_commenced") {
        // if (formData[1]?.[fieldKey].toDateString() > formData[1]['initial_draught_survey_' + index]) {
        //   isValideCondition = false;
        //   let fieldSp = field.split('_').join(' ')
        //   errorMsg = fieldSp + ' is Required'
        // }
      }
    });
    return entry;
  });
  if (!isValideCondition) {
    toast.error(errorMsg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    return
  }
  const renameKeys = (arr) => {
    return arr.map(item => {
      const newItem = {};

      Object.keys(item).forEach(key => {
        const newKey = key
          .replace("barge_detail_loading_", "barge_detail_")
          .replace("barge_detail_unloading_", "barge_detail_");

        newItem[newKey] = item[key];
      });

      return newItem;
    });
  };
  let MainData = {
    ops_vessel_sv: {
      fk_jiid: formData[0].ji_id,
      fk_jisid: OperationTypeID,
      opsvsv_stowageplan: subTableData[0] ? subTableData[0] : [],
      opsvsv_vesselinfo,
      opsvsv_dischargedetails: subTableData[2] ? subTableData[2] : [],
      opsvsv_barge_details: {
        loading_details: subTableData[3] ? renameKeys(subTableData[3]) : [],
        unloading_details: subTableData[4] ? renameKeys(subTableData[4]) : []
      },
      opsvsv_daily_moisture_and_size: subTableData[1] ? subTableData[1] : [],
      opsvsv_otherdetails: [
        {
          colour: formData[1].colour,
          weather: formData[1].weather,
          reciever_surveyor: formData[1].reciever_surveyor,
          agent: formData[1].agent,
          port_surveyor: formData[1].port_surveyor,
          stevedores: formData[1].stevedores,
          cargo_being_discharged_by: formData[1].cargo_being_discharged_by,
          no_of_cranes_being_used: formData[1].no_of_cranes_being_used,
          sampling_done_at: formData[1].sampling_done_at,
          condition_cargo: formData[1].condition_cargo,
          direct_sale_or_stock_sale: formData[1].direct_sale_or_stock_sale,
          last_cargo: formData[1].last_cargo,
          remarks: formData[1].remarks,
          kind_attand: formData[1].kind_attand,
        },
      ],
      opsvsv_storagedetail: [
        {
          trans_by: formData[1].trans_by,
          number: formData[1].number,
          stock_yard: formData[1].stock_yard,
          diastance: formData[1].diastance,
          contamination_if_any: formData[1].contamination_if_any,
          adj_cargo_at_stock_yard: formData[1].adj_cargo_at_stock_yard,
        },
      ],
      opsvsv_dischargedetailstotal: totalTannange(subTableData[1]),
      opsvsv_dischargedetailsbalancedqty: "",
      opsvsv_remarks: "",
      status:
        formData[1]?.ops_status === "posted" || (submitType === "post" && !isforSandReport)
          ? "posted"
          : "in-process",
      tenant: GetTenantDetails(1),
    },
  };
  if (formData[1].opsvsv_id) {
    MainData.opsvsv_id = formData[1].opsvsv_id;
    res = await putDataFromApi(updateSVApi, MainData);
  } else {
    res = await postDataFromApi(createSVApi, MainData);
  }

  if (res?.data?.status === 200) {
    if (isNextClick || submitType !== "post") {
      getSingleSupervissionData(
        OperationTypeID,
        formData,
        setSubTableData,
        setIsOverlayLoader,
        setFormData,
        formConfig.sections?.[1]?.tabs,
        subTableData
      );
      setActiveTab(activeTab)
    }
    if (!isforSandReport) {
      toast.success(res?.data?.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    if (!isforSandReport) {
      OperationCreateDataFunction(
        formData,
        setIsOverlayLoader,
        setIsPopupOpen,
        OperationType,
        OperationTypeID,
        navigate,
        (submitType === "post" && !isforSandReport) || formData[1]?.ops_status === "posted" ? "posted" : "in-process",
        "",
        [],
        "",
        1,
        "",
        operationMode
      );
    }
    if (isforSandReport) {
      navigate(
        `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
          formData[1].opsvsv_id
        )}/${encryptDataForURL(
          formData[1].opsvsv_id
        )}?status=${encryptDataForURL("NonLMS")}` +
        "&OperationType=" +
        encryptDataForURL(OperationType) +
        "&useFor=" +
        encryptDataForURL("daily_report") +
        "&JISIDForDailyReport=" +
        encryptDataForURL(formData[0].ji_id) + "&ReferenceNo=" +
        encryptDataForURL(formData[0].ji_reference_number) + '&operationId=' + encryptDataForURL(OperationTypeID)
      );
    }
    else {
      if (!isNextClick && submitType === "post") {
        generateCertificate("uploadedDocument", "posted", '', 1)
        const redirectUrl = getOperationActivityUrl(operationMode)
        navigate(
          `${redirectUrl}${encryptDataForURL(
            formData[0].ji_id
          )}`
        );
      }

    }
    return;
  } else {
    toast.error(res.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  setIsPopupOpen(false);
  setIsOverlayLoader(false);
};

const DailyReport = () => {

}
export const truckOnlySealDailyReport = async (formData, navigate, subTableData, OperationTypeID) => {
  let tr_os_id;
  if (formData[1]?.tr_os_id) {
    tr_os_id = formData[1]?.tr_os_id;
  } 
  if (tr_os_id) {
    let payload = {
      "tr_os_id": tr_os_id,
    }
    let generateCertificateResponse = await postDataFromApi(
      dailyReportPDFApi,
      payload,
      "",
      true,
      "",
      ""
    );
    if (
      generateCertificateResponse?.data?.status === 200
    ) {
      const pdfBlob = new Blob([generateCertificateResponse.data], {
        type: "application/pdf",
      });
      let payload = new FormData();
      payload.append("document", pdfBlob, ("Daily Report" + ".pdf") || "certificate.pdf");
      payload.append("model_type ", "commercial_certificate");
      payload.append("bypass_file_size_check ", true);
      payload.append("sub_folder", 6);
      let uploadResponse = await postDataFromApi(
        masterUploadApi,
        payload,
        "TRUE"
      );

      if (uploadResponse.data.status === 200) {
        let folderPayload = {
          data: {
            fd_name: formData[0]?.ji_reference_number,
          },
          parent_folder: "commercial_certificate",
        };
        let folderRes = await postDataFromApi(folderCreateApi, folderPayload);
        let FolderID;
        // setLoadingTable(true);

        if (folderRes.data.status === 201 || folderRes.data.status === 200) {
          FolderID = folderRes?.data?.data.fd_id;
        } else {
          FolderID = folderRes?.data?.message?.existing_folder_id;
        }
        if (FolderID) {
          let payload = {
            data: {
              dl_folder: FolderID,
              // dl_sub_folder: 6,
              dl_module: "commercial_certificate",
              dl_document_name:
                formData[0]?.ji_reference_number || "Daily Report",
              dl_document_reference: formData[0]?.ji_id,
              dl_document_jisid: OperationTypeID,
              dl_type: "Document Type",
              dl_show_to_all: true,
              dl_s3_url: uploadResponse.data?.data?.document,
              dl_version: "1.0",
              dl_file_type: "Only Seal Daily Report",
              dl_date_uploaded: new Date(),
              dl_status: "Active",
              // dl_assigned_to: "Assigned User",
              dl_discription: "Only Seal",
              // document_type: "daily_report",
              // doc_ref_id: OperationTypeID
            },
          };
          let documentResponse = await postDataFromApi(
            documentCreateApi,
            payload
          );

          if (documentResponse.data.status === 200) {
            toast.success(
              documentResponse?.message ||
              documentResponse?.data?.message ||
              "Daily Report Successfully Shared",
              {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              }
            );
            setTimeout(() => {
              navigate("/operation/JI-commercial-certificate-list/" + encryptDataForURL(formData[0]?.ji_id))

            }, 2000);

          } else {
            // setLoading(false);
          }
        }
      } else {
        toast.error(
          uploadResponse?.message ||
          uploadResponse?.data?.message,
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        // setLoading(false);
      }
    } else {
      toast.error(
        generateCertificateResponse?.message ||
        generateCertificateResponse?.data?.message,
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      // setLoading(false);
    }
  }
}
const getBeforeFinalCalculationData = (totalInitial, formData, interimCount, opsvd_interim_cal, section, defaultValue) => {
  let keyValue = "";
  if (interimCount) {
    keyValue = "interim_" + (interimCount - 1)
    const TotalValue = getTotalValues(formData, "interim_" + (interimCount - 1), section.headers1)
    const opsvd_changeonshipaccount = getChangeOnShipsValue(
      formData,
      totalInitial,
      TotalValue
    )
    const opsvd_diffdisplacement = getDisplacementDifferenceCalc(formData, interimCount, 0)
    opsvd_interim_cal[keyValue] = {};
    opsvd_interim_cal[keyValue]['total'] = TotalValue || defaultValue
    opsvd_interim_cal[keyValue]['opsvd_changeonshipaccount'] = opsvd_changeonshipaccount || defaultValue
    opsvd_interim_cal[keyValue]['opsvd_diffdisplacement'] = opsvd_diffdisplacement || defaultValue
    opsvd_interim_cal[keyValue]['opsvd_qtydischargedorloaded'] = ((parseFloat(opsvd_diffdisplacement) || 0) +
      (parseFloat(opsvd_changeonshipaccount) || 0) || defaultValue)
    opsvd_interim_cal[keyValue]['opsvd_roundoffqty'] = (Math.round(opsvd_interim_cal[keyValue]['opsvd_qtydischargedorloaded']) || defaultValue)

  }
  else {
    const TotalValue = getTotalValues(formData, "initial", section.headers1)
    const opsvd_changeonshipaccount = getChangeOnShipsValue(
      formData,
      totalInitial,
      TotalValue
    )
    const opsvd_diffdisplacement = getDisplacementDifferenceCalc(formData, interimCount, 0)
    keyValue = "initial"
    opsvd_interim_cal[keyValue] = {};
    opsvd_interim_cal[keyValue]['total'] = TotalValue || defaultValue
    opsvd_interim_cal[keyValue]['opsvd_changeonshipaccount'] = opsvd_changeonshipaccount || defaultValue
    opsvd_interim_cal[keyValue]['opsvd_diffdisplacement'] = opsvd_diffdisplacement || defaultValue
    opsvd_interim_cal[keyValue]['opsvd_qtydischargedorloaded'] = ((parseFloat(opsvd_diffdisplacement) || 0) +
      (parseFloat(opsvd_changeonshipaccount) || 0) || defaultValue)
    opsvd_interim_cal[keyValue]['opsvd_roundoffqty'] = (Math.round(opsvd_interim_cal[keyValue]['opsvd_qtydischargedorloaded']) || defaultValue)

  }

  return opsvd_interim_cal
}

export const Operation_DraftSurvey_CreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  section,
  submitType,
  operationMode,
  setFormData,
  setTableData,
  setIsTabOpened
) => {
  let opsvd_initial = [];
  let opsvd_interim = [];
  let opsvd_final = [];
  let opsvd_interim_cal = {};
  const actualIntermCount = formData[1].opsvd_interim_count
    ? formData[1].opsvd_interim_count
    : 0;

  let totalInitial = getTotalValues(formData, "initial", section.headers1)
  let totalFinal = formData[1].opsvd_is_final ? getTotalValues(formData, "final", section.headers1) : getTotalValues(formData, "interim_" + (actualIntermCount - 1), section.headers1)
  const defaultValue = '-'

  section.headers1.map((header, i) => {
    if (i === 0) {
      opsvd_initial.push({
        'fromdate_time-initial': formData[1]["fromdate_time-initial"] || '',
        'todate_time-initial': formData[1]["todate_time-initial"] || '',
        'opsvd_survey_keel_correction': formData[0]["opsvd_survey_keel_correction"] || '',
        'ds_keel_correction_value': formData[1]["ds_keel_correction_value"] || '',
      });
      opsvd_final.push({
        'fromdate_time-final': formData[1]["fromdate_time-final"] || '',
        'todate_time-final': formData[1]["todate_time-final"] || '',
      });
    }
    opsvd_initial.push({
      [header.name]: formData[1][header.name + "-initial"] || defaultValue,
      "unit": formData[1][header.name + "-unit"] && formData[1][header.name + "-initial"] ? formData[1][header.name + "-unit"] : '',
    });
    opsvd_final.push({
      [header.name]: formData[1][header.name + "-final"] || defaultValue,
      "unit": formData[1][header.name + "-unit"] && formData[1][header.name + "-final"] ? formData[1][header.name + "-unit"] : '',
    });
  });
  opsvd_interim_cal = getBeforeFinalCalculationData(totalInitial, formData, 0, opsvd_interim_cal, section, defaultValue)
  let isValudValue = true;
  let errorMesg = ""
  section.headers2.map((header) => {
    opsvd_initial.push({
      [header.name]: formData[1][header.name + "-initial"] || defaultValue,
      "unit": formData[1][header.name + "-unit"] && formData[1][header.name + "-initial"] ? formData[1][header.name + "-unit"] : '',
    });

    opsvd_final.push({
      [header.name]: formData[1][header.name + "-final"] || defaultValue,
      "unit": formData[1][header.name + "-unit"] && formData[1][header.name + "-final"] ? formData[1][header.name + "-unit"] : '',
    });
    if (['mean_forward', 'mean_aft', 'port_mid_ship', 'starboard_ship', 'corrected_mean_of_means'].includes(header.name)) {
      if (!formData[1][header.name + "-initial"]) {
        errorMesg = header.label + ' fields is required'
        isValudValue = false;
      }
      else if (formData[1].opsvd_is_final && !formData[1][header.name + "-final"]) {
        errorMesg = header.label + ' fields is required'
        isValudValue = false;
      }
    }
  });
  if (!formData[1]['fromdate_time' + "-initial"]) {
    errorMesg = 'Start Date fields is required'
    isValudValue = false;
  }
  else if (!formData[1]['todate_time' + "-initial"]) {
    errorMesg = 'Start Date fields is required'
    isValudValue = false;
  }
  else if (formData[1].opsvd_is_final && !formData[1]['fromdate_time' + "-final"]) {
    errorMesg = 'Start Date fields is required'
    isValudValue = false;
  }
  else if (formData[1].opsvd_is_final && !formData[1]['todate_time' + "-final"]) {
    errorMesg = 'End Time fields is required'
    isValudValue = false;
  }


  let temp_opsvd_interim_inner = [];
  for (let i = 0; i < actualIntermCount; i++) {
    let opsvd_interim_inner = [];

    section.headers1.map((header, headerIndex) => {
      if (headerIndex === 0) {
        opsvd_interim_inner.push({
          'fromdate_time-interim': formData[1]['fromdate_time-interim' + "_" + i] || '',
          'todate_time-interim': formData[1]['todate_time-interim' + "_" + i] || '',
        });
      }
      opsvd_interim_inner.push({
        [header.name]: formData[1][header.name + "-interim" + "_" + i] || defaultValue,
        "unit": formData[1][header.name + "-unit"] && formData[1][header.name + "-interim" + "_" + i] ? formData[1][header.name + "-unit"] : '',
      });

    });
    section.headers2.map((header) => {
      opsvd_interim_inner.push({
        [header.name]: formData[1][header.name + "-interim" + "_" + i] || defaultValue,
        "unit": formData[1][header.name + "-unit"] && formData[1][header.name + "-interim" + "_" + i] ? formData[1][header.name + "-unit"] : '',
      });
      if (['mean_forward', 'mean_aft', 'port_mid_ship', 'starboard_ship', 'corrected_mean_of_means'].includes(header.name)) {
        if (!formData[1][header.name + "-interim" + "_" + i]) {
          errorMesg = header.label + ' fields is required'
          isValudValue = false;
        }
      }
    });
    if (!formData[1]['fromdate_time' + "-interim" + "_" + i]) {
      errorMesg = 'Start Date fields is required'
      isValudValue = false;
    }
    else if (!formData[1]['todate_time' + "-interim" + "_" + i]) {
      errorMesg = 'End Time fields is required'
      isValudValue = false;
    }
    temp_opsvd_interim_inner.push(opsvd_interim_inner);
    opsvd_interim.push(temp_opsvd_interim_inner);
    opsvd_interim_cal = getBeforeFinalCalculationData(totalInitial, formData, i + 1, opsvd_interim_cal, section)
  }

  if (!isValudValue) {
    toast.error(errorMesg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    return
  }

  let res;
  setIsOverlayLoader(true);
  const opsvd_changeonshipaccount = getChangeOnShipsValue(
    formData,
    totalInitial,
    totalFinal,
    formData[1].opsvd_is_final
  );
  const opsvd_diffdisplacement = getDisplacementDifferenceCalc(formData, actualIntermCount, formData[1].opsvd_is_final)
  let MainData = {
    ops_vessel_ds: {
      fk_jiid: formData[0].ji_id,
      fk_jisid: OperationTypeID,
      opsvd_initial: opsvd_initial,
      opsvd_interim: temp_opsvd_interim_inner,
      opsvd_final: opsvd_final || defaultValue,
      opsvd_totalinitial: totalInitial || defaultValue,
      opsvd_totalfirstinitial: getTotalValues(
        formData,
        "interim-0",
        section.headers1
      ) || defaultValue,
      opsvd_totallastinitial: totalFinal || defaultValue,
      opsvd_changeonshipaccount: opsvd_changeonshipaccount || defaultValue,
      // opsvd_qtytobedischarged: "",
      opsvd_qtydischargedorloaded:
        ((parseFloat(opsvd_diffdisplacement) || 0) +
          (parseFloat(opsvd_changeonshipaccount) || 0) || defaultValue),
      opsvd_roundoffqty:
        Math.round(
          ((parseFloat(opsvd_diffdisplacement) || 0) +
            (parseFloat(opsvd_changeonshipaccount)
              || 0)) || defaultValue),
      opsvd_remarks: formData[1].opsvd_remarks || '-',
      opsvd_diffdisplacement: opsvd_diffdisplacement || defaultValue,
      status: submitType === "post" ? "posted" : "in-process",
      opsvd_interim_count: formData[1].opsvd_interim_count
        ? formData[1].opsvd_interim_count
        : 0,
      opsvd_is_final: formData[1].opsvd_is_final ? true : false,
      opsvd_interim_cal: opsvd_interim_cal,
      opsvd_survey_at: formData[0].opsvd_survey_at,
      opsvd_survey_at_sow: formData[0].opsvd_survey_at_sow,
      tenant: GetTenantDetails(1),
    },
  };
  if (formData?.[0]?.opsvd_survey_keel_correction) {
    MainData.ops_vessel_ds = {
      ...MainData.ops_vessel_ds,
      opsvd_changeonshipaccount: formData?.[1]?.opsvd_changeonshipaccount,
      opsvd_qtydischargedorloaded: formData?.[1]?.opsvd_qtydischargedorloaded,
      opsvd_roundoffqty: formData?.[1]?.opsvd_roundoffqty,
      opsvd_diffdisplacement: formData?.[1]?.opsvd_diffdisplacement,
    }
  }
  let initialdate = new Date();
  if (formData[1].opsvd_is_final && !formData[1].opsvd_final_date) {
    MainData.ops_vessel_ds.opsvd_final_date = moment(initialdate).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  }
  if (formData[1].opsvd_id) {
    MainData.opsvd_id = formData[1].opsvd_id;

    res = await putDataFromApi(updateDSApi, MainData);
  } else {
    MainData.ops_vessel_ds.opsvd_initial_date = moment(initialdate).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    res = await postDataFromApi(createDSApi, MainData);
  }
  if (res?.data?.status === 200) {
    toast.success(res?.data?.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    OperationCreateDataFunction(
      formData,
      setIsOverlayLoader,
      setIsPopupOpen,
      OperationType,
      OperationTypeID,
      navigate,
      submitType === "post" ? "posted" : "in-process",
      null,
      [],
      "",
      1,
      "",
      operationMode
    );
    if (submitType === "post") {
      const redirectUrl = getOperationActivityUrl(operationMode)
      navigate(
        `${redirectUrl}${encryptDataForURL(
          formData[0].ji_id
        )}`
      );
    }
    else {
      getSingleDraftSurveyData(OperationTypeID, formData, setTableData, setIsOverlayLoader, setFormData, section, setIsTabOpened)
    }
    return;
  } else {
    toast.error(res.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  setIsPopupOpen(false);
  setIsOverlayLoader(false);
};
export const jobInstructionUpdateDataFunction = async (
  formData,
  setIsOverlayLoader,
  JRFTPIFormData,
  jrfCreationType
) => {
  let JRFData = [];
  let TPIData = [];
  for (let obj in JRFTPIFormData[0]) {
    let name = obj.split("_");
    const id = name[name.length - 1];
    if (JRFTPIFormData[0][obj] === "Yes") {
      JRFData.push(id);
    } else {
      TPIData.push(id);
    }
  }
  let payloadData = {
    ji_id: formData[0].ji_id,
    job_inst_data: {
      status: "posted",
    },
  };
  if (jrfCreationType !== "postOther") {
    payloadData["for_jrf"] = {
      jila_id: JRFData,
    };
  } else {
    payloadData["for_tpi"] = {
      jila_id: TPIData,
    };
  }
  let res;
  setIsOverlayLoader(true);
  let MainData = payloadData;
  res = await putDataFromApi(jobinstructionUpdateApi, MainData);
  if (res?.data?.status === 200) {
    toast.success(res?.data?.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setIsOverlayLoader(false);
  } else {
    toast.error(res.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  setIsOverlayLoader(false);
};


export const getLotCompositeData = async (
  setMasterResponse,
  indexNo,
  formData,
  OperationTypeID
) => {
  try {
    let res = await postDataFromApi(getlotnodropdownApi, {
      ji_id: formData[1]?.ji_id,
      jis_id: OperationTypeID,
    });
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data.lot_ids.map((value) => ({
        id: value[0],
        name: value[1] + ` (${value[2]})`,
      }));
      const bodyToPass = {
        model: "jism_composite_lot_nos_" + indexNo,
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getAssignemtnLabDropdownData = async (
  formData,
  OperationTypeID,
  setCustomFormData,
  setDropDownOptionLoaded,
  isForLab,
  labId,
  setOperationAssignmentData,
  isuseforstep5
) => {
  try {
    const payLoad = {
      ji_id: formData[1]?.ji_id,
      jis_id: OperationTypeID,
      lab_id: labId !== "otherTpi" ? labId : "",
      context: labId === "otherTpi" ? "otherTpi" : "",
    };
    let res;
    if (isuseforstep5) {
      res = await postDataFromApi(getLastStepAssignmentData, payLoad);
    } else {
      res = await postDataFromApi(getAssignemtnLabDropdownApi, payLoad);
    }
    if (res?.data?.status === 200 && res.data.data) {
      if (isForLab) {
        let paramDataGroup = [];
        let paramDataParamater = [];
        res.data.data.map((singleData) => {
          singleData.ops_exec_la_set_paramjson.map((param) => {
            paramDataParamater.push({
              basis: param.basis,
              std_id: param.std_id,
              param_id: param.param_id,
              std_name: param.std_name,
              param_name: param.param_name,
              param_unit: param.param_unit,
            });
          });
          singleData.ops_exec_la_set_groupjson.map((param) => {
            paramDataGroup.push({
              group_id: param.group_id,
              group_name: param.group_name,
              parameters: param.parameters,
            });
          });
        });
        setOperationAssignmentData([
          {
            jia_set_paramjson: paramDataParamater,
            jia_set_groupjson: paramDataGroup,
          },
        ]);
      } else {
        const clientData = res.data.data.map((value) => ({
          id: value.lab_id,
          name: value.lab_name + (value.lab_code ? ` (${value.lab_code})` : ""),
        }));
        // clientData.push({
        //   id: "otherTpi",
        //   name: "External Results",
        // });
        setCustomFormData((prevData) => {
          return {
            ...prevData,
            1: {
              ...prevData[1],
              "smpl_filter_lab":
                clientData.length > 0 ? clientData[0].id : "",
              "smpl_filter_lot_composite": "Lot",
            },
          };
        });
        setDropDownOptionLoaded(clientData);
      }
    }
    else {
      if (isForLab) {
        toast.error("This lab has no any parameter so please select other lab", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setOperationAssignmentData([
          {
            jia_set_paramjson: [],
            jia_set_groupjson: [],
          },
        ])
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const OperationSizeAnalysisCreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  subTableData,
  operationStepNo,
  operationMode,
  ops_is_sizeanalysis,
  submitType,
  isSizeAnalysis,
  isNoNavigate,
  setTableData,
  setFormData
) => {
  let res;
  setIsOverlayLoader(true);
  let MainData = {
    ops_size_analysis: {
      fk_jiid: formData[0].ji_id,
      fk_jisid: OperationTypeID,
      ops_sizeanalysis_json: subTableData,
      ops_is_sizeanalysis: ops_is_sizeanalysis,
      tenant: GetTenantDetails(1),
    },
  };
  if (formData[1]?.ops_sizeanalysis_id) {
    MainData.ops_sizeanalysis_id = formData[1]?.ops_sizeanalysis_id;
    res = await putDataFromApi(opsSizeAnalysisUpdateApi, MainData);
  } else {
    res = await postDataFromApi(opsSizeAnalysisCreateApi, MainData);
  }
  if (res?.data?.status === 200) {
    toast.success(res?.data?.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    if (isSizeAnalysis) {
      navigate(
        getOperationActivityUrl(formData[0]?.operation_type?.operation_type_name) + "confirugation-certificate/" +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "/" +
        encryptDataForURL(OperationTypeID) +
        "/" +
        encryptDataForURL(formData[0]?.["rpc_id"] || -999) +
        "?status=" +
        encryptDataForURL("NonLMS") +
        "&OperationType=" +
        encryptDataForURL(OperationType) + "&operationMode=" + encryptDataForURL(formData[0]?.operation_type?.operation_type_code) + "&isUseForPhysical=" + encryptDataForURL(1)
      );
      return
    }
    if (ops_is_sizeanalysis) {
      OperationCreateDataFunction(
        formData,
        setIsOverlayLoader,
        setIsPopupOpen,
        OperationType,
        OperationTypeID,
        navigate,
        "in-process",
        1,
        null,
        operationStepNo,
        1,
        "",
        operationMode
      );
    }
    else {
      if (!isNoNavigate) {
        OperationCreateDataFunction(
          formData,
          setIsOverlayLoader,
          setIsPopupOpen,
          OperationType,
          OperationTypeID,
          navigate,
          submitType === "post" ? "posted" : "in-process",
          "",
          [],
          "",
          1,
          "",
          operationMode
        );
        const redirectUrl = getOperationActivityUrl(operationMode)
        navigate(
          `${redirectUrl}${encryptDataForURL(
            formData[0].ji_id
          )}`
        );
      }
      else {
        getSingleSizeAnalysisData(OperationTypeID, formData, setTableData, setIsOverlayLoader, setFormData)
      }

      return;
    }

  } else {
    toast.error(res.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  setIsPopupOpen(false);
  setIsOverlayLoader(false);
};
export const getSingleSizeAnalysisData = async (
  OperationTypeID,
  formData,
  setTableData,
  setIsOverlayLoader,
  setFormData
) => {
  try {
    setIsOverlayLoader(true)
    let res = await postDataFromApi(opsSizeAnalysisGetApi, {
      ji_id: formData[1]?.ji_id,
      jis_id: OperationTypeID,
    });
    if (res?.data?.status === 200 && res.data.data) {
      const updatedFormData = { ...formData };
      if (!updatedFormData[1]) {
        updatedFormData[1] = {};
      }
      updatedFormData[1]["ops_sizeanalysis_id"] =
        res.data.data.ops_sizeanalysis_id;
      res.data.data.ops_sizeanalysis_json.map((singleValue, index) => {
        updatedFormData[1]["qty_" + index] = singleValue.qty;
        updatedFormData[1]["size_analysis_" + index] =
          singleValue.size_analysis;
        updatedFormData[1]["unit_" + index] = singleValue.unit;
        updatedFormData[1]["group_no_" + index] = singleValue.group_no;
        updatedFormData[1]["result_" + index] = singleValue.result;
        updatedFormData[1]["pa_sample_mark_" + index] = singleValue.pa_sample_mark;
        updatedFormData[1]["pa_sample_mark_id_" + index] = singleValue.pa_sample_mark_id;
      });
      setFormData(updatedFormData);
      setTableData(res.data.data.ops_sizeanalysis_json);
    }
  } catch (error) {
    console.error(error);
  }
  finally {
    setIsOverlayLoader(false)
  }
};
export const OperationSampleCollectionCreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  subTableData,
  operationStepNo,
  operationMode
) => {
  let res;
  setIsOverlayLoader(true);
  let MainData = {
    jis_id: OperationTypeID,
    ji_scopeofwork: {
      jis_sample_collection: subTableData
    }
  };

  res = await putDataFromApi(getScopeworkUpdateApi, MainData);
  if (res?.data?.status === 200) {
    toast.success(res?.data?.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    OperationCreateDataFunction(
      formData,
      setIsOverlayLoader,
      setIsPopupOpen,
      OperationType,
      OperationTypeID,
      navigate,
      "in-process",
      1,
      null,
      operationStepNo,
      1,
      "",
      operationMode
    );
  } else {
    toast.error(res.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  setIsPopupOpen(false);
  setIsOverlayLoader(false);
};

export const getSingleSampleCollectionData = async (
  OperationTypeID,
  formData,
  setTableData,
  setIsOverlayLoader,
  setFormData
) => {
  try {
    let res = await postDataFromApi(getScopeworkSingleDataApi, {
      jis_id: OperationTypeID,
    });
    if (res?.data?.status === 200 && res.data.data) {
      const updatedFormData = { ...formData };
      if (!updatedFormData[1]) {
        updatedFormData[1] = {};
      }
      res.data.data.jis_sample_collection.map((singleValue, index) => {
        for (let obj in singleValue) {
          updatedFormData[1][obj + '_' + index] = singleValue[obj];
        }
        // updatedFormData[1]["qty_" + index] = singleValue.qty;
        // updatedFormData[1]["size_analysis_" + index] =
        //   singleValue.size_analysis;
        // updatedFormData[1]["unit_" + index] = singleValue.unit;
      });
      setFormData(updatedFormData);
      setTableData(res.data.data.jis_sample_collection);
    }
  } catch (error) {
    console.error(error);
  }
};
export const getSingleHHData = async (
  OperationTypeID,
  formData,
  setTableData,
  setIsOverlayLoader,
  setFormData,
  section
) => {
  try {
    let res = await postDataFromApi(getHHApi, {
      ji_id: formData[1]?.ji_id,
      jis_id: OperationTypeID,
    });
    if (res?.data?.status === 200 && res.data.data) {
      const updatedFormData = { ...formData };
      if (!updatedFormData[1]) {
        updatedFormData[1] = {};
      }
      updatedFormData[1]["ops_sizeanalysis_id"] =
        res.data.data.ops_sizeanalysis_id;
      res.data.data.opsvhh_data.map((singleValue, index) => {
        section.headers.map((singleField) => {
          const fieldName = singleField.name;
          updatedFormData[1][fieldName + "_" + index] = singleValue[fieldName];
        });
      });
      updatedFormData[1]["opsvhh_id"] = res.data.data.opsvhh_id;
      setFormData(updatedFormData);
      setTableData(res.data.data.opsvhh_data);
    }
  } catch (error) {
    console.error(error);
  }
};
export const getSingleDraftSurveyData = async (
  OperationTypeID,
  formData,
  setTableData,
  setIsOverlayLoader,
  setFormData,
  section,
  setIsTabOpened,
  activityJIID
) => {
  const updatedFormData = { ...formData };
  if (!updatedFormData[1]) {
    updatedFormData[1] = {};
  }
  try {
    const defaultValue = '-'
    let res = await postDataFromApi(getDSApi, {
      ji_id: activityJIID ? activityJIID : formData[1]?.ji_id,
      jis_id: OperationTypeID,
    });
    if (res?.data?.status === 200 && res.data.data) {
      // const updatedFormData = { ...formData };
      // if (!updatedFormData[1]) {
      //   updatedFormData[1] = {};
      // }
      section.headers1.map((field, index) => {
        if (index === 0) {
          let inittimeOPSFilter = res.data.data.opsvd_initial.filter((item) => {
            return item.hasOwnProperty("fromdate_time-initial");
          });

          if (inittimeOPSFilter.length > 0) {
            updatedFormData[1]["fromdate_time-initial"] =
              inittimeOPSFilter[0]?.["fromdate_time-initial"] || "";
            updatedFormData[1]["todate_time-initial"] =
              inittimeOPSFilter[0]?.["todate_time-initial"] || "";
            updatedFormData[0]["opsvd_survey_keel_correction"] =
              inittimeOPSFilter[0]?.["opsvd_survey_keel_correction"] || "";
            updatedFormData[1]["ds_keel_correction_value"] =
              inittimeOPSFilter[0]?.["ds_keel_correction_value"] || "";
          }
          let finaltimeOPSFilter = res.data.data.opsvd_final.filter((item) => {
            return item.hasOwnProperty("fromdate_time-final");
          });
          if (finaltimeOPSFilter.length > 0) {
            updatedFormData[1]["fromdate_time-final"] =
              finaltimeOPSFilter[0]?.["fromdate_time-final"] || "";
            updatedFormData[1]["todate_time-final"] =
              finaltimeOPSFilter[0]?.["todate_time-final"] || "";
          }
        }
        let filterdata = res.data.data.opsvd_initial.filter((item) => {
          return item.hasOwnProperty(field.name);
        });
        if (filterdata.length > 0) {
          updatedFormData[1][field.name + "-initial"] =
            filterdata[0]?.[field.name] && filterdata[0]?.[field.name] !== defaultValue ? filterdata[0]?.[field.name] : '';
          updatedFormData[1][field.name + "-unit"] =
            filterdata[0]?.["unit"] || "";
        }
        for (let i = 0; i < res.data.data.opsvd_interim_count; i++) {
          let filterdata2 = res.data.data.opsvd_interim[i].filter((item) => {
            return item.hasOwnProperty(field.name);
          });
          if (filterdata2.length > 0) {
            updatedFormData[1][field.name + "-interim_" + i] =
              filterdata2[0]?.[field.name] && filterdata2[0]?.[field.name] !== defaultValue ? filterdata2[0]?.[field.name] : '';
          }
          let interimfilterdata = res.data.data.opsvd_interim[i].filter((item) => {
            return item.hasOwnProperty("fromdate_time-interim");
          });
          if (interimfilterdata.length > 0) {
            updatedFormData[1]["fromdate_time-interim_" + i] =
              interimfilterdata[0]?.["fromdate_time-interim"] || "";
            updatedFormData[1]["todate_time-interim_" + i] =
              interimfilterdata[0]?.["todate_time-interim"] || "";
          }
        }

        let filterdata3 = res.data.data.opsvd_final.filter((item) => {
          return item.hasOwnProperty(field.name);
        });
        if (filterdata3.length > 0) {
          updatedFormData[1][field.name + "-final"] =
            filterdata3[0]?.[field.name] && filterdata3[0]?.[field.name] !== defaultValue ? filterdata3[0]?.[field.name] : '';
        }
      });
      section.headers2.map((field) => {
        let filterdata = res.data.data.opsvd_initial.filter((item) => {
          return item.hasOwnProperty(field.name);
        });
        if (filterdata.length > 0) {
          updatedFormData[1][field.name + "-initial"] =
            filterdata[0]?.[field.name] && filterdata[0]?.[field.name] !== defaultValue ? filterdata[0]?.[field.name] : '';
          updatedFormData[1][field.name + "-unit"] =
            filterdata[0]?.["unit"] || "";
        }
        for (let i = 0; i < res.data.data.opsvd_interim_count; i++) {
          let filterdata2 = res.data.data.opsvd_interim[i].filter((item) => {
            return item.hasOwnProperty(field.name);
          });
          if (filterdata2.length > 0) {
            updatedFormData[1][field.name + "-interim_" + i] =
              filterdata2[0]?.[field.name] && filterdata2[0]?.[field.name] !== defaultValue ? filterdata2[0]?.[field.name] : '';
          }
        }

        let filterdata3 = res.data.data.opsvd_final.filter((item) => {
          return item.hasOwnProperty(field.name);
        });
        if (filterdata3.length > 0) {
          updatedFormData[1][field.name + "-final"] =
            filterdata3[0]?.[field.name] && filterdata3[0]?.[field.name] !== defaultValue ? filterdata3[0]?.[field.name] : '';
        }
      });
      updatedFormData[1]["opsvd_remarks"] = res.data.data.opsvd_remarks;
      updatedFormData[1]["opsvd_diffdisplacement"] =
        res.data.data.opsvd_diffdisplacement;
      updatedFormData[1]["opsvd_id"] = res.data.data.opsvd_id;
      updatedFormData[1]["opsvd_is_final"] = res.data.data.opsvd_is_final;
      updatedFormData[1]["opsvd_initial_date"] =
        res.data.data.opsvd_initial_date;
      updatedFormData[1]["opsvd_final_date"] = res.data.data.opsvd_final_date;
      updatedFormData[1]["opsvd_interim_count"] =
        res.data.data.opsvd_interim_count;
      updatedFormData[0]["opsvd_survey_at"] =
        res.data.data.opsvd_survey_at;
      updatedFormData[0]["opsvd_survey_at_sow"] =
        res.data.data.opsvd_survey_at_sow;
      if (updatedFormData[0]["opsvd_survey_keel_correction"]) {
        updatedFormData[1]["opsvd_changeonshipaccount"] =
        res.data.data.opsvd_changeonshipaccount;
        updatedFormData[1]["opsvd_qtydischargedorloaded"] =
        res.data.data.opsvd_qtydischargedorloaded;
        updatedFormData[1]["opsvd_roundoffqty"] =
        res.data.data.opsvd_roundoffqty;
      }

      setIsTabOpened(true)
    }

  } catch (error) {
    setIsTabOpened(false)
    console.error(error);
  }
  finally {
  }
};

export const getSingleSupervissionData = async (
  OperationTypeID,
  formData,
  setTableData,
  setIsOverlayLoader,
  setFormData,
  section,
  tableData,
  activityJIID
) => {
  const updatedFormData = { ...formData };
  if (!updatedFormData[1]) {
    updatedFormData[1] = {};
  }
  try {
    setIsOverlayLoader(true)
    let res = await postDataFromApi(getSVApi, {
      ji_id: activityJIID ? activityJIID : formData[1]?.ji_id,
      jis_id: OperationTypeID,
    });
    if (res?.data?.status === 200 && res.data.data) {

      res.data.data.opsvsv_stowageplan.map((singleValue, index) => {
        section[0].headers.map((field) => {
          updatedFormData[1][field.name + "_" + index] =
            singleValue[field.name];
        });
      });
      res.data.data.opsvsv_vesselinfo.map((singleValue, index) => {
        section[1].fields.map((field) => {
          updatedFormData[1][field.name + "_" + index] =
            singleValue[field.name];
          updatedFormData[1][field.name + "_remark" + "_" + index] =
            singleValue[field.name + "_remark"];
        });
      });

      res.data.data.opsvsv_otherdetails.map((singleValue, index) => {
        section[2].fields.map((field) => {
          updatedFormData[1][field.name] = singleValue?.[field.name];
        });
      });
      res.data.data.loading_details = res.data.data?.opsvsv_barge_details?.loading_details || []
      res.data.data.unloading_details = res.data.data?.opsvsv_barge_details?.unloading_details || []
      const cleanFieldName = (name) => name.replace("barge_detail_loading_", "barge_detail_").replace("barge_detail_unloading_", "barge_detail_");

      res.data.data.loading_details.map((singleValue, index) => {
        section[5].headers.map((field) => {
          updatedFormData[1][field.name + "_" + index] = singleValue?.[cleanFieldName(field.name)];
        })
      });
      res.data.data.unloading_details.map((singleValue, index) => {
        section[6].headers.map((field) => {
          updatedFormData[1][field.name + "_" + index] = singleValue?.[cleanFieldName(field.name)];
        })
      });

      res.data.data.opsvsv_storagedetail.map((singleValue, index) => {
        section[3].fields.map((field) => {
          updatedFormData[1][field.name] = singleValue[field.name];
        });
      });
      res.data.data.opsvsv_daily_moisture_and_size?.map((singleValue, index) => {
        section[4].headers.map((field) => {
          updatedFormData[1][field.name + "_" + index] =
            singleValue[field.name];
        });
      });
      res.data.data.opsvsv_dischargedetails.map((singleValue, index) => {
        section[7].headers.map((field) => {
          updatedFormData[1][field.name + "_" + index] =
            singleValue[field.name];
        });
      });

      updatedFormData[1]["opsvsv_vesselInfoCount"] =
        res.data.data.opsvsv_vesselinfo.length;
      updatedFormData[1]["ops_status"] = res.data.data.status;

      updatedFormData[1]["opsvsv_id"] = res.data.data.opsvsv_id;

      let tableData = [];
      tableData.push(res.data.data.opsvsv_stowageplan, res.data.data.opsvsv_daily_moisture_and_size, res.data.data.opsvsv_dischargedetails, res.data.data.loading_details, res.data.data.unloading_details);
      setTableData(tableData);
    }
  } catch (error) {
    console.log('----', error);
  }
  finally {
    setFormData(updatedFormData);
    setTimeout(() => {
      setIsOverlayLoader(false)
    }, 1000)

  }
};

export const getOPS3StepCheckLabWiseParameters = async (group_id, commodity_id, lab_id, rowIndex, parameterDataTable, setParameterDataTable, beforeLabWiseparameterDataTable, operationStepNo) => {
  let newbeforeLabWiseparameterDataTable = JSON.parse(JSON.stringify(beforeLabWiseparameterDataTable));
  let newparameterDataTable = JSON.parse(JSON.stringify(parameterDataTable));
  if (lab_id === "otherTpi") {
    newparameterDataTable[rowIndex].groupJsonParameter = newbeforeLabWiseparameterDataTable[rowIndex].groupJsonParameter
    setParameterDataTable(newparameterDataTable)
    return true;
  }

  try {
    let tempBody = {
      group_id: group_id,
      commodity_id
    };
    if (operationStepNo != 1) {
      tempBody.lab_id = lab_id
    }
    let res;
    res = await postDataFromApi(labGroupsStdBasisApi, tempBody);
    if (res.data && res.data.status == 200) {
      const responseData = res.data.data.parameters
      const newParameters = []

      newbeforeLabWiseparameterDataTable[rowIndex].groupJsonParameter.map((singlePara) => {
        responseData.map((resSingleParam) => {
          if (singlePara.param_id === resSingleParam.param_id) {
            singlePara.standards.map((singleStd) => {
              let isExistsData = resSingleParam.standard.find((ressingleStd) => {
                return ressingleStd.std_id == singleStd.std_id
              })
              if (isExistsData) {
                newParameters.push(singlePara)
              }
            })
          }
        })
      })
      newparameterDataTable[rowIndex].groupJsonParameter = newParameters
      setParameterDataTable(newparameterDataTable)
    }
  } catch (error) {
  }
};


export const OperationCargoSupervisionCreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  subTableData,
  operationMode,
  submitType,
) => {

  let res;
  setIsOverlayLoader(true);
  let truck_cargo_supervision = {
    "tr_cs_no_of_trs": formData[1].tr_cs_no_of_trs,
    "tr_cs_total_qty": formData[1].tr_cs_total_qty,
    "tr_cs_json_data": subTableData,
    "fk_jiid": formData[0].ji_id,
    "fk_jisid": OperationTypeID,
    tenant: GetTenantDetails(1),
  }

  if (res?.data?.status === 200) {
    toast.success(res?.data?.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setIsOverlayLoader(false);
    setIsPopupOpen(false);
    OperationCreateDataFunction(
      formData,
      setIsOverlayLoader,
      setIsPopupOpen,
      OperationType,
      OperationTypeID,
      navigate,
      submitType === "post" ? "posted" : "in-process",
      "",
      [],
      "",
      1,
      "",
      operationMode
    );
    const redirectUrl = getOperationActivityUrl(operationMode)
    navigate(
      redirectUrl + `${encryptDataForURL(
        formData[0].ji_id
      )}`
    );
    return;
  } else {
    toast.error(res.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  setIsPopupOpen(false);
  setIsOverlayLoader(false);

};


export const Operation_BulkCargo_CreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  submitType,
  operationMode
) => {
  try {
    let res;
    setIsOverlayLoader(true);
    let MainData = {
      fk_jiid: formData[0].ji_id,
      fk_jisid: OperationTypeID,
      bulk_cargo: {
        bulk_crg_dos: formData[1]?.bulk_crg_dos,
        bulk_crg_angle_of_purpose: formData[1]?.bulk_crg_angle_of_purpose,
        bulk_crg_stowage_factor: formData[1]?.bulk_crg_stowage_factor,
        bulk_crg_bulk_density: formData[1]?.bulk_crg_bulk_density,
        bulk_crg_smpl: formData[1]?.bulk_crg_smpl,
        fk_jisid: OperationTypeID,
        fk_jiid: formData[0]?.ji_id,
        status: submitType === "post" ? "posted" : "in-process",
        tenant: GetTenantDetails(1)
      }
    }
    

  }
  catch (ex) {
    // console.log('ex', ex)
  }
  finally {
    setIsOverlayLoader(false);
  }
};

export const getAllSampleMarkListDataForDD = async (ji_id, jis_id, setIsOverlayLoader, setMasterResponse) => {
  try {
    const bodyData = {
      ji_id: ji_id,
      jis_id: jis_id,
    };
    let res = await postDataFromApi(TMLDatagetAllApi, bodyData);
    if (res?.data?.status === 200 && res.data.data) {
      const clientData = res.data.data.map((value, index) => ({
        id: value?.jism_id,
        name: value?.jism_marknumber,
      }));
      const bodyToPass = {
        model: "pa_sample_mark_id",
        data: clientData,
      };
      setMasterResponse((prev) => [...prev, bodyToPass]);
    }

  }
  catch (ex) {

  }
  finally {

  }
}

export const handleExportSampleMakrList = async (OperationType, OperationTypeID, setIsOverlayLoader) => {
  try {
    setIsOverlayLoader(true);
    let endPoint = "";
    let res = await postDataFromApi(endPoint, "", "", 1);
    if (res?.status === 200) {
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      let excelFileName = '_' + getFormatedDate(new Date(), 1) + ".xlsx";
      excelFileName = 'sample_marklist_' + getFormatedDate(new Date(), 1) + ".xlsx";
      saveAs(blob, excelFileName);
      setIsOverlayLoader(false);
    } else {
      toast.error(res.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  finally {
    setIsOverlayLoader(false)
  }
};