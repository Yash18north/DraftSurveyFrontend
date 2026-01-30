import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteDataFromApi,
  postDataFromApi,
  putDataFromApi,
} from "../../services/commonServices";
import {
  getActivityCode,
  getFormatedDate,
  getLMSOperationActivity,
  getOperationActivityListPageUrl,
  getOperationActivityUrl,
  getPurchaseManager,
  getRakeCollectionActivity,
  getRakeOperations,
  getSampleCollectionActivity,
  getStackOperations,
  getVesselOperation,
  isModuelePermission,
} from "../../services/commonFunction";
import { useDispatch, useSelector } from "react-redux";
import DeleteConfirmation from "./DeleteConfirmation";
import {
  InternalCertificateDeleteApi,
  JRFDeleteApi,
  JRFPDFDownloadApi,
  SFMDeleteApi,
  allotmentDeleteApi,
  sampleInwardDetailsDeleteAPI,
  sampleverificationDeleteApi,
  testMemoDeleteApi,
  InvoiceDeleteApi,
  folderCreateApi,
  InternalCertificateGetPDFApi,
  masterUploadApi
} from "../../services/api";
import { historyData } from "../../actions/authActions";
import PropTypes from "prop-types";
import { encryptDataForURL, decryptDataForURL } from "../../utills/useCryptoUtils";
import { handleJobInstructionDelete } from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import { getNonLMSDetailsById } from "./commonHandlerFunction/OPscertificate/OPSCertificateHandlerFunctions";
import { handleVesselOperationDelete, handleDocumentDelete, handleCommercialCertDelete } from "./commonHandlerFunction/CommercialCertificateHandlerFunctions";
import { handleConsortiumDelete } from "./commonHandlerFunction/operations/consortiumHandlerFunctions";
import { handleConsortiumDelete as stubHandleConsortiumDelete } from "../../utils/stubFunctions";
import { useTranslation } from "react-i18next";
import { handleSupplierDelete } from "./commonHandlerFunction/Purchase/Supplier/SupplierHandler";
import { handleSupplierDelete as stubHandleSupplierDelete } from "../../utils/stubFunctions";
import { handleDownloadPR, handlePurchaseReqDelete } from "./commonHandlerFunction/Purchase/PurchaseReq/PurchaseRequsitionHandler";
import { handleDownloadPR as stubHandleDownloadPR, handlePurchaseReqDelete as stubHandlePurchaseReqDelete } from "../../utils/stubFunctions";
import { handleCalibrationDelete } from "./commonHandlerFunction/Purchase/Calibration/CalibrationHandler";
import { handleCalibrationDelete as stubHandleCalibrationDelete } from "../../utils/stubFunctions";
import { handleDownloadPO, handlePurchaseOrderDelete } from "./commonHandlerFunction/Purchase/PurchaseOrder/PurchaseOrderHandler";
import { handleDownloadPO as stubHandleDownloadPO2, handlePurchaseOrderDelete as stubHandlePurchaseOrderDelete } from "../../utils/stubFunctions";
import { handleTenderDelete } from "./commonHandlerFunction/Tender/TenderHandlerFunc";
import { handleTenderDelete as stubHandleTenderDelete } from "../../utils/stubFunctions";
import { handleChemicalStocksDelete } from "./commonHandlerFunction/ChemicalStocks/ChemicalstockHandler";
import { handleChemicalStocksDelete as stubHandleChemicalStocksDelete } from "../../utils/stubFunctions";
import { handleIncentiveDelete } from "./commonHandlerFunction/Feedback/IncentiveHandler";
import { handleIncentiveDelete as stubHandleIncentiveDelete } from "../../utils/stubFunctions";
import { handleCreateDebitFromList } from "./commonHandlerFunction/InvoiceHandlerFunctions";
import { handleCreateDebitFromList as stubHandleCreateDebitFromList } from "../../utils/stubFunctions";
import { handlePurchaseItemDelete } from "./commonHandlerFunction/Purchase/Items/ItemsHandler";
import { handlePurchaseItemDelete as stubHandlePurchaseItemDelete } from "../../utils/stubFunctions";
import { handleCategoryDelete, handleCategorykDelete } from "./commonHandlerFunction/Purchase/Category/CategoryHandler";
import { handleCategoryDelete as stubHandleCategoryDelete } from "../../utils/stubFunctions";
import { handleIShipmentRecordDelete } from "./commonHandlerFunction/Shipment/ShipmentHandler";



