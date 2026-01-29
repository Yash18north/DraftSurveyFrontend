import React from "react";
import { useNavigate } from "react-router-dom";
import { cretateTestMemoDetails } from "./commonHandlerFunction/testMemoFunctionHandler";
import { cretateTestMemoDetails as stubCretateTestMemoDetails } from "../../utils/stubFunctions";
import { encryptDataForURL } from "../../utills/useCryptoUtils";
import { GetTenantDetails, postDataFromApi } from "../../services/commonServices";
import { getOperationActivityListPageUrl, getOperationActivityUrl, getPurchaseManager } from "../../services/commonFunction";
import { useDispatch } from "react-redux"
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { handleFormSave } from "./commonHandlerFunction/JRFHandlerFunctions";
import { handleGetJobCostingList, handleJobCostingFormCreateAndUpdate } from "./commonHandlerFunction/Audit/JobCosting/JobCostingHandlerFunction";
import { getSingleBranchExpense } from "./commonHandlerFunction/Audit/BranchExpenseHandler";
import { handleGetSingleOutstanding } from "./commonHandlerFunction/Audit/OutStanding/OutStandingHandlerFunction";
import { handleGetSingleSalesRegister } from "./commonHandlerFunction/Audit/SalesRegister/SalesRegisterHandlerFunction";
import { handleDownloadPO, handlePurchaseOrderCreateUpdate } from "./commonHandlerFunction/Purchase/PurchaseOrder/PurchaseOrderHandler";
import { handleDownloadPO as stubHandleDownloadPO, handlePurchaseOrderCreateUpdate as stubHandlePurchaseOrderCreateUpdate } from "../../utils/stubFunctions";
import { handlePurchaseReqUpdateCreate } from "./commonHandlerFunction/Purchase/PurchaseReq/PurchaseRequsitionHandler";
import { handleCreateDebitFromList } from "./commonHandlerFunction/InvoiceHandlerFunctions";
const ListingActionButton = ({
  status,
  actions,
  user,
  moduleType,
  jrf_id,
  sampleInwardFormId,
  row,
  setIsRejectPopupOpen,
  setJRFCreationType,
  setIsPopupOpen,
  setIsOverlayLoader,
  handleSubmit,
  setFormData,
  formData,
  setSubTableData,
  setIsCustomPopup,
  setCurrentActiverow,
  formConfig
}) => {

  const { t }
    = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const actionBtnList = {
    jrf: [
      {
        btnStatus: "posted",
        label: "Verify Checklist",
        status: "checklist",
        btnshortName: "verifyCheckList",
      },
      {
        btnStatus: "accepted",
        label: "Sample Inward",
        status: "inward",
        btnshortName: "sampleInward",
      },
      {
        btnStatus: "completed",
        label: "Test Report",
        status: "testReport",
        btnshortName: "testReport",
      },
      {
        btnStatus: "rejected",
        label: "Update",
        status: "rejected",
        btnshortName: "Edit",
      },
      {
        btnStatus: "saved",
        label: "Update",
        status: "saved",
        btnshortName: "Saved",
      },
    ],
    sampleinward: [
      {
        btnStatus: "inwarded",
        label: "Assignment",
        status: "assignment",
        btnshortName: "assignment",
      },
      {
        btnStatus: "assigning",
        label: "Assignment",
        status: "assignment",
        btnshortName: "assignment",
      },
      {
        btnStatus: "created",
        label: "Sample Inward",
        status: "inward",
        btnshortName: "sampleInward",
      },
      {
        btnStatus: "saved",
        label: "Sample Inward",
        status: "inward",
        btnshortName: "sampleInward",
      },
      {
        btnStatus: "assigned",
        label: "Create Test Memo",
        status: "testMemo",
        btnshortName: "testMemo",
      },
      {
        btnStatus: "certified",
        label: "Test Report",
        status: "certified",
        btnshortName: "testReport",
      },
    ],
    allotment: [
      {
        btnStatus: "pending",
        label: "Allot",
        status: "allot",
        btnshortName: "allot",
      },
      {
        btnStatus: "allotted",
        label: "Update",
        status: "allotted",
        btnshortName: "Edit",
      },
      {
        btnStatus: "allotted",
        label: "Verification",
        status: "verification",
        btnshortName: "verification",
      },
    ],
    testmemomain: [
      {
        btnStatus: "pending",
        label: "Verify Test Memo",
        status: "pending",
        btnshortName: "verifytestmemo",
      },
      {
        btnStatus: "posted",
        label: "Allot",
        status: "posted",
        btnshortName: "create-allot",
      },
      {
        btnStatus: "created",
        label: "Send to Lab",
        status: "sendToLab",
        btnshortName: "sendToLab",
      },
      {
        btnStatus: "results",
        label: "Verify Test Result",
        status: "results",
        btnshortName: "verifytestresult",
      },
      {
        btnStatus: "verified",
        label: "Test Report",
        status: "verified",
        btnshortName: "testmemoresult",
      },
      {
        btnStatus: "rejected",
        label: "Update",
        status: "rejected",
        btnshortName: "Edit",
      },
    ],
    sampleverification: [
      {
        btnStatus: "pending",
        label: "Verification",
        status: "verification",
        btnshortName: "verification",
      },
    ],
    sfm: [
      {
        btnStatus: "pending",
        label: "Result",
        status: "SFMResult",
        btnshortName: "SFMResult",
      },
      {
        btnStatus: "in-process",
        label: "Result",
        status: "SFMResult",
        btnshortName: "SFMResult",
      },
      {
        btnStatus: "rejected",
        label: "Update",
        status: "SFMUpdate",
        btnshortName: "SFMUpdate",
      },
    ],
    internalcertificate: [
      {
        btnStatus: "dtm-approved",
        label: "Verify",
        status: "verifyByTm",
        btnshortName: "verifyByTm",
      },
      {
        btnStatus: "pending",
        label: "Verify",
        status: "verifyByDTM",
        btnshortName: "verifyByDTM",
      },
      {
        btnStatus: "tm-approved",
        label: "Publish",
        status: "publishBtn",
        btnshortName: "publishBtn",
      },
      {
        btnStatus: "dtm-reject",
        label: "Update",
        status: "dtmReject",
        btnshortName: "dtmReject",
      },
      {
        btnStatus: "tm-reject",
        label: "Update",
        status: "tmReject",
        btnshortName: "tmReject",
      },
    ],
    jobinstruction: [
      {
        btnStatus: "saved",
        label: "Scope Of Work",
        status: "saved",
        btnshortName: "saved",
      },
      {
        btnStatus: "created",
        label: "Analysis",
        status: "created",
        btnshortName: "created",
      },
      {
        btnStatus: "pre-analysis",
        label: "Analysis",
        status: "pre-analysis",
        btnshortName: "pre-analysis",
      },
      {
        btnStatus: "analysis",
        label: "Nominate",
        status: "analysis",
        btnshortName: "analysis",
      },
      {
        btnStatus: "rejected",
        label: "Update",
        status: "rejected",
        btnshortName: "rejected",
      },
      {
        btnStatus: "posted",
        label: "Verify",
        status: "posted",
        btnshortName: "posted",
      },
      {
        btnStatus: "accepted",
        label: "Process",
        status: "accepted",
        btnshortName: "accepted",
      },
    ],
    jioperationjsonb: [
      {
        btnStatus: "posted",
        label: "Verify",
        status: "posted",
        btnshortName: "posted",
      },
      {
        btnStatus: "accepted",
        label: "Process",
        status: "accepted",
        btnshortName: "accepted",
      },
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      }
    ],
    TPIMain: [
      {
        btnStatus: "created",
        label: "Update",
        status: "created",
        btnshortName: "created",
      },
      {
        btnStatus: "posted",
        label: "Update",
        status: "posted",
        btnshortName: "posted",
      },
    ],
    consortiumorder: [
      {
        btnStatus: "saved",
        label: "Consortium Job",
        status: "saved",
        btnshortName: "saved",
      },
      {
        btnStatus: "posted",
        label: "View JI",
        status: "posted",
        btnshortName: "posted",
      },
    ],
    jobCosting: [
      {
        btnStatus: "updated",
        label: "Edit",
        status: "updated",
        btnshortName: "updated",
      },
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      },
      {
        btnStatus: "cancelled",
        label: "Comment",
        status: "cancelled",
        btnshortName: "cancelled",
      }
    ],
    auditBranchExpenses: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      }],
    auditOutstanding: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      }],
    auditSalesRegister: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      }],
    invoice: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      },
      {
        btnStatus: "invoice_generated",
        label: "View Invoice",
        status: "invoice_generated",
        btnshortName: "invoice_generated",
      },
      {
        btnStatus: "debit_save",
        label: "View Invoice",
        status: "debit_save",
        btnshortName: "debit_save",
      }
    ],
    purchase: [
      {
        btnStatus: "approved",
        label: "Create P.O",
        status: "approved",
        btnshortName: "approved",
      },
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      },
      {
        btnStatus: "posted",
        label: "Approve",
        status: "posted",
        btnshortName: "posted",
      },
      {
        btnStatus: "Pre-Close",
        label: "Approve",
        status: "Pre-Close",
        btnshortName: "Pre-Close",
      },
      {
        btnStatus: "accept",
        label: "Download",
        status: "accept",
        btnshortName: "accept",
      }

    ],
    purchaseReq: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      },
      {
        btnStatus: "posted",
        label: "Send for Approval",
        status: "posted",
        btnshortName: "posted",
      },
      {
        btnStatus: "sent for approval",
        label: "Approve",
        status: "sent for approval",
        btnshortName: "sent for approval",
      },
      {
        btnStatus: "reject",
        label: "Update",
        status: "reject",
        btnshortName: "reject",
      }
    ],
    calibration: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      },
    ],
    supplier: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      },
      {
        btnStatus: "posted",
        label: "Edit",
        status: "posted",
        btnshortName: "posted",
      }
    ],
    tender: [
      {
        btnStatus: "awarded",
        status: "awarded",
        btnshortName: "awarded",
      },
      {
        btnStatus: "not awarded",
        status: "not awarded",
        btnshortName: "not awarded",
      },
      {
        btnStatus: "submitted",
        status: "submitted",
        btnshortName: "submitted",
      }
    ],
    stocks: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      },
      {
        btnStatus: "posted",
        label: "Edit",
        status: "posted",
        btnshortName: "posted",
      },
    ],
    incentives: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      },
    ],
    incentives: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      },
    ],
    ShipmentList: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      }
    ],
    marketPlaceListing: [
      {
        btnStatus: "saved",
        label: "Edit",
        status: "saved",
        btnshortName: "saved",
      }
    ],
  };

  const rolesWiseBtnList = {
    jrf: {
      BU: ["testReport", "Edit", "Saved"],
      LR: ["testReport", "verifyCheckList", "sampleInward", "Edit", "Saved"],
      TM: [],
      STM: [],
      QM: [],
      SQM: [],
      SLC: [],
      LC: [],
      DTM: [],
      SU: []
    },
    sampleinward: {
      BU: ["testReport"],
      LR: ["assignment", "testMemo", "testReport", "sendToLab", "sampleInward"],
      TM: ["verifytestmemo"],
      STM: ["verifytestmemo"],
      QM: ["verifytestmemo"],
      SQM: ["verifytestmemo"],
      SLC: ["verifytestmemo"],
      LC: [],
      DTM: [],
      SU: []
    },
    allotment: {
      BU: ["testReport"],
      LR: ["assignment", "testMemo", "certified"],
      TM: ["verifytestmemo", "Edit"],
      STM: ["verifytestmemo", "Edit"],
      QM: ["verifytestmemo", "Edit"],
      SQM: ["verifytestmemo", "Edit"],
      SLC: ["verifytestmemo", "verification"],
      LC: ["verification"],
      DTM: ["verifytestmemo", "verification"],
      SU: []
    },
    sampleverification: {
      BU: [],
      LR: [],
      TM: [],
      STM: [],
      QM: [],
      SQM: [],
      SLC: ["verification"],
      LC: ["verification"],
      DTM: ["verification"],
      SU: []
    },
    testmemomain: {
      BU: [],
      LR: ["sendToLab", "testmemoresult", "Edit"],
      TM: ["verifytestmemo", "create-allot", "verifytestresult"],
      STM: ["verifytestmemo", "create-allot", "verifytestresult"],
      QM: ["verifytestmemo", "create-allot", "verifytestresult"],
      SQM: ["verifytestmemo", "create-allot", "verifytestresult"],
      SLC: ["verifytestmemo", "verifytestresult"],
      LC: ["verification"],
      DTM: ["create-allot"],
      SU: []
    },
    sfm: {
      BU: [],
      LR: [],
      TM: [],
      STM: [],
      QM: [],
      SQM: [],
      SLC: ["SFMResult", "SFMUpdate"],
      LC: ["SFMResult", "SFMUpdate"],
      DTM: ["SFMResult", "SFMUpdate"],
      SU: []
    },
    internalcertificate: {
      BU: [],
      LR: ["publishBtn", "dtmReject", "tmReject"],
      TM: ["verifyByTm", "verifyByDTM"],
      STM: ["verifyByTm"],
      QM: ["verifyByTm"],
      SQM: ["verifyByTm"],
      SLC: ["verifyByDTM"],
      LC: [],
      DTM: ["verifyByDTM"],
      SU: []
    },
    jobinstruction: {
      BU: ["posted", "accepted", "process"],
      LR: [],
      TM: [],
      STM: [],
      QM: [],
      SQM: [],
      SLC: [],
      LC: [],
      DTM: [],
      "OPS_ADMIN": ["saved", "created", "analysis", "pre-analysis", "rejected", "accepted"],
      SU: ['accepted'],
      BH: ['accepted'],
      CP: []
    },
    jioperationjsonb: {
      BU: ["posted", "accepted", "process", "saved"],
      LR: [],
      TM: [],
      STM: [],
      QM: [],
      SQM: [],
      SLC: [],
      LC: [],
      DTM: [],
      "OPS_ADMIN": ["saved", "accepted"],
      BH: [],
      SU: ["accepted"],
      BH: ['accepted'],
      CP: []
    },
    TPIMain: {
      BU: ["created", "posted"],
      LR: [],
      TM: [],
      STM: [],
      QM: [],
      SQM: [],
      SLC: [],
      LC: [],
      DTM: [],
      "OPS_ADMIN": [],
      SU: []
    },
    consortiumorder: {
      BU: ["saved", "posted"],
      LR: [],
      TM: [],
      STM: [],
      QM: [],
      SQM: [],
      SLC: [],
      LC: [],
      DTM: [],
      "OPS_ADMIN": ["saved", "posted"],
      SU: ['posted']
    },
    jobCosting: {
      BU: ["updated", "saved"],
      "AUDIT": ["updated", "saved", 'cancelled']
    },
    auditBranchExpenses: {
      AUDIT: ["updated", "saved"],
      BU: ["updated", "saved"],
      "OPS_ADMIN": ["updated", "saved"],
      "AUDIT": ["updated", "saved"]
    },
    auditOutstanding: {
      AUDIT: ["updated", "saved"],
      BU: ["updated", "saved"],
      "OPS_ADMIN": ["updated", "saved"],
      "AUDIT": ["updated", "saved"]
    },
    auditSalesRegister: {
      AUDIT: ["updated", "saved"],
      BU: ["updated", "saved"],
      "OPS_ADMIN": ["updated", "saved"],
      "AUDIT": ["updated", "saved"]
    },
    purchase: {
      PM: ["approved", "published", "saved", "posted", "accept", "Pre-Close"],
      SU: ["posted", "Pre-Close"],
      BH: ["posted", "approved", "published", "saved", "accept", "Pre-Close"],
      AUDIT: ["posted", "Pre-Close"]
    },
    purchaseReq: {
      PM: ["sent for Approval", "saved", "posted", 'reject'],
      SU: ["sent for Approval"],
      BH: ["sent for Approval", "saved", "posted", 'reject'],
      AUDIT: ["sent for Approval"]
    },
    supplier: {
      PM: ["saved", "posted"]
    },
    invoice: {
      BU: ["saved", "invoice_generated", 'debit_save'],
      LR: ["saved", "invoice_generated", "debit_save"],
      TM: [],
      STM: [],
      QM: [],
      SQM: [],
      SLC: [],
      LC: [],
      DTM: [],
      "OPS_ADMIN": ["invoice_generated", "debit_save"],
      SU: ["invoice_generated", "debit_save"],
      CU: ["invoice_generated", "debit_save"]
    },
    AUDIT: {
      BU: ["updated", "saved"]
    },
    calibration: {
      PM: ["saved"]
    },
    stocks: {
      PM: ["saved"],
      BU: ["saved"],
      SLC: ["saved","posted"],
      LC: ["saved","posted"],
    },
    incentives: {
      PM: ["saved"],
      BU: ["saved"]
    },
    ShipmentList:{
      SU: ["saved","posted"],
    },
    marketPlaceListing:{
      SU: ["saved"],
    },
  };

  const getBtnListArray = () => {

    let btnFilteredData = [];
    btnFilteredData = actionBtnList[moduleType].filter((btn) => {

      if (GetTenantDetails(1, 1) === "TPBPL" && moduleType === "allotment" && ['LC', 'SLC', 'DTM'].includes(user?.role)) {
        return false;
      }
      return rolesWiseBtnList[moduleType]?.[user?.role] && rolesWiseBtnList[moduleType]?.[user?.role].map((singlestatus) => singlestatus.toLowerCase()).includes(
        btn.btnshortName.toLowerCase()
      ) || false;
    });
    return btnFilteredData;
  };

  //table Action buttion handler
  const handleOnclick = (action) => {

    if (moduleType === "sampleinward") {
      if (action.status === "testMemo") {
        cretateTestMemoDetails(
          sampleInwardFormId,
          action,
          navigate,
          setIsOverlayLoader
        );
      } else if (action?.status == "testReport") {
        // navigate(action?.redirectUrl + "/" + encryptDataForURL(row["internal_certificate_id"]));
        navigate(`/testReport/previewPDF/${encryptDataForURL(row["internal_certificate_id"])}` + "?ReferenceNo=" +
          encryptDataForURL(row?.jrf_referenceno));
        // handleTestReport(row, action);
      } else {
        navigate(
          action?.redirectUrl +
          "?status=" +
          encryptDataForURL(action?.status) +
          "&sampleInwardId=" +
          encryptDataForURL(sampleInwardFormId) +
          "&id=" +
          encryptDataForURL(jrf_id)
        );
      }
    } else if (moduleType === "allotment") {
      navigate(
        action?.redirectUrl +
        "?status=" +
        encryptDataForURL(action?.status) +
        "&sampleAllotmentId=" +
        encryptDataForURL(row["sa_id"])
      );
    } else if (moduleType === "sampleverification") {
      navigate(
        action?.redirectUrl +
        "?status=" +
        encryptDataForURL(action?.status) +
        "&sampleVarificationId=" +
        encryptDataForURL(row["sv_id"])
      );
    } else if (moduleType === "testmemomain") {
      if (
        action.status === "create-allot" ||
        action.status === "sendToLab" ||
        action.status === "verifytestmemo"
      ) {
        navigate(
          action?.redirectUrl +
          "?status=" +
          encryptDataForURL(action?.status) +
          "&testMemoId=" +
          encryptDataForURL(row["tm_id"])
        );
      } else if (action.status == "verifytestresult") {
        navigate(
          action?.redirectUrl +
          "?status=" +
          encryptDataForURL(action?.status) +
          "&testMemoId=" +
          encryptDataForURL(row["tm_id"])
        );
      } else if (action.status == "testmemoresult") {
        navigate(
          action?.redirectUrl +
          "?status=" +
          encryptDataForURL(action?.status) +
          "&testMemoId=" +
          encryptDataForURL(row["tm_id"])
        );
      } else if (action.status == "Edit") {
        navigate(
          action?.redirectUrl +
          "?status=" +
          encryptDataForURL(action?.status) +
          "&testMemoId=" +
          encryptDataForURL(row["tm_id"])
        );
      }
    } else if (moduleType === "sfm") {
      navigate(
        action?.redirectUrl +
        "?status=" +
        encryptDataForURL(action?.status) +
        "&sfmid=" +
        encryptDataForURL(row["sfm_id"])
      );
    } else if (moduleType === "internalcertificate") {
      localStorage.setItem("icId", encryptDataForURL(row["ic_id"]));
      if (action?.status == "approveByDTM") {
        setIsPopupOpen(true);
        setJRFCreationType("approve");
      } else if (action?.status == "rejectByDTM") {
        setIsRejectPopupOpen(true);
      } else {
        navigate(
          action?.redirectUrl +
          "?status=" +
          encryptDataForURL(action?.status) +
          "&editId=" +
          encryptDataForURL(row["ic_id"])
        );
      }
    } else if (moduleType == "jobinstruction") {

      if (action.recordType) {
        navigate(
          action?.redirectUrl +
          "/" +
          encryptDataForURL(row["ji_id"]) +
          "/" +
          encryptDataForURL(action.recordType)
        );
      } else if (action.status === "posted") {
        let redirecturl = getOperationActivityListPageUrl(row["operation_type"]['operation_type_code'])
        redirecturl = redirecturl.replace(/\/([^\/]*)$/, "-$1");
        navigate(
          redirecturl + 'view' +
          "/" +
          encryptDataForURL(row["ji_id"]) +
          "?action=" +
          encryptDataForURL("View") +
          "&status=" +
          encryptDataForURL(action?.status) + `&isFullDetails=${encryptDataForURL(1)}`
        );
      }
      else if (action.status === "accepted") {
        let redirectUrl = getOperationActivityUrl(row["operation_type"]['operation_type_name'])
        navigate(
          redirectUrl +
          encryptDataForURL(row["ji_id"]) +
          "?action=" +
          encryptDataForURL("View") +
          "&status=" +
          encryptDataForURL(action?.status) + "&operationMode=" +
          encryptDataForURL(row?.["operation_type"]?.operation_type_code)
        );
      }
      else {
        if (action.status === "rejected") {
          // localStorage.setItem('isMainScopeWork', '')
          dispatch({
            type: "MAIN_SCOPE_WORK",
            isMainScopeWork: ''
          });
          navigate(action?.redirectUrl + "/" + encryptDataForURL(row["ji_id"]));
        }
        else {
          dispatch({
            type: "MAIN_SCOPE_WORK",
            isMainScopeWork: 1
          });
          navigate(action?.redirectUrl + "/" + encryptDataForURL(row["ji_id"]));
        }
      }
    } else if (moduleType === "invoice") {
      if (action?.label == "Edit") {
        navigate(
          `/operation/invoice-listing/create-invoice/${encryptDataForURL(
            row["im_id"]
          )}` + "?status=" +
          encryptDataForURL("Edit")
        );
      }
      else if (action?.value == "View Invoice") {
        navigate(
          `/operation/invoice-listing/invoice-preview/${encryptDataForURL(
            row["im_id"]
          )}/${encryptDataForURL(
            row["im_invoiceurl"]
          )}/${encryptDataForURL(
            row["im_invoiceurl"]
          )}`
        );
      }
      else if (action?.label == "View Invoice") {
        navigate(
          `/operation/invoice-listing/invoice-preview/${encryptDataForURL(
            row["im_id"]
          )}/${encryptDataForURL(
            row["im_invoiceurl"]
          )}/${encryptDataForURL(
            row["im_invoicenumber"]
          )}`
        );
      }
      else if (action?.label == "Edit Debit") {
        navigate(
          `/operation/invoice-listing/create-debit/${encryptDataForURL(
            row["im_id"]
          )}` + "?status=" +
          encryptDataForURL("Edit")
        );
      }
    } else if (moduleType == "jioperationjsonb") {
      if (action.status === "accepted") {
        let redirectUrl = getOperationActivityUrl(row["operation_type"]['operation_type_name'])
        navigate(
          redirectUrl +
          encryptDataForURL(row["ji_id"]) +
          "?action=" +
          encryptDataForURL("View") +
          "&status=" +
          encryptDataForURL(action?.status) + "&operationMode=" +
          encryptDataForURL(row?.["operation_type"]?.operation_type_code)
        );
      }
      else if (action.status === "posted") {
        let redirecturl = getOperationActivityListPageUrl(row["operation_type"]['operation_type_code'])
        redirecturl = redirecturl.replace(/\/([^\/]*)$/, "-$1");
        navigate(
          redirecturl + 'view' +
          "/" +
          encryptDataForURL(row["ji_id"]) +
          "?action=" +
          encryptDataForURL("View") +
          "&status=" +
          encryptDataForURL(action?.status) + `&isFullDetails=${encryptDataForURL(1)}`
        );
      }
      else {
        navigate(
          action?.redirectUrl +
          "/" +
          encryptDataForURL(row["ji_id"]) +
          "?action=" +
          encryptDataForURL("View") +
          "&status=" +
          encryptDataForURL(action?.status) + "&operationMode=" +
          encryptDataForURL(row?.["operation_type"]?.operation_type_code)
        );
      }
    } else if (moduleType === "TPIMain") {
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
        )}`
      );
    } else if (moduleType === "consortiumorder") {
      if (action?.label == "View JI") {
        navigate(
          `/operation/jrfInstructionListing?filterList=${encryptDataForURL(
            'consortium_order-' + row['co_id']
          )}`
        );
      }
      else {
        navigate(
          `/operation/consortiums-list/consortium/${encryptDataForURL(
            row["co_id"]
          )}`
        );
      }
    }
    else if (moduleType === "jobCosting") {
      if (action?.label == "Comment") {
        setCurrentActiverow(row)
        setIsCustomPopup(true);
      }
      else {
        navigate(`/audit/job-costing-edit/${encryptDataForURL(
          row["jc_id"]
        )}`);
      }
    }
    else if (moduleType === "auditBranchExpenses") {
      navigate(`/audit/auditBranchExpenseForm/${encryptDataForURL(
        row["id"]
      )}`);


    }
    else if (moduleType === "auditOutstanding") {
      navigate(`/audit/auditOutstandingForm/${encryptDataForURL(
        row["id"]
      )}`);

    }
    else if (moduleType === "auditSalesRegister") {
      navigate(`/audit/auditSalesRegisterForm/${encryptDataForURL(
        row["id"]
      )}`);
    }
    else if (moduleType === "purchaseReq") {
      if (action?.label == "Edit") {
        navigate(`/PurchRequistion/PurchaseRequistionForm/${encryptDataForURL(
          row["req_no"]
        )}`);
      }
      else if (action?.label == "Send for Approval") {
        navigate(`/PurchRequistion/PurchaseRequistionForm/${encryptDataForURL(
          row["req_no"]
        )}`);
      }
      else if (action?.label == "Approve") {
        navigate(`/PurchRequistion/PurchaseRequistionForm/${encryptDataForURL(
          row["req_no"]
        )}`);

        // handlePurchaseOrderCreateUpdate(
        //   row,
        //   handleSubmit,
        //   setIsOverlayLoader,
        //   navigate,
        //   3,
        //   setFormData
        // )
      }
      else if (action?.label == "Update") {
        navigate(`/PurchRequistion/PurchaseRequistionForm/${encryptDataForURL(
          row["req_no"]
        )}`);
      }
    }
    else if (moduleType === "purchase") {
      if (action?.label == "Create P.O") {
        navigate(`/purchase/purchaseForm/${encryptDataForURL(
          row["po_id"]
        )}`);
      } else if (action?.label == "Edit") {
        navigate(`/purchase/purchaseForm/${encryptDataForURL(
          row["po_id"]
        )}`);
      }
      else if (action?.label == "Download") {
        //  console.log("@@", row)
        handleDownloadPO(row["po_id"], row["po_number"])

      }
      else if (action?.label == "Approve") {
        // handleDownloadPO(row["po_id"])
        navigate(`/purchase/purchaseForm/${encryptDataForURL(
          row["po_id"]
        )}?status=${encryptDataForURL('View')}&action=${encryptDataForURL("approve")}`);
      }
    }
    else if (moduleType === "supplier") {
      if (action?.label == "Edit") {
        navigate(`/supplierList/supplierForm/${encryptDataForURL(
          row["sup_id"]
        )
          } `);
      }

    }
    else if (moduleType === "calibration") {
      if (action?.label == "Edit") {
        navigate(`/calibrationList/calibrationForm/${encryptDataForURL(
          row["calib_id"]
        )
          } `);
      }

    }
    else if (moduleType === "stocks") {
      if (action?.label == "Edit") {
        navigate(`/chemicalStocks/chemicalStocksForm/${encryptDataForURL(
          row["chemist_stock_id"]
        )
          }`);
      }

    }
    else if (moduleType === "incentives") {
      if (action?.label == "Edit") {
        navigate(`/incentivesList/incentivesForm/${encryptDataForURL(
          row["incentive_id"]
        )
          }`);
      }
    }
    else if (moduleType === "marketPlaceListing") {
      if (action?.label == "Edit") {
        navigate(`/market/marketForm/${encryptDataForURL(
          row["id"]
        )
          }`);
      }

    }
    else if (moduleType === "ShipmentList") {
      if (action?.label == "Edit") {
        navigate(`/shipment/shipmentForm/${encryptDataForURL(
          row["id"]
        )
          }`);
      }

    }
    else {
      if (action?.status == "testReport") {
        // navigate(
        //   action?.redirectUrl +
        //   "/" +
        //   encryptDataForURL(row["internal_certificate_id"])
        // );
        navigate(`/testReport/previewPDF/${encryptDataForURL(row["internal_certificate_id"])}` + "?ReferenceNo=" +
          encryptDataForURL(row?.jrf_referenceno));
        // handleTestReport(row, action);
      } else {
        if (row["jrf_status"] === "saved") {
          if (row["jrf_is_ops"]) {
            navigate(
              "/jrfListing/operation-jrf?status=" +
              encryptDataForURL("Edit") +
              "&id=" +
              encryptDataForURL(jrf_id)
            );
          } else {
            if (row["jrf_is_external"]) {
              navigate(
                "/jrfListing/external-jrf?status=" +
                encryptDataForURL('Edit') +
                "&id=" +
                encryptDataForURL(jrf_id)
              );
            }
            else {
              navigate(
                "/jrfListing/jrf?status=" +
                encryptDataForURL("Edit") +
                "&id=" +
                encryptDataForURL(jrf_id)
              );
            }
          }
        } else if (row["jrf_is_ops"] && row["jrf_status"] === "posted") {
          navigate(
            "/jrfListing/operation-inwardForm-checklist?status=" +
            encryptDataForURL("checklist") +
            "&id=" +
            encryptDataForURL(jrf_id)
          );
        } else if (
          user?.role === "LR" &&
          status === "rejected" &&
          row["jrf_is_external"]
        ) {
          navigate(
            "/jrfListing/external-jrf?status=" +
            encryptDataForURL(action?.status) +
            "&id=" +
            encryptDataForURL(jrf_id)
          );
        }
        else if (
          status === "rejected" &&
          row["jrf_is_ops"]
        ) {
          navigate(
            "/jrfListing/operation-jrf?status=" +
            encryptDataForURL(action?.status) +
            "&id=" +
            encryptDataForURL(jrf_id)
          );
        } else {
          navigate(
            action?.redirectUrl +
            "?status=" +
            encryptDataForURL(action?.status) +
            "&id=" +
            encryptDataForURL(jrf_id)
          );
        }
      }
    }
  };


  const checkRoleBseCondition = (buttonDetails) => {

    if (moduleType === "jrf") {
      if (user?.role === "LR" && status === "rejected") {
        if (!row['jrf_is_external'] && !row['jrf_is_regular']) {
          return false;
        }
        else if (!row['jrf_is_external']) {
          return false;
        }
      }
    }
    else if (moduleType === "allotment") {
      if (user?.role === "DTM") {
        if (user?.logged_in_user_info?.usr_id !== row['sa_sampleallottedto']) {
          return false;
        }
      }
      else if (user?.role === "LC") {
        if (GetTenantDetails(1, 1) === "TPBPL") {
          return false;
        }
      }
    }
    else if (['jobinstruction', 'jioperationjsonb'].includes(moduleType)) {
      // if (user?.role === "BU") {
      //   if (user?.logged_in_user_info?.usr_id !== row['fk_useropsexecutiveid']) {
      //     return false
      //   }
      // }
    }
    else if (moduleType === "jobCosting") {
      if (['cancelled'].includes(buttonDetails.btnshortName) && row?.fk_im_id?.im_is_jc_comment) {
        return false;
      }
    }
    else if (moduleType === "purchase") {
      if (['posted', 'Pre-Close'].includes(buttonDetails.btnshortName) && row?.fk_approval_id !== user?.logged_in_user_info?.usr_id) {
        return false;
      }
    }
    else if (moduleType === "purchaseReq") {
      if (!getPurchaseManager(moduleType,"change")) {
        if (['saved', 'reject'].includes(buttonDetails.btnshortName)) { 
          return false;
        }
      }
      if (['sent for approval'].includes(buttonDetails.btnshortName) && row?.req_fk_approval_id !== user?.logged_in_user_info?.usr_id) {
        return false;
      }
    }
    else if (['supplier', 'stocks', 'calibration'].includes(moduleType)) {
      if (['saved', 'posted'].includes(buttonDetails.btnshortName) && !getPurchaseManager(moduleType,"change")) {
        return false;
      }
    }
    if (['jrf', 'sampleinward'].includes(moduleType)) {
      if (['testmemoresult', 'testReport'].includes(buttonDetails.btnshortName) && !row['internal_certificate_id']) {
        return false;
      }
    }

    return true;
  };
  const chkBtnExists = (action) => {
    const validConditions = user?.role ? getBtnListArray() : [];

    const filterData = validConditions.filter((condition) => {
      if (!checkRoleBseCondition(condition)) {
        return false;
      }
      if (action.isDupplicate) {
        return (
          condition.btnStatus.toLowerCase() === status.toLowerCase() &&
          condition.btnshortName.toLowerCase() === action?.status.toLowerCase()
        );
      } else {
        return (

          condition.btnStatus.toLowerCase() === status.toLowerCase() && condition.label.toLowerCase() === action?.label.toLowerCase()
        );
      }
    });
    return Boolean(filterData.length > 0);
  };
  return actions.map((action, actionIndex) => {

    let isValid;
    isValid = status && chkBtnExists(action);


    if (!isValid || action?.type === "icon") {
      return null;
    }
    if (['jobinstruction', 'jioperationjsonb'].includes(moduleType)) {
      if (user?.role === "BU") {
        if (user?.logged_in_user_info?.usr_id !== row['fk_useropsexecutiveid']) {
          return row['status'] === "accepted" ? (<button
            type="button"
            key={"listing-action" + actionIndex}
            className="iconBtn"
            onClick={() => handleOnclick(action)}
          >

            View
          </button>) : null
        }
      }
    }
    // if (["invoice"].includes(moduleType)) {
    //   if (row["im_is_debit_created"] && row["im_status"] != "debit_save") {
    //     return null
    //   }
    // }
    if (["invoice"].includes(moduleType)) {
      if (row["im_is_debit_created"] && row["im_status"] === "debit_save") {
        return null
      }
    }
    return (

      <button
        type="button"
        key={"listing-action" + actionIndex}
        className="iconBtn"
        onClick={() => handleOnclick(action)}
      >
        {action?.label}
      </button>
    );
  });
}

export default ListingActionButton;