const PopupOptions = ({
  popupActions,
  setPopupIndex,
  id,
  row,
  section,
  getAllListingData,
  setFormData,
  formConfig,
  type,
  sampleInwardFormId,
  model,
  isBottom,
  status,
  setDontClick,
  from,
  setPopupType,
  operationMode,
  formData,
  setIsOverlayLoader,

}) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const translate = t;
  let user;
  const session = useSelector((state) => state.session);
  user = session?.user;
  console.log("roeship",row)
  let rolePermissions;
  rolePermissions = session?.user?.permissions;
 
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  let OperationType = decryptDataForURL(params.get("OperationType"));
  OperationType = getActivityCode(OperationType)
  OperationType = OperationType && OperationType.toLowerCase() != "othertpi" ? OperationType.toLowerCase() : OperationType

  const [actions, setActions] = useState(popupActions);
  const [isDelete, setIsDelete] = useState(false);
  const [actionType, setActionType] = useState(false);
  const moduleType = formConfig?.listView?.moduleType;
  const subModuleType = formConfig?.listView?.subModuleType;
  const uploadExtraModules = ['tenderDocumentList', 'purchaseorderDocumentList', 'purchasereqDocumentList', 'jrfDocumentList', 'itemDocumentList']

  const handleClick = async (value, actionType = "") => {
    setActionType(value);
    setDontClick(true);
    if (value.toLowerCase() === "rake details") {
      if (getLMSOperationActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
        navigate(
          getOperationActivityUrl(operationMode) +
          encryptDataForURL(row["fk_jiid"]) +
          "/" +
          encryptDataForURL(row["activity_master"]["activity_code"]) +
          "?OperationType=" +
          encryptDataForURL(row["activity_master"]["activity_code"]) +
          "&operationId=" +
          encryptDataForURL(row["jis_id"]) +
          "&operationStepNo=" +
          encryptDataForURL(7) +
          "&action=" +
          encryptDataForURL("opsView") + "&operationMode=" + encryptDataForURL(operationMode) + "&isRakeDetails=" + encryptDataForURL(1)
        );
      }
      else {
        navigate(
          section.redirectUrl +
          encryptDataForURL(formData[0]?.["ji_id"]) +
          "/" +
          encryptDataForURL(row["activity_master"]["activity_code"]) +
          "?OperationType=" +
          encryptDataForURL(row["activity_master"]["activity_code"]) +
          "&operationId=" +
          encryptDataForURL(row["jis_id"]) +
          "&operationStepNo=" +
          encryptDataForURL(2) + "&operationMode=" + encryptDataForURL(formData[0]?.operation_type?.operation_type_code) + "&isRakeDetails=" + encryptDataForURL(1)
        );
      }
      return
    }

    if (moduleType === "sampleinward") {
      if (actionType === "View") {
        navigate(
          `/inwardList/inwardForm?status=${encryptDataForURL(
            value
          )}&id=${encryptDataForURL(id)}&sampleInwardId=${encryptDataForURL(
            sampleInwardFormId
          )}&action=${encryptDataForURL("View")}`
        );
      } else if (value === "History") {
        const historyDetails = {
          recordNo: "Inward No " + row.smpl_inward_number,
          model: model,
          redirect: "/inwardList",
          Breadcrumb: "Sample Inward List",
        };
        dispatch(historyData(historyDetails));
        navigate(
          `/module-history?status=${encryptDataForURL(
            value
          )}&id=${encryptDataForURL(row["smpl_inwrd_id"])}`
        );

        setPopupIndex(-1);
      } else if (value === "assignmentview") {
        navigate(
          "/inwardList/groupAssignmentPreview?status=" +
          encryptDataForURL("assignment") +
          "&sampleInwardId=" +
          encryptDataForURL(sampleInwardFormId) +
          "&id=" +
          encryptDataForURL(id)
        );
      } else if (value === "Delete") {
        setIsDelete(true);
      } else {
        navigate(
          `/inwardList/inwardForm?status=${encryptDataForURL(
            value
          )}&id=${encryptDataForURL(id)}&sampleInwardId=${encryptDataForURL(
            sampleInwardFormId
          )}&action=${encryptDataForURL("Edit")}`
        );
      }
    } else if (moduleType === "testmemomain") {
      if (value === "Delete") {
        setIsDelete(true);
      } else if (value === "View") {
        navigate(
          `/testmemoList/testmemo?view=${encryptDataForURL(
            "view"
          )}&status=${encryptDataForURL(
            "testMemo"
          )}&testMemoId=${encryptDataForURL(row["tm_id"])}`
        );
      } else if (value === "History") {
        const historyDetails = {
          recordNo: "Test Memo No " + row.tm_number,
          model: model,
          redirect: "/testmemoList",
          Breadcrumb: "Test Memo List",
        };
        dispatch(historyData(historyDetails));
        navigate(
          `/module-history?status=${encryptDataForURL(
            value
          )}&id=${encryptDataForURL(row["tm_id"])}`
        );

        setPopupIndex(-1);
      } else if (value === "PDF") {
        const historyDetails = {
          recordNo: "Test Memo No " + row.tm_number,
          model: model,
          redirect: "/testmemoList",
          Breadcrumb: "Test Memo List",
        };
        dispatch(historyData(historyDetails));
        const encryptedValue = encryptDataForURL(value);
        const encryptedId = encryptDataForURL(row["tm_id"]);
        navigate(
          `/testmemoList/testmemoPDF?status=${encryptedValue}&id=${encryptedId}`
        );

        setPopupIndex(-1);
      } else {
        navigate(`/testmemoList`);
      }
    } else if (moduleType === "allotment") {
      if (value === "View") {
        navigate(
          `/allotmentList/allotment?view=${encryptDataForURL(
            "view"
          )}&status=${encryptDataForURL(
            "allotment"
          )}&sampleAllotmentId=${encryptDataForURL(row["sa_id"])}`
        );
      } else if (value === "Delete") {
        setIsDelete(true);
      } else if (value === "History") {
        const historyDetails = {
          recordNo: "Allotment No " + row.tm_number,
          model: model,
          redirect: "/allotmentList",
          Breadcrumb: "Allotment List",
        };
        dispatch(historyData(historyDetails));
        navigate(
          `/module-history?status=${encryptDataForURL(
            value
          )}&id=${encryptDataForURL(row["sa_id"])}`
        );

        setPopupIndex(-1);
      } else {
        navigate(`/testmemoList`);
      }
    } else if (moduleType === "sampleverification") {
      if (value === "View") {
        navigate(
          `/verificationList/sampleVerification?view=${encryptDataForURL(
            "view"
          )}&status=${encryptDataForURL(
            "verification"
          )}&sampleVarificationId=${encryptDataForURL(row["sv_id"])}`
        );
      } else if (value === "History") {
        const historyDetails = {
          recordNo: "Verification No " + row.sv_verificationno,
          model: model,
          redirect: "/verificationList",
          Breadcrumb: "Verification List",
        };
        dispatch(historyData(historyDetails));
        navigate(
          `/module-history?status=${encryptDataForURL(
            value
          )}&id=${encryptDataForURL(row["sv_id"])}`
        );

        setPopupIndex(-1);
      } else if (value === "Delete") {
        setIsDelete(true);
      } else {
        navigate(`/testmemoList`);
      }
    } else if (moduleType === "sfm") {
      if (value === "View") {
        navigate(
          `/SFMList/result?view=${encryptDataForURL(
            "view"
          )}&status=${encryptDataForURL("SFMResult")}&sfmid=${encryptDataForURL(
            row["sfm_id"]
          )}`
        );
      } else if (value === "PDF") {
        const historyDetails = {
          recordNo: "SFM No " + row.sfm_msfm_no,
          model: model,
          redirect: "/SFMList",
          Breadcrumb: "SFM List",
        };
        dispatch(historyData(historyDetails));
        const encryptedValue = encryptDataForURL(value);
        const encryptedId = encryptDataForURL(row["sfm_id"]);
        navigate(`/SFMList/SFMPDF?status=${encryptedValue}&id=${encryptedId}`);

        setPopupIndex(-1);
      } else if (value === "History") {
        const historyDetails = {
          recordNo: "SFM No " + row.sfm_msfm_no,
          model: model,
          redirect: "/SFMList",
          Breadcrumb: "SFM List",
        };
        dispatch(historyData(historyDetails));
        navigate(
          `/module-history?status=${encryptDataForURL(
            value
          )}&id=${encryptDataForURL(row["sfm_id"])}`
        );

        setPopupIndex(-1);
      } else if (value === "PDF") {
        const historyDetails = {
          recordNo: "SFM No " + row.sfm_msfm_no,
          model: model,
          redirect: "/SFMList",
          Breadcrumb: "SFM List",
        };
        dispatch(historyData(historyDetails));
        navigate(`/SFMPDF?status=${value}&id=${row["sfm_id"]}`);

        setPopupIndex(-1);
      } else if (value === "Delete") {
        setIsDelete(true);
      } else {
        navigate(`/testmemoList`);
      }
    } else if (moduleType === "internalcertificate") {
      if (value === "View") {
        navigate(
          `/testReport/test-results?view=${encryptDataForURL(
            "view"
          )}&status=${encryptDataForURL(
            "testmemoresult"
          )}&editId=${encryptDataForURL(row["ic_id"])}`
        );
      } else if (value === "History") {
        const historyDetails = {
          recordNo: "ULR No " + row.ic_ulrno,
          model: model,
          redirect: "/testReport",
          Breadcrumb: "Test Report List",
        };
        dispatch(historyData(historyDetails));
        navigate(
          `/module-history?status=${encryptDataForURL(
            value
          )}&id=${encryptDataForURL(row["ic_id"])}`
        );

        setPopupIndex(-1);
      } else if (value === "Edit") {
        navigate(
          `/testReport/test-results?status=${encryptDataForURL(
            "testmemoresult"
          )}&editId=${encryptDataForURL(row["ic_id"])}`
        );
      } else if (value === "Delete") {
        setIsDelete(true);
      } else if (value === "Preview Report") {
        navigate(`/testReport/previewPDF/${encryptDataForURL(row["ic_id"])}` + "?ReferenceNo=" +
          encryptDataForURL(row?.ic_refenence));
        // navigate(`/testReport/preview/${encryptDataForURL(row["ic_id"])}`);
        // handleTestReport(row);
      } else {
        navigate(`/testmemoList`);
      }
    } else if (moduleType === "jrf") {
      if (value === "Delete") {
        setIsDelete(true);
      } else if (value === "Download") {
        navigate(`/jrfListing/jrf-pdf-preview/${encryptDataForURL(id)}`);
        setPopupIndex(-1);
      } else if (value === "History") {
        const historyDetails = {
          recordNo: "JRF No " + row.jrf_no,
          model: model,
          redirect: "/jrfListing",
          Breadcrumb: "JRF List",
        };

        dispatch(historyData(historyDetails));
        navigate(
          `/module-history?status=${encryptDataForURL(
            value
          )}&id=${encryptDataForURL(id)}`
        );

        setPopupIndex(-1);
      }
      else if (value === "Documents") {
        navigate(
          "/jrfListing/jrf-document-list/" +
          encryptDataForURL(id)
        );
      }
      else if (value === "Reject") {
        let redirectUrl = !row["jrf_is_ops"] ? "/jrfListing/inwardForm-checklist" : "/jrfListing/operation-inwardForm-checklist"
        navigate(
          redirectUrl + "?status=" +
          encryptDataForURL("checklist") +
          "&id=" +
          encryptDataForURL(id)
        );
      }
      else {
        if (row.jrf_is_external) {
          navigate(
            `/jrfListing/external-jrf?status=${encryptDataForURL(
              value
            )}&id=${encryptDataForURL(id)}`
          );
        } else if (row.jrf_is_ops) {
          navigate(
            `/jrfListing/operation-jrf?status=${encryptDataForURL(
              value
            )}&id=${encryptDataForURL(id)}`
          );
        } else {
          navigate(
            `/jrfListing/jrf?status=${encryptDataForURL(
              value
            )}&id=${encryptDataForURL(id)}`
          );
        }
        setPopupIndex(-1);
      }
    } else if (
      moduleType === "jobinstruction" ||
      moduleType === "jioperationjsonb" || moduleType === "invoice"
    ) {

      if (subModuleType === "invoice") {
        if (["Edit", "View"].includes(value)) {
          navigate(
            `/operation/invoice-listing/create-invoice/${encryptDataForURL(
              row["im_id"]
            )}` + "?status=" +
            encryptDataForURL(value)
          );
          setPopupIndex(-1);
        }
        else if (["Delete"].includes(value)) {
          handleInvoiceDelete();
          setPopupIndex(-1);
        }
        else if (["Create Debit"].includes(value)) {
          // navigate(
          //   `/operation/invoice-listing/invoice-preview/${encryptDataForURL(
          //     row["im_id"]
          //   )}/${encryptDataForURL(
          //     row["im_invoiceurl"]
          //   )}/${encryptDataForURL(
          //     row["im_invoicenumber"]
          //   )}`
          // );
          handleCreateDebitFromList(row, formConfig, setIsOverlayLoader, navigate)
        }
        else if (["Edit Debit"].includes(value)) {
          navigate(
            `/operation/invoice-listing/create-debit/${encryptDataForURL(
              row["im_id"]
            )}` + "?status=" +
            encryptDataForURL("Edit")
          );
        }
        else if (["Courier Details"].includes(value)) {
          navigate(
            `/operation/invoice-listing/create-invoice/${encryptDataForURL(
              row["im_id"]
            )}` + "?status=" +
            encryptDataForURL("Edit") + "&isCourier=" +
            encryptDataForURL(true)
          );
        }
      }

      else {
        if (from === "subListTable") {
          if (['configurationList', 'commercialCertificate'].includes(subModuleType)) {
            if (value === "View" && subModuleType === 'configurationList') {
              navigate(
                "/operation/operation-certificate/" +
                encryptDataForURL(row?.fk_jiid) +
                "/" +
                encryptDataForURL(row?.fk_jisid) +
                "?status=" +
                encryptDataForURL(row?.status) +
                "&RPCID=" +
                encryptDataForURL(row?.rpc_id) +
                "&OperationType=" +
                encryptDataForURL(OperationType) + "&opsCertiView=" +
                encryptDataForURL('view') + "&operationMode=" + encryptDataForURL(operationMode)
              );
            }
            else if (value.toLowerCase() === "delete") {
              setIsDelete(true);
              return
            }
            else if (
              !getLMSOperationActivity().includes(getActivityCode(row?.activity_master?.activity_code || row.activity_code).toLowerCase()) && ![getVesselOperation("bulk_crg"), getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(getActivityCode(row?.activity_master?.activity_code || row.activity_code).toLowerCase())
            ) {
              if (row.cc_is_external) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(row?.fk_jisid)}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}` +
                  "&OperationType=" +
                  encryptDataForURL(row?.activity_code) + "&isExternal=" + encryptDataForURL(1)
                );
                return
              }
              else if (row?.cc_is_physical) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                    row?.fk_jiid
                  )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}` + "&isUseForPhysical=" +
                  encryptDataForURL(1)
                );
                return
              }
              let payload = {
                ji_id: row?.fk_jiid,
                jis_id: row?.fk_jisid,
                tenant: 1,
              };
              // let OPSDSRes = await postDataFromApi(
              //   "/ops-vessel-ds/get/",
              //   payload
              // );
              let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
              if (OPSDSRes.status === 200) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                    OPSDSRes?.data?.data?.opsvd_id
                  )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}`
                );
              }
            } else {
              if (row.cc_is_external) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(row?.fk_jisid)}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}` +
                  "&OperationType=" +
                  encryptDataForURL(row?.activity_code) + "&isExternal=" + encryptDataForURL(1)
                );
                return
              }
              else if (row?.cc_is_physical) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                    row?.fk_jiid
                  )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}` + "&isUseForPhysical=" +
                  encryptDataForURL(1)
                );
                return
              }
              navigate(
                `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                  row?.fk_jiid
                )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                  "View"
                )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}` + `&activityJIID=${encryptDataForURL(row.fk_jisid)}`
              );
            }
          } else {
            if (
              getLMSOperationActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())
            ) {
              let opsNo = 2
              if (getRakeCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
                opsNo = 7
              }
              else if (getSampleCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
                opsNo = 6
              }
              navigate(
                getOperationActivityUrl(operationMode) +
                encryptDataForURL(row["fk_jiid"]) +
                "/" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "?OperationType=" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&operationStepNo=" +
                encryptDataForURL(opsNo) +
                "&action=" +
                encryptDataForURL("opsView") + "&operationMode=" + encryptDataForURL(operationMode)
              );
            } else if (moduleType === "vesselOperation" && formConfig?.listView?.subModuleType === 'configurationList') {
              navigate(
                "/operation/vessel-ji-list/vessel-list/" +
                encryptDataForURL(row["fk_jiid"]) +
                "/" +
                encryptDataForURL(OperationType) +
                "?OperationType=" +
                encryptDataForURL(OperationType) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&useFor=" +
                encryptDataForURL("viewOnly") +
                "&action=" +
                encryptDataForURL("View")
              );
            } else {
              navigate(
                getOperationActivityUrl(operationMode) +
                encryptDataForURL(formData[0]?.ji_id) +
                "/" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "?OperationType=" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&useFor=" +
                encryptDataForURL("viewOnly") +
                "&action=" +
                encryptDataForURL("View") + "&activityJIID=" + encryptDataForURL(row["fk_jiid"])
              );
            }
          }
          setPopupIndex(-1);
        }
        if (value === "Delete") {
          setIsDelete(true);
          return
        }
        if (subModuleType == "commercialCertificate" && value === "View") {

        }
        else if (value === "History") {
          const historyDetails = {
            recordNo: "Job Instruction No " + row.ji_reference_number,
            model: model,
            redirect: "/operation/jrfInstructionListing",
            Breadcrumb: "Draught Survey List",
          };

          dispatch(historyData(historyDetails));
          navigate(
            `/module-history?status=${encryptDataForURL(
              value
            )}&id=${encryptDataForURL(row["ji_id"])}`
          );

          setPopupIndex(-1);
        } else if (value === "Documents") {
          navigate(
            "/operation/JI-commercial-certificate-list/" +
            encryptDataForURL(row.ji_id)
          );
        } else if (value === "Edit") {
          // localStorage.setItem('isMainScopeWork','');
          dispatch({
            type: "MAIN_SCOPE_WORK",
            isMainScopeWork: ""
          });
          navigate(
            `/operation/jrfInstructionListing/job-instruction/${encryptDataForURL(
              row["ji_id"]
            )}`
          );
          setPopupIndex(-1);
        } else if (value === "Man Power") {
          navigate(
            `/operation/jrfInstructionListing/job-instruction/man-power/${encryptDataForURL(
              row["ji_id"]
            )}`
          );
        } else {
          if (['CP', 'BH'].includes(user?.role)) {
            let redirectUrl = getOperationActivityUrl(row["operation_type"]['operation_type_name'])
            navigate(
              redirectUrl +
              encryptDataForURL(row["ji_id"]) +
              "?action=" +
              encryptDataForURL("View")
            );
          }
          else {
            let redirecturl = getOperationActivityListPageUrl(row["operation_type"]['operation_type_name'])
            redirecturl = redirecturl.replace(/\/([^\/]*)$/, "-$1");
            navigate(
              `${redirecturl}view/${encryptDataForURL(
                row["ji_id"]
              )}?action=${encryptDataForURL("View")}&useFor=${encryptDataForURL(
                "viewOnly"
              )}&isFullDetails=${encryptDataForURL(1)}`
            );
            setPopupIndex(-1);
          }
        }
      }
    } else if (['truckOperation', 'vesselOperation'].includes(moduleType)) {

      if (value === "Delete") {
        setIsDelete(true);
      }
      else if (value === "Man Power") {
        navigate(
          `/operation/jrfInstructionListing/job-instruction/man-power/${encryptDataForURL(
            row["fk_jiid"]
          )}/${encryptDataForURL(
            row["fk_activitymasterid"]
          )}?activityName=${encryptDataForURL(row?.activity_master?.activity_name)}&operationMode=${encryptDataForURL(operationMode)}`
        );
      }
      else {
        if (from === "subListTable") {
          if (['configurationList', 'commercialCertificate'].includes(subModuleType)) {
            if (value === "View" && subModuleType === 'configurationList') {
              navigate(
                "/operation/operation-certificate/" +
                encryptDataForURL(row?.fk_jiid) +
                "/" +
                encryptDataForURL(row?.fk_jisid) +
                "?status=" +
                encryptDataForURL(row?.status) +
                "&RPCID=" +
                encryptDataForURL(row?.rpc_id) +
                "&OperationType=" +
                encryptDataForURL(OperationType) + "&opsCertiView=" +
                encryptDataForURL('view') + "&operationMode=" + encryptDataForURL(operationMode)
              );
            }
            else if (
              !getLMSOperationActivity().includes(getActivityCode(row?.activity_master?.activity_code || row.activity_code).toLowerCase()) && ![getVesselOperation("bulk_crg"), getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(getActivityCode(row?.activity_master?.activity_code || row.activity_code).toLowerCase())
            ) {
              let payload = {
                ji_id: row?.fk_jiid,
                jis_id: row?.fk_jisid,
                tenant: 1,
              };
              // let OPSDSRes = await postDataFromApi(
              //   "/ops-vessel-ds/get/",
              //   payload
              // );
              let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
              if (OPSDSRes.status === 200) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                    OPSDSRes?.data?.data?.opsvd_id
                  )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}`
                );
              }
            } else {
              navigate(
                `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                  row?.fk_jiid
                )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                  "View"
                )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}`
              );
            }
          } else {
            if (
              getLMSOperationActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())
            ) {
              let opsNo = 2
              if (getRakeCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
                opsNo = 7
              }
              else if (getSampleCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
                opsNo = 6
              }
              navigate(
                getOperationActivityUrl(operationMode) +
                encryptDataForURL(row["fk_jiid"]) +
                "/" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "?OperationType=" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&operationStepNo=" +
                encryptDataForURL(opsNo) +
                "&action=" +
                encryptDataForURL("opsView") + "&operationMode=" + encryptDataForURL(operationMode)
              );
            } else if (moduleType === "vesselOperation" && formConfig?.listView?.subModuleType === 'configurationList') {
              navigate(
                "/operation/vessel-ji-list/vessel-list/" +
                encryptDataForURL(row["fk_jiid"]) +
                "/" +
                encryptDataForURL(OperationType) +
                "?OperationType=" +
                encryptDataForURL(OperationType) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&useFor=" +
                encryptDataForURL("viewOnly") +
                "&action=" +
                encryptDataForURL("View")
              );
            } else {
              navigate(
                getOperationActivityUrl(operationMode) +
                encryptDataForURL(formData[0]?.ji_id) +
                "/" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "?OperationType=" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&useFor=" +
                encryptDataForURL("viewOnly") +
                "&action=" +
                encryptDataForURL("View") +
                "&operationMode=" +
                encryptDataForURL(operationMode) + "&activityJIID=" + encryptDataForURL(row["fk_jiid"])
              );
            }
          }
          setPopupIndex(-1);
        }
      }
    } else if (['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType)) {
      if (value === "Delete") {
        setIsDelete(true);
      } else {
        setPopupType(value);
      }
    }
    else if (moduleType === "TPIMain") {
      navigate(
        `/operation/vessel-ji-list/other-tpi/${encryptDataForURL(
          row["fk_jiid"]
        )}/${encryptDataForURL("otherTPI")}/${encryptDataForURL(
          row["fk_jis_id"]
        )}/${encryptDataForURL(
          row["tpi_id"]
        )}?OperationType=${encryptDataForURL(
          row["activity_code"]
        )}&operationId=${encryptDataForURL(
          row["fk_jis_id"]
        )}&action=${encryptDataForURL('View')}`
      );
    }
    else if (moduleType === "consortiumorder") {
      if (value === "Delete") {
        setIsDelete(true);
      }
      else if (value === "Edit") {
        navigate(
          `/operation/consortiums-list/consortium/${encryptDataForURL(
            row["co_id"]
          )}`
        );
        setPopupIndex(-1);
      }
      else {
        navigate(
          `/operation/consortiums-list/consortium/${encryptDataForURL(
            row["co_id"]
          )}?action=${encryptDataForURL('View')}`
        );
      }
    }
    else if (moduleType === "purchaseReq") {

      if (value === "View") {
        navigate(`/PurchRequistion/PurchaseRequistionForm/${encryptDataForURL(row["req_no"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "History") {
        const historyDetails = {
          "object_id": `${row["id"]}`,
          model: model,
          redirect: "/PurchRequistion",
          Breadcrumb: "Purchase Requistion List",
        };
        dispatch(historyData(historyDetails));
        navigate(`/module-history?status=${encryptDataForURL('History')}/${encryptDataForURL(row["id"])}`);
      }
      else if (value === "Download") {
        handleDownloadPR(row["req_id"])
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
      else if (value = "Documents") {
        navigate("/PurchRequistion/purchreqDocumentlist/" +
          encryptDataForURL(row["req_id"]) + '?fd_name=' + encryptDataForURL(row["req_no"]))
      }
    }
    else if (moduleType === "purchase") {
      if (value === "View") {
        navigate(`/purchase/purchaseForm/${encryptDataForURL(row["po_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Download") {
        handleDownloadPO(row["po_id"], row["po_number"])
      }
      else if (value === "History") {
        const historyDetails = {
          "object_id": `${row["id"]}`,
          model: model,
          redirect: "/purchase",
          Breadcrumb: "Purchase Order List",
        };
        dispatch(historyData(historyDetails));
        navigate(`/module-history?status=${encryptDataForURL('History')}/${encryptDataForURL(row["id"])}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
      else if (value === "Documents") {
        navigate(
          "/purchaseorderList/purchaseorder-document-list/" +
          encryptDataForURL(row.po_id) + '?fd_name=' + encryptDataForURL(row["po_number"])
        );
      }
      else if (value === "Insurance Details") {
        navigate(`/purchase/purchaseForm/${encryptDataForURL(row["po_id"])}?status=${encryptDataForURL('View')}` + "&isInsurance=" +
          encryptDataForURL(true));
      }
    }
    else if (moduleType === "calibration") {
      if (value === "View") {
        navigate(`/calibrationList/calibrationForm/${encryptDataForURL(row["calib_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "History") {
        const historyDetails = {
          "object_id": `${row["id"]}`,
          model: model,
          redirect: "/calibrationList",
          Breadcrumb: "Calibration List",
        };
        dispatch(historyData(historyDetails));
        navigate(`/module-history?status=${encryptDataForURL('History')}/${encryptDataForURL(row["id"])}`);
      }
      else if (value === "Edit") {
        navigate(`/calibrationList/calibrationForm/${encryptDataForURL(row["calib_id"])}?status=${encryptDataForURL('Edit')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "supplier") {
      if (value === "View") {
        navigate(`/supplierList/supplierForm/${encryptDataForURL(row["sup_id"])}?status=${encryptDataForURL('View')}`);
      }

      else if (value === "Delete") {

        setIsDelete(true)
      }
      else if (value === "History") {
        const historyDetails = {
          "object_id": `${row["sup_id"]}`,
          model: model,
          redirect: "/supplierList",
          Breadcrumb: "Supplier List",
        };
        dispatch(historyData(historyDetails));
        navigate(`/module-history?status=${encryptDataForURL('History')}/${encryptDataForURL(row["id"])}`);
      }
    }
    else if (moduleType === "tender") {
      if (value === "View") {
        navigate(`/tenderList/tenderForm/${encryptDataForURL(row["tender_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/tenderList/tenderForm/${encryptDataForURL(row["tender_id"])}?status=${encryptDataForURL('Change')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
      else if (value === "Documents") {
        navigate(
          "/tenderList/tender-document-list/" +
          encryptDataForURL(row.tender_id)
        );
      }

    }
    else if (moduleType === "stocks") {
      if (value === "View") {
        navigate(`/chemicalStocks/chemicalStocksForm/${encryptDataForURL(row["chemist_stock_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "incentives") {
      if (value === "View") {
        navigate(`/incentivesList/incentivesForm/${encryptDataForURL(row["incentive_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "purchaseItems") {
      if (value === "View") {
        navigate(`/itemlist/item/${encryptDataForURL(row["item_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/itemlist/item/${encryptDataForURL(row["item_id"])}?action=${encryptDataForURL('Change')}`);
      }
      else if (value === "Documents") {
        navigate(`/itemlist/item-document-list/${encryptDataForURL(row["item_id"])}` + '?fd_name=' + encryptDataForURL(row["item_id"]));
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "category") {

      if (value === "View") {
        navigate(`/categorylist/categoryForm/${encryptDataForURL(row["category_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/categorylist/categoryForm/${encryptDataForURL(row["category_id"])}?action=${encryptDataForURL('Change')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "ShipmentList") {

      if (value === "View") {
        
        navigate(`/shipment/shipmentForm/${encryptDataForURL(row["ship_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/shipment/shipmentForm/${encryptDataForURL(row["ship_id"])}?action=${encryptDataForURL('Change')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "marketPlaceListing") {

      if (value === "View") {
        
        navigate(`/market/marketForm/${encryptDataForURL(row["id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/market/marketForm/${encryptDataForURL(row["id"])}?action=${encryptDataForURL('Change')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "userMaster") {
      if (value === "View") {
        navigate(`/users/user-form/${encryptDataForURL(row["usr_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/users/user-form/${encryptDataForURL(row["usr_id"])}?action=${encryptDataForURL('Change')}`);
      }
    }
    else if (moduleType === "feedback") {
      if (value === "View") {
        navigate(`/feedbackListList/feedbackListForm/${encryptDataForURL(row["feedback_id"])}?status=${encryptDataForURL('View')}`);
      }
    }
    if (moduleType === "ClientDetails") {
      navigate(
        `/collections/client-list/${encryptDataForURL(
          row["cust_id"]
        )}` + "?action=" +
        encryptDataForURL(value)
      );
      setPopupIndex(-1);
    }
  };



  const handleDeleteData = async () => {

    if (moduleType === "sampleinward") {
      handleSimpleInwardDeleteData();
      return;
    } else if (moduleType === "testmemomain") {
      handleTestMemoDeleteData();
      return;
    } else if (moduleType === "allotment") {
      handleAllotmentDelete();
      return;
    } else if (moduleType === "sampleverification") {
      handleSampleVerificationDelete();
      return;
    } else if (moduleType === "sfm") {
      handleSFMDelete();
      return;
    } else if (moduleType === "internalcertificate") {
      handleinternalcertificateDelete();
      return;
    } else if (moduleType === "jobinstruction" || moduleType === "jioperationjsonb") {
      if (subModuleType == "commercialCertificate") {
        handleCommercialCertDelete(
          row.cc_id,
          setIsDelete,
          getAllListingData,
          setPopupIndex,
          row
        )
      }
      else {
        handleJobInstructionDelete(
          row.ji_id,
          setIsDelete,
          getAllListingData,
          setPopupIndex
        );
      }
      return;
    }
    else if (moduleType === "vesselOperation") {
      handleVesselOperationDelete(
        row,
        setIsDelete,
        getAllListingData,
        setPopupIndex
      );
      return;
    }
    else if (['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType)) {
      handleDocumentDelete(
        row,
        setIsDelete,
        getAllListingData,
        setPopupIndex
      );
      return;
    }
    else if (moduleType === "consortiumorder") {
      handleConsortiumDelete(
        row,
        setIsDelete,
        getAllListingData,
        setPopupIndex
      );
      return;
    }
    else if (moduleType === "supplier") {
      handleSupplierDelete(
        row,
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "purchaseReq") {
      handlePurchaseReqDelete(
        row["req_no"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "purchase") {
      handlePurchaseOrderDelete(
        row["po_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "calibration") {
      handleCalibrationDelete(
        row["calib_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "purchaseItems") {
      handlePurchaseItemDelete(
        row["item_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "category") {

      handleCategoryDelete(
        row["category_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "tender") {
      handleTenderDelete(
        row["tender_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "stocks") {
      handleChemicalStocksDelete(
        row["chemist_stock_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "incentives") {
      handleIncentiveDelete(
        row["incentive_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "ShipmentList") {
      handleIShipmentRecordDelete(
        row["ship_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "marketPlaceListing") {
      // handleIShipmentRecordDelete(
      //   row["id"],
      //   setIsDelete,
      //   getAllListingData,
      //   setPopupIndex
      // )
    }
    else {
      let deleteBody = {
        jrf_id: id,
      };
      let res = await deleteDataFromApi(JRFDeleteApi, deleteBody);
      if (res?.data?.status === 200) {
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
      setIsDelete(false);
      setPopupIndex(-1);
      getAllListingData();
    }
  };
  const handleSimpleInwardDeleteData = async () => {
    let res;
    if (row["status"] == "rejected") {
      let MainData = {
        jrf_id: id,
        jrf_data: {
          jrf_status: "cancelled",
        },
      };
      res = await putDataFromApi(formConfig.apiEndpoints.update, MainData);
    } else {
      let deleteBody = {
        smpl_inwrd_id: sampleInwardFormId,
      };
      res = await deleteDataFromApi(sampleInwardDetailsDeleteAPI, deleteBody);
    }
    if (res?.data?.status === 200) {
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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleTestMemoDeleteData = async () => {
    let deleteBody = {
      test_memo_id: row.tm_id,
    };
    let res = await deleteDataFromApi(testMemoDeleteApi, deleteBody);

    if (res?.data?.status === 200) {
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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleAllotmentDelete = async () => {
    let deleteBody = {
      sa_id: row.sa_id,
    };
    let res = await deleteDataFromApi(allotmentDeleteApi, deleteBody);

    if (res?.data?.status === 200) {
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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleSampleVerificationDelete = async () => {
    let deleteBody = {
      sv_id: row.sv_id,
    };
    let res = await deleteDataFromApi(sampleverificationDeleteApi, deleteBody);

    if (res?.data?.status === 200) {
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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleSFMDelete = async () => {
    let deleteBody = {
      sfm_id: row.sfm_id,
    };
    let res = await deleteDataFromApi(SFMDeleteApi, deleteBody);

    if (res?.data?.status === 200) {
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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleinternalcertificateDelete = async () => {
    let deleteBody = {
      ic_id: row.ic_id,
    };
    let res = await deleteDataFromApi(InternalCertificateDeleteApi, deleteBody);

    if (res?.data?.status === 200) {
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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleInvoiceDelete = async () => {
    let deleteBody = {
      im_id: row.im_id,
    };
    let res = await deleteDataFromApi(InvoiceDeleteApi, deleteBody);

    if (res?.data?.status === 200) {
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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleDownloadJRF = async () => {
    let bodyData = {
      jrf_id: id,
    };
    let res = await postDataFromApi(JRFPDFDownloadApi, bodyData, "", 1);
    if (res?.status === 200) {
      let pdfDate = "JRF" + id + "_" + getFormatedDate(new Date(), "", 1);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = pdfDate + ".pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setIsDelete(false);
    setPopupIndex(-1);
  };
  const openDeletePopup = () => {
    let headingMsg = "Confirmation!";
    let titleMsg = "";
    if (actionType == "Delete") {
      headingMsg = formConfig?.popupMessages?.delete?.headerMsg;
      titleMsg = formConfig?.popupMessages?.delete?.titleMsg;
    } else if (actionType == "Download") {
      headingMsg = formConfig?.popupMessages?.download?.headerMsg;
      titleMsg = formConfig?.popupMessages?.download?.titleMsg;
    }
    return (
      <DeleteConfirmation
        isOpen={isDelete}
        handleClose={setIsDelete}
        handleConfirm={() =>
          actionType == "Download" ? handleDownloadJRF() : handleDeleteData()
        }
        popupMessage={titleMsg}
        popupHeading={headingMsg}
        actionType={actionType}
      />
    );
  };

  const checkOPSHeadData = () => {
    if (['SU', 'OPS_ADMIN'].includes(user?.role)) {
      return false
    }
    else if (user?.logged_in_user_info?.usr_id === row['fk_useropsexecutiveid']) {
      return false
    }
    return true;
  }

  const chkActionVisibility = (
    rolePermissions,
    module,
    subModuleType,
    permission,
    value = ""
  ) => {
    // console.log("module",module)
    let isVisbile = false;
    if (
      permission &&
      isModuelePermission(rolePermissions, module, permission)
    ) {

      if (module == "jrf") {
        if (value.toLowerCase() === "edit") {
          let data = {
            BU: ["saved", "rejected"],
            LR: ["saved"],
            SU: []
          };
          if (data[user?.role].includes(row.jrf_status)) {
            isVisbile = true;
          }
        } else if (value.toLowerCase() === "delete") {
          let data = {
            BU: ["saved", "rejected"],
            LR: [],
            SU: []
          };
          if (data[user?.role].includes(row.jrf_status)) {
            isVisbile = true;
            if (['saved'].includes(row.jrf_status) && row.jrf_is_ops) {
              isVisbile = false;
            }
          }
        } else if (value.toLowerCase() === "reject") {
          let data = {
            BU: [],
            LR: ['accepted'],
            SU: []
          };
          if (data[user?.role].includes(row.jrf_status)) {
            isVisbile = true;
          }
        } else {
          isVisbile = true;
        }
      } else if (module == "sampleinward") {
        if (value.toLowerCase() === "edit") {
          let data = {
            LR: ["created", "saved"],
            SU: []
          };
          if (data[user?.role].includes(row.smpl_status)) {
            isVisbile = true;
          }
        } else {
          isVisbile = true;
        }
      } else if (module == "internalcertificate") {
        if (value.toLowerCase() === "edit") {
          let data = {
            LR: ["rejected", "saved"],
            TM: [],
            STM: [],
            QM: [],
            SQM: [],
            SLC: [],
            DTM: [],
            LC: [],
            SU: []
          };
          if (data[user?.role].includes(row.status)) {
            isVisbile = true;
          }
        } else {
          isVisbile = true;
        }
      } else if (module == "jobinstruction" || moduleType === "jioperationjsonb" || moduleType === "invoice") {
        if (subModuleType == "invoice") {
          if (["edit", "delete"].includes(value.toLowerCase())) {
            let data = {
              BU: ['Saved', 'debit_save'],
              LR: ['Saved', 'debit_save'],
            };
            if (data[user?.role] && data[user?.role].includes(row?.im_status)) {
              isVisbile = true;
            }
          }
          else if (["view"].includes(value.toLowerCase())) {
            isVisbile = true;
          }
          else if (["Share Invoice"].includes(value.toLowerCase())) {
            isVisbile = ['LR', 'BU'].includes(user?.role);
          }
          else if (["create debit"].includes(value.toLowerCase())) {
            if (['invoice_generated'].includes(row?.im_status) && !row?.im_is_debit_created) {
              isVisbile = ['LR', 'BU'].includes(user?.role);
            }
          }
          else if (["edit debit"].includes(value.toLowerCase())) {
            if (['debit_save'].includes(row?.im_status)) {
              isVisbile = ['LR', 'BU'].includes(user?.role);
            }
          }
          else if (["courier details"].includes(value.toLowerCase())) {
            if (!['Saved'].includes(row?.im_status)) {
              isVisbile = ['LR', 'BU'].includes(user?.role);
            }
          }
          else {
            isVisbile = false;
          }
          return isVisbile

        }
        else if (subModuleType == "commercialCertificate") {
          if (value.toLowerCase() === "delete") {

            let data = {
              BU: ['saved']
            };
            if (data?.[user?.role] && data?.[user?.role].includes(status)) {
              isVisbile = false;
            }
            else {
              isVisbile = false;
            }
          }
          else {
            isVisbile = true;
          }
          return isVisbile
        }
        else {
          if (value.toLowerCase() != "view" && checkOPSHeadData()) {
            return false
          }
          if (value.toLowerCase() === "edit") {
            let data = {
              BU: ['posted', 'accepted'],
              "OPS_ADMIN": ["saved", "created", "pre-analysis", "analysis"],
              SU: []
            };
            if (data[user?.role].includes(status)) {
              isVisbile = true;
            }
          } else if (value.toLowerCase() === "delete") {
            let data = {
              BU: [],
              "OPS_ADMIN": ["saved"],
              SU: []
            };
            if (data[user?.role].includes(status)) {
              isVisbile = true;
            }
          }
          else if (value.toLowerCase() === "history") {
            let data = {
              BU: ['rejected'],
              "OPS_ADMIN": ["rejected"],
              SU: []
            };
            if (!data[user?.role].includes(status)) {
              isVisbile = true;
            }
          }
          else if (module === "internalcertificate") {
            if (!["SU"].includes(user?.role)) {
              isVisbile = true;
            }
          }
          else if (module === "sampleinward") {
            if (!["SU"].includes(user?.role)) {
              isVisbile = true;
            }
          }
          else {
            isVisbile = true;
          }
        }
      }
      else if (module == "consortiumorder") {
        if (value.toLowerCase() === "view") {
          isVisbile = true;
        }
        else if (value.toLowerCase() === "edit") {
          let data = {
            BU: ['saved'],
            "OPS_ADMIN": ["saved"],
            SU: []

          };
          if (data[user?.role].includes(status)) {
            isVisbile = true;
          }
        } else if (value.toLowerCase() === "delete") {
          let data = {
            BU: ["saved"],
            "OPS_ADMIN": ["saved"],
            SU: []
          };
          if (data[user?.role].includes(status)) {
            isVisbile = true;
          }
        } else if (value.toLowerCase() === "documents") {
          if (module == "jobinstruction" || moduleType === "jioperationjsonb") {
            if (value.toLowerCase() != "view" && checkOPSHeadData()) {
              return false
            }
            let data = {
              BU: ['rejected', 'cancel'],
              "OPS_ADMIN": ["rejected", "saved", "created", "pre-analysis", "analysis", 'cancel']
            };
            if (!data[user?.role].includes(status)) {
              isVisbile = true;
            }
          }
          else {
            isVisbile = true;
          }
        } else if (value.toLowerCase() === "man power") {
          if (!['CP', 'BH'].includes(user?.role)) {
            isVisbile = true;
          }

        } else if (value.toLowerCase() === "commercial certificate") {
          isVisbile = true;
        }
      }
      else if (module === "purchaseReq") {
        if (["Delete"].includes(value)) {
          if (!getPurchaseManager(module, "delete")) {
            return false
          }
        }
        isVisbile = true;
      }
     
      else {
        isVisbile = true;
      }
    }
    else if (module == "calibration") {
      if (['edit', 'delete'].includes(value.toLowerCase())) {
        let data = {
          PM: ['saved']
        };
        if (data[user?.role].includes(status) && getPurchaseManager(module, ['edit'].includes(value.toLowerCase()) ? "change" : "delete")) {
          isVisbile = true;
        }
        else {
          isVisbile = false;
        }
      }
      else {
        isVisbile = true;
      }
    }
    else if (module === "purchaseReq") {
      if (["Delete"].includes(value)) {
        if (!getPurchaseManager(module, "delete")) {
          return false
        }
      }

      if (["Saved"].includes(status)) {
        if (["Delete", "View"].includes(value)) {
          isVisbile = true
        }
      }
      else if (["Sent for Approval", "Posted", "Approved"].includes(status)) {
        if (["View", "History", "Documents", "Download"].includes(value)) {
          isVisbile = true
        }
      }
    }
    else if (module === "supplier") {
      if (["saved"].includes(status)) {
        isVisbile = true
        if (["Delete"].includes(value) && !getPurchaseManager(module, "delete")) {
          isVisbile = false
        }
      }
      else if (["posted"].includes(status)) {
        if (["View", "History"].includes(value)) {
          isVisbile = true
        }
      }
      else {
        isVisbile = false
      }
    }
    else if (module === "purchase") {
      if (["Saved", "Reject"].includes(status)) {
        if (["View"].includes(value)) {
          isVisbile = true
        }
      }
      else if (["Sent for Approval", "Posted", "Approved", "Pre-Close"].includes(status)) {
        if (["View", "History", "Download", 'Documents'].includes(value)) {
          isVisbile = true
        }
      }
      else if (['Accept'].includes(status)) {
        // console.log('vall', value)
        if (['Documents', "View", "Insurance Details"].includes(value)) {
          isVisbile = true
        }
      }
    }
    else if (module === "stocks") {
      if (['edit', 'delete'].includes(value.toLowerCase())) {
        let data = {
          PM: ['saved'],
          BU: ['saved'],
          LC: ['saved'],
          LR: ['saved'],
        };
        if (data[user?.role]?.includes(status) && getPurchaseManager(module, ['edit'].includes(value.toLowerCase()) ? "change" : "delete")) {
          isVisbile = true;
        }
        else {
          isVisbile = false;
        }
      }
      else {
        isVisbile = true;
      }

    }
    else if (module === "incentives") {
      if (["delete", "view"]?.includes(value)) {
        let data = {
          PM: ['saved']
        };
        if (data[user?.role].includes(status)) {
          isVisbile = true;
        }
        else {
          isVisbile = false;
        }
      }
      else {
        isVisbile = true;
      }

    }
    else if (module === "purchaseItems") {
      isVisbile = true
      if (['edit', 'delete'].includes(value.toLowerCase())) {
        if (!getPurchaseManager(module, ['edit'].includes(value.toLowerCase()) ? "change" : "delete")) {
          isVisbile = false
        }
      }
    }
    else if (module === "category") {
      isVisbile = true
      if (['edit', 'delete'].includes(value.toLowerCase())) {
        if (!getPurchaseManager(module, ['edit'].includes(value.toLowerCase()) ? "change" : "delete")) {
          isVisbile = false
        }
      }
    }
    else if (module === "userMaster") {
      isVisbile = true
    }
    else if (module == "ClientDetails") {
      isVisbile = true;
    }
     else if(module ==="ShipmentList"){
         
          if (['edit', 'delete',"view","history"].includes(value.toLowerCase())) {
            isVisbile = true;
          }
         else {
            isVisbile=false
         }
      }
     else if(module ==="marketPlaceListing"){
         
          if (['edit', 'delete',"view","history"].includes(value.toLowerCase())) {
            isVisbile = true;
          }
         else {
            isVisbile=false
         }
      }
    else {

      if (value.toLowerCase() === "download") {
        let data = {
          BU: ["posted", "saved"],
          LR: ["posted", "saved"],
        };
        if (data[user?.role] && !data[user?.role].includes(row?.jrf_status)) {
          isVisbile = true;
        }
      }
      else if (
        value.toLowerCase() === "pdf" &&
        (formConfig?.listView?.moduleType === "sfm" ||
          formConfig?.listView?.moduleType === "testmemomain")
      ) {
        let data = {
          TM: ["certified", 'results'],
          STM: ["certified", 'results'],
          QM: ["certified", 'results'],
          SQM: ["certified", 'results'],
          SLC: ["certified", 'results', "completed"],
          LR: ["certified", 'results'],
          DTM: ["certified", 'results'],
          LC: ["completed"],
          SU: [],
        }
        if (user?.all_roles?.main_role_id && user?.all_roles?.other_roles?.length) {
          if (formConfig?.listView?.moduleType === "testmemomain") {
            data?.[user?.role]?.push('results')
          }
        }
        if (data[user?.role] && data[user?.role].includes(row.status || row.sfm_status)) {
          isVisbile = true;
        }
      } else if (value.toLowerCase() === "history") {
        if (module == "jobinstruction" || moduleType === "jioperationjsonb") {
          if (value.toLowerCase() != "view" && checkOPSHeadData()) {
            return false
          }
          let data = {
            BU: ['rejected'],
            "OPS_ADMIN": ["rejected"],
          };
          if (data[user?.role] && !data[user?.role].includes(status)) {
            isVisbile = true;
          }
        }
        else {
          isVisbile = true;
        }
      } else if (
        value.toLowerCase() === "pdf" &&
        (moduleType === "sfm" || moduleType === "testmemomain")
      ) {
        let data = {
          TM: ["certified"],
          LR: ["certified"],
          DTM: ["certified"],
          LC: ["completed"],
        };

        if (data[user?.role] &&
          (data[user?.role].includes(row?.status) ||
            data[user?.role].includes(row?.sfm_status))
        ) {
          isVisbile = true;
        }
      } else if (value.toLowerCase() === "documents") {
        if (module == "jobinstruction" || moduleType === "jioperationjsonb") {
          if (value.toLowerCase() != "view" && checkOPSHeadData()) {
            return false
          }
          let data = {
            BU: ['rejected'],
            "OPS_ADMIN": ["rejected", "saved", "created", "pre-analysis", "analysis"],
            "SU": ["rejected", "saved", "created", "pre-analysis", "analysis"],
          };
          if (data[user?.role] && !data[user?.role].includes(status)) {
            isVisbile = true;
          }
        }
        else if (module == "jrf") {
          let data = {
            BU: [],
            LR: [],
            SU: []
          };
          if (data[user?.role] && !data[user?.role].includes(status)) {
            isVisbile = true;
          }
        }
        else {
          isVisbile = true;
        }
      } else if (value.toLowerCase() === "man power") {
        isVisbile = true;
      } else if (value.toLowerCase() === "commercial certificate") {
        isVisbile = true;
      }
      // else if (value.toLowerCase() === "rake details") {
      //   isVisbile = true;
      // }
      else if (value.toLowerCase() === "view") {
        if (moduleType === "TPIMain") {
          isVisbile = true
        }
      }
    }
    // return true
    return isVisbile;
  };
  const chkSubListVisibility = (from, moduleType, value, subModuleType) => {
    if (subModuleType == "commercialCertificate") {
      let isVisbile = true
      if (value.toLowerCase() === "delete") {

        let data = {
          BU: ['saved']
        };
        if (data?.[user?.role] && data?.[user?.role].includes(status)) {
          isVisbile = true;
        }
        else {
          isVisbile = false;
        }
      }
      else {
        isVisbile = true;
      }
      return isVisbile
    }
    if (value?.toLowerCase() === "delete" && row?.status === "completed") {
      return false
    }
    else if (value?.toLowerCase() === "rake details") {
      // if (operationMode === "RAKE") {
      //   if (getActivityCode(row?.activity_master?.activity_code).toLowerCase() === getRakeOperations('QAss')) {
      //     return true
      //   }
      // }
      return false
    }
    else {
      if (from === "subListTable") {
        if (['CP', 'BH'].includes(user?.role)) {
          return false
        }
        else {
          return true
        }
      }
    }

  }
  const popupRef = useRef(null);
  const [dynamicTop, setDynamicTop] = useState(0);

  useEffect(() => {
    if (popupRef.current) {
      const popupHeight = popupRef.current.offsetHeight;
      setDynamicTop(-popupHeight); // Set `top` to negative of the height
    }
  }, [isBottom]); // Recalculate if `isBottom` changes

  return (
    <div
      ref={popupRef}
      className={"popupOptions"}
      style={isBottom ? { position: 'absolute', top: `${dynamicTop}px` } : {}}
    >
      {actions.map((action, actionIndex) => {
        return (action.value &&
          action.value !== "" &&
          action.type === "icon" &&
          action.status !== "assignmentview"
          &&
          chkActionVisibility(
            rolePermissions,
            section.moduleType,
            section.subModuleType,
            action.permission,
            action.value
          ))
          ||
          chkSubListVisibility(
            from,
            section.moduleType,
            action.value,
            section.subModuleType,
          )


          ? (
            <div key={"sample-inward-" + actionIndex}>
              <button
                type="button"
                className="nonNativeButton2"
                aria-label="Sample Inward Action Button"
                onClick={() =>
                  moduleType === "sampleinward"
                    ? handleClick(action.status, action.value)
                    : handleClick(action.value)
                }
              >
                <i className={action.label}></i>
                {action.value}
              </button>
            </div>
          ) : action.status === "assignmentview" &&
            row["smpl_status"] === "assigned" ? (
            <div key={"actionIndex-" + actionIndex}>
              <button
                type="button"
                className="nonNativeButton2"
                aria-label="Assignment View Button"
                onClick={() =>
                  moduleType === "sampleinward"
                    ? handleClick(action.status, action.value)
                    : handleClick(action.value)
                }
              >
                <i className={action.label}></i>
                {action.value}
              </button>
            </div>
          ) : action.status === "JICommercialList" ? (
            <div key={"actionIndex-" + actionIndex}>
              <button
                type="button"
                className="nonNativeButton2"
                aria-label="Assignment View Button"
                onClick={() => handleClick(action.value)}
              >
                <i className={action.label}></i>
                {action.value}
              </button>
            </div>
          )
            : action.status === "vesseListView" ? (
              <div key={"actionIndex-" + actionIndex}>
                <button
                  type="button"
                  className="nonNativeButton2"
                  aria-label="Assignment View Button"
                  onClick={() => handleClick(action.value)}
                >
                  <i className={action.label}></i>
                  {action.value}
                </button>
              </div>
            )
              : null;
      })}
      {isDelete && openDeletePopup()}
    </div>
  );
};
PopupOptions.propTypes = {
  popupActions: PropTypes.arrayOf(PropTypes.object),
  setPopupIndex: PropTypes.func,
  id: PropTypes.string,
  row: PropTypes.object,
  section: PropTypes.string,
  getAllListingData: PropTypes.func,
  formConfig: PropTypes.object,
  type: PropTypes.string,
  sampleInwardFormId: PropTypes.string,
  model: PropTypes.object,
  isBottom: PropTypes.bool,
  status: PropTypes.string,
  setDontClick: PropTypes.func,
};



export default PopupOptions;
