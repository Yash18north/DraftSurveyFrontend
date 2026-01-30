import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  NavItem,
  NavLink,
  Col,
  Button,
} from "react-bootstrap";
import classnames from "classnames";
import RenderTableSection from "./RenderTableSection";
import RenderAssignmentTableSection from "./RenderAssignmentTableSection";
import RenderTableSectionCertificate from "./RenderTableSectionCertificate";
import RenderAdvTableSection from "./RenderAdvTableSection";
import RenderConfigureTable from "./RenderConfigureTable"
import PropTypes from "prop-types";

import RenderListSection from "./RenderListSection";
import RenderAccordionSection from "./RenderAccordionSection";
import RenderFields from "./RenderFields";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "./Popup";
import PopupGA from "./PopupGAForm";
import PopupSearch from "./PopupSearch";
import Loading from "./Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  getDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../services/commonServices";
import {
  SFMUpdateApi,
  allotmentCreateApi,
  allotmentUpdateApi,
  documentShareCreate,
  getSimgleAllotmentDetailsApi,
  sampleverificationCreateApi,
  sampleverificationSingleApi,
  documentCreateApi,
  folderCreateApi,
  ccUpdateApi,
  ccCertPdfApi,
  masterUploadApi,
  reportConfigUpdateApi,
  reportConfigCreateApi,
  ccCertCreateApi,
  rakeQAPdfApi,
  stackQAPdfApi,
  getReferenceWiseDataApi,
  bulkCargoPDF,
  physicalAnalysisPDF,
  tmlMoisturePDFApi,
  opsRakeSVPDFApi,
  opsStackSVPDFApi,
  purchaseOrderDownload,
  purchaseOrderInsuranceDownload,
  purchaseOrderVenRatingDownload
} from "../../services/api";

import {
  CommonTMRoles,
  getActivityCode,
  getActivityName,
  getLMSOperationActivity,
  getPlantOperations,
  getRakeOperations,
  getVesselOperation,
  getStackOperations,
  isModuelePermission,
  rolesDetails,
  getUniqueData,
  getVoucherTypes,
  getRakeCollectionActivity,
  getOperationActivityUrl,
  getFormatedDate,
  getDateFromCreatedAt,
  getPurchaseManager,
  handleCommonCustomConfirmHandler,
  getCurrentRole
} from "../../services/commonFunction";

import { useSelector, useDispatch } from "react-redux";
import DeleteConfirmation from "./DeleteConfirmation";
import RejectPopupModal from "./RejectPopupModal";
import { useTranslation } from "react-i18next";
import RenderTablePreview from "./RenderTableSectionPreview";
import {
  getAllotmentDetails,
  getReferenceData,
  getSingleJRFData,
  handleJRFCreateOrUpdate,
  handleJRFCreateOrUpdateWithOperations,
} from "./commonHandlerFunction/JRFHandlerFunctions";
import {
  handleChecklistBtns,
  handleInwardMainSubmit,
  handleInwardStatusChange,
} from "./commonHandlerFunction/sampleInwardHandlerFunctions";
import GroupAssignmentButtons from "./ShowButtons/GroupAssignmentButtons";
import GroupAssignmentPreviewButtons from "./ShowButtons/GroupAssignmentPreviewButtons";
import SampleInwardButtons from "./ShowButtons/SampleInwardButtons";
import InternalCertificateButtons from "./ShowButtons/InternalCertificateButtons";

import ViewCheckListButtons from "./ShowButtons/ViewCheckListButtons";
import JRFButtons from "./ShowButtons/JRFButtons";
import JIButtons from "./ShowButtons/operations/JIButtons";
import TenderButton from "./ShowButtons/Tender/TenderButton";
import TestMemoButtons from "./ShowButtons/TestMemoButtons";
import SampleVerificationButtons from "./ShowButtons/SampleVerificationButtons";
import AllotmentButtons from "./ShowButtons/AllotmentButtons";
import OperationCertificateButtons from "./ShowButtons/OperationCertificateButtons";
import CommercialCertificateButtons from "./ShowButtons/CommercialCertificateButtons";
import InvoicePreviewButtons from "./ShowButtons/InvoicePreviewButtons";
import {
  changeTestMEmoStatuChange,
  getTestMemoDetails,
  getTestMemoDetailsWithCertificate,
  handleTestMemoDelete,
  handleTestMemoStatusChange,
} from "./commonHandlerFunction/testMemoFunctionHandler";
import RenderAdvtestMemoTableSection from "./RenderAdvtestMemoTableSection";
import { getVerificationDetailsHandler, handleSampleVerificationMainSubmit, handleVerificationMain } from "./commonHandlerFunction/sampleVerificationHandlerFunctions";
import RenderAdvSFMTableSection from "./RenderAdvSFMTableSection";
import {
  getallFormulaList,
  getSFMDetails,
  handleSFMCreateWithoutVerification,
  handleSFMVerificationMain,
} from "./commonHandlerFunction/sfmHandlerFunctions";
import SFMButtons from "./ShowButtons/SFMButtons";
import {
  changeTestReportStatusChange,
  checkICULRNoAvailibility,
  getCertificateDetailsById,
  handleIntarnalCertificateCreateUpdate,
} from "./commonHandlerFunction/intenralCertificateHandlerFunction";
import { saveAs } from "file-saver";
import OverlayLoading from "./OverlayLoading";
import {
  createQualityAnalysisHandler,
  geSamplingMethodMasterData,
  getBranchDetailsById,
  getBranchDetailsData,
  getclientDetails,
  getclientDetailsJRF,
  getJIsowandactivityData,
  getReferenceNoListData,
  getSingleJiRecord,
  getSubCommodityData,
  handleJICreateOrUpdate,
  handleJIUpdateStatus,
} from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import {
  getReportConfig,
  getCommercialCertificateSingle,
  getCommercialCertificateTopBottom,
  handleCommonUploadFile,
  getConfigDatabyji_jis_id,
  handleConfigSave,
} from "./commonHandlerFunction/CommercialCertificateHandlerFunctions";
import RenderSubListSection from "./RenderSubListSection";
import RenderSubListSectionPagination from "./RenderSubListSectionWithPagination";

import {
  getSingleDraftSurveyData,
  getSingleHHData,
  getSingleSupervissionData,
  Operation_DraftSurvey_CreateDataFunction,
  Operation_HH_CreateDataFunction,
  Operation_Supervision_CreateDataFunction,
  OperationCreateDataFunction,
  OperationSampleCollectionCreateDataFunction,
  OperationSizeAnalysisCreateDataFunction,
  // getSingleCSData,
  OperationCargoSupervisionCreateDataFunction,
  getSingleSizeAnalysisData,
  Operation_BulkCargo_CreateDataFunction,
  vesselListNextFunctionality
} from "./commonHandlerFunction/operations/TMLOperations";

import {
  decryptDataForURL,
  encryptDataForURL,
} from "../../utills/useCryptoUtils";
import RenderTableOperationSection from "./RenderTableOperationSection";
import RenderVesselInfoTable from "./RenderVesselInfoTable";
import {
  getTPISetDetails,
  handleSFMCreateWithOperations,
  handleSFMUpdateWithOperations,
} from "./commonHandlerFunction/operations/TPIHandlerFunctions";
import RenderTableSetAllManualSection from "./RenderTableSetAllManualSection";
import { isValidPhoneNumber } from "react-phone-number-input";
import RenderTableForDraftSurveySection from "./RenderTableForDraftSurveySection";
import JIPopupModal from "./commonModalForms/JIPopupModal";
import {
  checkCettificateNoAvailibility,
  getNonLMSDetailsById,
  downLoadNonLMSCertificatePDFById,
} from "./commonHandlerFunction/OPscertificate/OPSCertificateHandlerFunctions";

import { getSingleQualityAnalysisData, getSingleQualityAssesmentData, OperationQualityAnalysisCreateDataFunction, OperationQualityAssesmentCreateDataFunction } from "./commonHandlerFunction/operations/RakeHandlerOperation";

// Removed truck operation imports
import RenderTableManualMultiEntrySection from "./RenderTableManualMultiEntrySection";


import { useLocation } from 'react-router-dom';
import ConsortiumButton from "./ShowButtons/operations/ConsortiumButton";
import InvoiceButton from "./ShowButtons/operations/InvoiceButton";


import { getSingleConsortiumRecord, handleConsortiumCreateOrUpdate } from "./commonHandlerFunction/operations/consortiumHandlerFunctions";

import JobCostingButton from "./ShowButtons/JobCosting";
import { Input } from "reactstrap";
// import { handleFormCreateAndUpdate } from "./commonHandlerFunction/Audit/JobCosting/JobCostingHandlerFunction";
// import { getInvoiceData, handleInvoiceCreateOrUpdate } from "./commonHandlerFunction/InvoiceHandlerFunctions";
import DocumentPopup from "../../views/Document/UploadFiles/DocumentPopup";
// Removed SalesRegisterButtons import statement


import { handleInvoiceCreateOrUpdate, getInvoiceData, handleInvoiceStubUpdate, hanfleInvoiceStatusChange } from "./commonHandlerFunction/InvoiceHandlerFunctions";


import { set } from "rsuite/esm/internals/utils/date";
// import DocumentPopup from "../../views/Document/UploadFiles/DocumentPopup";
import Document from "../../formJsonData/Operations/jobinstructions/DocumentPopup.json";
import RenderTallyListSection from "./RenderTallyListSection ";
import PurchaseButtons from "./ShowButtons/Purchase/PurchasingOrder/PurchaseButtons";
import PurchaseRequistionButtons from "./ShowButtons/Purchase/PurchaseRequistion/PurchaseRequistionButton";
import CalibrationsButtons from "./ShowButtons/Purchase/Calibration/CalibrationsButtons";
import SupplierButtons from "./ShowButtons/Purchase/Supplier/SupplierButtons";
import PopUpPurchaseReq from "./PopUpPurchaseReq";
import { handleGetPurchaseReq, handlePurchaseReqUpdateCreate } from "./commonHandlerFunction/Purchase/PurchaseReq/PurchaseRequsitionHandler";
import { handleGetSupplier } from "./commonHandlerFunction/Purchase/Supplier/SupplierHandler";
import { calculateTotalGST, handleGetPurchaseReqTableData } from "./commonHandlerFunction/Purchase/PurchaseReq/PurchaseReqTableHandler";
import { handleGetCalibration } from "./commonHandlerFunction/Purchase/Calibration/CalibrationHandler";
import { getCalculationsForPrice, getCalculationsForTotal, handleGetPurchaseOrder, handlePurchaseOrderCreateUpdate } from "./commonHandlerFunction/Purchase/PurchaseOrder/PurchaseOrderHandler";
import { handleGetTender } from "./commonHandlerFunction/Tender/TenderHandlerFunc";
import ChemicalStocksButtons from "./ShowButtons/ChemicalStocks/Stocks";
import { getChemicalStock } from "./commonHandlerFunction/ChemicalStocks/ChemicalstockHandler";
import FeedbackButton from "./ShowButtons/Feedback/FeedbackButton";
import IncentiveButton from "./ShowButtons/Feedback/IncentiveButton";
import { handleGetFeedback } from "./commonHandlerFunction/Feedback/FeedbackHandler";
import { handleGetCategory } from "./commonHandlerFunction/Purchase/Category/CategoryHandler"
import { getBillingDelayDayCount, getJobCostingIncDataFunc, handleGetIncentive, incentivesCalculationData } from "./commonHandlerFunction/Feedback/IncentiveHandler";
import PurchaseItemButton from "./ShowButtons/Purchase/Items/PurchaseItemButton";
import { handleGetPurchaseItem } from "./commonHandlerFunction/Purchase/Items/ItemsHandler";
import moment from "moment";
import { handleActivityForInvoice, handleMultipleRefForInvoice } from "./commonHandlerFunction/operations/invoiceHandlerFunctions";
import CustomPopupModal from "./commonModalForms/CustomPopupModal";
import { handleGetclientMAsterData, handleGetUserMAsterData } from "./commonHandlerFunction/MasterData/Users/userHandler";
import CategoryBtn from "./ShowButtons/Purchase/Category/CategoryBtns";
import ClientDetailsButtons from "./ShowButtons/ClientDetails/ClientDetailsButtons";
import { ClientDetailsButtons as stubClientDetailsButtons } from "../../utils/stubFunctions";
import ShipmentButtons from "./ShowButtons/Shipment/ShipmentButton";
import MarketPlaceButton from "./ShowButtons/MarketPlace/MarketPlaceButtons";
import { handleGetAShipmet } from "./commonHandlerFunction/Shipment/ShipmentHandler";

export const selectUser = (state) => state.user;
export const selectRolePermissions = (state) => state.rolePermissions;
const hideMap = {
  courier_hand_delivery: [
    "courier_address"
  ],
  direct_courier: [
    "courier_persone_name",
    "courier_reciever_name",
    "courier_date_submission",
    "courier_submission_address"
  ],
  hand_delivery: [
    "courier_service_name",
    "courier_tracking_no",
    "courier_date",
    "courier_recieved_date",
    "courier_done_by_executive",
    "courier_address",
    "courier_acknowledge_by"
  ],
  hardcopy: [
    "courier_service_name",
    "courier_tracking_no",
    "courier_date",
    "courier_recieved_date",
    "courier_done_by_executive",
    "courier_address",
    "courier_acknowledge_by",
    "courier_persone_name",
    "courier_reciever_name",
    "courier_date_submission",
    "courier_submission_address"
  ],
};
const Forms = ({
  formConfig,
  masterResponse,
  getSampleIdsMasterData,
  searchConfigJson,
  getAssignmentMasterData,
  setTestMemoId,
  testMemoId,
  testReportPrweview,
  isExternalJRF,
  totalSamples,
  setMasterResponse,
  useForComponent,
  isViewOnlyTable,
  operationStepNo,
  tileHeader,
  operationMode,
  isRegularJRF,
  ...props
}) => {
  let {
    EditRecordId,
    editReordType,
    TMLType,
    TMLID,
    TPIID,
    operationName,
    EditSubRecordId,
    JISID,
    RPCID,
    ConfigID,
    FolderID,
    DocID,
    activityID,
    poId
  } = useParams();
  EditRecordId = EditRecordId ? decryptDataForURL(EditRecordId) : "";
  TMLType = TMLType ? decryptDataForURL(TMLType) : "";
  TMLType = getActivityCode(TMLType)
  TMLType = TMLType && TMLType.toLowerCase() != "othertpi" ? TMLType.toLowerCase() : TMLType
  TMLID = TMLID ? decryptDataForURL(TMLID) : "";
  EditSubRecordId = EditSubRecordId ? decryptDataForURL(EditSubRecordId) : "";
  activityID = activityID ? decryptDataForURL(activityID) : "";
  const dispatch = useDispatch();
  [TPIID, operationName, JISID, RPCID, ConfigID, FolderID, DocID, poId] = [
    TPIID,
    operationName,
    JISID,
    RPCID,
    ConfigID,
    FolderID,
    DocID,
    poId
  ].map((item) => (item ? decryptDataForURL(item) : ""));

  editReordType = editReordType ? decryptDataForURL(editReordType) : "";
  operationName = operationName ? decryptDataForURL(operationName) : "";
  const { t } = useTranslation();
  const translate = t;
  let user = useSelector(selectUser);
  const session = useSelector((state) => state.session);
  user = session.user;
  const cc_ids = session?.cc_ids;
  const ref_nos = session?.ref_nos ? [...new Set(session.ref_nos)] : [];
  const activities = session?.activities;
  const selectedMultiDocs = session?.selectedMultiDocs;
  const ccEmails = session?.ccEmails || [];
  const clientEmails = session?.clientEmails;
  const ccMailBody = session?.ccMailBody;
  const ccMailSubject = session?.ccMailSubject;
  let rolePermissions = useSelector(selectRolePermissions);
  rolePermissions = session?.user?.permissions;
  const [activeTab, setActiveTab] = useState("1-0");
  const [formData, setFormData] = useState({});
  const [searchFormData, setSearchFormData] = useState({});
  const [searchFormDataType, setSearchFormDataType] = useState({});
  const [searchFormDataErros, setSearchFormDataErros] = useState({});
  const [isFilterBtnClicked, setIsFilterBtnClicked] = useState(false);
  const [tableLength, setTableLength] = useState(0);

  const [filterIndex, setFilterIndex] = useState(1);

  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formConfigState, setFormConfigState] = useState(formConfig);
  const [rowAdded, setRowAdded] = useState(false);
  const [searchby, setSearchby] = useState(false);
  const [fileUrl, setFileUrl] = useState()
  const [response, setResponse] = useState({});
  const [statusCounts, setStatusCounts] = useState([]);
  const [jrfId, setJrfId] = useState();
  const [referenceData, setReferenceData] = useState({});
  const [isValideReferenceNo, setIsValideReferenceNo] = useState("");
  const [tempJson, setTempJson] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [jrfCreationType, setJrfCreationType] = useState("");
  const [viewOnly, setViewOnly] = useState(false);
  const [pageType, setPageType] = useState("");
  const [remarkText, setRemarkText] = useState("");
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [action, setAction] = useState("");
  const [actionClicked, setActionClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [inwardBtnchange, setInwardBtnchange] = useState("");
  const [subTableData, setSubTableData] = useState([]);


  const [istavSaveClicked, setIstavSaveClicked] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  ////For Group Assignment Only....
  const [gaData, setGaData] = useState([]);
  const [showModalGA, setShowModalGA] = useState(false);
  const [tabOpen, setTabOpen] = useState(true);
  const [tabOpenSecond, setTabOpenSecond] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [simpleInwardResponse, setSimpleInwardResponse] = useState([]);
  const [testMemoSetData, setTestMemoSetData] = useState([]);
  const [groupDefaultValue, setGroupDefaultValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [LoadingText, setLoadingText] = useState(null);

  const [loadingTable, setLoadingTable] = useState(true);
  const [isDisplayNewAddOption, setIsDisplayNewAddOption] = useState(false);
  const [testReportData, setTestReportData] = useState("");
  const [subCommodityOptions, setSubCommodityOptions] = useState([]);
  const [customOptions, setCustomOptions] = useState([]);
  const [isRefrenceNoCalled, setIsRefrenceNoCalled] = useState(true);
  const [isOverlayLoader, setIsOverlayLoader] = useState(false);
  const [isStatusCountCalled, setIsStatusCountCalled] = useState(false);
  const [allFormulaList, setAllformulaList] = useState([]);
  const [editModuleId, setEditModuleId] = useState("");
  const [OperationType, setOperationType] = useState("");
  const [OpsConfigID, setOpsConfigID] = useState("");
  const [OperationTypeID, setOperationTypeID] = useState("");
  const moduleType = formConfig?.sections[0]?.moduleType;
  const moduleSubType = formConfig?.sections[0]?.moduleSubType;
  const listModuleType = formConfig.listView?.moduleType;
  const listSubModuleType = formConfig.listView?.subModuleType;
  const [isTestMethods, setIstestMethods] = useState(false);
  const [isValideValue, setIsValideValue] = useState(true);
  const [JRFTPIFormData, setJRFTPIFormData] = useState({});
  const [viewDetail, setViewDetail] = useState(false);
  const [parameterDataTableMain, setParameterDataTableMain] = useState([]);
  const [popupType, setPopupType] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [sharingPdfUrl, setSharingPdfUrl] = useState(null);
  const [kpiValue, setKpiValue] = useState("");
  const [isSubSectionSave, setIsSubSectionSave] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [activityJIID, setActivityJIID] = useState('');
  const [resendShareFile, setResendShareFile] = useState(false);
  const [simpleInwardId, setSimpleInwardId] = useState("");
  const [labDropDownOptions, setLabDropDownOptions] = useState([])
  const [branchName, setBranchName] = useState([])
  const [uploadPopup, setUploadPopup] = useState(false);
  // const [fileUrl, setFileUrl] = useState("");
  // const [popupJson, setPopupJson] = useState(Document.upload.changeDescriptionJson);
  const [popupJson, setPopupJson] = useState();
  const [popupAddPurchaseReq, setPopupAddPurchaseReq] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false);
  const [customFilterData, setCustomFilterData] = useState({});
  const [participantFields, setParticipantFields] = useState(0);
  const [newExraFields, setNewExtraFields] = useState(0);
  const [prevParticipantIndex, setPrevParticipantIndex] = useState();
  const [sizeofPage, setSizeOfPage] = useState(0);
  const [isCustomPopup, setIsCustomPopup] = useState(false);
  let navigate = useNavigate();
  


  let vieableArr = [
    "view",
    "inward",
    "assignment",
    "checklist",
    "assignment-view",
  ];
  useEffect(() => {
    if (formConfig.listView) {
      getAllStatusCount();
    }
    if (moduleSubType === "ShareFiles") {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ds_cc_email: ccEmails,
            email_multiple_input: clientEmails ? [clientEmails] : [],
            email_subject: ccMailSubject || '',
            email_message: ccMailBody || '',
          },
        };
      });
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    if (customFilterData?.[1]?.search_financial_year) {
      getAllStatusCount();
      getAllListingData();
    }
  }, [customFilterData?.[1]?.search_financial_year]);

  console.log("object",EditRecordId)
  useEffect(() => {
    try {
      setIsOverlayLoader(true)
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split("?")[1]);
      setPageType('')
      setViewOnly(false)
      if (moduleType === "allotment") {
        const id = decryptDataForURL(params.get("testMemoId"));
        const view = decryptDataForURL(params.get("view"));
        if (view === "view") {
          setViewOnly(true);
          setAction(view);
        }
        setTestMemoId(id);
        if (id) {
          getTestMemoDetails(
            id,
            setTabOpen,
            setFormData,
            setTestMemoSetData,
            "",
            setIsOverlayLoader
          );
        } else {
          getAllotmentDetails(setFormData, setIsOverlayLoader);
        }
      } else if (moduleType === "sampleverification") {
        const sampleAllotmentId = decryptDataForURL(
          params.get("sampleAllotmentId")
        );
        const view = decryptDataForURL(params.get("view"));
        if (view === "view") {
          setViewOnly(true);
          setAction("View");
        }
        if (sampleAllotmentId) {
          getAllotmentDetails(setFormData, setIsOverlayLoader);
        } else {
          getVerificationDetails();
        }
      } else if (moduleType === "testmemomain") {
        const id = decryptDataForURL(params.get("testMemoId"));
        const view = decryptDataForURL(params.get("view"));
        const status = decryptDataForURL(params.get("status"));

        setPageType(status);
        if (view == "view") {
          setViewOnly(true);
          setAction(view);
        }
        setTestMemoId(id);
        getTestMemoDetails(
          id,
          setTabOpen,
          setFormData,
          setTestMemoSetData,
          "",
          setIsOverlayLoader
        );
      } else if (moduleType == "internalcertificate") {
        const id = decryptDataForURL(params.get("testMemoId"));
        const editId = decryptDataForURL(params.get("editId"));
        const view = decryptDataForURL(params.get("view"));
        const status = decryptDataForURL(params.get("status"));
        setPageType(status);
        if (view === "view" || !['LR', 'SU'].includes(user?.role)) {
          setViewOnly(true);
          setAction(view);
        }
        if (editId) {
          getCertificateDetailsById(
            editId,
            setTabOpen,
            setFormData,
            setTestMemoId,
            "",
            setViewOnly,
            getAssignmentMasterData,
            setIsValideValue,
            setSubTableData
          );
        } else if (id) {
          setTestMemoId(id);
          getTestMemoDetailsWithCertificate(
            id,
            setTabOpen,
            setFormData,
            setTestMemoSetData,
            setTestReportData,
            getAssignmentMasterData,
            setIsValideValue,
            user,
            setCustomOptions,
            setIstestMethods
          );
        }
      } else if (moduleType == "sfm") {
        const id = decryptDataForURL(params.get("sfmid"));
        const view = decryptDataForURL(params.get("view"));
        if (view === "view") {
          setViewOnly(true);
        }
        getSFMDetails(
          id,
          setFormData,
          setTabOpen,
          setIstavSaveClicked,
          setTestMemoSetData,
          view === "view",
          formData
        );
        getallFormulaList(setAllformulaList);
      }
      else if (moduleType == "jobinstruction") {
        setTabOpen(false);
      }
      else if (moduleType == "invoice") {
        setTabOpen(false);
        const status = decryptDataForURL(params.get("status"));
        setPageType(status);
        if (status == "View") {
          setTabOpen(true)
          setViewOnly(true);
          setAction(status);
          setTimeout(() => {
            getInvoiceData(
              EditRecordId,
              setFormData,
              setSubTableData,
              formData,
              formConfig?.sections[1]?.tabs[0]?.rows,
              status
            );
          }, 1000)

        }
        else if (status == "Edit") {
          setTabOpen(true)
          setAction(status);
          setTimeout(() => {
            getInvoiceData(
              EditRecordId,
              setFormData,
              setSubTableData,
              formData,
              formConfig?.sections[1]?.tabs[0]?.rows,
              status
            );
          }, 1000)

        }
      }
      else if (moduleType == "vesselJICertificate" && configCertStatusRPCID) {
      }
      else if (moduleType == "jobCosting" && EditRecordId) {
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
      }
      else if (moduleType == "auditBranchExpenses") {
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
      }
      else if (moduleType === "auditOutstanding") {
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
      }
      else if (moduleType === "auditSalesRegister") {
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
      }
      else if (moduleType === "tender") {
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
        if (EditRecordId) {
          handleGetTender(
            EditRecordId,
            setFormData,
            status,
            setParticipantFields
          )
        }
      }
      else if (moduleType === "stocks") {
        if (status === "View") {

          setViewOnly(true);
          setAction(status);
        }
        if (EditRecordId) {
          getChemicalStock(
            EditRecordId,
            setFormData,
            status,
            viewOnly
          )
        }
      }
      else if (moduleType === "purchaseReq") {

        if (status === "View" || ["Sent for Approval", "Posted"].includes(formData[0]?.req_status)) {

          setViewOnly(true);
          setAction(status);
        }
        if (EditRecordId) {
          handleGetPurchaseReq(
            EditRecordId,
            setFormData,
            setSubTableData,
            viewOnly,
            status
          )
          setTabOpen(true);

        }


      }
      else if (["purchase", "PoPreview"].includes(moduleType)) {
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
        if (EditRecordId) {
          handleGetPurchaseOrder(
            EditRecordId,
            setFormData,
            setSubTableData,
            viewOnly,
            status
          )
        }
      }
      else if (moduleType === "supplier") {
        if (status === "View") {

          setViewOnly(true);
          setAction(status);

        }
        if (EditRecordId) {
          handleGetSupplier(
            EditRecordId,
            setFormData,

          )
        }
      }
      else if (moduleType === "calibration") {
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
      }
      else if (['purchaseItems', 'purchaseReq', 'userMaster', "category"].includes(moduleType)) {
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
      }
      else if (moduleType === "incentives") {
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
        if (EditRecordId) {

          handleGetIncentive(
            EditRecordId,
            setFormData,
            status,
            setIsOverlayLoader
          )
        }
      }
      else if (moduleType === "ShipmentForm") {
       
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
        if (EditRecordId) {

          handleGetAShipmet(
            EditRecordId,
            setFormData,
            status,
            setIsOverlayLoader
          )
        }
      }
      else if (moduleType === "marketPlaceForm") {
     
        if (status === "View") {
          setViewOnly(true);
          setAction(status);
        }
        if (EditRecordId) {

          // handleGetIncentive(
          //   EditRecordId,
          //   setFormData,
          //   status,
          //   setIsOverlayLoader
          // )
        }
      }
      else {
        getSingleData();
        if (status.toLowerCase() !== "view") {
          if (isExternalJRF) {
            setFormData((prevFormData) => {
              return {
                ...prevFormData,
                0: {
                  ...prevFormData[0],
                  jrf_ext_contactpersonname:
                    user?.logged_in_user_info?.contact_person_name,
                  jrf_ext_contactpersonnumber:
                    user?.logged_in_user_info?.contact_person_number,
                  cmp_address:
                    user?.logged_in_user_info?.lab_or_branch?.lab_address,
                  jrf_lab: user?.logged_in_user_info?.lab_or_branch?.lab_id,
                  jrf_contact_person: user?.logged_in_user_info?.contact_person_name,
                  jrf_contact_person_number:
                    user?.logged_in_user_info?.contact_person_number,
                  jrf_branch:
                    user?.logged_in_user_info?.lab_or_branch?.branch_details?.br_id,
                },
              };
            });
          } else {
            setFormData((prevFormData) => {
              return {
                ...prevFormData,
                0: {
                  ...prevFormData[0],
                  jrf_contact_person: user?.logged_in_user_info?.contact_person_name,
                  jrf_contact_person_number:
                    user?.logged_in_user_info?.contact_person_number,
                  cmp_address:
                    isRegularJRF ? user?.logged_in_user_info?.lab_or_branch?.lab_address : user?.logged_in_user_info?.lab_or_branch?.branch_address,
                  jrf_lab: isRegularJRF ? user?.logged_in_user_info?.lab_or_branch?.lab_id : "",
                },
              };
            });
          }
        }

      }
    } finally {
      setIsOverlayLoader(false)
    }
  }, []);


  useEffect(() => {
    if (props.isMainJiSaved) {
      setTabOpen(true)
    }
  }, [props.isMainJiSaved])
  useEffect(() => {
    if (referenceNo !== "") {
      getReferenceData(
        referenceNo,
        setIsValideReferenceNo,
        formData,
        setReferenceData,
        setFormData,
        setSubCommodityOptions,
        setIsRefrenceNoCalled,
        setIsOverlayLoader
      );
    }
  }, [referenceNo]);
  useEffect(() => {

    setRowAdded(false);
  }, [rowAdded]);
  useEffect(() => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        0: {
          ...prevFormData[0],
          noOfSamples: totalSamples ? totalSamples.length : 0,
        },
      };
    });
  }, [formData[0]?.smpl_inwrd_No, totalSamples]);
  useEffect(() => {
    if (formConfig?.sections[0]?.moduleType === "internalcertificate") {
      if (
        formData[0]?.ic_is_size_analysis?.[0]
      ) {
        setTabOpen(true);
      } else {
        setTabOpen(false);
      }
    }
  }, [formData[0]?.ic_is_size_analysis]);

  useEffect(() => {
    if (moduleType == "operationCertificate") {
      if (formData[0]?.cc_is_rake_details?.length > 0 && formData[0]?.cc_is_rake_details?.[0]) {
        setTabOpen(true);
      }

      else {
        setTabOpen(false);
      }
    }
  }, [formData[0]?.cc_is_rake_details]);


  useEffect(() => {
    if (
      (["jobinstruction"].includes(moduleType) &&
        formData[0]?.fk_commodityid &&
        !editReordType && formConfig?.sections[0]?.isMainPage) || ["consortiumorder"].includes(moduleType)) {
      const subcmdfield = ["consortiumorder"].includes(moduleType) ? 'fk_sub_commodity_id' : "fk_subcommodityid"
      const cmdfield = ["consortiumorder"].includes(moduleType) ? 'fk_commodity_id' : "fk_commodityid"
      if (!(["consortiumorder"].includes(moduleType) && viewOnly)) {

        if (formData[0]?.[cmdfield]) {
          getSubCommodityData(
            formData[0]?.[cmdfield],
            setMasterResponse,
            setIsOverlayLoader,
            subcmdfield
          );
        }
      }
    }
    else if (["jobinstruction"].includes(moduleType) &&
      formData[0]?.fk_commodityid &&
      editReordType === "analysis" && user?.role === "OPS_ADMIN") {
      geSamplingMethodMasterData(formData[0]?.fk_commodityid, setMasterResponse, setFormData)
    }
  }, [formData[0]?.fk_commodityid, formData[0]?.fk_commodity_id]);
  useEffect(() => {
    if (
      ["jobinstruction"].includes(moduleType) &&
      formData[0]?.fk_branchid &&
      editReordType === "nomination"
      // && (!['posted', 'accepted'].includes(formData?.[0]?.status))
    ) {

      getBranchDetailsById(
        formData[0]?.fk_branchid,
        setMasterResponse,
        setIsOverlayLoader
      );
    }
  }, [formData[0]?.fk_branchid]);
  useEffect(() => {
    if (formData[0]?.ji_id) {
      getJIsowandactivityData(
        EditRecordId,
        setSubTableData,
        "quality_analysis_for_nominate",
        formData,
        setFormData
      );
    }
  }, [formData[0]?.ji_id])

  useEffect(() => {
    if (
      ["auditOutstanding", "auditSalesRegister"].includes(moduleType) && formData[0]?.company
    ) {
      const isMultiple = moduleType === "auditSalesRegister"
      let multipleFields = []
      if (moduleType === "auditSalesRegister") {
        multipleFields = ['credit_note_branch_name']
      }
      getBranchDetailsData(setMasterResponse, formData[0]?.company, 'branch_name', "branch_name", isMultiple, multipleFields)
    }
  }, [formData[0]?.company]);
  useEffect(() => {
    if (["jobinstruction", "invoice"].includes(moduleType)) {
      if (formData[0]?.fk_clientid && !viewOnly) {
        getclientDetails(
          formData[0]?.fk_clientid,
          setFormData,
          setIsOverlayLoader,
          formData,
          formData?.[0]?.fk_clientid == formData?.[1]?.fk_clientid,
        );
      } else {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              ji_client_address: prevFormData[0]?.ji_client_address || "-",
              ji_client_billing_address: prevFormData[0]?.ji_client_billing_address || "-",
              ji_client_email: prevFormData[0]?.ji_client_email || "-",
              ji_client_gst: prevFormData[0]?.ji_client_gst || "-",
              state_of_client: prevFormData[0]?.state_of_client || "-",
            },
          };
        });
      }
    }
  }, [formData[0]?.fk_clientid]);
  useEffect(() => {
    if (["jrf"].includes(moduleType)) {
      if (formData[0]?.fk_clientid) {
        if (status.toLowerCase() != "edit" && status.toLowerCase() != "view") {
          getclientDetailsJRF(
            formData[0]?.fk_clientid,
            setFormData,
            setIsOverlayLoader,
            formData,
            formData?.[0]?.fk_clientid == formData?.[1]?.fk_clientid,
          );
        }
      } else {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              ji_client_address: "-",
              ji_client_billing_address: "",
              ji_client_email: "",
              ji_client_gst: "-",
              state_of_client: "-",
            },
          };
        });
      }

    }
  }, [formData[0]?.fk_clientid]);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const action = decryptDataForURL(params.get("action"));
    let opType = decryptDataForURL(params.get("OperationType"));
    opType = getActivityCode(opType)
    opType = opType && opType.toLowerCase() != "othertpi" ? opType.toLowerCase() : opType
    const opTypeId = decryptDataForURL(params.get("operationId"));
    const fkConfigID = decryptDataForURL(params.get("ConfigID"));
    const JIID = decryptDataForURL(params.get("activityJIID"));


    const status = decryptDataForURL(params.get("status"));
    if (action === "View") {
      setViewOnly(true);
      setAction(action);
    } else if (action === "opsView") {
      setAction(action);
    }
    if (EditRecordId) {
      if (moduleType === "consortiumorder") {
        getSingleConsortiumRecord(
          formConfig.apiEndpoints.read,
          EditRecordId,
          setFormData,
          setIsOverlayLoader,
          action
        )
      }
      else if (moduleType === "calibration") {
        handleGetCalibration(
          EditRecordId,
          setFormData,
          setIsOverlayLoader
        )
      }
      else if (moduleType === "purchaseItems") {
        handleGetPurchaseItem(
          EditRecordId,
          setFormData,
          setIsOverlayLoader
        )
      }
      else if (moduleType === "category") {
        handleGetCategory(
          EditRecordId,
          setFormData,
          setIsOverlayLoader
        )
      }
      else if (moduleType === "userMaster") {
        handleGetUserMAsterData(
          EditRecordId,
          setFormData,
          setIsOverlayLoader
        )
      }
      else if (moduleType === "ClientDetails") {
        handleGetclientMAsterData(
          EditRecordId,
          setFormData,
          setIsOverlayLoader
        )
      }
      else {
        if (
          ['jobinstruction', 'vesselJICertificate', 'operationCertificate', 'JICommercialCertificateList'].includes(moduleType)
        ) {
          if (
            moduleType === "operationCertificate" && ['approve', 'Edit'].includes(status)
          ) {
            getCommercialCertificateSingle(
              EditRecordId,
              JISID,
              RPCID,
              setFormData,
              formData,
              formConfig.sections?.[1]?.tabs?.[0],
              setIsOverlayLoader,
              TMLType,
              setNewExtraFields,
              isUseForPhysical
            );
          } else {
            getSingleJiRecord(
              formConfig.apiEndpoints.read,
              EditRecordId,
              setFormData,
              setTabOpen,
              setIsOverlayLoader,
              editReordType,
              moduleType,
              formConfig,
              setSubTableData,
              formConfig?.sections,
              props.isMainJiSaved,
              user?.role,
              TMLType || OperationType || OPSTypeGl,
              JISID,
              operationMode,
              fkConfigIDGL
            );
          }
        }
        setOperationType(opType);
        setOperationTypeID(opTypeId);
        setOpsConfigID(fkConfigID);
        setActivityJIID(JIID);
        if (TMLType === "analysis") {
          if (EditRecordId && TMLID) {
            if (operationStepNo && operationStepNo != 3) {
              getSampleIdsMasterData(EditRecordId, TMLID);
            }

          }
        }
      }
    }
  }, [EditRecordId]);

  useEffect(() => {
    if (formData[0]?.["ji_id"]) {
      if (moduleType === "operationCertificate") {
        getCommercialCertificateTopBottom(
          setFormData,
          EditRecordId,
          OperationType,
          JISID,
          setNewExtraFields
        );
        if (RPCID) {
          getConfigDatabyji_jis_id(EditRecordId, JISID, setFormData, RPCID)
        }

      }
      else if (TMLType === "otherTPI") {
        getallFormulaList(setAllformulaList);
        getTPISetDetails(
          setTestMemoSetData,
          EditRecordId,
          OperationTypeID,
          setFormData,
          TPIID
        );
      }
      else if (moduleType == "vesselJICertificate" && configCertStatusRPCID) {
        getReportConfig(
          EditRecordId,
          EditSubRecordId,
          configCertStatusRPCID,
          setFormData,
          setSequence
        );
      }
    }
  }, [formData[0]?.["ji_id"]]);
  useEffect(() => {
    if (formData[0]?.["ji_id"]) {
      if (TMLType === getVesselOperation("HH")) {
        getSingleHHData(
          OperationTypeID,
          formData,
          setSubTableData,
          setIsOverlayLoader,
          setFormData,
          formConfig.sections?.[1]?.tabs?.[0]
        );
      } else if (TMLType === getVesselOperation("DS")) {
        getSingleDraftSurveyData(
          OperationTypeID,
          formData,
          setSubTableData,
          setIsOverlayLoader,
          setFormData,
          formConfig.sections?.[1]?.tabs?.[0],
          props.setIsTabOpened,
          activityJIID
        );
      } else if (TMLType === getVesselOperation("SV")) {
        getSingleSupervissionData(
          OperationTypeID,
          formData,
          setSubTableData,
          setIsOverlayLoader,
          setFormData,
          formConfig.sections?.[1]?.tabs,
          subTableData,
          activityJIID
        );
      }
      else if (TMLType === getVesselOperation('DM')) {
        getSingleSizeAnalysisData(
          OperationTypeID,
          formData,
          setSubTableData,
          setIsOverlayLoader,
          setFormData
        );
      }
      
    }
  }, [OperationType, formData[1]?.["ji_id"]]);
  useEffect(() => {
    if (formData[0]?.["ji_dual_port_seq"] === "Second") {
      getReferenceNoListData(setMasterResponse);
    }
  }, [formData[0]?.["ji_dual_port_seq"]]);
  useEffect(() => {
    if (TMLType === getVesselOperation('DS')) {
      if (props.isTabOpened) {
        setTabOpen(true)
      }
      else {
        setTabOpen(false)
      }
    }

  }, [props.isTabOpened])

  const getNarrationNumber = (activities) => {
    const resultString = activities?.map(item => {
      const date = new Date(item.cc_created_time);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
      const year = date.getFullYear();
      return `${item.cc_certificatenumber} - DT.${day}.${month}.${year}`;
    }).join(', ');

    return resultString
  }
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const Status = decryptDataForURL(params.get("status"));
    if (!["Edit", "View"].includes(Status)) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            reference_number: getUniqueData(ref_nos),
            cc_ids: getUniqueData(cc_ids),
            activities: activities,
            im_naration_no: getNarrationNumber(activities)
          },
        };
      });
    }
    else {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            activities: activities
          },
        };
      });
    }

  }, []);

  useEffect(() => {
    if (moduleType == "tally") {
      let UpdateDataforRow = JSON.parse(localStorage.getItem("row"));
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            ...UpdateDataforRow
          },
        };
      });
    }
  }, []);
  useEffect(() => {
    if (moduleType == "purchaseReq") {
      if (formData[0]?.req_no) {
        setTabOpen(true)
      }
      else {
        setTabOpen(false)
      }
    }
  }, [formData[0]?.req_no])
  useEffect(() => {
    if (moduleType == "invoice") {
      if (viewOnly) {
        return
      }
      if ((Type == "Advance" || formData[0]?.im_is_regular == "advance")) {
        // handleMultipleRefForInvoice([formData[0]?.reference_number_data], [formData[0]?.reference_number_data_jrf]);
        // handleActivityForInvoice([formData[0]?.reference_number_data], formData[0]?.activities, [formData[0]?.reference_number_data_jrf]);
        handleMultipleRefForInvoice(formData[0]?.reference_number_data || [], formData[0]?.reference_number_data_jrf, EditRecordId, Type, formData, cc_ids, user, setFormData, setMasterResponse);
        handleActivityForInvoice(formData[0]?.reference_number_data || [], formData[0]?.activities, formData[0]?.reference_number_data_jrf, EditRecordId, Type, formData, cc_ids, user, setFormData, setMasterResponse);
      }
      else {
        if (EditRecordId && formData[0]?.reference_number) {
          handleMultipleRefForInvoice(formData[0]?.reference_number.split(" , "), '', EditRecordId, Type, formData, cc_ids, user, setFormData, setMasterResponse);
          handleActivityForInvoice(formData[0]?.reference_number.split(" , "), [], '', EditRecordId, Type, formData, cc_ids, user, setFormData, setMasterResponse);
        }
        if (ref_nos?.length > 0) {
          handleMultipleRefForInvoice(ref_nos, formData[0]?.reference_number_data_jrf, EditRecordId, Type, formData, cc_ids, user, setFormData, setMasterResponse);
          handleActivityForInvoice(ref_nos, formData[0]?.activities, formData[0]?.reference_number_data_jrf, EditRecordId, Type, formData, cc_ids, user, setFormData, setMasterResponse);
        }
      }
      if (Type === "Advance" && !EditRecordId) {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              im_naration_no: formData[0]?.reference_number_data?.join(',')
            },
          };
        });
      }
    }
  }, [formData[0]?.reference_number]);
  useEffect(() => {
    if (moduleType != "invoice") {
      dispatch({
        type: "CC_IDS",
        cc_ids: [],
      });
      dispatch({
        type: "REF_NUMS",
        ref_nos: [],
      });
      dispatch({
        type: "CC_Activities",
        activities: [],
      });

    }
  }, [])

  /**
   * callback of confirmation popup submit click
   * @param {*} redirectURL 
   * @returns 
   */
  const getPopupConfirmationCallback = (redirectURL) => {
    if (inwardBtnchange) {
      if (inwardBtnchange === "allotment") {
        handleAllotSubmit();
      } else if (moduleType === "sampleverification") {
        return;
      } else if (inwardBtnchange === "sendToLab") {
        handleTestMemoStatusChange(
          testMemoId,
          navigate,
          "pending",
          formData,
          setIsOverlayLoader
        );
      } else if (inwardBtnchange === "reassign") {
        handleTestMemoDelete(testMemoId, navigate);
      } else {
        handleInwardStatusChange(
          inwardBtnchange,
          pageType,
          formData,
          navigate,
          jrfId,
          setIsOverlayLoader
        );
      }
    } else if (jrfCreationType && moduleType === "sampleverification") {
      if (jrfCreationType == "post") {
        handleVerificationMain(
          formData,
          navigate,
          testMemoId,
          setSaveClicked,
          setIsOverlayLoader
        );
      } else {
        navigate("/verificationList");
      }
    } else if (moduleType === "sfm") {
      if (jrfCreationType === "post") {
        if (!handleSubmit()) {
          return
        }
        handleSFMVerificationMain(
          formData,
          navigate,
          setLoading,
          setIsOverlayLoader,
          formConfig?.sections[0]
        );
      } else {
        navigate("/SFMList");
      }
    } else if (
      moduleType === "internalcertificate" ||
      listModuleType === "internalcertificate"
    ) {
      if (jrfCreationType == "save" || jrfCreationType == "post") {
        handleIntarnalCertificateCreateUpdate(
          formData,
          testMemoId,
          navigate,
          jrfCreationType,
          setIsOverlayLoader,
          subTableData,
          user
        );
      } else if (jrfCreationType == "approve") {
        changeTestReportStatusChange(
          decryptDataForURL(localStorage.getItem("icId")),
          navigate,
          "dtm-approved",
          "",
          1,
          getAllListingData,
          setIsPopupOpen,
          setIsOverlayLoader
        );
      } else if (jrfCreationType == "publish") {
        changeTestReportStatusChange(
          formData[0].ic_id,
          navigate,
          "publish",
          "",
          "",
          getAllListingData,
          setIsPopupOpen,
          setIsOverlayLoader
        );
      } else {
        navigate("/testReport");
      }
    } else if (moduleType === "jobinstruction") {
      if (['save', 'post', 'postOther', 'postJRF'].includes(jrfCreationType)) {
        if (useForComponent == "OperationDetails") {
          if (TMLType == getVesselOperation("HH")) {
            Operation_HH_CreateDataFunction(
              formData,
              setIsOverlayLoader,
              setIsPopupOpen,
              OperationType,
              OperationTypeID,
              navigate,
              subTableData,
              jrfCreationType,
              operationMode
            );
          } else if (OperationType == getVesselOperation("SV")) {
            Operation_Supervision_CreateDataFunction(
              formData,
              setIsOverlayLoader,
              setIsPopupOpen,
              OperationType,
              OperationTypeID,
              navigate,
              subTableData,
              jrfCreationType,
              operationMode,
              "",
              activeTab,
              setActiveTab,
              setSubTableData,
              setFormData,
              formConfig,
              '',
              generateCertificate
            );
          } else if (OperationType == getVesselOperation("DS")) {
            Operation_DraftSurvey_CreateDataFunction(
              formData,
              setIsOverlayLoader,
              setIsPopupOpen,
              OperationType,
              OperationTypeID,
              navigate,
              formConfig.sections[1].tabs[0],
              jrfCreationType,
              operationMode,
              setFormData,
              setSubTableData,
              props.setIsTabOpened
            );
          }
          else if (TMLType == getVesselOperation("CS")) {

            OperationCargoSupervisionCreateDataFunction(
              formData,
              setIsOverlayLoader,
              setIsPopupOpen,
              OperationType,
              OperationTypeID,
              navigate,
              subTableData,
              operationMode,
              jrfCreationType,
            );
          }
          else if (TMLType == getVesselOperation("bulk_crg")) {
            Operation_BulkCargo_CreateDataFunction(
              formData,
              setIsOverlayLoader,
              setIsPopupOpen,
              OperationType,
              OperationTypeID,
              navigate,
              jrfCreationType,
              operationMode,

            );
          }
          else if (TMLType == getRakeOperations('QAss')) {
            const isForMainSection = isSubSectionSave
            setIsSubSectionSave(false)
            OperationQualityAssesmentCreateDataFunction(
              formData,
              setIsOverlayLoader,
              setIsPopupOpen,
              OperationType,
              OperationTypeID,
              navigate,
              subTableData,
              jrfCreationType,
              operationMode,
              operationStepNo,
              '',
              formConfig.sections[1]?.tabs?.[0],
              setSubTableData,
              setFormData,
              formConfig,
              setActiveTab,
              activeTab
            );

            if (jrfCreationType === "post") {
              generateCertificate("uploadedDocument", "posted", '', 1)
            }
          }
          else if ([getRakeOperations('QA')].includes(TMLType) && isSubSectionSave) {
            const isForMainSection = isSubSectionSave
            setIsSubSectionSave(false)
            OperationQualityAnalysisCreateDataFunction(
              formData,
              setIsOverlayLoader,
              setIsPopupOpen,
              OperationType,
              OperationTypeID,
              navigate,
              jrfCreationType,
              operationMode,
              isForMainSection,
              formConfig.sections[0],
              setSubTableData,
              setFormData,
              formConfig,
              operationStepNo
            );
          }
          else if ([getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(TMLType)) {
            OperationCreateDataFunction(
              formData,
              setIsOverlayLoader,
              setIsPopupOpen,
              OperationType,
              OperationTypeID,
              navigate,
              "posted",
              "",
              [],
              "",
              1,
              "",
              operationMode
            );
            if (jrfCreationType === "post") {
              generateCertificate("uploadedDocument", "posted", '', 1)
            }
            const redirectUrl = getOperationActivityUrl(operationMode)
            navigate(
              redirectUrl + `${encryptDataForURL(
                formData[0].ji_id
              )}`
            );
          }
          else {
            if (operationStepNo == 4 || TMLType == getVesselOperation("DM")) {
              OperationSizeAnalysisCreateDataFunction(
                formData,
                setIsOverlayLoader,
                setIsPopupOpen,
                OperationType,
                OperationTypeID,
                navigate,
                subTableData,
                operationStepNo,
                operationMode,
                TMLType !== getVesselOperation("DM"),
                jrfCreationType
              );
            }
            else if (operationStepNo == 6) {
              OperationSampleCollectionCreateDataFunction(
                formData,
                setIsOverlayLoader,
                setIsPopupOpen,
                OperationType,
                OperationTypeID,
                navigate,
                subTableData,
                operationStepNo,
                operationMode
              );
            }
            else if (operationStepNo == 7) {
              OperationQualityAnalysisCreateDataFunction(
                formData,
                setIsOverlayLoader,
                setIsPopupOpen,
                OperationType,
                OperationTypeID,
                navigate,
                jrfCreationType,
                operationMode,
                '',
                formConfig.sections[1].tabs[0].fields,
                setSubTableData,
                setFormData,
                formConfig,
                operationStepNo
              );
            } else {
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
                "",
                "",
                operationMode
              );
            }
          }
        } else if (useForComponent == "OperationDetailsAssignment") {
          let JRFData = [];
          let TPIData = [];
          for (let obj in JRFTPIFormData[0]) {
            let name = obj.split("_");
            const id = name[name.length - 1];

            if (JRFTPIFormData[0][obj] && JRFTPIFormData[0][obj][0] === "Yes") {
              JRFData.push(id);
              TPIData.push(id);
            }
          }
          if (operationStepNo == 3 && !['postJRF', 'postOther', 'post'].includes(jrfCreationType)) {
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
              "",
              "",
              operationMode
            );
          } else {
            if (jrfCreationType === "postJRF") {
              if (JRFData.length === 0) {
                toast.error("Please choose Parameter for sent To JRF", {
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
                return;
              }
            } else if (jrfCreationType === "postOther") {
              if (TPIData.length === 0) {
                toast.error("Please choose Parameter for sent To External Results", {
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
                return;
              }
            }
            OperationCreateDataFunction(
              formData,
              setIsOverlayLoader,
              setIsPopupOpen,
              OperationType,
              OperationTypeID,
              navigate,
              jrfCreationType === "post" ? "input-completed" : "in-process",
              jrfCreationType === "post" ? 1 : "",
              jrfCreationType === "post" ? [] : (jrfCreationType === "postOther" ? TPIData : JRFData),
              operationStepNo,
              1,
              jrfCreationType,
              operationMode
            );
            if (jrfCreationType === "postOther") {
              handleSFMCreateWithOperations(
                formData,
                OperationType,
                OperationTypeID,
                navigate,
                setIsOverlayLoader,
                setIsPopupOpen,
                TPIData
              );
            } else if (jrfCreationType === "postJRF") {
              handleJRFCreateOrUpdateWithOperations(
                formData,
                setIsOverlayLoader,
                setIsPopupOpen,
                navigate,
                "/jrf/create",
                OperationTypeID,
                OperationType,
                JRFData,
                subTableData
              );
            }
          }
        } else if (useForComponent === "OperationDetailsOtherTPI") {
          handleSFMUpdateWithOperations(
            TPIID,
            jrfCreationType,
            navigate,
            setIsOverlayLoader,
            setIsPopupOpen
          );
        } else {
          if (editReordType === "analysis") {
            if (
              subTableData.length === 0 &&
              parameterDataTableMain.length > 0
            ) {
              createQualityAnalysisHandler(
                parameterDataTableMain,
                setIsOverlayLoader,
                formData
              );
            }
          }
          handleJICreateOrUpdate(
            formData,
            formConfig,
            setIsOverlayLoader,
            setIsPopupOpen,
            jrfCreationType,
            setTabOpen,
            setFormData,
            editReordType,
            navigate,
            setSubTableData,
            subTableData,
            editReordType === "analysis",
            props.setMainJISaved
          );
        }
      }
      else {
        navigate("/operation/jrfInstructionListing");
      }
    }
    else if (moduleType === "consortiumorder") {
      handleConsortiumCreateOrUpdate(
        formData,
        formConfig,
        setIsOverlayLoader,
        setIsPopupOpen,
        jrfCreationType,
        navigate,
        getSingleConsortiumRecord,
        setFormData
      );
    }
    else if (moduleType === "invoice") {
      handleInvoiceCreateOrUpdate(
        formData,
        formConfig,
        setIsOverlayLoader,
        setIsPopupOpen,
        jrfCreationType,
        navigate,
        setFormData,
        setTabOpen,
        "button",
        masterResponse,
        handleSubmit,
        [],
        user
      )
    } else if (jrfCreationType) {
      handleJRFCreateOrUpdate(
        setSaveClicked,
        formData,
        referenceData,
        jrfId,
        formConfig,
        setJrfId,
        navigate,
        setIsPopupOpen,
      )
    } else if (moduleType === "jobCosting") {
      // Removed handleJobCostingFormCreateAndUpdate function call
    }
    else {
      navigate(redirectURL);
    }
  };
  /**
   * use for the open popup modal
   * @returns 
   */
  const openDeletePopup = () => {
    let headingMsg = "Confirmation!";
    let titleMsg = "";
    if (inwardBtnchange) {
      switch (inwardBtnchange) {
        case "post":
        case "save":
        case "assign":
        case "assignment":
        case "sendToLab":
        case "allotment":
        case "publish":
        case "approve":
        case "reassign":
          headingMsg = formConfig?.popupMessages[inwardBtnchange]?.headerMsg;
          titleMsg = formConfig?.popupMessages[inwardBtnchange]?.titleMsg;
          break;
        default:
          headingMsg = formConfig?.popupMessages.cancel?.headerMsg;
          titleMsg = formConfig?.popupMessages.cancel?.titleMsg;
          break;
      }
    } else {
      switch (jrfCreationType) {
        case "post":
        case "approve":
        case "publish":
        case "postJRF":
        case "postOther":
        case "save":
          headingMsg = formConfig?.popupMessages[jrfCreationType]?.headerMsg;
          titleMsg = formConfig?.popupMessages[jrfCreationType]?.titleMsg;
          break;
        default:
          headingMsg = formConfig?.popupMessages.cancel?.headerMsg;
          titleMsg = formConfig?.popupMessages.cancel?.titleMsg;
          break;
      }
    }

    let redirectURL = "";
    if (pageType === "inward" || pageType === "assignment") {
      redirectURL = "/inwardList";
    } else if (moduleType === "testmemomain") {
      redirectURL = "/testmemoList";
    } else if (moduleType == "internalcertificate") {
      redirectURL = "/testmemoList";
    } else if (moduleType == "allotment") {
      redirectURL = "/allotmentList";
    } else {
      redirectURL = "/jrfListing";
    }
    return (
      <DeleteConfirmation
        isOpen={isPopupOpen}
        handleClose={setIsPopupOpen}
        handleConfirm={() => getPopupConfirmationCallback(redirectURL)}
        popupMessage={titleMsg}
        popupHeading={headingMsg}
        saveClicked={saveClicked}
        isOverlayLoader={isOverlayLoader}
        actionType={inwardBtnchange ? inwardBtnchange : jrfCreationType}
        moduleType={moduleType}
        formData={formData}
      />
    );
  };
  /**
   * Reject popup modal handle function
   * @param {*} e 
   */
  const rejectHandleer = (e) => {
    if (moduleType === "testmemomain") {
      let isSFM = "";
      if (formData[0].status === "results") {
        isSFM = 1;
      }
      changeTestMEmoStatuChange(
        testMemoId,
        navigate,
        "rejected",
        remarkText,
        setIsOverlayLoader,
        isSFM,
        null,
        null,
        formData
      );
    } else if (
      moduleType === "internalcertificate" ||
      listModuleType == "internalcertificate"
    ) {
      let status = "tm-reject";
      let isRedirect = 0;
      let icId = formData[0].ic_id
        ? formData[0].ic_id
        : decryptDataForURL(localStorage.getItem("icId"));
      if (formData[0].status === "pending" || user?.role === "DTM") {
        status = "dtm-reject";
      }
      changeTestReportStatusChange(
        icId,
        navigate,
        status,
        remarkText,
        isRedirect,
        getAllListingData,
        setIsPopupOpen,
        setIsOverlayLoader
      );
    } else if (moduleType === "jobinstruction") {
      handleJIUpdateStatus(
        formData,
        formConfig,
        setIsOverlayLoader,
        editReordType,
        navigate,
        1,
        isCancelPopupOpen ? "cancel" : "rejected",
        remarkText,
        subTableData,
        "",
        isCancelPopupOpen
      );
    } else if (moduleType === "invoice") {
      hanfleInvoiceStatusChange(
        formData,
        formConfig,
        setIsOverlayLoader,
        "cancelled",
        navigate,
        isCancelPopupOpen,
        remarkText,
      )
    } else if (moduleType === "commercialCertificatePreview") {
      ApproveCertificate(
        "rejected",
        remarkText
      )
    } else if (moduleType === "purchase") {
      handlePurchaseOrderCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate, 3, setFormData, "", setSubTableData, 1, remarkText)
    } else if (moduleType === "purchaseReq") {
      handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 4, setFormData, setSubTableData, 1, "", remarkText)
    } else {
      handleChecklistBtns(
        e,
        "reject",
        formData,
        remarkText,
        setSaveClicked,
        formConfig,
        navigate,
        setIsOverlayLoader
      );
    }
  };
  /**
     * Reject popup modal open handler function
     * @param {*} e 
     */
  const openRejectModal = () => {
    let headingMsg = "Confirmation!";
    let titleMsg = "";

    headingMsg = "Confirmation!";
    titleMsg = "Do you really want to reject?";
    if (isCancelPopupOpen) {
      titleMsg = "Do you really want to cancel?";
    }

    return (
      <RejectPopupModal
        isOpen={isRejectPopupOpen}
        setRemarkText={setRemarkText}
        remarkText={remarkText}
        handleClose={() => {
          setIsRejectPopupOpen(false)
          if (isCancelPopupOpen) {
            setIsCancelPopupOpen(false)
          }
        }}
        handleConfirm={(e) => rejectHandleer(e)}
        popupMessage={titleMsg}
        popupHeading={headingMsg}
        isCancelPopupOpen={isCancelPopupOpen}
        setPopupType={setPopupType}
        setUploadPopup={setUploadPopup}
        setFormData={setFormData}
        formData={formData}
      />
    );
  };

  useEffect(() => {
    if (formConfig.listView && (kpiValue || typeof kpiValue === "object")) {
      getAllListingData();
    }
  }, [kpiValue]);
  /**
   * add participant dynamically
   * @param {*} type 
   */
  const addParticipantInTender = (type) => {
    if (!type) {
      setFormData((prevData) => {
        return {
          ...prevData,
          3: {
            ...prevData[3],
            ['participant_' + (participantFields - 1)]: ""
          }
        }
      })
    }
    setParticipantFields((prevIndex) => type ? (prevIndex + 1) : (prevIndex - 1))
  };
  /**
   * use for get all listing data for purchase modules
   * @param {*} pagination 
   * @param {*} fieldName 
   * @param {*} sortType 
   * @param {*} searchValue 
   * @param {*} isClearBtn 
   * @param {*} isCustomFilter 
   * @param {*} customFilterType 
   * @param {*} customFilterValue 
   * @returns 
   */
  const getAllListingDataForPurchaseModels = async (
    pagination = "",
    fieldName = "",
    sortType = "",
    searchValue = "",
    isClearBtn = "",
    isCustomFilter,
    customFilterType,
    customFilterValue
  ) => {

    try {
      let endPoint = formConfig?.apiEndpoints?.read
      if (!endPoint) {
        return;
      }
      const spQuerystring = endPoint.split('?')
      endPoint = spQuerystring[0]
      let querystring = spQuerystring.length > 1 ? "?" + spQuerystring[1] : ""
      if (pagination) {
        querystring += querystring ? "&page=" + pagination : "?page=" + pagination;
      }

      if (fieldName && sortType) {
        if (listModuleType === "incentives") {
          const orderingValue = sortType === "desc" ? `-${fieldName}` : fieldName;
          querystring += `&ordering=${orderingValue}`;
        }
        else if (sortType === "desc" || sortType === "asc") {
          querystring += `&order_by=${fieldName},${sortType}`;
        }
      }

      if (kpiValue) {

        if (listModuleType === "purchaseReq") {
          querystring += querystring ? "&req_status=" + kpiValue
            : "?req_status=" + kpiValue;
        }
        else if (listModuleType === "purchase") {
          querystring += querystring ? "&po_status=" + kpiValue
            : "?po_status=" + kpiValue;
        }
        else if (listModuleType === "calibration") {
          querystring += querystring ? "&calib_status=" + kpiValue
            : "?calib_status=" + kpiValue;
        }
        else if (listModuleType === "supplier") {
          querystring += querystring ? "&sup_status=" + kpiValue
            : "?sup_status=" + kpiValue;

        }
        else if (listModuleType === "tender") {
          querystring += querystring ? "&tender_final_status=" + kpiValue
            : "?tender_final_status=" + kpiValue;
        }
        else if (listModuleType === "stocks") {
          querystring += querystring ? "&stocks_status=" + kpiValue
            : "?stock_status=" + kpiValue;
        }
        else if (listModuleType === "incentives") {
          querystring += querystring ? "&incentive_status=" + kpiValue
            : "?incentive_status=" + kpiValue;
        }

      }
      if (searchValue || searchValue === -1) {

        searchValue = searchValue === -1 ? "" : searchValue;
        querystring += querystring ?
          // "?" +  searchValue :""
          "&search=" + searchValue
          : "?search=" + searchValue;
      } else if (searchTerm) {

        querystring += querystring ?
          //  "?" +searchTerm
          "&search=" + searchTerm
          : "?search=" + searchTerm
      }

      if (!isClearBtn && searchFormData) {

        querystring = querystring || "?"
        //   "?search="
        for (let index = 1; index <= filterIndex; index++) {
          if (searchFormData?.["fieldWiseFilter_" + index]) {


            let fieldName =

              (listModuleType === "purchaseReq" || listModuleType === "purchase" || listModuleType === "tender" || listModuleType === "supplier" || listModuleType === "calibration" || listModuleType === "stocks" || listModuleType === "incentives" &&
                !["req_date", "po_requisition_date", "tender_issue_date", "tender_submission_date", "created_at", "calib_next_due_date", "calib_date" || listModuleType === "stocks" || listModuleType === "incentives"].includes(searchFormData?.["fieldWiseFilter_" + index]))
                ?
                (searchFormData?.["fieldWiseFilterOption_" + index] === "exact" && searchFormData["fieldWiseFilter_" + index] != "fk_departmentid"
                  ?
                  searchFormData["fieldWiseFilter_" + index] + "=" + searchFormData["fieldWiseFilterValue_" + index]
                  :
                  searchFormData?.["fieldWiseFilterOption_" + index] === "exact" && searchFormData["fieldWiseFilter_" + index] === "fk_departmentid" ?
                    searchFormData["fieldWiseFilter_" + index] + "=" + searchFormData["fieldWiseFilterValue_" + index]
                    :
                    searchFormData["fieldWiseFilter_" + index] + "_" + searchFormData["fieldWiseFilterOption_" + index] + "=" + searchFormData["fieldWiseFilterValue_" + index]
                )
                :
                (listModuleType === "purchaseReq" || listModuleType === "purchase" || listModuleType === "tender" || listModuleType === "supplier" || listModuleType === "calibration" || listModuleType === "stocks"
                ["req_date", "po_requisition_date", "tender_issue_date", "tender_submission_date", "created_at", "calib_next_due_date", "calib_date", "stock_created_at"].includes(searchFormData?.["fieldWiseFilter_" + index]) &&
                  searchFormData?.["fieldWiseFilterOption_" + index] === "exact")
                  ?
                  searchFormData?.["fieldWiseFilter_" + index] + "=" + searchFormData["fieldWiseFilterValue_" + index]
                  :
                  (listModuleType === "purchaseReq" || listModuleType === "purchase" || listModuleType === "tender" || listModuleType === "supplier" || listModuleType === "calibration" || listModuleType === "stocks" &&
                    ["req_date", "po_requisition_date", "tender_issue_date", "tender_submission_date", "created_at", "calib_next_due_date", "calib_date", "stock_created_at"].includes(searchFormData?.["fieldWiseFilter_" + index]) &&
                    searchFormData?.["fieldWiseFilterOption_" + index] !== "exact")
                    ?
                    searchFormData?.["fieldWiseFilter_" + index] + "_" + searchFormData?.["fieldWiseFilterOption_" + index]
                    :
                    "";
            querystring += "&" + fieldName;
          }
        }
      }
      if (isFiltered && !isCustomFilter && !kpiValue) {

        let customFilterType = customFilterData[1]?.['lastChangeFiledName']
        let customFilterValue = customFilterData[1]?.['lastChangeFiledValue']

        if (!["auditOutstanding", "auditSalesRegister", "auditBranchExpenses", "purchaseReq"].includes(listModuleType)) {
          querystring +=
            "&filter_context=" +
            customFilterType +
            "&filter_context_id=" +
            customFilterValue;
        }
        else {

          querystring +=
            "&" +
            customFilterType +
            "=" +
            customFilterValue;
        }
      }

      if (customFilterData?.[1]?.search_financial_year && customFilterData?.[1]?.search_financial_year !== "all") {
        querystring += '&fin_year=' + customFilterData?.[1]?.search_financial_year
      }
      setLoadingTable(true);
      let res;
      res = await getDataFromApi(endPoint + querystring);
      if (res?.data?.status === 200) {

        setResponse(res.data);
        setLoadingTable(false);
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
      setLoadingTable(false);

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
    } finally {
      setLoadingTable(false);
    }
  }
  /**
   * getAll listing data for all modules
   * @param {*} pagination 
   * @param {*} fieldName 
   * @param {*} sortType 
   * @param {*} searchValue 
   * @param {*} isClearBtn 
   * @param {*} isCustomFilter 
   * @returns 
   */
  const getAllListingData = async (
    pagination = "",
    fieldName = "",
    sortType = "",
    searchValue = "",
    isClearBtn = "",
    isCustomFilter,
    // customFilterType,
    // customFilterValue,
  ) => {
    try {
      if (["tender", "stocks", "incentives"].includes(listModuleType)) {
        let customFilterType = customFilterData?.[1]?.['lastChangeFiledName']
        let customFilterValue = customFilterData?.[1]?.['lastChangeFiledValue']
        getAllListingDataForPurchaseModels(
          pagination,
          fieldName,
          sortType,
          searchValue,
          isClearBtn,
          isCustomFilter,
          customFilterType,
          customFilterValue
        )
      }
      else {
        let endPoint =
          ["LC", "SLC"].includes(user?.role) && listModuleType === "allotment"
            ? formConfig?.apiEndpoints?.readUserWise
            : formConfig?.apiEndpoints?.read;
        if (listModuleType === "dashboard") {

          // if (["LR"].includes(user?.role)) {
          //   endPoint = "/jrf-dashboard/list/";
          // }
          endPoint += `?page_size=${sizeofPage || 25}`
          if (customFilterData?.[1]?.from_date) {
            endPoint += `&from_date=${customFilterData?.[1]?.from_date}&to_date=${customFilterData?.[1]?.end_date}`
          }

        }
        if (!endPoint) {
          return;
        }
        const spQuerystring = endPoint.split('?')
        endPoint = spQuerystring[0]
        let querystring = spQuerystring.length > 1 ? "?" + spQuerystring[1] : ""
        // querystring += querystring ? "&pages_size=10" : "?pages_size=10";
        if (pagination) {
          querystring += querystring ? "&page=" + pagination : "?page=" + pagination;
        }
        if (fieldName && sortType) {
          if (["auditOutstanding", "auditSalesRegister", "auditBranchExpenses", "jobCosting"].includes(listModuleType)) {
            if (sortType === "desc") {
              querystring += querystring
                ? "&sort_by=-" + fieldName
                : "?sort_by=-" + fieldName;
            }
            else {
              querystring += querystring
                ? "&sort_by=" + fieldName
                : "?sort_by=" + fieldName;
            }
          }
          else if (["purchaseReq", "supplier", "calibration"].includes(listModuleType)) {
            querystring += `&order_by=${fieldName},${sortType}`;
          }
          else {
            querystring += querystring
              ? "&sort_by=" + fieldName
              : "?sort_by=" + fieldName;

            querystring += "&sort_order=" + sortType
          }


        }
        if (kpiValue) {
          let newkpiValue = kpiValue.replace(/\s+/g, "__")
          if (['purchaseReq'].includes(listModuleType)) {

            newkpiValue = kpiValue
          }
          querystring += querystring
            ? "&kpi_status=" + newkpiValue
            : "?kpi_status=" + newkpiValue;
        }
        if (searchValue || searchValue === -1) {

          searchValue = searchValue === -1 ? "" : searchValue;
          querystring += querystring
            ? "&search=" + searchValue
            : "?search=" + searchValue;
        } else if (searchTerm) {
          querystring += querystring
            ? "&search=" + searchTerm
            : "?search=" + searchTerm;
        }
        if (!isClearBtn && searchFormData) {

          querystring = querystring || "?search=";

          for (let index = 1; index <= filterIndex; index++) {
            if (searchFormData?.["fieldWiseFilter_" + index]) {
              let fieldName = searchFormData?.["fieldWiseFilter_" + index] + "__" + searchFormData?.["fieldWiseFilterOption_" + index];

              if (['jobCosting'].includes(listModuleType)) {
                if (["commodity_json", "company", "ref_no_data", "certificate_data"].includes(searchFormData?.["fieldWiseFilter_" + index])) {
                  fieldName = searchFormData?.["fieldWiseFilter_" + index]
                }
              }
              else if (['jioperationjsonb'].includes(listModuleType) && ['commercialCertificate'].includes(formConfig?.listView?.subModuleType)) {
                if (["cc_date_from", 'cc_date_to'].includes(searchFormData?.["fieldWiseFilter_" + index])) {
                  fieldName = searchFormData?.["fieldWiseFilter_" + index]
                }
              }
              // (listModuleType === "jobCosting" &&
              //   ["commodity_json", "company", "ref_no_data", "certificate_data"].includes(searchFormData?.["fieldWiseFilter_" + index]))
              //   ? searchFormData?.["fieldWiseFilter_" + index]
              //   : searchFormData?.["fieldWiseFilter_" + index] + "__" + searchFormData?.["fieldWiseFilterOption_" + index];

              querystring += "&" + fieldName + "=" + searchFormData?.["fieldWiseFilterValue_" + index];
            }
          }
        }
        const filterList = decryptDataForURL(params.get("filterList"))
        if (filterList) {
          const spString = filterList.split('-')
          querystring += "&filter_context=" + spString[0] + "&filter_context_id=" + spString[1];
        }

        if (isFiltered && !isCustomFilter) {
          let customFilterType = customFilterData?.[1]?.['lastChangeFiledName']
          let customFilterValue = customFilterData?.[1]?.['lastChangeFiledValue']
          if (customFilterType != undefined && customFilterValue != undefined) {
            if (!["auditOutstanding", "auditSalesRegister", "auditBranchExpenses"].includes(listModuleType)) {
              querystring +=
                "&filter_context=" +
                customFilterType +
                "&filter_context_id=" +
                customFilterValue;
            }
            else {
              querystring +=
                "&" +
                customFilterType +
                "=" +
                customFilterValue;
            }
          }
        }

        setLoadingTable(true);
        let res;
        if (customFilterData?.[1]?.search_financial_year && customFilterData?.[1]?.search_financial_year !== "all") {
          querystring += '&fin_year=' + customFilterData?.[1]?.search_financial_year
        }
        if (formConfig?.listView?.subModuleType === "commercialCertificate") {
          res = await postDataFromApi(endPoint + querystring);
        }
        else {
          res = await getDataFromApi(endPoint + querystring);
        }

        if (res?.data?.status === 200) {
          setResponse(res.data);
          setLoadingTable(false);
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
      }
    } catch (error) {
      setLoadingTable(false);

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
    } finally {
      setLoadingTable(false);
    }
  };
  /**
   * common functions for all MIS reports
   * @returns 
   */
  const getAllListingDataExports = async (customFormData, isCustomFormData, apiEndpoint, customName = "") => {
    try {
      setIsOverlayLoader(true);
      let endPoint = formConfig?.apiEndpoints?.exportExcel;
      if (!endPoint) {
        return;
      }
      let querystring = "";

      if (searchTerm) {

        querystring += querystring
          ? "&search=" + searchTerm
          : "?search=" + searchTerm;
      }
      let customPayload = {}
      if (searchFormData) {

        querystring = querystring || "?"
        // || "?search=" ;

        for (let index = 1; index <= filterIndex; index++) {
          if (searchFormData?.["fieldWiseFilter_" + index]) {
            let fieldName =
              ["incentives"].includes(listModuleType)
                ? searchFormData?.["fieldWiseFilter_" + index]
                : searchFormData?.["fieldWiseFilter_" + index] +
                "__" +
                searchFormData?.["fieldWiseFilterOption_" + index];

            querystring +=
              querystring.endsWith("?") ? "" : "&";
            querystring += fieldName + "=" + searchFormData?.["fieldWiseFilterValue_" + index];
            customPayload[fieldName] = searchFormData?.["fieldWiseFilterValue_" + index]
          }
        }
      }

      if (isCustomFormData) {
        for (let obj in customFormData?.[0]) {
          customPayload[obj] = customFormData?.[0]?.[obj]
        }
      }
      let res
      if (apiEndpoint) {
        res = await getDataFromApi(apiEndpoint + querystring, "", "", 1, 1);
      }
      else if (formConfig?.apiEndpoints?.exportMethod === "GET") {
        res = await getDataFromApi(endPoint + querystring, "", "", 1, 1);
      }
      else {
        res = await postDataFromApi(endPoint + querystring, customPayload, "", 1);
      }
      if (res?.status === 200) {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        let excelFileName = listModuleType + '_' + getFormatedDate(new Date(), 1) + ".xlsx";
        if (customName) {
          excelFileName = customName + '_' + getFormatedDate(new Date(), 1) + ".xlsx";
        }
        else if (listModuleType === "jrf") {
          excelFileName = 'Submitted Samples_' + getFormatedDate(new Date(), 1) + ".xlsx";
        }
        else if (['dashboard'].includes(listModuleType)) {
          excelFileName = 'Jobinstructions_' + getFormatedDate(new Date(), 1) + ".xlsx";
          if (formConfig?.listView?.isLMSDashboard) {
            excelFileName = 'Submitted Samples_' + getFormatedDate(new Date(), 1) + ".xlsx";
          }
        }

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
  /**
   * Use for the check need to show Export button or not
   * @returns 
   */
  const isShowExportButtonShow = () => {
    if (["sampleinward", "sampleverification", "jobinstruction", "auditSalesRegister", "auditBranchExpenses", "auditOutstanding", "purchaseReq", "purchase", 'incentives', 'allotment', 'jrf', 'dashboard', 'supplier', 'purchaseItems', 'calibration', 'stocks'].includes(
      listModuleType
    )) {
      if (['SU'].includes(user?.role)) {
        return true
      }
      if (listModuleType === "allotment") {
        return CommonTMRoles.includes(user?.role)
      }
      else if (listModuleType === "jrf") {
        return ['LR', 'SU'].includes(user?.role)
      }
      else if (listModuleType === "incentives") {
        return ['CU', 'BU', 'LR'].includes(user?.role)
      }
      return true
    }
    return false
  }
  /**
   * get all status count on table list page
   * @returns 
   */
  const getAllStatusCount = async () => {
    try {
      setIsStatusCountCalled(true)
      if (!formConfig?.apiEndpoints?.statuCount) {
        return
      }
      let endPoint = formConfig?.apiEndpoints?.statuCount;
      if (customFilterData?.[1]?.search_financial_year && customFilterData?.[1]?.search_financial_year !== "all") {
        endPoint += '?fin_year=' + customFilterData?.[1]?.search_financial_year
      }
      const res = await getDataFromApi(endPoint);

      if (res?.data?.status === 200) {
        setStatusCounts(res.data.data);
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
      setIsStatusCountCalled(false)
    }
  };
  const getVerificationDetails = async (id = "", from = "") => {
    getVerificationDetailsHandler(id, from, setFormData, formData, setTestMemoId, setTabOpen, setIstavSaveClicked, setIsOverlayLoader)
  };
  const getSingleData = async () => {
    try {
      setIsOverlayLoader(true);
      setViewOnly(false);
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split("?")[1]);
      let status = params.get("status") ? params.get("status") : "";

      status = decryptDataForURL(status).toLowerCase();
      const id = decryptDataForURL(params.get("id"));
      const sampleInwardId = decryptDataForURL(params.get("sampleInwardId"));
      if (!id) {
        setLoading(false);
        setLoadingTable(false);
        setIsOverlayLoader(false);
        return;
      }
      let actioning = decryptDataForURL(params.get("action"));
      if (
        sampleInwardId &&
        (status === "assignment" || status === "assignment-view")
      ) {
        getSampleIdsMasterData(sampleInwardId);
      }

      setAction(actioning);

      setJrfId(id);

      setPageType(status);
      if (status !== "inward") {
        setTabOpen(true);
      }
      if (['approve', 'edit'].includes(status) && ['vesselJICertificate', 'operationCertificate', 'JICommercialCertificateList'].includes(moduleType)
      ) {
        if (['approve'].includes(status)) {
          setViewOnly(true);
        }
        getCommercialCertificateSingle(EditRecordId, JISID, RPCID, setFormData, null, null, null, null, setNewExtraFields, isUseForPhysical);
      }
      if ([...vieableArr, 'edit'].includes(status)) {
        if (vieableArr.includes(status)) {
          setViewOnly(true);
        }

        getSingleJRFData(formConfig, setFormData, setViewOnly, vieableArr, sampleInwardId, moduleType, getAssignmentMasterData, setReferenceData, user, setLoading, setSubCommodityOptions, setIsOverlayLoader, setIsRefrenceNoCalled, setLoadingTable)
      }
      if (["View", "Edit"].includes(actioning)) {
        setTabOpen(true);
      }
    }
    finally {
      setIsOverlayLoader(false);
    }
  };

  //For Reference Number Logic....
  async function referenceLogic(fieldName, value) {
    if (fieldName === "jrf_referenceno") {
      let ref_regex = /^\d{2}[A-Z]\d{4}[A-Z]\d{2,3}[A-Z]{2}\d{4}$/
      if (GetTenantDetails(1, 1) == "TPBPL") {
        ref_regex = /^\d{2}P\d{4}[A-Z]\d{2,3}[A-Z]{2}\d{4}$/;
      }

      if (ref_regex.test(value)) {
        setReferenceNo(value);
      } else {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              jrf_state: "--",
              jrf_commodity: "--",
              jrf_mode: "--",
            },
          };
        });
      }
    }
  }
  const handleFieldChange = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = "",
    isOptionsDetails,
    optionDetails,
    isBlurField,
    valueName
  ) => {

    if (type === "checkbox") {
      value = isChecked;
    }
    else if (type == "number") {
      // value = value ? parseFloat(value) : value
    }
    if (fieldName === "jrf_referenceno") {
      value = value ? value.toUpperCase() : "";
      referenceLogic(fieldName, value);
    }
    if (moduleType == "internalcertificate") {
      if (
        fieldName == "ic_smpldrawnbylab" &&
        (value == "Sample Not Drawn By Laboratory")
      ) {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              ic_locationofsmpl: "N/A",
              ic_samplingmethods: "N/A",
              ic_envcondition: "N/A",
              ic_conditionofsmpl: "N/A",
              ic_dos: "N/A",
            },
          };
        });
      }
      else if (
        fieldName == "ic_smpldrawnbylab" &&
        value == "As Per Client"
      ) {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              ic_locationofsmpl: "N/A",
              ic_samplingmethods: "N/A",
              ic_envcondition: "N/A",
              ic_conditionofsmpl: "N/A",
              ic_is_mark: "",
              ic_is_seal: "",
              ic_dos: "N/A",
            },
          };
        });
      }
      else if (
        fieldName == "ic_smpldrawnbylab" &&
        (value == "Sample Drawn By Laboratory")
        // (value == "Sample Drawn By Laboratory" || value == "As Per Client")
      ) {
        // setFormData((prevFormData) => {
        //   return {
        //     ...prevFormData,
        //     0: {
        //       ...prevFormData[0],
        //       ic_dos: "",
        //       ic_samplingmethods: "",
        //     },
        //   };
        // });
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              ic_locationofsmpl: "",
              ic_samplingmethods: formData[0]?.ic_samplingmethods_exists || formData[0]?.ic_samplingmethods,
              ic_envcondition: "",
              ic_conditionofsmpl: "",
              ic_dos: ""
            },
          };
        });
        getAssignmentMasterData(
          formData[0].cmd_id,
          formData[0].lab_id,
          "parameter",
          setIstestMethods
        );
      } else if (fieldName == "ic_ulrno") {
        checkICULRNoAvailibility(value, setIsOverlayLoader, setIsValideValue);
      }
      else if (
        fieldName == "ic_is_account_of" &&
        (value == "Yes")
      ) {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              ic_customername: "",
              ic_customeraddress: ""
            },
          };
        });
      }
    } else if (moduleType == "sfm") {
      if (fieldName === "sfm_dateanalysisstarted") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [sectionIndex]: {
              ...prevFormData[sectionIndex],
              "sfm_dateanalysiscompleted": "",
            },
          };
        });
      }
    } else if (moduleType == "operationCertificate") {
      if (fieldName == "cert_number") {
        checkCettificateNoAvailibility(
          value,
          setIsOverlayLoader,
          setIsValideValue
        );
      }
      else if (fieldName === "cc_fk_place_pf_work_id") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [sectionIndex]: {
              ...prevFormData[sectionIndex],
              "cc_place_of_work_name": optionDetails?.pow_name
            },
          };
        });
      }
      else if (fieldName === "fk_cc_cert_format_id") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],
              "fk_cc_cert_format_label": optionDetails?.client_certificate_format_code
            },
          };
        });
      }
    } else if (moduleType === "vesselJICertificate") {
      // if (fieldName === "rpc_is_lot_no" && value) {
      //   setFormData((prevFormData) => {
      //     return {
      //       ...prevFormData,
      //       [sectionIndex]: {
      //         ...prevFormData[sectionIndex],
      //         ["rpc_is_wght_avg"]: "",
      //       },
      //     };
      //   });
      // } else if (fieldName === "rpc_is_wght_avg" && value) {
      //   setFormData((prevFormData) => {
      //     return {
      //       ...prevFormData,
      //       [sectionIndex]: {
      //         ...prevFormData[sectionIndex],
      //         ["rpc_is_lot_no"]: "",
      //       },
      //     };
      //   });
      // }
      // if (fieldName === "rpc_is_lotwise_smpl_mark" && value) {
      //   setFormData((prevFormData) => {
      //     return {
      //       ...prevFormData,
      //       1: {
      //         ...prevFormData[1],
      //         rpc_is_lotwise_qty: [],
      //       },
      //     };
      //   });
      // }
      // else if (fieldName === "rpc_is_lotwise_qty" && value) {
      //   setFormData((prevFormData) => {
      //     return {
      //       ...prevFormData,
      //       1: {
      //         ...prevFormData[1],
      //         rpc_is_lotwise_smpl_mark: [],
      //       },
      //     };
      //   });
      // }
    } else if (moduleType == "jobinstruction") {
      if (fieldName === "fk_operationtypetid") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [sectionIndex]: {
              ...prevFormData[sectionIndex],
              "ji_is_consortium_order": optionDetails?.ops_code == "CS" ? "Yes" : "No",
              "ji_is_dual_port": optionDetails?.ops_code == "CS" ? "No" : formData[0]?.ji_is_dual_port,
              "fk_operationtypetid_code": optionDetails?.ops_code
            },
          };
        });
      }
      else if (fieldName === "fk_placeworkid") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [sectionIndex]: {
              ...prevFormData[sectionIndex],
              "ji_place_of_work_name": optionDetails?.pow_name
            },
          };
        });
      }
      else if (fieldName === "fk_consortium_order") {
        if (isOptionsDetails) {
          setFormData((prevFormData) => {
            return {
              ...prevFormData,
              [sectionIndex]: {
                ...prevFormData[sectionIndex],
                "fk_commodityid": optionDetails?.fk_commodity_id,
                "fk_subcommodityid": optionDetails?.fk_sub_commodity_id,
                "ji_nameofoperationmode": optionDetails?.co_vessel_name,
              },
            };
          });
        }
      }
      else if (fieldName === "fk_branchid") {
        if (isOptionsDetails) {
          setFormData((prevFormData) => {
            return {
              ...prevFormData,
              [sectionIndex]: {
                ...prevFormData[sectionIndex],
                "ji_branch_state_id": optionDetails?.state_id,
                "ji_branch_state": optionDetails?.state_name
              },
            };
          });
        }
      }
      else if (fieldName === "fk_companyid") {
        if (!editReordType && formConfig?.sections[0]?.isMainPage) {
          setFormData((prevFormData) => {
            return {
              ...prevFormData,
              [sectionIndex]: {
                ...prevFormData[sectionIndex],
                "fk_branchid": "",
              },
            };
          });
        }
      }
      else if (fieldName === "ji_totalqty") {
        if (isBlurField && !formData[0]?.ji_appointed_totalqty) {
          setFormData((prevFormData) => {
            return {
              ...prevFormData,
              [sectionIndex]: {
                ...prevFormData[sectionIndex],
                "ji_appointed_totalqty": value,
              },
            };
          });
        }
      }
    } else if (moduleType == "invoice") {
      if (fieldName === "reference_number") {
        // setFormData((prevFormData) => {
        //   return {
        //     ...prevFormData,
        //     [0]: {
        //       ...prevFormData[0],
        //       "reference_number_data": optionDetails?.ji_reference_number,
        //       "reference_number_data_jrf": optionDetails?.ji_id
        //     },
        //   };
        // });
        setFormData((prevFormData) => {
          let updatedRefData = optionDetails.map((singleOPT) => {
            return singleOPT.ji_reference_number
          })
          let updatedRefJRFData = optionDetails.map((singleOPT) => {
            return singleOPT.ji_id
          })
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],
              "reference_number_data": updatedRefData,
              "reference_number_data_jrf": updatedRefJRFData
            },
          };
        });
      }
      else if (fieldName === "fk_invoice_branchid") {
        setFormData((prevFormData) => {
          let companycode = optionDetails?.br_code
          companycode = companycode ? companycode[3] : 'C'
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],
              "invoiceCompanyCode": companycode
            },
          };
        });
      }
      // else if (fieldName.startsWith("activities_")) {
      //   setFormData((prevFormData) => {
      //     return {
      //       ...prevFormData,
      //       [0]: {
      //         ...prevFormData[0],
      //         "reference_number_data": optionDetails?.ji_reference_number
      //       },
      //     };
      //   });
      // }
    } else if (moduleType === "jrf") {
      if (fieldName === "jrf_branch") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [sectionIndex]: {
              ...prevFormData[sectionIndex],
              "ji_branch_state_id": optionDetails?.state_id,
              "ji_branch_state": optionDetails?.state_name
            },
          };
        });
      }
    }
    else if (moduleType === "stocks") {
      if (fieldName === "fk_item_id") {

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],
              "stock_name_of_chemical": optionDetails?.item_description,

            },
          };
        });
      }
    }
    else if (moduleType === "purchaseReq") {
      const isIndexedField = fieldName.startsWith("prd_item_code_");
      const isUnindexedField = fieldName === "prd_item_code";

      if (isIndexedField) {
        const index = fieldName.split("_").pop();

        if (!isNaN(Number(index))) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [1]: {
              ...prevFormData[1],
              [`prd_item_code_${index}`]: optionDetails?.item_id || "",
              [`prd_item_description_${index}`]: optionDetails?.item_description || "",
              [`prd_uom_${index}`]: optionDetails?.item_uom || "",
              // [`prd_manufacture_time_${index}`]: optionDetails?.item_manufacture_time || "",
            },
          }));
        }
      }

      if (isUnindexedField) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [1]: {
            ...prevFormData[1],
            prd_item_code: optionDetails?.item_id || "",
            prd_item_description: optionDetails?.item_description || "",
            prd_uom: optionDetails?.item_uom || "",
            // prd_manufacture_time: optionDetails?.item_manufacture_time || "",
          },
        }));
      }
    }

    else if (moduleType === "purchase") {
      if (fieldName === "fk_supplier_id") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],
              "po_billing_address": optionDetails?.sup_address,
              // "po_ship_address": optionDetails?.sup_address,
              "po_gst_no": optionDetails?.sup_gst_no,
              "po_payment_term": optionDetails?.sup_payment_terms,
              "po_vendor_id": optionDetails?.sup_id,
              "po_vendor_name": optionDetails?.sup_name,
            },
          };
        });
      }
      else if (fieldName === "po_ship_to") {

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],

              "po_ship_address": optionDetails?.cmp_address,

            },
          };
        });
      } else if (fieldName === "fk_prev_po_details") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],
              "fk_supplier_id": optionDetails?.fk_supplier_id,
              "po_billing_address": optionDetails?.supplier_details?.sup_address,
              "po_gst_no": optionDetails?.supplier_details?.sup_gst_no,
              "po_payment_term": optionDetails?.supplier_details?.sup_payment_terms,
              "po_vendor_id": optionDetails?.supplier_details?.sup_id,
              "po_vendor_name": optionDetails?.supplier_details?.sup_name,
              "po_ship_to": optionDetails?.po_ship_to,
              "po_ship_address": optionDetails?.po_ship_to_details?.cmp_address,
              "po_quotation_no": optionDetails?.po_quotation_no,

            },
          };
        });
      }
      else {
        let updatedFormData = { ...formData[1] };
        let price = 0;
        let getIndex = 0;

        if (fieldName.startsWith("prd_discount_") || fieldName.startsWith("prd_unit_price_")) {
          getIndex = fieldName.split("_").pop();

          updatedFormData = {
            ...updatedFormData,
            [fieldName]: value
          };

          price = getCalculationsForPrice(updatedFormData, getIndex);
          // (price.toFixed(2))
          setFormData((prev) => ({
            ...prev,
            [1]: {
              ...prev[1],
              [`prd_price_${getIndex}`]: price,
            },
          }));

        }
      }

    }
    else if (moduleType === "calibration") {
      if (fieldName === "calib_date") {

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],
              "calib_next_due_date": value,

            },
          };
        });
      }
    }
    else if (moduleType === "incentives") {

      if (fieldName === "incentive_invoice_id") {

        // setFormData((prevFormData) => {
        //   return {
        //     ...prevFormData,
        //     [0]: {
        //       ...prevFormData[0],
        //       incentive_client: optionDetails?.client?.cust_id,
        //       incentive_pow: optionDetails?.client?.state,
        //       incentive_client_id: optionDetails?.client?.cust_name,
        //       incentive_mode: optionDetails?.im_paymentmode,
        //       incentive_price: optionDetails?.im_total,
        //       incentive_place_of_work: optionDetails?.client?.state?.state_name || "NA",
        //       incentive_billing_amt_inr: optionDetails?.im_total,
        //       incentive_work_completion_date: getDateFromCreatedAt(optionDetails?.im_workorderdate) || "--/--/--",
        //       incentive_vessel_quantity: optionDetails?.ji_quantity,
        //       ji_payment_terms: optionDetails?.invoice_details?.[0]?.job_instruction_details?.ji_payment_terms

        //     },
        //   }
        // })

      }

    }
    else if (moduleType === "tender") {
      if (fieldName === "tender_issue_date") {

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],
              tender_submission_date: value

            },
          }
        })

      }

    }

    if (['purchaseItems', 'stocks'].includes(moduleType)) {
      if (['item_services', 'stock_services'].includes(fieldName) && value === "Calibration") {
        if (!EditRecordId && !formData[0]?.fk_calibration_id) {
          setIsCustomPopup(true)
        }
      }
    }
    setFormData((prevFormData) => {

      return {
        ...prevFormData,
        [sectionIndex]: {
          ...prevFormData[sectionIndex],
          [fieldName]: value,
        },
      };
    });


    setFormErrors((prevFormErrors) => {
      const newFormErrors = { ...prevFormErrors };
      if (newFormErrors[sectionIndex]) {
        delete newFormErrors[sectionIndex][fieldName];
        if (Object.keys(newFormErrors[sectionIndex]).length === 0) {
          delete newFormErrors[sectionIndex];
        }
      }
      return newFormErrors;
    });
  };
  // useEffect(() => {
  //   formData[0]?.incentive_invoice_id && getJobCostingIncDataFunc(setFormData, formData, setIsOverlayLoader)
  // }, [formData[0]?.incentive_invoice_id])

  useEffect(() => {
    incentivesCalculationData('incentive_incentive_amount', formData[0]?.incentive_profit_against_work, setFormData, formData)
  }, [formData[0]?.incentive_profit_against_work, formData[0]?.incentive_incentive_amount_perc])
  useEffect(() => {
    incentivesCalculationData('incentive_sales_lead_share', formData[0]?.incentive_receivable_amount, setFormData, formData)
  }, [formData[0]?.incentive_receivable_amount])

  // Tender

  useEffect(() => {

    if (["", "NA", "undefined"].includes(formData[1]?.tender_emd_amount) ||
      /^0\d+/.test(formData[1]?.tender_emd_amount)) {
      setFormData((prev) => ({
        ...prev,
        [1]: {
          ...prev[1],
          tender_emd_approved_by: "",
          tender_emd_transfer_mode: "",
          tender_emd_transfer_details: "",
        },
      }));
      return;
    }
    else if (parseInt(formData[1]?.tender_emd_amount) === 0) {

      setFormData((prevFormData) => ({
        ...prevFormData,
        [1]: {
          ...prevFormData[1],
          tender_emd_approved_by: "NA",
          tender_emd_transfer_mode: "NA",
          tender_emd_transfer_details: "NA",
        },
      }));
    }
  }, [formData[1]?.tender_emd_amount]);


  useEffect(() => {

    getCalculationsForTotal(formData, setFormData)
  }, [JSON.stringify(formData[1])])

  useEffect(() => {
    const billingDate = new Date(formData[0]?.incentive_billing_date);

    const paymentCollectionDateStr = formData[0]?.incentive_payment_collection_date;
    let paymentCollectionDate = null;

    if (paymentCollectionDateStr?.includes('/')) {

      const [day, month, year] = paymentCollectionDateStr.split('/');
      paymentCollectionDate = new Date(year, month - 1, day);
    } else {

      paymentCollectionDate = new Date(paymentCollectionDateStr);
    }


    if (!isNaN(billingDate) && !isNaN(paymentCollectionDate)) {
      const delayInDays = Math.floor(
        (paymentCollectionDate - billingDate) / (1000 * 60 * 60 * 24)
      );

      setFormData((prev) => ({
        ...prev,
        0: {
          ...prev[0],
          incentive_delay_payment_days:
            delayInDays === 1 ? `${delayInDays} day` : `${delayInDays} days`,
        },
      }));
    } else {
      console.warn("Invalid billing or payment collection date");
    }
  }, [
    formData[0]?.incentive_billing_date,
    formData[0]?.incentive_payment_collection_date,
  ]);
  // PurchaseTotal


  useEffect(() => {
    const totalAmt = formData[1]?.po_total_amt;
    const gst = formData[1]?.po_gst;

    calculateTotalGST(totalAmt, gst, setFormData);
  }, [formData[1]?.po_gst]);

  useEffect(() => {

    let newFields = [{}]
    if (Array.isArray(formData[0]?.branch_name)) {

      newFields = formData[0]?.branch_name.map(branchInputName => {
        const fieldName = branchInputName + '_amount';
        return {
          width: 6,
          name: branchInputName + '_amount',
          label: branchInputName,
          value: branchInputName + '_amount',
          type: moduleType === "auditOutstanding" ? "doubleText" : "number",
          placeholder: "Enter Amount",
          readOnly: fieldName in formData[0],
          "secondName": branchInputName + "_amount_comment",
          "secondPlaceholder": "Comment",
          "secondType": "text",
          "firstType": "number",
          "fieldWidth": 75,
          "upperFieldWidth": "75"
        };
      })
    }
    setTempJson([...newFields])
    if (tempJson.length && formConfig?.sections?.[0]?.fields) {
      formConfig.sections[0].fields = formConfig.sections[0]?.fields?.filter(
        field => !tempJson.find(tempField => tempField.name === field.name)
      );
    }
    if (moduleType === "auditOutstanding") {

      formConfig.sections[0].fields = []
    }
    else if (moduleType === "auditSalesRegister") {

      formConfig.sections[0].fields = []
    }
    if (formData[0]?.branch_name != undefined) {
      formConfig.sections[0].fields?.splice(7, 0, ...newFields);
    }

  }, [
    formData[0]?.branch_name
  ]);


  useEffect(() => {
    let newFields = [{}];
    if (Array.isArray(formData[1]?.credit_note_branch_name)) {

      newFields = formData[1].credit_note_branch_name.map(branchInputName => {
        const fieldName = branchInputName + '_credit_note_amount';

        return {
          width: 6,
          name: branchInputName + '_credit_note_amount',
          label: branchInputName,
          value: branchInputName + '_credit_note_amount',
          type: "number",
          placeholder: "Enter Amount",
          readOnly: fieldName in formData[1]
        }
      });
    };
    setTempJson([...newFields]);
    if (tempJson.length && formConfig?.sections?.[1]?.fields !== undefined) {
      formConfig.sections[1].fields = formConfig?.sections[1]?.fields.filter(
        field => !tempJson.find(tempField => tempField.name === field.name)

      )
    }
    if (formData[1]?.credit_note_branch_name === undefined) {
      if (formConfig?.sections?.[1] && moduleType === "auditSalesRegister") {
        formConfig.sections[1].fields = [
          {
            "width": 25,
            "label": "Credit Note Details",
            "name": "section_heading",
            "type": "label",
            "required": true,
            "color": "$danger",
            "textDecoration": "none",
            "styleName": "section_heading",
            "fontSize": "16px"
          },
          {
            "width": 6,
            "name": "credit_note_branch_name",
            "label": "Select Branch",
            "multiple": true,
            "options": [],
            "styleName": "custom_status",
            "type": "select"
          },
          {
            "width": 25,
            "label": "Total",
            "name": "section_heading",
            "type": "label",
            "color": "$danger",
            "textDecoration": "none",
            "styleName": "section_heading",
            "fontSize": "16px",
            "errorMsgs": {
              "required": "This field is required"
            }
          },
          {
            "width": 6,
            "label": "Total Credit Note Amount",
            "name": "credit_note_total",
            "type": "text",
            "placeholder": "Auto Generated",
            "errorMsgs": {
              "required": "This field is required"
            },
            "defaultValue": 0,
            "readOnly": true
          }
        ];
      }
    }
    else {
      formConfig.sections[1]?.fields.splice(2, 0, ...newFields)
    }
  }, [formData[1]?.credit_note_branch_name]);


  useEffect(() => {
    if (moduleType === "jobCosting" && formData[0]?.jc_inv_amt) {
      let misc_3p = parseFloat(((parseFloat(formData[0]?.jc_inv_amt) * 3) / 100).toFixed(2));
      let ho_exp_10p = parseFloat(((parseFloat(formData[0]?.jc_inv_amt) * 10) / 100).toFixed(2));

      setTimeout(() => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          0: {
            ...prevFormData[0],
            jc_misc_3p: misc_3p,
            jc_ho_exp_10p: ho_exp_10p,
          },
        }));
      }, 10);
    }
  }, [formData[0]?.jc_inv_amt]);
  useEffect(() => {
    // Removed job costing calculations
  }, [
    formData[0]?.jc_misc_3p,
    formData[0]?.jc_ho_exp_10p,
    formData[0]?.jc_travel_expense,
    formData[0]?.jc_survey_analysis,
    formData[0]?.jc_courier,
    formData[0]?.jc_charges,
    formData[0]?.jc_jabour_charges,
    formData[0]?.jc_food_charges,
    formData[0]?.purcase_material,
    formData[0]?.jc_ot,
    formData[0]?.jc_analysis_charges,
    formData[0]?.jc_guest_house_exp,
  ]);

  useEffect(() => {
    // Removed branch expense calculations
  }, [
    formData[0]?.salary_payroll,
    formData[0]?.salary_casual,
    formData[0]?.salary_contract,
    formData[0]?.rent,
    formData[0]?.ot,
    formData[0]?.shipment_and_sampling,
    formData[0]?.analysis_charges,
    formData[0]?.lab_exp_and_sampl_material,
    formData[0]?.business_promotion,
    formData[0]?.other,
    formData[0]?.ho_overhead,
    formData[0]?.guest_house_exp
  ]);




  //  ----------------------------------------------------------------
  const handleFieldBlur = (sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = "",
    isOptionsDetails,
    optionDetails) => {
    handleFieldChange(sectionIndex, fieldName, value, type, isChecked, isOptionsDetails, optionDetails, 1)
  }
  const handleSubmit = () => {
    setActionClicked(true);

    let errors = {};
    const formDataObject = {};
    Object.entries(formData).forEach(([sectionIndex, fields]) => {
      Object.entries(fields).forEach(([fieldName, fieldValue]) => {
        formDataObject[fieldName] = fieldValue;
      });
    });
    let focusErrName = "";
    let notRequired = [];

    formConfigState.sections.forEach((section, sectionIndex) => {
      if (!["tabs", "sampleAssignmentTabs"].includes(section.type)) {
        let fieldArray = [];
        if (section?.subSections?.length > 0) {
          section?.subSections.map((subSection) => {
            fieldArray = subSection.fields
            fieldArray.forEach((field) => {
              let { required, validation, pattern, type } = field;
              let value = formData[sectionIndex]?.[field.name];
              if (Array.isArray(value)) {
                value = value.join(',')
              }
              value = typeof value === "string" ? value.trim() : value;

              let notRequired = [];
              if (formConfig?.sections[0]?.moduleType === "jrf") {
                if (user?.role === "LR") {
                  if (isRegularJRF) {
                    // notRequired.push('jrf_ext_orgnizationname', 'jrf_ext_address', 'jrf_ext_contactpersonname', 'jrf_ext_contactpersonnumber', 'jrf_ext_contactpersonemail')
                  }
                }

              }
              else if (formConfig?.sections[0]?.moduleType === "internalcertificate") {
                if (!formData?.[0]?.ic_is_mark && !formData?.[0]?.ic_is_seal) {
                  notRequired.push('ic_mark_and_seal_qualifier')
                }
              }
              else if (formConfig?.sections[0]?.moduleType === "jobinstruction") {
                if (formData[0]?.fk_operationtypetid_code != 'CS') {
                  notRequired.push('fk_consortium_order')
                }
                // if (['RK', 'ST', 'TR', 'PV', 'CS', 'PL'].includes(formData[0]?.fk_operationtypetid_code)) {
                if (!['VL'].includes(formData[0]?.fk_operationtypetid_code)) {
                  notRequired.push('ji_eta')
                  notRequired.push('ji_nameofoperationmode')
                }
                if (['PV', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                  notRequired.push('ji_sampling_methods')
                }
                if (['CS', 'TL', 'DS', 'CM', 'SS', 'CV'].includes(formData[0]?.fk_operationtypetid_code)) {
                  notRequired.push('ji_type_of_sampling')
                  notRequired.push('ji_type_of_analysis')
                  notRequired.push('ji_analysis')
                  if (['DS', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                    notRequired.push('ji_sampling_methods')
                  }
                  // notRequired.push('ji_sampling_methods')
                }
                // if (['CV', 'PV', 'CN', 'RC', 'AS', 'PL', 'RK', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                //   notRequired.push('ji_appointed_totalqty')
                //   notRequired.push('ji_totalqty')
                // }
                if (!['TL'].includes(formData[0]?.fk_operationtypetid_code)) {
                  notRequired.push('fk_userbranchcaptainid')
                }
                if (formData[0]?.ji_sent_through?.length === 1 && formData[0].ji_sent_through[0] === "Verbal Nomination") {
                  notRequired.push('ji_reference')
                }
              }

              if (notRequired.includes(field.name)) {
                required = false;
              }
              if (
                required &&
                (!value || value === "") &&
                field.type !== "label" &&
                field.type !== "checkbox" &&
                !field.multiple
              ) {
                if (!focusErrName) {
                  focusErrName = field.name;
                }

                errors = {
                  ...errors,
                  [sectionIndex]: {
                    ...errors[sectionIndex],
                    [field.label]: validation
                      ? validation.message
                      : "This field is required",
                  },
                };
              } else if (type === "phone") {
                if (value) {
                  if (!isValidPhoneNumber(value)) {
                    if (!focusErrName) {
                      focusErrName = field.name;
                    }

                    errors = {
                      ...errors,
                      [sectionIndex]: {
                        ...errors[sectionIndex],
                        [field.label]: validation
                          ? validation.message
                          : "This field is required",
                      },
                    };
                  }
                }

              }
              else if (type === "email") {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                const regex = new RegExp(emailPattern);
                if (!regex.test(value)) {
                  errors = {
                    ...errors,
                    [sectionIndex]: {
                      ...errors[sectionIndex],
                      [field.label]: validation
                        ? validation.message
                        : "This field is required",
                    },
                  };
                }
              } else if (pattern) {
                if (value) {
                  let regex;
                  if (type === "tel") {
                    regex = /^(?:\+91)?\d{10}$/;
                  } else {
                    regex = new RegExp(pattern);
                  }
                  if (!regex.test(value)) {
                    if (!focusErrName) {
                      focusErrName = field.name;
                    }

                    errors = {
                      ...errors,
                      [sectionIndex]: {
                        ...errors[sectionIndex],
                        [field.label]: validation
                          ? validation.message
                          : "This field is required",
                      },
                    };
                  }
                }
              } else if (
                (field.name === "jrf_terms_and_conditions" &&
                  (!value || value === "")) ||
                (field.type === "select" &&
                  field.multiple &&
                  value &&
                  value.length === 0)
              ) {
                if (!focusErrName) {
                  focusErrName = field.name;
                }
                errors = {
                  ...errors,
                  [sectionIndex]: {
                    ...errors[sectionIndex],
                    [field.name]: validation
                      ? validation.message
                      : "This field is required",
                  },
                };
              }
            });
          })
          // fieldArray=section?.subSections[section?.subSections.length-1].fields
        }
        else {
          fieldArray = section.fields
          fieldArray.forEach((field) => {
            let { required, validation, pattern, type } = field;
            let value = formData[sectionIndex]?.[field.name];
            if (Array.isArray(value)) {
              value = value.join(',')
            }
            value = typeof value === "string" ? value.trim() : value;

            let notRequired = [];
            if (formConfig?.sections[0]?.moduleType === "jrf") {
              if (user?.role === "LR") {
                if (isRegularJRF) {
                  // notRequired.push('jrf_ext_orgnizationname', 'jrf_ext_address', 'jrf_ext_contactpersonname', 'jrf_ext_contactpersonnumber', 'jrf_ext_contactpersonemail')
                }
              }

            }
            else if (formConfig?.sections[0]?.moduleType === "internalcertificate") {
              if (!formData?.[0]?.ic_is_mark && !formData?.[0]?.ic_is_seal) {
                notRequired.push('ic_mark_and_seal_qualifier')
              }
            }
            else if (formConfig?.sections[0]?.moduleType === "jobinstruction") {
              if (formData[0]?.fk_operationtypetid_code != 'CS') {
                notRequired.push('fk_consortium_order')
              }
              // if (['RK', 'ST', 'TR', 'PV', 'CS', 'PL'].includes(formData[0]?.fk_operationtypetid_code)) {
              if (!['VL'].includes(formData[0]?.fk_operationtypetid_code)) {
                notRequired.push('ji_eta')
                notRequired.push('ji_nameofoperationmode')
              }
              if (['PV'].includes(formData[0]?.fk_operationtypetid_code)) {
                notRequired.push('ji_sampling_methods')
              }
              if (['CS', 'TL', 'DS', 'CM', 'SS', 'CV'].includes(formData[0]?.fk_operationtypetid_code)) {
                notRequired.push('ji_type_of_sampling')
                notRequired.push('ji_type_of_analysis')
                notRequired.push('ji_analysis')
                if (['DS', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                  notRequired.push('ji_sampling_methods')
                }
                // notRequired.push('ji_sampling_methods')
              }
              // if (['CV', 'PV', 'CN', 'RC', 'AS', 'PL', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
              //   notRequired.push('ji_appointed_totalqty')
              //   notRequired.push('ji_totalqty')
              // }
              if (!['TL'].includes(formData[0]?.fk_operationtypetid_code)) {
                notRequired.push('fk_userbranchcaptainid')
              }
              if (formData[0]?.ji_sent_through?.length === 1 && formData[0].ji_sent_through[0] === "Verbal Nomination") {
                notRequired.push('ji_reference')
              }
            }
            else if (formConfig?.sections[0]?.moduleType === "sfm") {
              if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) != "TPBPL") {
                notRequired.push('sfm_borometricpressure')
              }

            }
            else if (formConfig?.sections[0]?.moduleType === "invoice") {
              if (!decryptDataForURL(params.get("isCourier"))) {
                if (field.isCourierData) {
                  notRequired.push(field.name)
                }
              }
              else {
                if (!["Courier Details"].includes(field.label) && field.name !== "im_courier") {
                  if (hideMap[formData[0]?.im_courier]?.includes(field.name)) {
                    notRequired.push(field.name)
                  }
                }
              }
            }

            if (notRequired.includes(field.name)) {
              required = false;
            }
            if (
              required &&
              (!value || value === "") &&
              field.type !== "label" &&
              field.type !== "checkbox" &&
              !field.multiple
            ) {
              if (!focusErrName) {
                focusErrName = field.name;
              }

              errors = {
                ...errors,
                [sectionIndex]: {
                  ...errors[sectionIndex],
                  [field.label]: validation
                    ? validation.message
                    : "This field is required",
                },
              };

            } else if (type === "phone") {
              if (value) {
                if (!isValidPhoneNumber(value)) {
                  if (!focusErrName) {
                    focusErrName = field.name;
                  }

                  errors = {
                    ...errors,
                    [sectionIndex]: {
                      ...errors[sectionIndex],
                      [field.label]: validation
                        ? validation.message
                        : "This field is required",
                    },
                  };
                }
              }

            }
            else if (type === "email") {
              const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              const regex = new RegExp(emailPattern);
              if (!regex.test(value)) {
                errors = {
                  ...errors,
                  [sectionIndex]: {
                    ...errors[sectionIndex],
                    [field.label]: validation
                      ? validation.message
                      : "This field is required",
                  },
                };
              }
            } else if (pattern) {
              if (value) {
                let regex;
                if (type === "tel") {
                  regex = /^(?:\+91)?\d{10}$/;
                } else {
                  regex = new RegExp(pattern);
                }
                if (!regex.test(value)) {
                  if (!focusErrName) {
                    focusErrName = field.name;
                  }

                  errors = {
                    ...errors,
                    [sectionIndex]: {
                      ...errors[sectionIndex],
                      [field.label]: validation
                        ? validation.message
                        : "This field is required",
                    },
                  };
                }
              }
            } else if (
              (field.name === "jrf_terms_and_conditions" &&
                (!value || value === "")) ||
              (field.type === "select" &&
                field.multiple &&
                value &&
                value.length === 0)
            ) {
              if (!focusErrName) {
                focusErrName = field.name;
              }
              errors = {
                ...errors,
                [sectionIndex]: {
                  ...errors[sectionIndex],
                  [field.name]: validation
                    ? validation.message
                    : "This field is required",
                },
              };
            }
          });
        }

      }
    });
    if (Object.keys(errors).length === 0) {
      return true;
    } else {
      const errorFieldElement = document.getElementById(`${focusErrName}`);
      if (errorFieldElement) {
        errorFieldElement.focus(); // Focus on the field with the first error
        errorFieldElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }); // Scroll to it
      }
      setFormErrors(errors);
      return false;
    }
  };
  //For Operation Certificate.
  // let configCertStatus = "in-process"
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  const Type = decryptDataForURL(params.get("type"));
  const configCertStatus = decryptDataForURL(params.get("status")) || "saved";
  const configCertStatusRPCID = decryptDataForURL(params.get("RPCID"));
  const OpsActivityName = decryptDataForURL(params.get("activityName"));
  const opsCertiView = decryptDataForURL(params.get("opsCertiView"));
  const isUseForPhysical = decryptDataForURL(params.get("isUseForPhysical"));
  const fkConfigIDGL = decryptDataForURL(params.get("ConfigID"));
  const opsTypeID = decryptDataForURL(params.get("activityJIID"));
  let OPSTypeGl = decryptDataForURL(params.get("OperationType"));
  OPSTypeGl = getActivityCode(OPSTypeGl)
  OPSTypeGl = OPSTypeGl && OPSTypeGl.toLowerCase() != "othertpi" ? OPSTypeGl.toLowerCase() : OPSTypeGl
  let opsMode = params.get("operationMode")
    ? params.get("operationMode")
    : "";
  operationMode = decryptDataForURL(opsMode);
  let isCustomMode = params.get("isCustomMode")
    ? params.get("isCustomMode")
    : "";
  isCustomMode = decryptDataForURL(isCustomMode);
  let isRakeDetails = params.get("isRakeDetails")
    ? params.get("isRakeDetails")
    : "";
  isRakeDetails = decryptDataForURL(isRakeDetails);
  useEffect(() => {
    if (configCertStatusRPCID) {
      setTabOpenSecond(true);
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            rpc_id: configCertStatusRPCID,
          },
        };
      });
    }
  }, [configCertStatusRPCID]);
  const handleCertificateSave = async (type) => {
    if (formData?.[1]?.rpc_is_wght_avg?.length > 0 || formData?.[1]?.rpc_is_lot_no?.length > 0 || formData?.[1]?.rpc_is_sample_specs?.length > 0 || formData?.[1]?.rpc_is_other_config?.length > 0) {
      handleConfigSave(type, formData, setIsOverlayLoader, sequence, EditSubRecordId, configCertStatus, EditRecordId, configCertStatusRPCID, setTabOpenSecond, setFormData);
    }
    else {
      toast.error(translate("custom.AtleastOneConfig"), {
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
  };

  const addRow = (tab, sectionIndex) => {
    setFormConfigState((prevFormConfig) => {
      const newFormConfig = { ...prevFormConfig };
      const section = newFormConfig.sections[sectionIndex];
      if (section.type === "tabs") {
        // Find the active tab
        const activeTabIndex = parseInt(activeTab.split("-")[1]);
        const activeTabData = section.tabs[activeTabIndex];

        // Clone the existing rows of the active tab
        const clonedRows = activeTabData.rows.map((row) => [...row]);

        // Copy properties from the first row and add the new row
        const newRow = clonedRows[0].map((property) => ({ ...property }));
        clonedRows.push(newRow);

        // Update the rows of the active tab
        activeTabData.rows = clonedRows;

        // Set newFormConfig to trigger re-render
        return { ...newFormConfig };
      }
      return newFormConfig;
    });
  };
  const addColumn = (tab, sectionIndex) => {
    setFormConfigState((prevFormConfig) => {
      const newFormConfig = { ...prevFormConfig };
      const section = newFormConfig.sections[sectionIndex];
      if (section.type === "tabs") {
        // Find the active tab
        const activeTabIndex = parseInt(activeTab.split("-")[1]); // Extract tab index from activeTab
        const activeTabData = section.tabs[activeTabIndex];

        // Clone the existing rows of the active tab
        const clonedRows = activeTabData.rows.map((row) => [...row]);
        const Placeholder = "New Column";

        // Iterate over each row and add a new column (text field) to it
        clonedRows.forEach((row) => {
          // Add an empty text field as a new column to each row
          row.push({ type: "text", value: "", placeholder: Placeholder }); // Here, we assume each column has a 'type' and 'value' property
        });

        // Update the rows of the active tab
        activeTabData.rows = clonedRows;

        // Set newFormConfig to trigger re-render
        return { ...newFormConfig };
      }
      return newFormConfig;
    });
  };

  const deleteRow = (sectionIndex) => {
    setFormConfigState((prevFormConfig) => {
      const newFormConfig = { ...prevFormConfig };

      // Access the correct section based on sectionIndex
      const section = newFormConfig.sections[sectionIndex];

      // Check if the section type is 'tabs'
      if (section.type === "tabs") {
        // Iterate through the tabs
        section?.tabs.forEach((tab) => {
          // Check if the tab type is 'table'
          if (tab.type === "table" || tab.type === "tableadv") {
            // Check if there's more than one row
            if (tab.rows.length > 1) {
              // Remove the last row
              tab.rows.pop();
            }
          }
        });
      }

      return { ...newFormConfig };
    });
  };

  const deleteColumn = (sectionIndex, columnIndex) => {
    setFormConfigState((prevFormConfig) => {
      const newFormConfig = { ...prevFormConfig };
      const section = newFormConfig.sections[sectionIndex];

      // Find the tab with type 'table'
      const tableTab = section.tabs.find((tab) => tab.type === "table");

      if (tableTab) {
        // Remove the column from the headers array
        tableTab.headers.splice(columnIndex, 1);

        // Remove the corresponding cell from each row
        tableTab.rows.forEach((row) => row.splice(columnIndex, 1));
      }

      return newFormConfig;
    });
  };

  const handleAllSave = () => {
    const existingData = localStorage.getItem("allData");
    let newData = [];
    if (existingData) {
      newData = JSON.parse(existingData);
      if (!Array.isArray(newData)) {
        newData = [];
      }
    }
    newData.push(gaData);
    localStorage.setItem("allData", JSON.stringify(newData));
  };

  const handleCancel = () => {
    localStorage.removeItem("allData");
    navigate("/inwardList");
  };


  const handleSFMMainSubmit = async () => {
    handleSubmit();
    let isValidate = handleSubmit();
    if (!isValidate) {
      return false;
    }
    let payload;
    payload = {
      sfm_id: formData[0].sfm_id,
      sfm_data: {
        sfm_expecteddateanalysis: formData[0].sfm_expecteddateanalysis,
        sfm_dateanalysisstarted: formData[0].sfm_dateanalysisstarted,
        sfm_dateanalysiscompleted: formData[0].sfm_dateanalysiscompleted,
        sfm_remarks: formData[0].sfm_remarks,
        sfm_ambient_temp: formData[0].sfm_ambient_temp,
        sfm_borometricpressure: formData[0].sfm_borometricpressure,
        sfm_humidity: formData[0].sfm_humidity,
        sfm_status: "in-process",
        tenant: GetTenantDetails(1),
      },
    };
    setIsOverlayLoader(true);
    let res = await putDataFromApi(SFMUpdateApi, payload);
    if (res.data && res.data.status === 200) {
      // handleAllotUpdate(formData)
      getSFMDetails(
        res.data.data.sfm_id,
        setFormData,
        setTabOpen,
        setIstavSaveClicked,
        setTestMemoSetData,
        ""
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
    setIsOverlayLoader(false);
  };



  const searchAPI = async (value) => {
    try {
      setSearchTerm(value);
      if (value.length > 2 || value.length < 1) {
        if (value) {
          getAllListingData("", "", "", value);
        } else {
          getAllListingData("", "", "", -1);
        }
      } else {
        setLoading(false);
      }
    } catch { }
  };

  //Filterlogic Written here by sufiyan

  const handleSearchFilter = (e, type = "") => {
    const { name, value } = e.target;
    if (type) {
      setSearchFormDataType((prevFormData) => {
        return {
          ...prevFormData,
          [name]: e.target[e.target.selectedIndex].getAttribute("data-type"),
        };
      });
    }
    setSearchFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  /*
  Create by sufiyan 
  use for clrearing search filter
   
  */
  const clearFilterData = () => {
    setSearchFormData({});
    setSearchFormDataErros({});
    setSearchFormDataType({});
    setFilterIndex(1);
    setIsFilterBtnClicked(false);
    getAllListingData("", "", "", "", 1);
  };

  const handleAllotValidate = (e) => {
    let isValidate = handleSubmit();
    if (!isValidate) {
      return false;
    }
    setInwardBtnchange("allotment");
    setIsPopupOpen(true);
  };

  const handleAllotSubmit = async () => {
    let payload;
    payload = {
      // sa_id: formData[0].sa_id,
      sample_allotment: {
        sa_sampleallottedto: formData[0].sa_sampleallottedto,
        sa_actualdateofreporting: formData[0].sa_actualdateofreporting,
        sa_remarks: formData[0].sa_remarks,
        sa_expdateofresult: formData[0].sa_expdateofresult,
        fk_testmemo_id: testMemoId ? testMemoId : formData[0].fk_testmemo_id,
        fkey_commodity: formData[0].fkey_commodity,
        status: GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL" ? "completed" : "allotted",
        // status: "allotted",
        tenant: GetTenantDetails(1),
      },
    };
    let res;
    setIsOverlayLoader(true);
    if (formData[0].sa_id) {
      payload.sa_id = formData[0].sa_id;
      res = await putDataFromApi(allotmentUpdateApi, payload);
    } else {
      res = await postDataFromApi(allotmentCreateApi, payload);
    }
    if (res.data && res.data.status === 200) {
      if (!formData[0].sa_id && GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL") {
        await handleSFMCreateWithoutVerification(res.data.data);
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
      setTimeout(() => {
        navigate("/allotmentList");
      }, 1000);
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

  const handleBackButtonFunction = () => {
    let redirectURL = "";
    if (pageType === "inward" || pageType === "assignment") {
      redirectURL = "/inwardList";
    } else if (moduleType === "testmemomain") {
      redirectURL = "/testmemoList";
    } else if (moduleType == "internalcertificate") {
      if (formData[0].ic_id) {
        redirectURL = "/testReport";
      }
      else {
        redirectURL = "/testmemoList";
      }
    } else if (moduleType == "allotment") {
      redirectURL = "/allotmentList";
    } else if (moduleType == "sfm") {
      redirectURL = "/SFMList";
    } else if (moduleType == "sampleverification") {
      redirectURL = "/verificationList";
    } else if (moduleType == "jobinstruction") {
      redirectURL = "/operation/jrfInstructionListing";
    }
    else if (moduleType == "consortiumorder") {
      redirectURL = "/operation/consortiums-list";
    }
    else {
      redirectURL = "/jrfListing";
    }
    navigate(redirectURL);
  };

  const getCustomCellValues = (cell, useFor, formIndex) => {
    // if(useFor === "sub_table"){
    //   cell.name = cell.name + "_" + formIndex
    // } 

    if (cell.type == "date") {
      if (!TMLType) {
        cell.readOnly = false;
      }
    }
    if (moduleType == "internalcertificate") {
      if (
        [
          "ic_samplingmethods",
          "ic_locationofsmpl",
          "ic_dos",
          "ic_envcondition",
          "ic_conditionofsmpl"
        ].includes(cell.name)
      ) {
        if (
          formData[0]?.ic_smpldrawnbylab === "Sample Not Drawn By Laboratory"
        ) {
          if (cell.name === "ic_envcondition") {
            cell.label = "Environmental Conditions During Sampling";
            cell.label = "Environmental Conditions During Sampling";
          } else if (cell.name === "ic_dos") {
            cell.type = "text";
          } else if (cell.name === "ic_samplingmethods") {
            cell.type = "text";
          }
          cell.required = false;
        }
        else if (formData[0]?.ic_smpldrawnbylab === "As Per Client") {
          cell = {
            ...cell,
            "width": 6,
            "thirdName": "ic_is_dos",
            "firstType": cell.type,
            "thirdType": "checkbox",
            "type": "doubleText",
            "fieldWidth": "75",
            "isShowRadioBefore": true,
          };
          cell.required = false;
          if (cell.name === "ic_dos") {
            cell.name = 'ic_dos'
            cell.thirdName = 'ic_is_dos'
            if (formData?.[0]?.ic_is_dos) {
              cell.firstType = "date"
              cell.required = true;
            }
            else {
              cell.firstType = "label"
            }
          }
          else if (cell.name === "ic_samplingmethods") {
            cell.name = 'ic_samplingmethods'
            cell.thirdName = 'ic_is_samplingmethods'
            if (formData?.[0]?.ic_is_samplingmethods) {
              cell.required = true;
            }
          }
          else if (cell.name === "ic_locationofsmpl") {
            cell.name = 'ic_locationofsmpl'
            cell.thirdName = 'ic_is_locationofsmpl'
            if (formData?.[0]?.ic_is_locationofsmpl) {
              cell.required = true;
            }
          }
          else if (cell.name === "ic_envcondition") {
            cell.name = 'ic_envcondition'
            cell.thirdName = 'ic_is_envcondition'
            if (formData?.[0]?.ic_is_envcondition) {
              cell.required = true;
            }
          }
          else if (cell.name === "ic_conditionofsmpl") {
            cell.name = 'ic_conditionofsmpl'
            cell.thirdName = 'ic_is_conditionofsmpl'
            if (formData?.[0]?.ic_is_conditionofsmpl) {
              cell.required = true;
            }
          }

          // cell.required = false;
        } else {
          cell.required = true;
          if (cell.name === "ic_envcondition") {
            cell.label = "Environmental Conditions During Sampling";
            cell.placeholder = "Environmental Conditions During Sampling";
          }
          else if (cell.name === "ic_dos") {
            cell.type = "date";
          }
          else if (cell.name === "ic_samplingmethods") {
            if (!isTestMethods) {
              cell.type = "text";
            } else {
              cell.type = "select";
              cell.options = [];
              cell.multiple = true;
              cell.isCustomOptions = true;
              cell.customOptions = customOptions?.['ic_samplingmethods'] || []
            }
          }
        }
      } else if (cell.name === "ic_ulrno") {
        if (formData[0]?.ic_id || formData[0].nonScopeData) {
          if (formData[0].nonScopeData || !formData[0]?.ic_ulrno) {
            cell.value = "-";
          }
          cell.type = "label";
          cell.required = false;
          cell.pattern = "";
        }
        else {
          cell = {
            "width": 6,
            "name": "ic_ulrno",
            "label": "ULR Number",
            "type": "text",
            "placeholder": "Enter ULR Number",
            "pattern": "^[A-Z]{2}\\d{4,5}\\d{2}\\d{9}$",
            "tooltip": "Before inputting the ULR Number, note its format:TC6456-Lab Complience Code, 24 - Current year,  00000000000- Sequene number(9 digit). Ensure accuracy for precision.",
            "isPatternMessage": true
          }
        }
      }
      else if (cell.name === "ic_smpldrawnbylab") {
        cell.options = [
          "Sample Drawn By Laboratory",
          "Sample Not Drawn By Laboratory",
          "As Per Client"
        ]
      }
      else if (cell.name === "ic_mark_and_seal_qualifier") {
        if (formData?.[0]?.ic_is_mark || formData?.[0]?.ic_is_seal) {
          cell.required = true
        }
        else {
          cell.required = false
        }
      }
    } else if (moduleType == "jrf") {
      if (cell.name == "jrf_lab") {
        if (user?.role === "LR" && viewOnly && !isExternalJRF) {
          cell.name = "jrf_branch_name";
          cell.label = "Branch Name";
        }
        if (isExternalJRF) {
          cell.disabled = true;
          cell.readOnly = true;
        }
        else if (isRegularJRF) {
          cell.disabled = true;
          cell.readOnly = true;
        }
      } else if (cell.name == "fk_sub_commodity") {
        cell.isCustomOptions = true;
        cell.customOptions = subCommodityOptions;
      } else if (cell.name === "jrf_terms_and_conditions") {
        // if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL") {
        if (GetTenantDetails(1, 1) === "TPBPL") {
          cell.options = [
            "Terms & Conditions: The samples will be retained for a duration of 30 days from the date of certificate issuance. However, for export vessels, the retention period will be extended to 90 days, where applicable. Any grievances or complaints must be duly lodged within a timeframe of 15 days from the date of issuance of the test report. Both parties will adhere to and uphold a set of compliance code and principles in the provision of services. We do not provides statement of conformity, opinions or interpretations concerning the findings rendered in reports.",
          ];
        }
        else {
          cell.options = ["Terms & Conditions: The samples will be retained for a duration of 30 days from the date of testing. However, for export vessels, the retention period will be extended to 90 days, where applicable. Any grievances or complaints must be duly lodged within a timeframe of 15 days from the date of issuance of the test report. Both parties will adhere to and uphold a set of compliance code and principles in the provision of services. We do not provides statement of conformity, opinions or interpretations concerning the findings rendered in reports."]
        }
      }
      else if (cell.name === "jrf_no_of_packets") {
        if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL") {
          cell.label = "No. of Containers";
          cell.placeholder = "No. of Containers";
        }
      }

    } else if (moduleType == "sfm") {
      if (cell.name === "sfm_dateanalysiscompleted") {
        cell.pastDate = false;
        cell.minDate = formData[0]?.sample_inward_dos;
      } else if (cell.name === "sfm_dateanalysisstarted") {
        cell.startDate = formData[0]?.actual_sfm_dateanalysisstarted
          ? formData[0]?.actual_sfm_dateanalysisstarted
          : "";
      } else if (cell.name === "sfm_humidity") {
        if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL") {
          cell.label = "Relative humidity";
        }
      }
    } else if (moduleType == "jobinstruction") {
      if (cell.name === "fk_subcommodityid") {
        if (formData[0].ji_id) {
          cell.readOnly = true
        }
        // cell.isCustomOptions = true;
        // cell.customOptions = subCommodityOptions;
      } else if (cell.name === "fk_supplierid" || cell.name === "ji_suplier_name") {
        if (formData[0].ji_is_supplier === "Buyer") {
          cell.label = "Supplier";
          cell.placeholder = "Enter Supplier";
        } else if (formData[0].ji_is_supplier === "Supplier") {
          cell.label = "Buyer";
          cell.placeholder = "Enter Buyer";
        }
        if (['TL'].includes(formData[0]?.fk_operationtypetid_code)) {
          cell.required = true;
        }
        else {
          cell.required = false;
        }
      } else if (cell.name === "ji_loading_unloading_name") {

        if (formData[0].ji_is_loading !== "Loading") {
          cell.label = "Name of Unloading Port";
        } else {
          cell.label = "Name of Loading Port";
        }
      }
      else if (['ji_loading_destination'].includes(cell.name)) {
        if (formData[0].ji_is_loading === "Loading") {
          cell.label = "Destination";
        }
        else {
          cell.label = "Source";
        }
      }
      else if (['loading_unloading_country_name', 'fk_loading_unloading_country'].includes(cell.name)) {
        if (formData[0].ji_is_loading === "Loading") {
          if (['RK'].includes(formData[0]?.fk_operationtypetid_code)) {
            cell.label = "Destination and country";
          }
          else {
            cell.label = "Unloading Port and country";
          }
        } else {
          if (['RK'].includes(formData[0]?.fk_operationtypetid_code)) {
            cell.label = "Source and country";
          }
          else {
            cell.label = "Loading Port and country";
          }
        }
      }
      else if (cell.name === "ji_first_ref_no") {
        if (
          formData[0]?.ji_dual_port_seq === "Second" &&
          formData[0]?.ji_is_dual_port === "Yes"
        ) {
          // cell.required = true;
        } else {
          // cell.required = false;
        }
      } else if (cell.name === "fk_consortium_order" || cell.name === "consortium_number") {
        if (formData[0]?.fk_operationtypetid_code == 'CS') {
          cell.required = true;
        } else {
          cell.required = false;
        }
      }
      else if (cell.name === "ji_nameofoperationmode") {
        cell.required = false;
        cell.readOnly = false;
        if (formData[0]?.fk_operationtypetid_code == 'VL') {
          cell.required = true;
        } else {
          if (formData[0]?.fk_operationtypetid_code == 'CS') {
            cell.readOnly = true;
          }
        }
        if (['ST', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
          cell.label = "Vessel Name (As declared by client)"
        }
        else {
          cell.label = "Vessel Name"
        }
      }
      else if (cell.name === "ji_eta") {
        if (!['VL'].includes(formData[0]?.fk_operationtypetid_code)) {
          cell.required = false;
        } else {
          cell.required = true;
        }
        // if (['RK', 'ST', 'TR', 'PV', 'CS', 'PL'].includes(formData[0]?.fk_operationtypetid_code)) {
        //   cell.required = false;
        // } else {
        //   cell.required = true;
        // }
      }
      else if (["ji_billing"].includes(cell.name)) {
        cell.type = "text"
      }

      else if (["ji_branch_sales_person", "fk_userbranchheadid", 'fk_userbranchcaptainid'].includes(cell.name)) {
        // cell.required = false
        if (['TL'].includes(formData[0]?.fk_operationtypetid_code) && ['fk_userbranchcaptainid'].includes(cell.name)) {
          cell.required = true
        }
        cell.type = "select"
      }
      else if (cell.name === "ji_is_dual_port") {
        if (formData[0]?.fk_operationtypetid_code === "CS") {
          cell.isDisabledField = true
        }
        else {
          cell.isDisabledField = false
        }
      }
      else if (cell.name === "ji_type_of_sampling") {
        if (['CS', 'TL', 'DS', 'CV', 'SS'].includes(formData[0]?.fk_operationtypetid_code)) {
          cell.readOnly = true
          cell.required = false
        }
        else {
          cell.readOnly = false
          cell.required = true
        }
      }
      else if (cell.name === "ji_type_of_analysis") {
        if (['CS', 'TL', 'DS', 'CV', 'SS'].includes(formData[0]?.fk_operationtypetid_code)) {
          cell.readOnly = true
          cell.required = false
        }
        else {
          cell.readOnly = false
          cell.required = true
        }
      }
      else if (cell.name === "ji_analysis") {
        if (['CS', 'TL', 'DS', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
          cell.readOnly = true
          cell.required = false
        }
        else {
          cell.readOnly = false
          cell.required = true
        }
      }
      else if (cell.name === "ji_sampling_methods") {
        if (['DS', 'PV', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
          if (['DS'].includes(formData[0]?.fk_operationtypetid_code)) {
            cell.readOnly = true
          }

          cell.required = false
        }
        else {
          cell.readOnly = false
          cell.required = true
        }
        // if (['CS', 'TL','DS'].includes(formData[0]?.fk_operationtypetid_code)) {
        //   cell.readOnly = true
        //   cell.required = false
        // }
        // else {
        //   cell.readOnly = false
        //   cell.required = true
        // }
      }
      // else if (cell.name === "ji_totalqty") {
      //   if (['CV', 'PV', 'CN', 'RC', 'AS', 'PL', 'RK'].includes(formData[0]?.fk_operationtypetid_code)) {
      //     cell.required = false;
      //   } else {
      //     cell.required = true;
      //   }
      // }
      // else if (cell.name === "ji_appointed_totalqty") {
      //   if (['CV', 'PV', 'CN', 'RC', 'AS', 'PL', 'RK'].includes(formData[0]?.fk_operationtypetid_code)) {
      //     cell.required = false;
      //   } else {
      //     cell.required = true;
      //   }
      // }
      else if (cell.name === "ji_reference") {
        if (formData[0]?.ji_sent_through?.length === 1 && formData[0].ji_sent_through[0] === "Verbal Nomination") {
          cell.required = false
        }
        else {
          cell.required = true
        }
      }
      else if (cell.name === "ji_payment_terms") {
        if (formData[0]?.ji_payment_terms) {
          cell.defaultValue = ""
        }
      }
      else if (cell.name === "ji_no_of_sample") {
        cell.label = "No. of Sample"
        if (formData[0]?.fk_operationtypetid_code === "RK") {
          cell.label = "No. of Rake"
        }
        else if (formData[0]?.fk_operationtypetid_code === "TR") {
          cell.label = "No. of Truck"
        }
        else if (formData[0]?.fk_operationtypetid_code === "ST") {
          cell.label = "No. of Stack"
        }
      }
      else if (cell.name === "ji_dos") {
        cell.label = "Date of Sampling"
        if (formData[0]?.fk_operationtypetid_code === "SS") {
          cell.label = "Date of Received"
        }
      }
      if (OperationType === getVesselOperation('DS')) {
        if (cell.name === "opsvd_survey_at") {
          const dscustomopt = ['Survey at Port', 'Survey at Jetty', 'Survey at Ancharage']
          let newoptions = [];
          dscustomopt.map((opt, i) => {
            newoptions.push({
              id: i + 1,
              name: opt
            })
          })
          cell.isCustomOptions = true;
          cell.customOptions = newoptions
          cell.readOnly = tabOpen
        }
        else if (cell.name === "opsvd_survey_at_sow") {
          let portType = 'Port'
          if (formData[0]?.opsvd_survey_at == 1) {
            portType = "Port"
          }
          else if (formData[0]?.opsvd_survey_at == 2) {
            portType = "Jetty"
          }
          else if (formData[0]?.opsvd_survey_at == 3) {
            portType = "Ancharage"
          }
          let newoptions = ['Initial and Final draft survey at ' + portType, 'Initial, Interim and Final Survey at ' + portType]
          cell.options = newoptions
          cell.isDisabledField = tabOpen
        }
        else if (cell.name === "opsvd_survey_keel_correction") {
          cell.isDisabledField = tabOpen
        }
      }
      else if (OperationType === getVesselOperation('SV')) {
        if (cell.name === "cargo_being_discharged_by") {
          if (formData[0].ji_is_loading === "Loading") {
            cell.label = "Cargo Being Loaded By"
            cell.placeholder = "Cargo Being Loaded By"
          }
          else {
            cell.label = "Cargo Being Discharged By"
            cell.placeholder = "Cargo Being Discharged By"
          }
        }
      }

      if (["fk_commodityid", "fk_branchid", 'fk_companyid', 'fk_subcommodityid', 'fk_clientid', 'ji_client_address', 'ji_client_gst', 'ji_client_billing_address', "ji_client_email", "fk_operationtypetid", "fk_placeworkid"].includes(cell.name)) {
        if (formData[0].ji_id) {
          cell.readOnly = true
        }
        if (['fk_clientid'].includes(cell.name) && formData[0].status === "rejected") {
          cell.readOnly = false
        }

      }
      if (formData[0].status === "rejected") {
        if (["fk_subcommodityid"].includes(cell.name)) {
          cell.readOnly = false
        }
        else if (["ji_date"].includes(cell.name)) {
          cell.readOnly = true
        }
      }
    } else if (moduleType == "GroupAssignment") {
      if (cell.name == "cmp_address") {
        if (formData[0]?.jrf_is_external) {
          cell.name = "jrf_ext_address";
          cell.label = "External Customer Address";
        }
      } else if (cell.name == "jrf_company_name") {
        if (formData[0]?.jrf_is_external) {
          cell.name = "jrf_ext_orgnizationname";
          cell.label = "External Customer Name";
        }
      }
    } else if (moduleType == "inwardChecklist") {
      if (cell.name == "jrf_company_name") {
        if (formData[0]?.jrf_is_external) {
          cell.name = "jrf_ext_orgnizationname";
          cell.label = "External Customer Name";
        }
      } else if (cell.name == "jrf_pkging_condition") {
        if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL") {
          cell.options = [
            "Sealed",
            "Unsealed",
            "Contamination",
            "Sign of Damage (Puncture, Leaks)",
            "Intact"
          ];
        }
      }
      else if (cell.name === "jrf_no_of_packets") {
        if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL") {
          cell.label = "No. of Containers";
          cell.placeholder = "No. of Containers";
        }
      }
      else if (cell.name === "jrf_sample_condition") {
        if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL") {
          cell.options = ["Liquids", "Semi Solid", "Gaseous"]
        }
      }
    } else if (moduleType == "allotment") {
      if (cell.name === "sa_actualdateofreporting") {
        cell.pastDate = true;
        cell.minDate = formData[0]?.smpl_dos;
      }
    } else if (moduleType == "operationCertificate") {
      if (cell.name === "cert_number") {
        if (RPCID !== "-999") {
          if (isCustomMode) {
            cell.isCopy = true
          }
          // cell.type="label"
        }
      }
    } else if (moduleType === "vesselJICertificate") {
      if (
        [
          "rpc_is_lot_no",
          "rpc_is_smpl_qty",
          "rpc_is_total_no",
          "rpc_is_qty",
          "rpc_is_smpl_wghtorunit",
          "rpc_is_total_qty",
          "rpc_is_smpl_mark",
          "rpc_is_smpl_type",
          "rpc_is_smpl_total",
          "rpc_is_dos",
        ].includes(cell.name)
      )
        cell.viewOnly = true;
    }
    else if (["auditOutstanding", "auditBranchExpenses", "auditSalesRegister"].includes(moduleType)) {

      if (EditRecordId) {

        if (["company", "branch", "month", "year"].includes(cell.name)) {
          cell.readOnly = true
        }
        else if (cell.name === "branch_name") {
          cell.disabledMarks = formData[0]?.exists_branch_name
        }
        else if (cell.name === "credit_note_branch_name") {
          cell.disabledMarks = formData[1]?.exists_credit_note_branch_name
        }
      }
      else {
        if (["company", "branch", "month", "year"].includes(cell.name)) {
          cell.readOnly = false
        }
      }
    }
    else if (["purchaseReq"].includes(moduleType)) {

      if (!["Saved", "Reject"].includes(formData[0]?.req_status) && formData[0]?.req_status) {
        cell.readOnly = true
      }
      else {
        if (cell.name != "request_no") {
          cell.readOnly = false
        }

      }


    }
    else if (["tender"].includes(moduleType)) {
      if (cell.name === "tender_submission_date") {
        cell.minDate = formData[0]?.tender_issue_date
      }

    }
    //  else if (["calibrations"].includes(moduleType)) {

    //  }
    // else if(moduleType==="jobCosting"){
    //   if (cell.name==="client_name") {
    //     let value= "ABC"
    //     cell.value = value
    //   }
    // }
    else if (moduleType == "sampleinward") {
      if (cell.name === "jrf_no_of_packets") {
        if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL") {
          cell.label = "No. of Containers";
          cell.placeholder = "No. of Containers";
        }
      }
    }

    else if (moduleType == "invoice") {
      if (Type == "Advance") {
        if (cell.name == "reference_number") {
          if (user?.role === "LR") {
            cell.isCustomPayload = true
          }
          else {
            cell.isCustomPayload = false
          }
        }
      }
      if (cell.name === "iv_jireference") {
        // if (Type === "IC" && !formData[0]?.is_iv_jireference) {
        cell.type = "text"
        cell.readOnly = false
        // }
      }
      else if (cell.name === "im_salespersonid") {
        if (formData[0]?.isShowSalesPersonDD) {
          cell.type = "DropDownWithLoadMore"
          cell.isSearchable = true
        }
        else {
          cell.type = "select"
          cell.isSearchable = false
        }
        if (status === "View") {
          cell.type = "text"
        }
      }
      else if (cell.name === "im_voucher_type") {
        cell.options = getVoucherTypes(formData?.[0]?.invoiceCompanyCode)
      }
      else if (cell.name === "im_tax_classification") {
        // if (formData[0]?.state_of_client != formData[0]?.fk_im_state) {
        //   cell.options = ['IGST']
        // }
        // else {
        //   cell.options = [
        //     "CGST",
        //     "SGST",
        //     "IGST"
        //   ]
        // }
      }
      else if (cell.name == "courier_persone_name") {
        cell.label = "Person Who Delivered The Docs"
        cell.placeholder = "Person Who Delivered The Docs"
        if (formData[0]?.im_courier === "courier_hand_delivery") {
          cell.label = "Branch OR Person Recieved"
          cell.placeholder = "Branch OR Person Recieved"
        }
      }
      else if (cell.name == "courier_remark") {
        cell.required = false
        if (formData[0]?.im_courier === "hardcopy") {
          cell.required = true
        }
      }
      if (['courier_address', 'courier_submission_address', 'courier_done_by_executive'].includes(cell.name)) {
        if (['courier_address', 'courier_submission_address'].includes(cell.name)) {
          if (!formData?.[0]?.courier_address) {
            cell.defaultValue = formData?.[0]?.ji_jrf_courier_details?.courier_address
          }
          if (!formData?.[0]?.courier_submission_address) {
            cell.defaultValue = formData?.[0]?.ji_jrf_courier_details?.courier_address
          }
        }
        if (['courier_done_by_executive'].includes(cell.name)) {
          if (!formData?.[0]?.courier_done_by_executive) {
            cell.defaultValue = formData?.[0]?.ji_jrf_courier_details?.ops_exec_name
          }
        }
      }
    }
    else if (moduleType == "calibration") {

      if (cell.name === "calib_next_due_date") {
        cell.minDate = formData[0]?.calib_date
      }
    }
    else if (moduleType == "PoPreview") {
      if (cell.name === "preview") {
        cell.apiUrl = purchaseOrderDownload
        cell.apiPayload = {
          "po_id": poId
        }
      }
    }
    else if (moduleType == "incentives") {
      if (cell.name === "incentive_delay_billing_days") {
        if (formData?.[0]?.ji_payment_terms) {
          cell.defaultValue = getBillingDelayDayCount(formData?.[0]?.incentive_billing_date, formData?.[0]?.ji_payment_terms)
        }
      }
    }
    else if (moduleType === "stocks") {
      if (!getPurchaseManager(moduleType, 'add') && getPurchaseManager(moduleType, 'change')) {
        if (!['stock_consumed_qty'].includes(cell.name)) {
          cell.readOnly = true
          cell.isDisabledField = true
        }
      }
    }
    else if (moduleType === "ShipmentForm") {

      if (formData[0].ji_is_loading === "Loading") {
        if (cell.name === "loading_unloading_port_name") {
          cell.label = "Unloading Port and country";
          
        }



      } else {
        if (cell.name === "loading_unloading_port_name") {

          cell.label = "Loading Port and country";
        }
      }
    }
    //For temporrary Date field set future and pass
    if (
      [
        "smpl_detail_dos",
        "sa_actualdateofreporting",
        "sa_expdateofresult",
        "sv_dateofverification",
        "sfm_dateanalysisstarted",
        "sfm_dateanalysiscompleted",
        "ic_dos",
        "ic_dateofrecsmpl",
        "ic_dateofanalysis",
      ].includes(cell.name)
    ) {
      if (["sa_expdateofresult", "sfm_dateanalysiscompleted"].includes(cell.name)) {
        cell.futureDays = 30;
        cell.noLimitation = true;
      } else {
        cell.pastDate = true;
      }
      cell.pastdays = 45;
    }
    if (['operationCertificate', 'jobinstruction', 'vesselJICertificate'].includes(moduleType)) {
      if (cell.type === "date") {
        // cell.noRestrictionApply = true || ['SU'].includes(getCurrentRole())
        cell.noRestrictionApply = true || ['SU'].includes(getCurrentRole())
      }
    }
    // if (cell.name === "iv_jireference") {
    //   if (Type === "IC" && !formData[0]?.is_iv_jireference) {
    //     cell.type = "text"
    //     cell.readOnly = false
    //   }
    // }
    return cell;
  };

  const getTileClassName = (status, tile) => {
    //     blank ->step1
    // saved ->step2
    // created /pre-analysis - >step3
    // analysis -step4

    if (
      // (status === "" || status === undefined) &&
      !editReordType && !props.isMainJiSaved &&
      tile.Text === "Company & Commodity"
    ) {
      return "card_header_btn_active";
      // } else if (status === "saved" && tile.Text === "Scope of Work") {
    } else if (!editReordType && props.isMainJiSaved && tile.Text === "Scope of Work") {
      return "card_header_btn_active";
    } else if (
      // (status === "created" || status === "pre-analysis") &&
      editReordType === "analysis" &&
      tile.Text === "Groups & Parameters"
    ) {
      return "card_header_btn_active";
      // } else if (status === "analysis" && tile.Text === "Nominations & Billing Details") {
    } else if (editReordType === "nomination" && tile.Text === "Nominations & Billing Details") {
      return "card_header_btn_active";
    } else {
      return "card_header_btn";
    }
  };
  const getSubTileClassName = (section, tile) => {
    if (operationStepNo === 1 && tile.Text === "Groups & Parameters") {
      return "card_header_btn_active";
    } else if (operationStepNo === 2 && ["Sample Information", "Sample Receipt Details"].includes(tile.Text)) {
      return "card_header_btn_active";
    } else if (operationStepNo == 3 && tile.Text === "Assign Parameters") {
      return "card_header_btn_active";
    } else if (operationStepNo == 4 && tile.Text === "Physical Analysis") {
      return "card_header_btn_active";
    } else if (operationStepNo == 6 && tile.Text === "Sample Collection") {
      return "card_header_btn_active";
    } else if (operationStepNo == 7 && tile.Text === "Rake Details") {
      return "card_header_btn_active";
    } else if (operationStepNo == 5 && tile.Text === "Send to JRF / Oth. TPI") {
      return "card_header_btn_active";
    } else if (section?.tabs[0]?.label.toLowerCase() === tile.Text.toLowerCase()) {
      return "card_header_btn_active";
    } else {
      if (!editReordType && tile.Text === "Scope of Work") {
        return "card_header_btn_active";
      } else if (editReordType === "analysis" && tile.Text === "Groups & Parameters") {
        return "card_header_btn_active";
      } else if (editReordType === "nomination" && tile.Text === "Nominations & Billing Details") {
        return "card_header_btn_active";
      }
      return "card_header_btn";
    }
  };

  const updateConfiguredStatus = async (status, CCID, certificateStatus) => {
    try {
      let payload = {
        rpc_id: RPCID,
        ji_id: EditRecordId,
        jis_id: JISID,
        report_configuration: {
          status: status,
        },
      };
      setIsOverlayLoader(true);
      let res = await putDataFromApi(reportConfigUpdateApi, payload);
      if (res.data.status === 200) {
        const successMessage =
          res.data?.data?.message || "Operation completed successfully.";
        toast.success(successMessage);

        setTimeout(() => {
          if (certificateStatus === "posted") {
            navigate(
              `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                EditRecordId
              )}/${encryptDataForURL(CCID)}?status=${encryptDataForURL(
                "posted"
              )}&CCID=${encryptDataForURL(CCID)}` +
              "&OperationType=" +
              encryptDataForURL(OperationType)
            );
          } else {
            navigate(
              `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                EditRecordId
              )}/${encryptDataForURL(CCID)}` +
              "?OperationType=" +
              encryptDataForURL(OperationType)
            );
          }
        }, 1000);
      } else {
        const errorMessage =
          res.data?.data?.message || "Something unexpected occurred.";
        toast.error(errorMessage);
      }
    }
    finally {
      setIsOverlayLoader(false)
    }
  };

  const generateCertificate = async (status, certificateStatus, isExternal = "", isSupervission = "", isWeighted = "") => {

    try {
      let isValidate = handleSubmit();
      if (!isValidate) {
        return false;
      }
      setIsOverlayLoader(true);
      let cc_additional_headers = {};
      Array.from({ length: newExraFields }).forEach((_, index) => {
        const fieldName = "new_extra_field";
        cc_additional_headers[formData?.[0]?.[`${fieldName}_label_${index}`]] = {
          value: formData?.[0]?.[`${fieldName}_value_${index}`] || '',
          isChecked: formData?.[0]?.[`${fieldName}_chk_${index}`] || false
        }
      })
      let cc_physical_options = []
      if (isUseForPhysical) {
        cc_physical_options = [
          ...new Set(session?.analysisData.map(singleData => singleData.pa_sample_mark))
        ]
        if (formData[0]?.cc_physical_report_sample_marks?.length > 0) {
          cc_physical_options = formData[0]?.cc_physical_report_sample_marks
        }
      }
      const certijsonFields = ['eic_bl_number', 'eic_weight_avg_moisture', 'eic_eia_code', 'dpl_source', 'dpl_name_colliery', 'dpl_analysis_completed_on', 'dpl_smpl_mark_date'];
      const cc_certijsondata = {};

      certijsonFields.forEach((key) => {
        cc_certijsondata[key] = formData[0]?.[key];
      });
      let payload = {
        commercial_certificate: {
          cc_certificatenumber: formData[0]?.cert_number,
          cc_date: isSupervission ? moment().format('YYYY-MM-DD') : formData[0].ji_date,
          cc_refencenumber: formData[0].ji_reference_number,
          cc_accountof: isSupervission ? formData[0]?.company?.company_name : formData[0].cc_accountof,
          cc_eia: formData[0].cc_eia,
          cc_commodity: formData[0].ji_sub_commodity_name,
          cc_topheader: formData[0].jrf_header,
          cc_bottomheader: formData[0].jrf_bottom,
          fk_jiid: EditRecordId,
          fk_jisid: isSupervission ? OperationTypeID : JISID,
          fk_cert_config_id: OpsConfigID,
          cc_show_rounded_qty: formData[0]?.cc_show_rounded_qty?.[0] ? true : false,
          cc_is_hide_basis: formData[0]?.cc_is_hide_basis?.[0] ? true : false,
          cc_is_qty_display: formData[0]?.cc_is_qty_display?.[0] ? true : false,
          cc_is_rake_details: formData[0]?.cc_is_rake_details?.[0] ? true : false,
          status: certificateStatus,
          cc_is_external: isExternal ? true : false,
          tenant: GetTenantDetails(1),
          is_physical: isUseForPhysical,
          cc_additional_remark: formData[0].cc_additional_remark,
          cc_supp_buyer: formData[0].cc_supp_buyer,
          cc_fk_place_pf_work_id: formData[0].cc_fk_place_pf_work_id,
          cc_other_placework: formData[0].cc_other_placework,
          cc_fk_sub_commodity_id: formData[0].cc_fk_sub_commodity_id,
          is_weighted_certi: isWeighted,
          cc_appointed_totalqty: formData[0].cc_appointed_totalqty || '-',
          cc_appointed_qty_unit: formData[0].cc_appointed_qty_unit,
          is_non_lms: !getLMSOperationActivity().includes(OperationType) && !isExternal,
          cc_additional_headers: cc_additional_headers,
          cc_is_other_format: formData[0]?.cc_is_other_format?.[0] ? true : false,
          fk_cc_cert_format_id: formData[0]?.fk_cc_cert_format_id,
          cc_physical_report_sample_marks: cc_physical_options,
          cc_certijsondata: cc_certijsondata,
        },
      };
      if (isUseForPhysical) {
        payload.commercial_certificate.cc_is_physical = true
      }
      if (certificateStatus === "posted" || isExternal) {
        payload.commercial_certificate.is_generate = true
      }
      if (RPCID !== "-999") {
        payload.commercial_certificate.fk_rpc_id = RPCID;
      }
      if (payload?.commercial_certificate?.fk_cert_config_id || !getLMSOperationActivity().includes(OperationType) || true) {
        let res = await postDataFromApi(ccCertCreateApi, payload);
        if (moduleType == "operationCertificate" && (formData[0]?.cc_is_rake_details?.length > 0 && formData[0]?.cc_is_rake_details?.[0])) {
          await OperationQualityAnalysisCreateDataFunction(
            formData,
            setIsOverlayLoader,
            setIsPopupOpen,
            OperationType,
            JISID,
            navigate,
            jrfCreationType,
            operationMode,
            true,
            formConfig.sections[0],
            setSubTableData,
            setFormData,
            formConfig,
            operationStepNo,
            OpsConfigID,
            isUseForPhysical,
            res?.data?.data?.cc_id
          );
        }

        if (res.data.status === 200) {
          if (isUseForPhysical) {
            navigate(
              `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                EditRecordId
              )}/${encryptDataForURL(res?.data?.data?.cc_id)}` +
              "?OperationType=" +
              encryptDataForURL(OperationType) + "&isExternal=" + encryptDataForURL(isExternal) + "&isUseForPhysical=" + encryptDataForURL(isUseForPhysical)
            );
            return
          }
          if (RPCID !== "-999") {
            if (!isSupervission) {
              updateConfiguredStatus(
                "completed",
                res?.data?.data?.cc_id,
                certificateStatus
              );
            }
          } else {
            if (status === "NonLMS" && ![getVesselOperation('bulk_crg')].includes(OperationType)) {
              let payload = {
                ji_id: EditRecordId,
                jis_id: JISID,
                tenant: 1,
              };
              let OPSDSRes = await getNonLMSDetailsById(OperationType, payload);
              if (OPSDSRes.data.status === 200) {
                if (certificateStatus === "saved") {
                  navigate(
                    `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                      OPSDSRes?.data?.data?.opsvd_id
                    )}/${encryptDataForURL(
                      res?.data?.data?.cc_id
                    )}?status=${encryptDataForURL("NonLMS")}` +
                    "&OperationType=" +
                    encryptDataForURL(OperationType) +
                    "&useFor=" +
                    encryptDataForURL('savedCertificate') + "&isExternal=" + encryptDataForURL(isExternal)
                  );
                } else {
                  navigate(
                    `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                      OPSDSRes?.data?.data?.opsvd_id
                    )}/${encryptDataForURL(
                      res?.data?.data?.cc_id
                    )}?status=${encryptDataForURL("NonLMSPosted")}` +
                    "&OperationType=" +
                    encryptDataForURL(OperationType) + "&isExternal=" + encryptDataForURL(isExternal)
                  );
                }
              }
            } else if ([getVesselOperation("DS"), getRakeOperations("QAss"), getVesselOperation('bulk_crg')].includes(OperationType)) {
              navigate(
                `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                  EditRecordId
                )}/${encryptDataForURL(
                  res?.data?.data?.cc_id
                )}/?status=${encryptDataForURL("NonLMSPosted")}` +
                "&OperationType=" +
                encryptDataForURL(OperationType) + "&isExternal=" + encryptDataForURL(isExternal)
              );
            }
            else {
              if (isExternal) {
                OperationCreateDataFunction(
                  null,
                  setIsOverlayLoader,
                  setIsPopupOpen,
                  OperationType,
                  JISID,
                  null,
                  "generated",
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  1
                );
                getCommercialCertificateSingle(EditRecordId, JISID, res?.data?.data?.cc_id, setFormData, null, null, null, null, setNewExtraFields, isUseForPhysical)
                const redirectUrl = getOperationActivityUrl(res?.data?.data?.operationmode?.ops_code)
                navigate(
                  `${redirectUrl}confirugation-certificate/${encryptDataForURL(
                    EditRecordId
                  )}/${encryptDataForURL(JISID)}/${encryptDataForURL(
                    res?.data?.data?.cc_id
                  )}?status=${encryptDataForURL(
                    "Edit"
                  )}&OperationType=${encryptDataForURL(OperationType)}` +
                  "&isExternal=" + encryptDataForURL(isExternal) + "&isCustomMode=" + encryptDataForURL(1) + "&operationMode=" + encryptDataForURL(res?.data?.data?.operationmode?.ops_code)
                );
              }
              else {
                if (!isSupervission) {
                  navigate(
                    `operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                      EditRecordId
                    )}/${encryptDataForURL(res?.data?.data?.cc_id)}` +
                    "?OperationType=" +
                    encryptDataForURL(OperationType) + "&isExternal=" + encryptDataForURL(isExternal)
                  );
                }
              }


            }
          }
        }
        else {
          setIsOverlayLoader(false);
          toast.error(res?.message, {
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
      }
    }
    finally {
      setIsOverlayLoader(false);
    }

  };

  const handleShareFile = async (resend = false) => {
    if (!formData[0]?.email_multiple_input || formData[0]?.email_multiple_input.length < 1) {
      toast.error(
        translate("custom.atleastOneEmail"),
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
      return false;
    }
    setLoading(true);
    let msg = translate("custom.sharingEmail")
    setLoadingText(msg)
    // setIsValideValue(false);
    let folderPayload = {
      data: {

        fd_name: selectedMultiDocs[0]?.folder?.fd_name,
        // fd_name: fd_name_with_date

      },
      parent_folder: "commercial_certificate",
    };
    let folderRes = await postDataFromApi(folderCreateApi, folderPayload);
    let FolderID;
    setLoadingTable(true);

    if (folderRes.data.status === 201 || folderRes.data.status === 200) {
      FolderID = folderRes?.data?.data.fd_id;
    } else {
      FolderID = folderRes?.data?.message?.existing_folder_id;
    }
    if (FolderID) {
      const sharePayload = {
        subject: formData[0]?.email_subject,
        message: formData[0]?.email_message,

        folder_id: FolderID,
        data: [],
      };

      formData[0]?.email_multiple_input.map((email, emailIndex) => {
        selectedMultiDocs.forEach((doc) => {
          sharePayload.data.push({
            ds_folder: FolderID,
            ds_document: doc?.dl_id, // Use doc.dl_id here
            ds_shared_with: email,
            ds_share_date: new Date().toISOString().slice(0, 19) + "Z",
            ds_restriction_dwonload: "true",
            ds_download_limit: 10,
            ds_download_count: 0,
            ds_restriction_view: false,
            ds_restriction_print: false,
            ds_expiry_date: "2023-12-31T23:59:59Z",
            ds_cc_email: formData[0]?.ds_cc_email,
          });
        });
      });

      let res = await postDataFromApi(documentShareCreate, sharePayload);
      if (res?.data?.status === 200 || res?.data?.status === 201) {

        toast.success(res.data.message || "Document Shared Successfully");
        // setUploadPopup(false);
        // setIsValideValue(true);
        setLoading(false);
        setLoadingText(null);
        setTimeout(() => {
          navigate(-1);
        }, 2000);

      }
      else {
        if (res?.data?.already_shared) {
          setResendShareFile(true);
        }
        if (resend) {
          setTimeout(() => {
            navigate(-1);
          }, 2000);
          toast.success(
            "Resended Email",
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

        }
        !resend &&
          toast.error(
            res?.message ||
            res?.data?.message ||
            translate("loginPage.unExpectedError"),
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
        setLoading(false);
        setLoadingText(null);
      }
    }
  };

  const EditGeneratedCertificate = async (type, isExternal = "", isWeighted = "") => {
    let isValidate = handleSubmit();
    if (!isValidate) {
      return false;
    }
    let cc_additional_headers = {};
    Array.from({ length: newExraFields }).forEach((_, index) => {
      const fieldName = "new_extra_field";
      cc_additional_headers[formData?.[0]?.[`${fieldName}_label_${index}`]] = {
        value: formData?.[0]?.[`${fieldName}_value_${index}`] || '',
        isChecked: formData?.[0]?.[`${fieldName}_chk_${index}`] || false
      }
    })
    const certijsonFields = ['eic_bl_number', 'eic_weight_avg_moisture', 'eic_eia_code', 'dpl_source', 'dpl_name_colliery', 'dpl_analysis_completed_on', 'dpl_smpl_mark_date'];
    const cc_certijsondata = {};

    certijsonFields.forEach((key) => {
      cc_certijsondata[key] = formData[0]?.[key];
    });
    let payload = {
      cc_id: RPCID,
      commercial_certificate: {
        cc_certificatenumber: formData[0].cert_number,
        cc_date: formData[0].ji_date,
        cc_refencenumber: formData[0].ji_reference_number,
        cc_accountof: formData[0].cc_accountof,
        cc_eia: formData[0].cc_eia,
        cc_commodity: formData[0].ji_sub_commodity_name,
        cc_topheader: formData[0].jrf_header,
        cc_bottomheader: formData[0].jrf_bottom,
        cc_show_rounded_qty: formData[0]?.cc_show_rounded_qty?.[0] ? true : false,
        cc_is_hide_basis: formData[0]?.cc_is_hide_basis?.[0] ? true : false,
        cc_is_qty_display: formData[0]?.cc_is_qty_display?.[0] ? true : false,
        cc_is_rake_details: formData[0]?.cc_is_rake_details?.[0] ? true : false,
        cc_additional_remark: formData[0].cc_additional_remark,
        cc_supp_buyer: formData[0].cc_supp_buyer,
        cc_fk_place_pf_work_id: formData[0].cc_fk_place_pf_work_id,
        cc_fk_sub_commodity_id: formData[0].cc_fk_sub_commodity_id,
        cc_other_placework: formData[0].cc_other_placework,
        cc_appointed_totalqty: formData[0].cc_appointed_totalqty || '-',
        cc_appointed_qty_unit: formData[0].cc_appointed_qty_unit,
        cc_is_other_format: formData[0]?.cc_is_other_format?.[0] ? true : false,
        status: type,
        is_weighted_certi: isWeighted,
        cc_additional_headers: cc_additional_headers,
        fk_cc_cert_format_id: formData[0]?.fk_cc_cert_format_id,
        cc_certijsondata: cc_certijsondata
      },
    };
    if (type === "posted" && !isExternal) {
      payload.commercial_certificate.is_generate = true
    }
    let res = await putDataFromApi(ccUpdateApi, payload);
    if (res.data.status === 200) {
      if (moduleType == "operationCertificate" && (formData[0]?.cc_is_rake_details?.length > 0 && formData[0]?.cc_is_rake_details?.[0])) {
        OperationQualityAnalysisCreateDataFunction(
          formData,
          setIsOverlayLoader,
          setIsPopupOpen,
          OperationType,
          JISID,
          navigate,
          jrfCreationType,
          operationMode,
          true,
          formConfig.sections[0],
          setSubTableData,
          setFormData,
          formConfig,
          operationStepNo,
          "",
          isUseForPhysical,
          RPCID,
        );
      }
      if (type === "posted" && !isExternal) {
        if (
          getLMSOperationActivity().includes(OperationType)
        ) {
          navigate(`/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
            EditRecordId
          )}/${encryptDataForURL(RPCID)}?status=${encryptDataForURL(
            "posted"
          )}&CCID=${encryptDataForURL(RPCID)}` +
            "&OperationType=" +
            encryptDataForURL(OperationType)
          );
        } else {
          let payload = {
            ji_id: EditRecordId,
            jis_id: JISID,
          };
          let OPSDSRes = await getNonLMSDetailsById(OperationType, payload);
          if (OPSDSRes.data.status === 200) {
            navigate(
              `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                OPSDSRes.data.data.opsvd_id
              )}/${encryptDataForURL(RPCID)}?status=${encryptDataForURL(
                "NonLMSPosted"
              )}&CCID=${encryptDataForURL(RPCID)}` +
              "&OperationType=" +
              encryptDataForURL(OperationType)
            );
          }
        }
      } else {
        navigate("/operation/commercial-certificate-list");
      }
    }
  };

  const CCID = decryptDataForURL(params.get("CCID"));
  const previewCertificate = async (CCID) => {
    navigate(
      "/operation/commercial-certificate-list/commercial-certificate-preview/" +
      encryptDataForURL(EditRecordId) +
      "/" +
      encryptDataForURL(CCID) +
      "?status=" +
      encryptDataForURL("approve") +
      "&CCID=" +
      encryptDataForURL(CCID) +
      "&OperationType=" +
      encryptDataForURL(OperationType)
    );
  };

  const sendForApproval = async () => {
    let payload = {
      cc_id: CCID || EditSubRecordId,
      commercial_certificate: {
        status: "sent_for_approval",
      },
    };
    let res = await putDataFromApi(ccUpdateApi, payload);
    if (res.data.status === 200) {
      navigate("/operation/commercial-certificate-list");
    }
  };

  const ApproveCertificate = async (status, remark) => {
    let payload = {
      cc_id: CCID,
      send_approval: true,
      commercial_certificate: {
        // fk_cc_approved_by:1,
        status: status ? status : "approved",
      },
    };
    if (status === "rejected") {
      payload.commercial_certificate.cc_remark = remark
    }
    // if (isGenerate) {
    //   payload.commercial_certificate.status = "posted"
    //   payload.commercial_certificate.is_generate = true
    //   payload.cc_id=EditSubRecordId
    //   payload.send_approval=''
    // }
    let res = await putDataFromApi(ccUpdateApi, payload);
    if (res.data.status === 200) {
      navigate("/operation/commercial-certificate-list");
    }
  };

  const PublishCertificate = async (CCID, status) => {
    let payload = {
      cc_id: CCID,
      commercial_certificate: {
        status: status,
      },
    };
    let res = await putDataFromApi(ccUpdateApi, payload);
    if (res?.data?.status === 200) {
      // navigate("/operation/commercial-certificate-list");
      navigate("/operation/commercial-certificate-list");
      // setLoadingTable(false);
    } else {
      // setLoadingTable(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsOverlayLoader(true)
      let row = session?.selectedSingleRow;
      if (row.cc_is_external) {
        PublishCertificate(row.cc_id, "published");
        return
      }
      //Use This Dynamic Folder ID
      let folderPayload = {
        data: {
          // "fd_name": "27C2425A01VL0028"
          fd_name: row?.cc_refencenumber,
        },
        parent_folder: "commercial_certificate",
      };
      let folderRes = await postDataFromApi(folderCreateApi, folderPayload);
      let FolderID;
      setLoading(true);

      if (folderRes.data.status === 201 || folderRes.data.status === 200) {
        FolderID = folderRes?.data?.data.fd_id;
      } else {
        FolderID = folderRes?.data?.message?.existing_folder_id;
      }
      if (
        FolderID &&
        (folderRes?.data.status === 200 || folderRes?.data?.status === 400)
      ) {
        let payload, generateCertificateResponse;
        if (
          !getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase()) && ![getVesselOperation("bulk_crg"), getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(getActivityCode(row.activity_code).toLowerCase())
        ) {
          let payload = {
            ji_id: row?.fk_jiid,
            jis_id: row?.fk_jisid,
            tenant: 1,
          };
          let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
          if (OPSDSRes.data.status === 200) {
            generateCertificateResponse = await downLoadNonLMSCertificatePDFById(
              getActivityCode(row?.activity_code).toLowerCase(),
              OPSDSRes?.data?.data?.opsvd_id,
              row?.cc_id,
              "",
              row?.fk_jisid
            );
          }
        } else {
          payload = {
            ji_id: row?.fk_jiid,
            cc_id: row?.cc_id,
          };
          if (isUseForPhysical) {
            generateCertificateResponse = await postDataFromApi(physicalAnalysisPDF, payload, "", true, "", "");
          }
          else if ([getPlantOperations("RK"), getRakeOperations('QA')].includes(OperationType)) {
            generateCertificateResponse = await postDataFromApi(rakeQAPdfApi, payload, "", true, "", "");
          }
          else if (OperationType == getStackOperations("PV") || OperationType == getStackOperations()) {
            generateCertificateResponse = await postDataFromApi(stackQAPdfApi, payload, "", true, "", "");
          }
          else if (OperationType == getVesselOperation('bulk_crg')) {
            generateCertificateResponse = await postDataFromApi(bulkCargoPDF, payload, "", true, "", "");
          }
          else if (OperationType == getVesselOperation('VL_TML_M')) {
            generateCertificateResponse = await postDataFromApi(tmlMoisturePDFApi, payload, "", true, "", "");
          }
          else if (OperationType == getRakeOperations('RK_SV')) {
            payload.jis_id = opsTypeID
            generateCertificateResponse = await postDataFromApi(opsRakeSVPDFApi, payload, "", true, "", "");
          }
          else if (OperationType == getStackOperations('ST_SV')) {
            payload.jis_id = opsTypeID
            generateCertificateResponse = await postDataFromApi(opsStackSVPDFApi, payload, "", true, "", "");
          }
          else {
            generateCertificateResponse = await postDataFromApi(ccCertPdfApi, payload, "", true, "", "");
          }
        }

        if (
          generateCertificateResponse &&
          generateCertificateResponse.data &&
          generateCertificateResponse.data.status === 200
        ) {
          const pdfBlob = new Blob([generateCertificateResponse.data], {
            type: "application/pdf",
          });
          let payload = new FormData();
          payload.append("document", pdfBlob, (row?.activity + "_" + row?.cc_certificatenumber + ".pdf") || "certificate.pdf");
          payload.append("model_type ", "commercial_certificate");
          payload.append("bypass_file_size_check ", true);
          payload.append("sub_folder", 6);
          let uploadResponse = await postDataFromApi(
            masterUploadApi,
            payload,
            "TRUE"
          );

          if (uploadResponse.data.status === 200) {
            let payload = {
              data: {
                dl_folder: FolderID,
                // dl_sub_folder: 6,
                dl_module: "commercial_certificate",
                dl_document_name:
                  row?.cc_refencenumber || row?.cc_certificatenumber,
                dl_document_reference: row?.fk_jiid,
                dl_document_jisid: row?.fk_jisid,
                dl_type: "Document Type",
                dl_show_to_all: true,
                dl_s3_url: uploadResponse.data?.data?.document,
                dl_version: "1.0",
                dl_file_type: getActivityName(row?.activity) + "_Certificate",
                dl_date_uploaded: new Date(),
                dl_status: "Active",
                // dl_assigned_to: "Assigned User",
                dl_discription:
                  getActivityName(row?.activity) ||
                  row?.cc_topheader ||
                  row?.cc_refencenumber ||
                  row?.cc_certificatenumber,
                fk_cc_id: row?.cc_id
                // document_type: "published_certificate",
                // doc_ref_id: row?.cc_id
              },
            };
            let documentResponse = await postDataFromApi(
              documentCreateApi,
              payload
            );

            if (documentResponse.data.status === 200) {
              PublishCertificate(row.cc_id, "published");

            } else {
              setLoading(false);
            }
          } else {
            toast.error(
              uploadResponse?.message ||
              uploadResponse?.data?.message ||
              translate("loginPage.unExpectedError"),
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
            setLoading(false);
          }
        } else {
          toast.error(
            generateCertificateResponse?.message ||
            generateCertificateResponse?.data?.message ||
            translate("loginPage.unExpectedError"),
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
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    finally {
      setIsOverlayLoader(false)
    }
  };
  const [IsPreviewUpload, setIsPreviewUpload] = useState(false);
  const dailyReportInDocument = async () => {

    // JISIDForDailyReport
    // return false;
    setLoading(true);

    let res = await postDataFromApi("/jobinstruction/get/", {
      ji_id: JISIDForDailyReport,
    });
    if (res?.data?.status === 200 && res.data.data) {
      let folderPayload = {
        data: {
          // "fd_name": "27C2425A01VL0028"
          fd_name: res.data.data.ji_reference_number,
        },
        parent_folder: "commercial_certificate",
      };
      let folderRes = await postDataFromApi(folderCreateApi, folderPayload);
      let FolderID;
      setLoadingTable(true);

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
            dl_document_name: res.data.data.ji_reference_number,
            dl_document_reference: JISIDForDailyReport,//ji_id paasing here
            dl_document_jisid: OperationTypeID,
            dl_type: "Document Type",
            dl_show_to_all: true,
            dl_s3_url: sharingPdfUrl,
            dl_version: "1.0",
            dl_file_type: getActivityName(OperationType) + "_Daily Report",
            dl_date_uploaded: new Date(),
            dl_status: "Active",
            // dl_assigned_to: "Assigned User",
            dl_discription: getActivityName(OperationType),
            // document_type: "daily_report",
            // doc_ref_id: OperationTypeID
          },
        };
        let documentResponse = await postDataFromApi(
          documentCreateApi,
          payload
        );
        if (documentResponse.data.status === 200) {
          setLoading(false);

          navigate(
            "/operation/JI-commercial-certificate-list/" +
            encryptDataForURL(JISIDForDailyReport)
          );
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (sharingPdfUrl) {
      dailyReportInDocument();
    }
  }, [sharingPdfUrl])

  const status = decryptDataForURL(params.get("status"));
  const useFor = decryptDataForURL(params.get("useFor"));
  const JISIDForDailyReport = decryptDataForURL(
    params.get("JISIDForDailyReport")
  );
  const OpertionActivity = decryptDataForURL(params.get("OpertionActivity"));
  const ViewDetailsButton = (moduleType, sectionIndex, subSectionIndex) => {
    const location = useLocation();
    // Check if the current route matches
    // const isVesselJiListView = location.pathname.startsWith('/operation/vessel-ji-list-view');
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const isFullDetails = decryptDataForURL(params.get("isFullDetails"));
    let isFirstStep = formConfig?.sections[0]?.isMainPage && !props.isMainJiSaved
    if (['vesselJICertificate', 'jobinstruction'].includes(moduleType) && !isFullDetails && !isFirstStep &&
      sectionIndex === 0 &&
      subSectionIndex === 0 &&
      formData[0]?.ji_id) {
      return <div className="View_Details_container">
        <button
          type="button"
          className="searchby_button View_Details "
          onClick={() => {
            setViewDetail(true)
          }}

        >
          View Full <br />
          Job Details
        </button>
      </div>

    }
  }
  const getShowSubSectionButton = (moduleType, sectionIndex, subSectionIndex) => {
    let isValideCondition = getVesselOperation('DS') === TMLType && moduleType === "jobinstruction"
    if (sectionIndex === 0 && subSectionIndex === 1 && formData[0]?.ji_id && isValideCondition) {
      return <div className="View_Details_container">
        <button
          type="button"
          className="searchby_button View_Details "
          onClick={() => setTabOpen(true)}
        >
          Save
        </button>
      </div>

    }
    return;
  }


  ///For Main Submission...
  const checkShowButtonConditon = () => {
    if ([getRakeOperations('QAss'), getRakeOperations('QA')].includes(OperationType)) {
      if (formData?.[0].rake_qas_id || formData?.[0].rake_qan_id) {
        return true;
      }
      else {
        //for rake details tab
        if (getRakeOperations('QA')) {
          return true
        }
        //
        return false
      }
    }
    else {
      return true;
    }
  }

  useEffect(() => {
    if (moduleType === "purchaseReq") {
      if (formData[0]?.req_no) {
        setTabOpen(true)
      }
      else {
        setTabOpen(false)
      }
    }
  }, [formData[0]?.req_no])

  const getExtraFieldsFunction = (formConfig) => {
    switch (moduleType) {
      case 'tender':
        formConfig.sections[3].fields = formConfig.sections[3].fields.filter(
          (field) => !(field?.name?.startsWith("participant_"))
        );
        Array.from({ length: participantFields }).forEach((_, index) => {
          const fieldName = "participant";
          formConfig.sections[3].fields.push({
            width: 6,
            name: `${fieldName}_${index}`,
            label: "Participant " + (index + 1),
            type: "text",
            placeholder: "Enter Participant",
            required: true
          });
        });
        break;
      case 'operationCertificate':
        formConfig.sections[0].fields = formConfig.sections[0].fields.filter(
          (field) => !(field?.name?.startsWith("new_extra_field_")) && !(field?.customName?.startsWith("new_extra_field_"))
        );
        // if (newExraFields) {
        // formConfig.sections[0].fields.push({
        //   "width": 12,
        //   "label": "Header Details",
        //   "styleName": "section_heading",
        //   "type": "label",
        //   customName: "new_extra_field_header"
        // })
        // }

        Array.from({ length: newExraFields }).forEach((_, index) => {
          const fieldName = "new_extra_field";
          formConfig.sections[0].fields.push({
            width: 6,
            name: `${fieldName}_value_${index}`,
            "thirdName": `${fieldName}_chk_${index}`,
            label: formData?.[0]?.[`${fieldName}_label_${index}`],
            type: "doubleText",
            placeholder: "Enter Value",
            firstType: 'text',
            firstReadOnly: !formData?.[0]?.[`${fieldName}_chk_${index}`],
            required: formData?.[0]?.[`${fieldName}_chk_${index}`],
            "fieldWidth": 100,
            "upperFieldWidth": "75",
            "thirdType": "checkbox",
            "isShowRadioBefore": true,
          });
        });
        break;
      default:
        break;
    }
    return formConfig
  }
  const renderModuleWiseButtons = () => {
    switch (moduleType) {
      case "GroupAssignment":
        return (
          <GroupAssignmentButtons
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            setInwardBtnchange={setInwardBtnchange}
            subTableData={subTableData}
            formData={formData}
            jrfId={jrfId}
            handleBackButtonFunction={handleBackButtonFunction}
            isDisplayNewAddOption={isDisplayNewAddOption}
          />
        );

      case "groupAssignmentPreview":
        return (
          <GroupAssignmentPreviewButtons
            formData={formData}
            jrfId={jrfId}
            handleBackButtonFunction={handleBackButtonFunction}
          />
        );

      case "testmemomain":
        return (
          <TestMemoButtons
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            setInwardBtnchange={setInwardBtnchange}
            viewOnly={viewOnly}
            role={user?.role}
            setIsRejectPopupOpen={setIsRejectPopupOpen}
            testMemoId={testMemoId}
            pageType={pageType}
            handleBackButtonFunction={handleBackButtonFunction}
            setIsOverlayLoader={setIsOverlayLoader}
          />
        );

      case "sampleverification":
        return (
          istavSaveClicked && (
            <SampleVerificationButtons
              setIsPopupOpen={setIsPopupOpen}
              setJRFCreationType={setJrfCreationType}
              handleSubmit={handleSubmit}
              saveClicked={saveClicked}
              tableData={subTableData}
              formData={formData}
              viewOnly={viewOnly}
              handleBackButtonFunction={handleBackButtonFunction}
              setSaveClicked={setSaveClicked}
            />
          )
        );

      case "allotment":
        return (
          <AllotmentButtons
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            saveClicked={saveClicked}
            handleAllotValidate={handleAllotValidate}
            viewOnly={viewOnly}
            handleBackButtonFunction={handleBackButtonFunction}
            setIsOverlayLoader={setIsOverlayLoader}
          />
        );

      case "sampleinward":
        return (
          <SampleInwardButtons
            action={action}
            tabOpen={tabOpen}
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            setInwardBtnchange={setInwardBtnchange}
            formData={formData}
            subTableData={subTableData}
            jrfId={jrfId}
            viewOnly={viewOnly}
            handleBackButtonFunction={handleBackButtonFunction}
          />
        );

      case "internalcertificate":
        return (
          <InternalCertificateButtons
            action={action}
            tabOpen={tabOpen}
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            setInwardBtnchange={setInwardBtnchange}
            formData={formData}
            subTableData={subTableData}
            jrfId={jrfId}
            viewOnly={viewOnly}
            handleSubmit={handleSubmit}
            remarkText={remarkText}
            setSaveClicked={setSaveClicked}
            formConfig={formConfig}
            saveClicked={saveClicked}
            setIsRejectPopupOpen={setIsRejectPopupOpen}
            handleBackButtonFunction={handleBackButtonFunction}
            setIsOverlayLoader={setIsOverlayLoader}
            isValideValue={isValideValue}
          />
        );

      case "inwardChecklist":
        return (
          <ViewCheckListButtons
            remarkText={remarkText}
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            setInwardBtnchange={setInwardBtnchange}
            formData={formData}
            setSaveClicked={setSaveClicked}
            formConfig={formConfig}
            saveClicked={saveClicked}
            setIsRejectPopupOpen={setIsRejectPopupOpen}
            viewOnly={viewOnly}
            handleBackButtonFunction={handleBackButtonFunction}
            setIsOverlayLoader={setIsOverlayLoader}
          />
        );

      case "sfm":
        return (
          istavSaveClicked && (
            <SFMButtons
              setIsPopupOpen={setIsPopupOpen}
              setJRFCreationType={setJrfCreationType}
              handleSubmit={handleSubmit}
              saveClicked={saveClicked}
              formData={formData}
              viewOnly={viewOnly}
              testMemoSetData={testMemoSetData}
              handleBackButtonFunction={handleBackButtonFunction}
            />
          )
        );

      case "jobinstruction":
        return (
          <JIButtons
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            handleSubmit={handleSubmit}
            viewOnly={viewOnly}
            handleBackButtonFunction={handleBackButtonFunction}
            action={action}
            tabOpen={tabOpen}
            setInwardBtnchange={setInwardBtnchange}
            formData={formData}
            subTableData={subTableData}
            EditRecordId={EditRecordId ? EditRecordId : formData[0]?.ji_id}
            editReordType={editReordType}
            navigate={navigate}
            setJrfCreationType={setJrfCreationType}
            formConfig={formConfig}
            setIsRejectPopupOpen={setIsRejectPopupOpen}
            setIsOverlayLoader={setIsOverlayLoader}
            useForComponent={useForComponent}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            testMemoSetData={testMemoSetData}
            isDisplayNewAddOption={isDisplayNewAddOption}
            isViewOnlyTable={isViewOnlyTable}
            operationStepNo={operationStepNo}
            OperationType={OperationType}
            OperationTypeID={OperationTypeID}
            parameterDataTableMain={parameterDataTableMain}
            isUseForManPower={formConfig?.sections[0]?.isUseForManPower}
            operationMode={operationMode}
            setSubTableData={setSubTableData}
            setFormData={setFormData}
            JRFTPIFormData={JRFTPIFormData}
            setMainJISaved={props.setMainJISaved}
            isMainJiSaved={props.isMainJiSaved}
            setTabOpen={setTabOpen}
            labDropDownOptions={labDropDownOptions}
            allSampleIds={props.allSampleIds}
            setIsCancelPopupOpen={setIsCancelPopupOpen}
            isRakeDetails={isRakeDetails}
          />
        );

      case "operationCertificate":
        return (
          <>
            <OperationCertificateButtons
              status={status}
              moduleSubType={moduleSubType}
              RPCID={RPCID}
              encryptDataForURL={encryptDataForURL}
              EditRecordId={EditRecordId}
              JISID={JISID}
              previewCertificate={previewCertificate}
              generateCertificate={generateCertificate}
              isValideValue={isValideValue}
              handleShareFile={handleShareFile}
              EditGeneratedCertificate={EditGeneratedCertificate}
              OperationType={OperationType}
              resendShareFile={resendShareFile}
              operationMode={operationMode}
              isCustomMode={isCustomMode}
              setUploadPopup={setUploadPopup}
              setPopupType={setPopupType}
              formData={formData}
            />
          </>
        );

      case "commercialCertificatePreview":
        return (
          <CommercialCertificateButtons
            useFor={useFor}
            status={status}
            ApproveCertificate={ApproveCertificate}
            handlePublish={handlePublish}
            sendForApproval={sendForApproval}
            IsPreviewUpload={IsPreviewUpload}
            setIsPreviewUpload={setIsPreviewUpload}
            dailyReportInDocument={dailyReportInDocument}
            setIsRejectPopupOpen={setIsRejectPopupOpen}
          />
        );

      case "invoicePreview":
      case "documentPreview":
        return (
          <InvoicePreviewButtons
            useFor={useFor}
            status={status}
            ApproveCertificate={ApproveCertificate}
            handlePublish={handlePublish}
            sendForApproval={sendForApproval}
            IsPreviewUpload={IsPreviewUpload}
            setIsPreviewUpload={setIsPreviewUpload}
            dailyReportInDocument={dailyReportInDocument}
            moduleType={moduleType}
          />
        );

      case "jrf":
        return (
          <JRFButtons
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            handleSubmit={handleSubmit}
            viewOnly={viewOnly}
            handleBackButtonFunction={handleBackButtonFunction}
            formData={formData}
            setIsOverlayLoader={setIsOverlayLoader}
          />
        );

      case "consortiumorder":
        return (
          <ConsortiumButton
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            handleSubmit={handleSubmit}
            viewOnly={viewOnly}
            handleBackButtonFunction={handleBackButtonFunction}
          />
        );

      case "auditBranchExpenses":
        return (
          <div>Audit functionality removed</div>
        );

      case "auditSalesRegister":
        return (
          <div>Sales register functionality removed</div>
        );

      case "auditOutstanding":
        return (
          <div>Outstanding functionality removed</div>
        );

      case "jobCosting":
        return (
          <JobCostingButton
            status={status}
            formData={formData}
            formConfig={formConfig}
            viewOnly={viewOnly}
            setFormData={setFormData}
            EditRecordId={EditRecordId}
            setIsOverlayLoader={setIsOverlayLoader}
          />
        );

      case "invoice":
        if (formData[0].im_id) {
          return (
            <InvoiceButton
              setIsPopupOpen={setIsPopupOpen}
              setJRFCreationType={setJrfCreationType}
              handleSubmit={handleSubmit}
              viewOnly={viewOnly}
              navigate={navigate}
              formData={formData}
              formConfig={formConfig}
              setIsOverlayLoader={setIsOverlayLoader}
              setFormData={setFormData}
              setTabOpen={setTabOpen}
              setIsRejectPopupOpen={setIsRejectPopupOpen}
              setIsCancelPopupOpen={setIsCancelPopupOpen}
              masterResponse={masterResponse}
              user={user}
              subTableData={subTableData}
            />
          );
        }
        return null;

      case "purchase":
      case "PoPreview":
        return (
          <PurchaseButtons
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
            setPopupAddPurchaseReq={setPopupAddPurchaseReq}
            setTableData={setSubTableData}
            section={formConfig?.sections[0]}
            setIsRejectPopupOpen={setIsRejectPopupOpen}
            moduleType={moduleType}
          />
        );

      case "purchaseReq":
        return (
          <PurchaseRequistionButtons
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
            setPopupAddPurchaseReq={setPopupAddPurchaseReq}
            setTableData={setSubTableData}
            moduleType={moduleType}
            section={formConfig?.sections[0]}
            setIsRejectPopupOpen={setIsRejectPopupOpen}
          />
        );

      case "calibration":
        return (
          <CalibrationsButtons
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />
        );

      case "supplier":
        return (
          <SupplierButtons
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />
        );

      case "tender":
        return (
          <TenderButton
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
            participantFields={participantFields}
          />
        );

      case "stocks":
        return (
          <ChemicalStocksButtons
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />
        );

      case "incentives":
        return (
          <IncentiveButton
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />
        );

      case "feedback":
        return (
          <FeedbackButton
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />
        );

      case "purchaseItems":
        return (
          <PurchaseItemButton
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />
        );
      case "category":
        return (
          <CategoryBtn
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />)
      case "ClientDetails":
        return (
          <ClientDetailsButtons
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />
        );
      case "ShipmentForm":
        return (
          <ShipmentButtons
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />
        );
        case "marketPlaceForm":
        return (
          <MarketPlaceButton
            formData={formData}
            handleSubmit={handleSubmit}
            setIsOverlayLoader={setIsOverlayLoader}
            setFormData={setFormData}
            viewOnly={viewOnly}
          />
        );
      default:
        return null;
    }
  };

  formConfig = getExtraFieldsFunction(formConfig)
  return !loading ? (
    <form key={"Main-Form"}>
      {/* <form onSubmit={handleSubmit}> */}
      <ToastContainer
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
      />
      {(isOverlayLoader || isStatusCountCalled) && <OverlayLoading />}
      {
        uploadPopup && (
          <DocumentPopup
            setUploadPopup={setUploadPopup}
            sectionIndex={0}
            formData={formData}
            handleFieldChange={handleFieldChange}
            formErrors={formErrors}
            viewOnly={viewOnly}
            actionClicked={actionClicked}
            handleUploadDocument={() => handleCommonUploadFile(formData, fileUrl, setUploadPopup, EditGeneratedCertificate, JISID, OperationType, navigate)}
            popupType={popupType}
            setPopupType={setPopupType}
            popupJson={popupJson}
            selectedDoc={null}
            fileUrl={fileUrl}
            setFileUrl={setFileUrl}
            isExternalUse={true}
            moduleType={moduleType}
            setFormData={setFormData}
          />
        )
      }
      {formConfig.sections?.map((section, sectionIndex) =>
        ["tabs"].includes(section.type) ? (
          tabOpen && (
            <div key={"form-section" + sectionIndex}>
              {section.tabs[0]?.tileSubHeader?.length > 0 && checkShowButtonConditon() && (
                <div className="card_header_btns card_header_btns_tabs">
                  {section?.tabs[0]?.tileSubHeader?.map((tile, tileIndex) => {
                    return (
                      <button
                        type="button"
                        className={getSubTileClassName(section, tile)}
                        onClick={() => {
                          if (tile.isClick && tile.opsNo != operationStepNo) {
                            vesselListNextFunctionality(
                              formData,
                              OperationType,
                              OperationTypeID,
                              navigate,
                              tile.opsNo,
                              action,
                              operationMode,
                              1
                            )
                          }
                        }}
                      >
                        <span>{tile.Text}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div
                className={
                  "nav nav-tabs nav-pills nav-fill tileHeaderNav " +
                  (section?.tabs[0]?.tileSubHeader?.length > 0 &&
                    "nav-tabs_hidden")
                }
              >
                {section.tabs.map((tab, tabIndex) => {
                  if (tab?.hidetab) {
                    return "";
                  }
                  if (tab.type === "tablePreview") {
                    if (
                      (action === "View" || !tab.isSubPreview) &&
                      (!tab.isSubPreview ||
                        [
                          "assigning",
                          "assigned",
                          "tm-created",
                          "sent to lab",
                          "certified",
                        ].includes(formData[0]?.smpl_status) ||
                        (tab.isSubPreview && moduleType === "jobinstruction"))
                    ) {

                      return (
                        <NavItem key={"section-tab" + tabIndex}>
                          <NavLink
                            className={classnames("nav-link tab_header", {
                              active:
                                activeTab === `${sectionIndex}-${tabIndex}`,
                            })}
                            onClick={() =>
                              tab.isNotComponene
                                ? null
                                : setActiveTab(`${sectionIndex}-${tabIndex}`)
                            }
                            tabIndex="0"
                            href="#"
                          >
                            {tab.label}
                          </NavLink>
                        </NavItem>
                      );
                    }
                  } else {
                    return checkShowButtonConditon() && (
                      tab.type !== "tableList" &&
                      tab.type !== "tableListPagination" && (
                        <NavItem key={"section-tab" + tabIndex}>
                          <NavLink
                            className={classnames("nav-link tab_header", {
                              active:
                                activeTab === `${sectionIndex}-${tabIndex}`,
                            })}
                            onClick={() =>
                              tab.isNotComponene || (OperationType === getVesselOperation("SV") && action !== "View")
                                ? null
                                : setActiveTab(`${sectionIndex}-${tabIndex}`)
                            }
                            tabIndex="0"
                            href="#"
                          // disabled={
                          //   [getVesselOperation("SV")].includes(OperationType) &&
                          //   ["posted"].includes(formData[1]?.ops_status) &&
                          //   action !== "View"
                          // }
                          >
                            {(OperationType === getVesselOperation("SV")) &&
                              tabIndex === 7 &&
                              formData[0].ji_is_loading === "Loading"
                              ? "Loading Details"
                              : tab.label}
                          </NavLink>
                        </NavItem>
                      )
                    );
                  }
                })}
              </div>
              <div className="tab-content">
                {section?.tabs.map((tab, tabIndex) => (
                  <div
                    key={"tab-content" + tabIndex}
                    role="tabpanel"
                    className={classnames("tab-pane", {
                      active: activeTab === `${sectionIndex}-${tabIndex}`,
                    })}
                  >
                    {/* Render tab content here */}

                    <Row>
                      <Col>
                        {tab.isNotComponene ? null : tab.type === "table" ? (
                          // tab.headers.length < 5 ? (
                          <span>
                            {!moduleType === "purchaseReq" ?
                              <Popup
                                showModal={showModal}
                                setShowModal={setShowModal}
                                tab={tab}
                                sectionIndex={sectionIndex}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                addRow={addRow}
                                moduleType={moduleType}
                              />
                              :
                              <>

                                {/* <PopUpPurchaseReq
                                  setPopupAddPurchaseReq={setPopupAddPurchaseReq}
                                  popupAddPurchaseReq={popupAddPurchaseReq}
                                  formData={formData}
                                  handleFieldChange={handleFieldChange}
                                  formErrors={formErrors}
                                  tab={tab}
                                  sectionIndex={sectionIndex}
                                  handleSubmit={handleSubmit}
                                  setIsOverlayLoader={setIsOverlayLoader}
                                  navigate={navigate}
                                  setFormData={setFormData}
                                /> */}
                              </>

                            }
                            {formData[0]?.jrf_is_ops &&
                              moduleType === "sampleinward" ? (
                              <RenderTableOperationSection
                                key={`${sectionIndex}-${tabIndex}`}
                                section={tab}
                                sectionIndex={sectionIndex}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                addRow={() => {
                                  tab.headers.length < 6 ||
                                    pageType === "inward" ||
                                    pageType === "assignment"
                                    ? addRow(tab, sectionIndex)
                                    : setShowModal(true);
                                }}
                                deleteRow={() => deleteRow(sectionIndex)}
                                deleteColumn={(columnIndex) =>
                                  deleteColumn(sectionIndex, columnIndex)
                                }
                                setFormData={setFormData}
                                popupMessages={formConfig.popupMessages}
                                pageType={pageType}
                                action={action || tab.isViewOnly}
                                masterOptions={masterResponse}
                                actionClicked={actionClicked}
                                setSaveClicked={setSaveClicked}
                                saveClicked={saveClicked}
                                setTableData={setSubTableData}
                                tableData={subTableData}
                                moduleType={moduleType}
                                pageType2={true}
                                simpleInwardResponse={simpleInwardResponse}
                                setSimpleInwardResponse={
                                  setSimpleInwardResponse
                                }
                                groupDefaultValue={groupDefaultValue}
                                testMemoId={testMemoId}
                                getVerificationDetails={getVerificationDetails}
                                getSampleIdsMasterData={getSampleIdsMasterData}
                                setIsOverlayLoader={setIsOverlayLoader}
                                isOverlayLoader={isOverlayLoader}
                                operationName={operationName}
                                OperationType={OperationType}
                                OperationTypeID={OperationTypeID}
                              />
                            ) : (

                              <RenderTableSection
                                key={`${sectionIndex}-${tabIndex}`}
                                section={tab}
                                sectionIndex={sectionIndex}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                addRow={() => {
                                  tab.headers.length < 6 ||
                                    pageType === "inward" ||
                                    pageType === "assignment"
                                    ? addRow(tab, sectionIndex)
                                    : setShowModal(true);
                                }}
                                deleteRow={() => deleteRow(sectionIndex)}
                                deleteColumn={(columnIndex) =>
                                  deleteColumn(sectionIndex, columnIndex)
                                }
                                setFormData={setFormData}
                                popupMessages={formConfig.popupMessages}
                                pageType={pageType}
                                action={action || tab.isViewOnly}
                                masterOptions={masterResponse}
                                actionClicked={actionClicked}
                                setSaveClicked={setSaveClicked}
                                saveClicked={saveClicked}
                                setTableData={setSubTableData}
                                tableData={subTableData}
                                moduleType={moduleType}
                                moduleSubType={moduleSubType}
                                pageType2={true}
                                simpleInwardResponse={simpleInwardResponse}
                                setSimpleInwardResponse={
                                  setSimpleInwardResponse
                                }
                                groupDefaultValue={groupDefaultValue}
                                testMemoId={testMemoId}
                                getVerificationDetails={getVerificationDetails}
                                getSampleIdsMasterData={getSampleIdsMasterData}
                                setIsOverlayLoader={setIsOverlayLoader}
                                isOverlayLoader={isOverlayLoader}
                                operationName={operationName}
                                OperationType={OperationType}
                                OperationTypeID={OperationTypeID}
                                operationStepNo={operationStepNo}
                                checkShowButtonConditon={checkShowButtonConditon}
                                operationMode={operationMode}
                                activityID={activityID}
                                OpsActivityName={OpsActivityName}
                                EditRecordId={EditRecordId}
                                cc_ids={cc_ids}
                                viewOnly={viewOnly}
                                simpleInwardId={simpleInwardId}
                                setSimpleInwardId={setSimpleInwardId}
                                setShowModal={setShowModal}
                                getAllListingData={getAllListingData}
                                handleSubmit={handleSubmit}
                                navigate={navigate}
                                tab={tab}
                                popupAddPurchaseReq={popupAddPurchaseReq}
                                setPopupAddPurchaseReq={setPopupAddPurchaseReq}
                                user={user}
                              />


                            )}
                          </span>
                        ) : tab.type === "manualTable" ? (
                          // tab.headers.length < 5 ? (
                          <span>
                            {
                              <Popup
                                showModal={showModal}
                                setShowModal={setShowModal}
                                tab={tab}
                                sectionIndex={sectionIndex}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                addRow={addRow}
                              />
                            }
                            <RenderTableSetAllManualSection
                              key={`${sectionIndex}-${tabIndex}`}
                              section={tab}
                              tabIndex={tabIndex}
                              sectionIndex={sectionIndex}
                              formData={formData}
                              handleFieldChange={handleFieldChange}
                              formErrors={formErrors}
                              addRow={() => {
                                tab.headers.length < 6 ||
                                  pageType === "inward" ||
                                  pageType === "assignment"
                                  ? addRow(tab, sectionIndex)
                                  : setShowModal(true);
                              }}
                              deleteRow={() => deleteRow(sectionIndex)}
                              deleteColumn={(columnIndex) =>
                                deleteColumn(sectionIndex, columnIndex)
                              }
                              setFormData={setFormData}
                              popupMessages={formConfig.popupMessages}
                              pageType={pageType}
                              action={action}
                              masterOptions={masterResponse}
                              actionClicked={actionClicked}
                              setSaveClicked={setSaveClicked}
                              saveClicked={saveClicked}
                              setTableData={setSubTableData}
                              tableData={subTableData}
                              moduleType={formConfig?.sections[0]?.moduleType}
                              pageType2={true}
                              simpleInwardResponse={simpleInwardResponse}
                              setSimpleInwardResponse={setSimpleInwardResponse}
                              groupDefaultValue={groupDefaultValue}
                              testMemoId={testMemoId}
                              getVerificationDetails={getVerificationDetails}
                              getSampleIdsMasterData={getSampleIdsMasterData}
                              setIsOverlayLoader={setIsOverlayLoader}
                              isOverlayLoader={isOverlayLoader}
                              viewOnly={viewOnly}
                              OperationType={OperationType}
                              OperationTypeID={OperationTypeID}
                              operationStepNo={operationStepNo}
                              setActiveTab={setActiveTab}
                              setTableLength={setTableLength}
                              tableLength={tableLength}
                              checkShowButtonConditon={checkShowButtonConditon}
                              operationMode={operationMode}
                            />
                          </span>
                        ) : tab.type === "manualEntryTable" ? (
                          // tab.headers.length < 5 ? (
                          <span>
                            {
                              <Popup
                                showModal={showModal}
                                setShowModal={setShowModal}
                                tab={tab}
                                sectionIndex={sectionIndex}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                addRow={addRow}
                              />
                            }
                            <RenderTableManualMultiEntrySection
                              key={`${sectionIndex}-${tabIndex}`}
                              section={tab}
                              sectionIndex={sectionIndex}
                              formData={formData}
                              handleFieldChange={handleFieldChange}
                              formErrors={formErrors}
                              tableData={subTableData}
                              setTableData={setSubTableData}
                              tabIndex={tabIndex}
                              OperationType={OperationType}
                              viewOnly={viewOnly}
                            />
                          </span>
                        ) : tab.type === "draftSurveyTable" ? (
                          // tab.headers.length < 5 ? (
                          <span>
                            {
                              <Popup
                                showModal={showModal}
                                setShowModal={setShowModal}
                                tab={tab}
                                sectionIndex={sectionIndex}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                addRow={addRow}
                              />
                            }
                            <RenderTableForDraftSurveySection
                              key={`${sectionIndex}-${tabIndex}`}
                              section={tab}
                              sectionIndex={sectionIndex}
                              formData={formData}
                              handleFieldChange={handleFieldChange}
                              setFormData={setFormData}
                              action={action}
                              setIsTabOpened={props.setIsTabOpened}
                              isTabOpened={props.isTabOpened}
                            />
                          </span>
                        ) : tab.type === "tableadv" ? (
                          <RenderAdvTableSection
                            key={`${sectionIndex}-${tabIndex}`}
                            section={tab}
                            sectionIndex={sectionIndex}
                            formData={formData}
                            handleFieldChange={handleFieldChange}
                            formErrors={formErrors}
                            addRow={() => {
                              true
                                ? addRow(tab, sectionIndex)
                                : setShowModal(true);
                            }}
                            addColumn={() => addColumn(tab, sectionIndex)}
                            deleteRow={() => deleteRow(sectionIndex)}
                            deleteColumn={(columnIndex) =>
                              deleteColumn(sectionIndex, columnIndex)
                            }
                            groupAssignment={tab.groupAssignment}
                            handleAllSave={handleAllSave}
                            handleCancel={handleCancel}
                            gaData={gaData}
                            setGaData={setGaData}
                            showModalGA={showModalGA}
                            setShowModalGA={setShowModalGA}
                            pageType={pageType}
                            actionClicked={actionClicked}
                            setIsOverlayLoader={setIsOverlayLoader}
                          />
                        ) : tab.type === "tablePreview" ? (
                          (action === "View" || !tab.isSubPreview) &&
                          (!tab.isSubPreview ||
                            [
                              "assigning",
                              "assigned",
                              "tm-created",
                              "sent to lab",
                              "certified",
                            ].includes(formData[0]?.smpl_status) ||
                            (tab.isSubPreview &&
                              moduleType === "jobinstruction") ||
                            tab.moduleType === "JRFOperationAssignment") && (
                            <RenderTablePreview
                              key={`${sectionIndex}-${tabIndex}`}
                              section={tab}
                              sectionIndex={sectionIndex}
                              formData={formData}
                              handleFieldChange={handleFieldChange}
                              formErrors={formErrors}
                              addRow={() => {
                                tab.headers.length < 6 ||
                                  pageType === "inward" ||
                                  pageType === "assignment"
                                  ? addRow(tab, sectionIndex)
                                  : setShowModal(true);
                              }}
                              deleteRow={() => deleteRow(sectionIndex)}
                              deleteColumn={(columnIndex) =>
                                deleteColumn(sectionIndex, columnIndex)
                              }
                              setFormData={setFormData}
                              popupMessages={formConfig.popupMessages}
                              pageType={pageType}
                              action={action}
                              masterOptions={masterResponse}
                              actionClicked={actionClicked}
                              isSubPreview={tab.isSubPreview}
                              simpleInwardResponse={simpleInwardResponse}
                              setSimpleInwardResponse={setSimpleInwardResponse}
                              tabIndex={tabIndex}
                              moduleType={moduleType}
                              OperationTypeID={OperationTypeID}
                              isSingleSetOnly={formConfig?.sections[0]?.isSingleSetOnly}
                            />
                          )
                        ) : tab.type === "accordion" ? (
                          <div
                            key={"sectionIndex" + sectionIndex}
                            className="my-2 bg-white individual-card"
                          >
                            <Card>
                              <CardBody>
                                <Row>

                                  {tab?.fields?.map((field, fieldIndex) => (

                                    <div
                                      key={"Form-Accordion" + fieldIndex + "_" + tabIndex}
                                      className={"col-md-" + field.width}
                                    >
                                      <RenderFields
                                        field={field}
                                        sectionIndex={sectionIndex}
                                        fieldIndex={fieldIndex}
                                        formData={formData}
                                        handleFieldChange={handleFieldChange}
                                        formErrors={formErrors}

                                        viewOnly={viewOnly}
                                        actionClicked={actionClicked}
                                      />
                                    </div>
                                  ))}
                                  <RenderAccordionSection
                                    section={tab}
                                    sectionIndex={sectionIndex}
                                    formData={formData}
                                    handleFieldChange={handleFieldChange}
                                    formErrors={formErrors}
                                  />
                                </Row>
                              </CardBody>
                            </Card>
                          </div>
                        ) : tab.type === "tableList" ? (

                          <RenderSubListSection
                            section={tab.listView}
                            sectionIndex={1}
                            actions={tab.listView.actions}
                            responseData={subTableData}
                            getAllListingData={getAllListingData}
                            formConfig={tab}
                            statusCounts={statusCounts}
                            setIsRejectPopupOpen={setIsRejectPopupOpen}
                            setJRFCreationType={setJrfCreationType}
                            setIsPopupOpen={setIsPopupOpen}
                            loadingTable={loadingTable}
                            setIsOverlayLoader={setIsOverlayLoader}
                            moduleType={moduleType}
                            formData={formData}
                            breadcrumb={formConfig?.breadcom}
                          />
                        ) : tab.type === "tableListPagination" ? (
                          <RenderSubListSectionPagination
                            section={tab.listView}
                            sectionIndex={1}
                            actions={tab.listView.actions}
                            responseData={subTableData}
                            getAllListingData={getAllListingData}
                            formConfig={tab}
                            statusCounts={statusCounts}
                            setIsRejectPopupOpen={setIsRejectPopupOpen}
                            setJRFCreationType={setJrfCreationType}
                            setIsPopupOpen={setIsPopupOpen}
                            loadingTable={loadingTable}
                            setIsOverlayLoader={setIsOverlayLoader}
                            moduleType={moduleType}
                            formData={formData}
                            handleFieldChange={handleFieldChange}
                            formErrors={formErrors}
                            viewOnly={viewOnly}
                            // editOnly={editOnly}
                            actionClicked={actionClicked}
                            breadcrumb={formConfig?.breadcom}
                            JISID={JISID}
                            OperationType={OperationType}
                            popupType={popupType}
                            setPopupType={setPopupType}
                            setFormData={setFormData}
                          />
                        ) : (
                          <>
                            <div
                              key={"sectionIndex" + sectionIndex}
                              className="my-2 bg-white individual-card"
                            >
                              <Card className="Default_screen">
                                <CardBody>

                                  {/* <CardTitle tag="h5">{section.title}</CardTitle> */}
                                  {/*
                                    Author : Yash Darshankar
                                    Date : 21/06/2024
                                    Description: Added this Class for New UI Spacing design
                                */}
                                  <Row className="main_form">
                                    {tab.tabType !== "vessel_Info" ? (
                                      tab.fields.map((field, fieldIndex) => {
                                        let isShow = true;


                                        if (moduleType === "inwardChecklist") {
                                          if (
                                            field.name ===
                                            "jrf_sample_condition" &&
                                            GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL"
                                          ) {
                                            // isShow = false;
                                          } else if (
                                            field.name == "jrf_pkging_condition"
                                          ) {
                                            if (
                                              GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL"
                                            ) {
                                              field.options = [
                                                "Sealed",
                                                "Unsealed",
                                                "Contamination",
                                                "Sign of Damage (Puncture, Leaks)",
                                                "Intact"
                                              ];
                                              // field.hintText = "<ul><li>All information is mutually confidential between TCRC Petrolabs and the customer. Any intention of placing the same in the public domain must be mutually agreed upon in print.</li><li>All proprietary information of TCRC Petrolabs and their customers is mutually agreed upon as confidential.</li><li>Tick (☑) whichever applies.</li></ul>"
                                            }
                                          } else if (
                                            field.name ===
                                            "jrf_vc_term_condition" &&
                                            GetTenantDetails(1, 1) !== "TPBPL"
                                          ) {
                                            isShow = false;
                                          }
                                          else if (field.name === "quantity_received_sample_desc" && GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) !== "TPBPL") {
                                            isShow = false;
                                          }
                                        }

                                        return (
                                          isShow && (
                                            <div
                                              key={"Form-default" + fieldIndex}
                                              className={"col-md-" + field.width}
                                            >

                                              <RenderFields
                                                field={getCustomCellValues(field)}
                                                sectionIndex={sectionIndex}
                                                fieldIndex={fieldIndex}
                                                formData={formData}
                                                handleFieldChange={
                                                  handleFieldChange
                                                }
                                                formErrors={formErrors}
                                                viewOnly={
                                                  !vieableArr.includes(
                                                    pageType
                                                  ) && viewOnly
                                                }
                                                masterOptions={masterResponse}
                                              />
                                            </div>
                                          )
                                        );

                                      })

                                    ) : (
                                      <RenderVesselInfoTable
                                        tab={tab}
                                        RenderFields={RenderFields}
                                        getCustomCellValues={getCustomCellValues}
                                        sectionIndex={sectionIndex}
                                        formData={formData}
                                        handleFieldChange={handleFieldChange}
                                        formErrors={formErrors}
                                        vieableArr={vieableArr}
                                        pageType={pageType}
                                        viewOnly={viewOnly}
                                      />
                                    )}

                                  </Row>
                                </CardBody>
                              </Card>
                            </div>
                          </>
                        )}
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
              {section.label === "Test Memo" ? (
                <div className="tab_footer">
                  <p>
                    {rolesDetails.map((role, UserIndex) => (
                      <span key={"role-" + UserIndex}>
                        {user?.role === role?.role ? role.label : null}
                      </span>
                    ))}{" "}
                    <br />
                    <br />{" "}
                    <span>
                      {user?.logged_in_user_info?.contact_person_name}
                    </span>
                  </p>
                  {/* <p>
                    Technical Manager <br />
                    <br /> <span>Benjamin Thompson</span>
                  </p> */}
                </div>
              ) : null}
            </div>
          ) || null
        ) : section.type === "testMemoTabs" ? (
          tabOpen && (
            <div key={"form-section" + sectionIndex}>
              <div className="nav nav-tabs nav-pills nav-fill card_header_btns_tabs ">
                {testMemoSetData.map((tab, tabIndex) => {
                  return (
                    <React.Fragment key={"tabIndex" + tabIndex}>
                      <NavItem key={"section-tab" + tabIndex}>
                        <NavLink
                          className={classnames("nav-link tab_header", {
                            active: activeTab === `${sectionIndex}-${tabIndex}`,
                          })}
                          onClick={() =>
                            setActiveTab(`${sectionIndex}-${tabIndex}`)
                          }
                          tabIndex="0"
                          href="#"
                        >
                          {"Set " + (tabIndex + 1)}
                        </NavLink>
                      </NavItem>
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="tab-content">
                {testMemoSetData.map((tab, tabIndex) => (
                  <div
                    key={"tab-content" + tabIndex}
                    role="tabpanel"
                    className={classnames("tab-pane", {
                      active: activeTab === `${sectionIndex}-${tabIndex}`,
                    })}
                  >
                    <Row>
                      <Col>
                        <RenderAdvtestMemoTableSection
                          key={`${sectionIndex}-${tabIndex}`}
                          section={section}
                          tabIndex={tabIndex}
                          setData={tab}
                          sectionIndex={sectionIndex}
                          formData={formData}
                          handleFieldChange={handleFieldChange}
                          formErrors={formErrors}
                          addRow={() => {
                            true
                              ? addRow(tab, sectionIndex)
                              : setShowModal(true);
                          }}
                          addColumn={() => addColumn(tab, sectionIndex)}
                          deleteRow={() => deleteRow(sectionIndex)}
                          deleteColumn={(columnIndex) =>
                            deleteColumn(sectionIndex, columnIndex)
                          }
                          groupAssignment={tab.groupAssignment}
                          handleAllSave={handleAllSave}
                          handleCancel={handleCancel}
                          gaData={gaData}
                          setGaData={setGaData}
                          showModalGA={showModalGA}
                          setShowModalGA={setShowModalGA}
                          pageType={pageType}
                          actionClicked={actionClicked}
                          setIsOverlayLoader={setIsOverlayLoader}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
              {section.label === "Test Memo" ? (
                <div className="tab_footer">
                  <p>
                    {rolesDetails.map((role, UserIndex) => (
                      <span key={"role-" + UserIndex}>
                        {formData[0]?.tm_created_by?.role === role?.role
                          ? role.label
                          : null}
                      </span>
                    ))}{" "}
                    <br />
                    <br /> <span>{formData[0]?.tm_created_by?.name}</span>
                  </p>
                  <p>
                    {rolesDetails.map((role, UserIndex) => (
                      <span key={"role-" + UserIndex}>
                        {formData[0]?.technical_manager?.role === role?.role
                          ? role.label
                          : null}
                      </span>
                    ))}{" "}
                    <br />
                    <br /> <span>{formData[0]?.technical_manager?.name}</span>
                  </p>
                </div>
              ) : null}
            </div>
          ) || null
        ) : section.type === "sampleAssignmentTabs" ? (
          tabOpen && (
            <div key={"form-section" + sectionIndex}>
              <div className="card_header_btns card_header_btns_tabs">
                {section?.tabs[0]?.tileSubHeader?.map((tile, tileIndex) => {
                  return (
                    <button
                      type="button"
                      className={getSubTileClassName(section, tile)}
                      onClick={() => {
                        if (tile.isClick && tile.opsNo != operationStepNo) {
                          vesselListNextFunctionality(
                            formData,
                            OperationType,
                            OperationTypeID,
                            navigate,
                            tile.opsNo,
                            action,
                            operationMode,
                            1
                          )
                        }
                      }}
                    >
                      <span>{tile.Text}</span>
                    </button>
                  );
                })}
              </div>

              <div
                className={
                  "nav nav-tabs nav-pills nav-fill tileHeaderNav " +
                  (section?.tabs[0]?.tileSubHeader?.length > 0 &&
                    "nav-tabs_hidden")
                }
              >
                <NavItem key={"section-tab"}>
                  <NavLink
                    className={classnames("nav-link tab_header", {
                      active: true,
                    })}
                    tabIndex="0"
                    href="#"
                  >
                    {section.label
                      ? section.label
                      : "Sample Group and Parameter List"}
                  </NavLink>
                </NavItem>
              </div>

              {section?.tabs.map((tab, tabIndex) => (
                <Row key={"tabIndx" + tabIndex}>
                  <Col>
                    <RenderAssignmentTableSection
                      key={`${sectionIndex}-${tabIndex}`}
                      section={tab}
                      sectionIndex={sectionIndex}
                      formData={formData}
                      handleFieldChange={handleFieldChange}
                      formErrors={formErrors}
                      addRow={() => {
                        tab.headers.length < 6 ||
                          pageType === "inward" ||
                          pageType === "assignment"
                          ? addRow(tab, sectionIndex)
                          : setShowModal(true);
                      }}
                      deleteRow={() => deleteRow(sectionIndex)}
                      deleteColumn={(columnIndex) =>
                        deleteColumn(sectionIndex, columnIndex)
                      }
                      setFormData={setFormData}
                      popupMessages={formConfig.popupMessages}
                      pageType={pageType}
                      action={action}
                      masterOptions={masterResponse}
                      actionClicked={actionClicked}
                      setSaveClicked={setSaveClicked}
                      saveClicked={saveClicked}
                      setTableData={setSubTableData}
                      tableData={subTableData}
                      moduleType={moduleType}
                      pageType2={true}
                      simpleInwardResponse={simpleInwardResponse}
                      setSimpleInwardResponse={setSimpleInwardResponse}
                      groupDefaultValue={groupDefaultValue}
                      testMemoId={testMemoId}
                      getVerificationDetails={getVerificationDetails}
                      getSampleIdsMasterData={getSampleIdsMasterData}
                      getAssignmentMasterData={getAssignmentMasterData}
                      isDisplayNewAddOption={isDisplayNewAddOption}
                      setIsDisplayNewAddOption={setIsDisplayNewAddOption}
                      setIsOverlayLoader={setIsOverlayLoader}
                      isOverlayLoader={isOverlayLoader}
                      useForComponent={useForComponent}
                      OperationTypeID={OperationTypeID}
                      TMLID={TMLID}
                      OperationType={OperationType}
                      operationName={operationName}
                      editReordType={editReordType}
                      setJRFTPIFormData={setJRFTPIFormData}
                      JRFTPIFormData={JRFTPIFormData}
                      operationStepNo={operationStepNo}
                      setParameterDataTableMain={setParameterDataTableMain}
                      setJRFCreationType={setJrfCreationType}
                      setIsPopupOpen={setIsPopupOpen}
                      isSingleSetOnly={formConfig?.sections[0]?.isSingleSetOnly}
                      labDropDownOptions={labDropDownOptions}
                      setLabDropDownOptions={setLabDropDownOptions}
                    />
                  </Col>
                </Row>
              ))}
            </div>
          ) || null
        ) : section.type === "SFMTabs" ? (
          tabOpen && (
            <div key={"form-section" + sectionIndex}>
              <div className="nav nav-tabs nav-pills nav-fill card_header_btns_tabs">
                {testMemoSetData.map((tab, tabIndex) => {
                  return (
                    <React.Fragment key={"tabIndex" + tabIndex}>
                      <NavItem key={"section-tab" + tabIndex}>
                        <NavLink
                          className={classnames("nav-link tab_header", {
                            active: activeTab === `${sectionIndex}-${tabIndex}`,
                          })}
                          onClick={() =>
                            setActiveTab(`${sectionIndex}-${tabIndex}`)
                          }
                          tabIndex="0"
                          href="#"
                        >
                          {"Set " + (tabIndex + 1)}
                        </NavLink>
                      </NavItem>
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="tab-content">
                {testMemoSetData.map((tab, tabIndex) => (
                  <div
                    key={"tab-content" + tabIndex}
                    role="tabpanel"
                    className={classnames("tab-pane", {
                      active: activeTab === `${sectionIndex}-${tabIndex}`,
                    })}
                  >
                    <Row>
                      <Col>
                        <RenderAdvSFMTableSection
                          key={`${sectionIndex}-${tabIndex}`}
                          section={section}
                          tabIndex={tabIndex}
                          setData={tab}
                          sectionIndex={sectionIndex}
                          formData={formData}
                          handleFieldChange={handleFieldChange}
                          formErrors={formErrors}
                          addRow={() => {
                            true
                              ? addRow(tab, sectionIndex)
                              : setShowModal(true);
                          }}
                          addColumn={() => addColumn(tab, sectionIndex)}
                          deleteRow={() => deleteRow(sectionIndex)}
                          deleteColumn={(columnIndex) =>
                            deleteColumn(sectionIndex, columnIndex)
                          }
                          groupAssignment={tab.groupAssignment}
                          handleAllSave={handleAllSave}
                          handleCancel={handleCancel}
                          gaData={gaData}
                          setGaData={setGaData}
                          showModalGA={showModalGA}
                          setShowModalGA={setShowModalGA}
                          pageType={pageType}
                          actionClicked={actionClicked}
                          setFormData={setFormData}
                          viewOnly={viewOnly}
                          activeTab={activeTab}
                          allFormulaList={allFormulaList}
                          moduleType={moduleType}
                          OperationTypeID={OperationTypeID}
                          EditRecordId={EditRecordId}
                          setIsOverlayLoader={setIsOverlayLoader}
                          testMemoSetData={testMemoSetData}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>

              <div className="tab_footer">
                {
                  formData[0]?.lab?.lab_is_skip_process ? (
                    (<p>
                      {rolesDetails.map((role, UserIndex) => (
                        <span key={"role-" + UserIndex}>
                          {formData[0]?.sfm_status !== "pending" && formData[0]?.sfm_updated_by?.role === role?.role ? role.label : null}
                        </span>
                      ))}{" "}
                      <br />
                      <br /> <span>{formData[0]?.sfm_status !== "pending" && formData[0]?.sfm_updated_by?.name}</span>
                    </p>)
                  ) : (
                    <p>
                      {rolesDetails.map((role, UserIndex) => (
                        <span key={"role-" + UserIndex}>
                          {formData[0]?.sfm_status !== "pending" && formData[0]?.allotment_details?.[0]?.chemist_role === role?.role ? role.label : null}
                        </span>
                      ))}{" "}
                      <br />
                      <br /> <span>{formData[0]?.sfm_status !== "pending" && formData[0]?.allotment_details?.[0]?.chemist_name}</span>
                    </p>
                  )
                }

                {['SU'].includes(user?.role) && !viewOnly && <div className="alert alert-warning mt-2 py-2">
                  <strong>Note:</strong> After clicking the <b>Post</b> button, the changes will reflect in the certificate.
                </div>}
                <p>
                  {rolesDetails.map((role, UserIndex) => (
                    <span key={"role-" + UserIndex}>
                      {formData[0]?.technical_manager?.role === role?.role
                        ? role.label
                        : null}
                    </span>
                  ))}{" "}
                  <br />
                  <br /> <span>{formData[0]?.technical_manager?.name}</span>
                </p>
              </div>
            </div>
          ) || null
        ) : section.type === "JIcertificate" ? (
          tabOpenSecond && (
            <div key={"form-section" + sectionIndex}>
              <div className="nav nav-tabs nav-pills nav-fill card_header_btns_tabs">
                {testMemoSetData.map((tab, tabIndex) => {
                  return (
                    <React.Fragment key={"tabIndex" + tabIndex}>
                      <NavItem key={"section-tab" + tabIndex}>
                        <NavLink
                          className={classnames("nav-link tab_header", {
                            active: activeTab === `${sectionIndex}-${tabIndex}`,
                          })}
                          onClick={() =>
                            setActiveTab(`${sectionIndex}-${tabIndex}`)
                          }
                          tabIndex="0"
                          href="#"
                        >
                          {"Set " + (tabIndex + 1)}
                        </NavLink>
                      </NavItem>
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="tab-content">
                {section?.tabs.map((tab, tabIndex) => (
                  <Row key={"tabIndx" + tabIndex}>
                    <Col>
                      <RenderTableSectionCertificate
                        key={`${sectionIndex}-${tabIndex}`}
                        section={tab}
                        sectionIndex={sectionIndex}
                        formData={formData}
                        handleFieldChange={handleFieldChange}
                        formErrors={formErrors}
                        addRow={() => {
                          tab.headers.length < 6 ||
                            pageType === "inward" ||
                            pageType === "assignment"
                            ? addRow(tab, sectionIndex)
                            : setShowModal(true);
                        }}
                        deleteRow={() => deleteRow(sectionIndex)}
                        deleteColumn={(columnIndex) =>
                          deleteColumn(sectionIndex, columnIndex)
                        }
                        setFormData={setFormData}
                        popupMessages={formConfig.popupMessages}
                        pageType={pageType}
                        action={action}
                        masterOptions={masterResponse}
                        actionClicked={actionClicked}
                        setSaveClicked={setSaveClicked}
                        saveClicked={saveClicked}
                        setTableData={setSubTableData}
                        tableData={subTableData}
                        moduleType={moduleType}
                        pageType2={true}
                        simpleInwardResponse={simpleInwardResponse}
                        setSimpleInwardResponse={setSimpleInwardResponse}
                        groupDefaultValue={groupDefaultValue}
                        testMemoId={testMemoId}
                        getVerificationDetails={getVerificationDetails}
                        getSampleIdsMasterData={getSampleIdsMasterData}
                        getAssignmentMasterData={getAssignmentMasterData}
                        isDisplayNewAddOption={isDisplayNewAddOption}
                        setIsDisplayNewAddOption={setIsDisplayNewAddOption}
                        setIsOverlayLoader={setIsOverlayLoader}
                        isOverlayLoader={isOverlayLoader}
                        useForComponent={useForComponent}
                        OperationTypeID={OperationTypeID}
                        TMLID={TMLID}
                        OperationType={OperationType}
                        operationName={operationName}
                        editReordType={editReordType}
                        setJRFTPIFormData={setJRFTPIFormData}
                        JRFTPIFormData={JRFTPIFormData}
                        operationStepNo={operationStepNo}
                        configCertStatus={configCertStatus}
                        configCertStatusRPCID={configCertStatusRPCID}
                        opsCertiView={opsCertiView}
                      />
                    </Col>
                  </Row>
                ))}
              </div>
            </div>
          ) || null
        )
          : section.type === "configureTable" ? (
            <RenderConfigureTable
              section={section}
              sectionIndex={sectionIndex}
              formData={formData}
              handleFieldChange={handleFieldChange}
              formErrors={formErrors}
              setFormData={setFormData}
              viewOnly={viewOnly}
              actionClicked={actionClicked}
              configCertStatusRPCID={configCertStatusRPCID}
              handleCertificateSave={handleCertificateSave}
              opsCertiView={opsCertiView}
              sequence={sequence}
              setSequence={setSequence}
              OperationType={OperationType}
            />
          ) : section.type === "list" ? null : (
            <div
              key={"form-config-section" + sectionIndex}
              className="my-2 bg-white individual-card"
            >
              <Card className="section_card">
                <CardBody
                  className={
                    "section_card_body " +
                    (moduleSubType === "vesselList" &&
                      "section_card_body_vesselList")
                  }
                >
                  <CardTitle tag="h5" className="section_title">
                    <div className="list_breadcrumb">
                      {sectionIndex === 0 &&
                        formConfig?.breadcom?.map((title, i) => {
                          if (moduleType === "invoice") {
                            if (i == 0) {
                              if (user?.role === "LR") {
                                title = {
                                  ...title,
                                  title: "LMS"
                                }
                              }
                              else {
                                title = {
                                  ...title,
                                  title: "Operation"
                                }
                              }
                            }
                          }

                          return <div key={"Form-breadcom" + i}>
                            {i === 0 ? null : (
                              <i className="bi bi-chevron-right card-title-icon"></i>
                            )}{" "}
                            <button
                              className="breadcrumb_button"
                              type="button"
                              onClick={() => title?.redirect !== "#" ? navigate(title?.redirect) : null}
                            >
                              {title.title}
                            </button>
                          </div>
                        })}
                    </div>
                    {['JICommercialCertificateList', 'tenderDocumentList', 'purchaseorderDocumentList', "purchasereqDocumentList", 'jrfDocumentList', 'itemDocumentList'].includes(moduleType) && (
                      <div className="jrf_container">
                        <div className="jrf_container_btns">
                          <div className="jrf_container_btns_main">
                            <button
                              type="button"
                              onClick={() => setPopupType("Upload")}
                              className="create_button"
                            >
                              <i className="bi bi-plus-lg"></i>
                              {translate("common.createBtn")}
                            </button>
                          </div>

                        </div>
                      </div>
                    )}

                  </CardTitle>

                  <div className="card_header_btns">
                    {tileHeader?.map((tile, tileIndex) => (
                      <button
                        type="button"
                        className={getTileClassName(
                          formData[0]?.["ji_internal_status"],
                          tile
                        )}
                      >
                        <div>

                          <p className="extra-text">{tile.leftSubTitle}</p>
                          <p className="extra-text">{tile.rightSubTitle}</p>
                        </div>
                        <span >{tile.Text}</span>
                      </button>
                    ))}
                  </div>
                  {section?.subSections?.length > 0 ?

                    section?.subSections.map((subSection, subSectionIndex) => {
                      if (moduleType === "jobinstruction") {
                        if (['CM'].includes(moduleType) && subSectionIndex === 1) {
                          return null
                        }
                      }
                      return (
                        subSection.type === "table" ? (
                          <RenderTableSection
                            key={`${0}-${0}`}
                            section={subSection}
                            sectionIndex={1}
                            formData={formData}
                            setFormData={setFormData}
                            action={"View"}
                            setTableData={setSubTableData}
                            tableData={subTableData}
                            moduleType={moduleType}
                            setIsOverlayLoader={setIsOverlayLoader}
                            isOverlayLoader={isOverlayLoader}
                            isUseForViwOnly={true}
                            checkShowButtonConditon={checkShowButtonConditon}
                          />
                        )
                          : subSection.type == "parameterPreview" ?
                            <RenderTablePreview
                              key={`${0}-${0}`}
                              section={subSection}
                              sectionIndex={1}
                              formData={formData}
                              isSubPreview={true}
                              moduleType={moduleType}
                              isSingleParamOnly={true}
                              isUseForViwOnly={true}
                              isPopup={true}
                              isSingleSetOnly={true}
                            /> :
                            <Row className="main_form _form">
                              {/* <Row className="main_form subSection_main_form"> */}
                              {subSection.fields.map((field, fieldIndex) => {

                                let isShow = true;
                                let isViewOnly = viewOnly;
                                if (!isViewOnly && field.fieldName == "msfm_number") {
                                  isShow = false;
                                }

                                if (
                                  (field.name === "jrf_remark" &&
                                    formData[0]?.jrf_status !== "rejected") ||
                                  (field.name === "jrf_status" &&
                                    !formData[0]?.jrf_status) ||
                                  (field.name === "tm_remarks" &&
                                    formData[0]?.status !== "rejected") ||
                                  // (field.name === "ic_borometric_pressure" &&
                                  //   ["C", "L"].includes(formData[0]?.company_code)) ||
                                  // (field.name === "sfm_borometricpressure" &&
                                  //   ["C", "L"].includes(formData[0]?.company_code))
                                  (field.name === "ic_borometric_pressure" &&
                                    GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) != "TPBPL") ||
                                  (field.name === "sfm_borometricpressure" &&
                                    GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) != "TPBPL")
                                ) {
                                  isShow = false;
                                }
                                if (moduleType === "testmemomain") {
                                  if (
                                    (field.name == "tm_datestartinganalysis" ||
                                      field.name == "tm_datecompletion") &&
                                    !["results", "certified", "verified"].includes(
                                      formData[0]?.["status"]
                                    )
                                  ) {
                                    isShow = false;
                                  } else if (field.name == "sample_condition") {
                                    if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL") {
                                      isShow = false;
                                    }
                                  }
                                } else if (
                                  moduleType === "sampleinward" ||
                                  moduleType === "inwardChecklist"
                                ) {
                                  if (
                                    (field.name == "smpl_detail_dos" ||
                                      field.name == "smpl_detail_recpt_mode") &&
                                    !formData[1]?.sampleInwardIdMain
                                  ) {
                                    isViewOnly = false;
                                  } else {
                                    isViewOnly = viewOnly;
                                    //for temporry open date for inward
                                    // if (field.name == "smpl_detail_dos" ||
                                    //   field.name == "smpl_detail_recpt_mode") {
                                    //   field.readOnly = false;
                                    //   field.noRestrictionApply = true;
                                    // }
                                    // else if (field.type != 'label') {
                                    //
                                    if (field.type != 'label') {
                                      field.type = 'label';
                                    }
                                  }
                                  if (
                                    field.name === "jrf_branch_name" &&
                                    formData[0]?.jrf_is_external
                                  ) {
                                    isShow = false;
                                  }
                                  else if (field.name === "jrf_test_method") {
                                    if (formData[0]?.jrf_is_ops) {
                                      isShow = false;
                                    }
                                  }
                                } else if (moduleType === "jrf") {
                                  if (
                                    field.name == "fk_sub_commodity" &&
                                    !isRefrenceNoCalled
                                  ) {
                                    isShow = false;
                                  }
                                } else if (moduleType === "internalcertificate") {
                                  if (
                                    field.name == "ic_rejection_remark" &&
                                    !["tm-reject", "dtm-reject"].includes(
                                      formData[0].status
                                    )
                                  ) {
                                    isShow = false;
                                  } else if (field.name === "ic_is_size_analysis") {
                                    if (isViewOnly || GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL") {
                                      isShow = false;
                                    }
                                  }
                                } else if (moduleType === "sfm") {
                                  if (
                                    field.name == "sfm_remarks" &&
                                    formData[0].sfm_status !== "rejected"
                                  ) {
                                    isShow = false;
                                  }
                                } else if (moduleType === "jobinstruction") {
                                  // if (
                                  //   field.name == "ji_dispatch_address" &&
                                  //   !(formData[0]?.ji_is_hardcopy?.includes("Print Hard Copy"))
                                  // ) {
                                  //   isShow = false;
                                  // } else 
                                  if (field.name === "ji_with_whom") {
                                    if (
                                      !formData[0].ji_type_of_sampling ||
                                      ["Independently"].includes(
                                        formData[0].ji_type_of_sampling
                                      )
                                    ) {
                                      isShow = false;
                                    }
                                  } else if (field.name === "ji_analysis_with_whom") {
                                    if (
                                      !formData[0].ji_type_of_analysis ||
                                      ["Independently"].includes(
                                        formData[0].ji_type_of_analysis
                                      )
                                    ) {
                                      isShow = false;
                                    }
                                  } else if (
                                    field.name == "ji_remark" &&
                                    formData[0].status !== "rejected"
                                  ) {
                                    isShow = false;
                                  } else if (
                                    field.name == "ji_cancel_description" &&
                                    formData[0].status !== "cancel"
                                  ) {
                                    isShow = false;
                                  }
                                  else if (field.name === "ji_is_consortium_order") {
                                    if (formData[0]?.fk_operationtypetid_code != "CS") {
                                      isShow = false;
                                    }
                                  } else if (field.name === "fk_consortium_order" || field.name === "consortium_number") {
                                    if (formData[0]?.ji_is_consortium_order === "No") {
                                      isShow = false;
                                    }
                                  } else if (field.name === "ji_dual_port_seq") {
                                    if (formData[0]?.ji_is_dual_port === "No") {
                                      isShow = false;
                                    }
                                  } else if (field.name === "ji_first_ref_no") {
                                    if (formData[0]?.ji_is_dual_port === "No") {
                                      isShow = false;
                                    } else if (formData[0]?.ji_dual_port_seq === "First") {
                                      isShow = false;
                                    }
                                  }
                                  else if (field.name === "ji_is_plot_no") {
                                    if (['SS'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false;
                                    }
                                  }
                                  else if (field.name === "ji_plot_no") {
                                    if (formData[0]?.ji_is_plot_no === "No") {
                                      isShow = false;
                                    }
                                  }
                                  else if (field.name === "ji_month_name") {
                                    if (formData[0]?.ji_is_monthly === "No") {
                                      isShow = false;
                                    }
                                  }
                                  else if (field.name === "ji_eta") {
                                    if (['PL', 'RK', 'ST', 'TR', 'PV', 'CS', 'PR', 'CV', 'BO', 'CN', 'RC', 'AS', 'SS', 'PL', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false
                                    }
                                  }
                                  else if (field.name === "ji_is_loading") {
                                    if (['PV', 'ST', 'CS', 'PR', 'CV', 'BO', 'SS', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false
                                    }
                                  }
                                  else if (['loading_unloading_country_name', 'fk_loading_unloading_country'].includes(field.name)) {
                                    if (['PV', 'RK', 'ST', 'CS', 'PR', 'CV', 'BO', 'SS', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false
                                    }
                                  }
                                  else if (['loading_unloading_port_name', 'fk_loading_unloading_port'].includes(field.name)) {
                                    if (['PV', 'RK', 'ST', 'CS', 'PR', 'CV', 'BO', 'SS', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false
                                    }
                                  }
                                  else if (field.name === "ji_loading_destination") {
                                    if (!['RK'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false
                                    }
                                  }
                                  else if (field.name === "ji_is_dual_port") {
                                    if (['RK', 'ST', 'TR', 'CS', 'TL', 'PR', 'CV', 'BO', 'CN', 'RC', 'AS', 'SS', 'PL', 'CM', 'MI', 'PV'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false
                                    }
                                  }
                                  else if (field.name === "ji_other_placework") {
                                    let spPlaceCode = formData[0]?.ji_place_of_work_name ? formData[0]?.ji_place_of_work_name.split('-') : []
                                    if (spPlaceCode.length != 2 || spPlaceCode[1].toLowerCase() !== "others") {
                                      isShow = false;
                                    }
                                  }
                                  else if (field.name === "fk_userbranchcaptainid") {
                                    const scopeofworkdata = formData?.[1]?.["scope_of_work_data"] || [];
                                    const existsLMS = scopeofworkdata.find((singleData) =>
                                      [getVesselOperation('TML'), getVesselOperation('VL_TML_M')].includes(getActivityCode(singleData?.activity_master?.activity_code).toLowerCase())
                                    );
                                    if (!existsLMS) {
                                      isShow = false;
                                    }
                                  }
                                  else if (['fk_supplierid', 'ji_suplier_name', 'ji_is_supplier'].includes(field.name)) {
                                    if (['CV', 'BO', 'PV', 'SS', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false
                                    }
                                  }
                                  else if (['ji_type_of_sampling', 'ji_type_of_analysis', 'ji_analysis', 'ji_sampling_methods'].includes(field.name)) {
                                    if (['CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false
                                    }
                                  }
                                  else if (['ji_no_of_sample'].includes(field.name)) {
                                    if (['PL'].includes(formData[0]?.fk_operationtypetid_code)) {
                                      isShow = false
                                    }
                                  }
                                  // else if (field.name === "ji_appointed_totalqty") {
                                  //   if (['CV', 'PV', 'CN', 'RC', 'AS', 'PL', 'RK', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                                  //     isShow = false
                                  //   }
                                  // }
                                  // else if (field.name === "ji_totalqty") {
                                  //   if (['CV', 'PV', 'CN', 'RC', 'AS', 'PL', 'RK', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                                  //     isShow = false
                                  //   }
                                  // }
                                }
                                else if (moduleType === "purchase") {
                                  if (
                                    field.name == "fk_prev_po_details" && formData[0]?.po_no
                                  ) {
                                    isShow = false;
                                  }
                                }
                                if (
                                  [
                                    "allotment_msfm_number",
                                    "ic_msfm_number",
                                    "jrf_msfm_number",
                                    "inward_msfm_number",
                                    "inward_msfm_number",
                                    "tm_msfm_no",
                                  ].includes(field.name)
                                ) {
                                  if (
                                    !["BU"].includes(user?.role) &&
                                    !user?.logged_in_user_info?.lab_or_branch
                                      ?.lab_is_compliant
                                  ) {
                                    isShow = false;
                                  }
                                }
                                if (
                                  OperationType === getVesselOperation("DS") &&
                                  field.name === "jrf_header"
                                ) {
                                  isShow = false;
                                }
                                return (
                                  isShow && (
                                    <div
                                      key={"Form-Extra-Adjustments" + fieldIndex}
                                      className={"col-md-" + field.width}
                                    >

                                      <RenderFields
                                        field={getCustomCellValues(field)}
                                        sectionIndex={sectionIndex}
                                        fieldIndex={fieldIndex}
                                        formData={formData}
                                        handleFieldChange={handleFieldChange}
                                        handleFieldBlur={handleFieldBlur}
                                        formErrors={formErrors}
                                        ////For Group Assignment Only....
                                        gaData={gaData}
                                        setGaData={setGaData}
                                        showModalGA={showModalGA}
                                        setShowModalGA={setShowModalGA}
                                        ////For Group Assignment Only....
                                        ////For Master Data....
                                        masterOptions={masterResponse}
                                        ////For Master Data....
                                        ////For View Status.....
                                        viewOnly={isViewOnly}
                                        actionClicked={actionClicked}
                                        pdfUrl={pdfUrl}
                                        setPdfUrl={setPdfUrl}
                                        sharingPdfUrl={sharingPdfUrl}
                                        IsPreviewUpload={IsPreviewUpload}
                                        setSharingPdfUrl={setSharingPdfUrl}
                                        setFormData={setFormData}
                                        isEditMode={EditRecordId && !editReordType ? true : false}
                                        moduleType={moduleType}
                                      />
                                      {isValideReferenceNo &&
                                        field.name === "jrf_referenceno" ? (
                                        <p className="text-danger errorMsg">
                                          {
                                            isValideReferenceNo
                                          }
                                        </p>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  )
                                );

                              })}
                              {viewDetail && (
                                <JIPopupModal
                                  section={subSection}
                                  sectionIndex={subSectionIndex}
                                  formData={formData}
                                  handleFieldChange={handleFieldChange}
                                  formErrors={formErrors}
                                  setViewDetail={setViewDetail}
                                  setIsOverlayLoader={setIsOverlayLoader}
                                  isOverlayLoader={isOverlayLoader}
                                />
                              )}
                              <PopupGA
                                showModalGA={showModalGA}
                                setShowModalGA={setShowModalGA}
                                staticData={section.fields}
                              />
                              {ViewDetailsButton(moduleType, sectionIndex, subSectionIndex)}
                              {
                                getShowSubSectionButton(moduleType, sectionIndex, subSectionIndex)
                              }
                              {/* <div className="submitBtn_container">
                              {moduleType === "jobinstruction" &&
                                !viewOnly && [getRakeOperations('QAss'), getRakeOperations('QA'), getPlantOperations('RK')].includes(OperationType)
                                && (!formData[0]?.rake_qas_id || !formData[0]?.rake_qan_id) && subSectionIndex === 1 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      setJrfCreationType("save");
                                      setIsPopupOpen(true);
                                      setIsSubSectionSave(true)
                                    }}
                                    className="submitBtn"
                                  >
                                    {translate("common.saveBtn")}
                                  </button>
                                )}
                            </div> */}
                            </Row>
                      )
                    })
                    :
                    section?.fields?.length > 0 &&
                    <Row className="main_form">
                      {section.fields.map((field, fieldIndex) => {

                        console.log("viewOnly", viewOnly)
                        let isShow = true;
                        let isViewOnly = viewOnly;
                        if (!isViewOnly && field.fieldName == "msfm_number") {
                          isShow = false;
                        }

                        if (
                          (field.name === "jrf_remark" &&
                            formData[0]?.jrf_status !== "rejected") ||
                          (field.name === "jrf_status" &&
                            !formData[0]?.jrf_status) ||
                          (field.name === "tm_remarks" &&
                            formData[0]?.status !== "rejected") ||
                          // (field.name === "ic_borometric_pressure" &&
                          //   ["C", "L"].includes(formData[0]?.company_code)) ||
                          // (field.name === "sfm_borometricpressure" &&
                          //   ["C", "L"].includes(formData[0]?.company_code))
                          (field.name === "ic_borometric_pressure" &&
                            GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) != "TPBPL") ||
                          (field.name === "sfm_borometricpressure" &&
                            GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) != "TPBPL")
                        ) {
                          isShow = false;
                        }
                        if (moduleType === "testmemomain") {
                          if (
                            (field.name == "tm_datestartinganalysis" ||
                              field.name == "tm_datecompletion") &&
                            !["results", "certified", "verified"].includes(
                              formData[0]?.["status"]
                            )
                          ) {
                            isShow = false;
                          } else if (field.name == "sample_condition") {
                            if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL") {
                              isShow = false;
                            }
                          }
                        } else if (
                          moduleType === "sampleinward" ||
                          moduleType === "inwardChecklist"
                        ) {
                          isViewOnly = false;
                          if (
                            (field.name == "smpl_detail_dos" ||
                              field.name == "smpl_detail_recpt_mode") &&
                            !formData[1]?.sampleInwardIdMain
                          ) {
                            field.readOnly = false;
                            if (field.name == "smpl_detail_recpt_mode") {
                              field.type = 'select';
                            }
                            else {
                              field.type = 'date';
                            }
                          }
                          else {
                            field.readOnly = viewOnly;
                            //for temporry open date for inward
                            // if (field.name == "smpl_detail_dos" ||
                            //   field.name == "smpl_detail_recpt_mode") {
                            //   field.readOnly = false;
                            //   field.noRestrictionApply = true;
                            // }
                            // else if (field.type != 'label') {
                            //
                            if (field.type != 'label') {
                              field.type = 'label';
                            }
                          }
                          if (
                            field.name === "jrf_branch_name" &&
                            formData[0]?.jrf_is_external
                          ) {
                            isShow = false;
                          }
                          else if (field.name === "jrf_test_method") {
                            if (formData[0]?.jrf_is_ops) {
                              isShow = false;
                            }
                          }
                        } else if (moduleType === "jrf") {
                          if (
                            field.name == "fk_sub_commodity" &&
                            !isRefrenceNoCalled
                          ) {
                            isShow = false;
                          }
                        } else if (moduleType === "internalcertificate") {
                          if (
                            field.name == "ic_rejection_remark" &&
                            !["tm-reject", "dtm-reject"].includes(
                              formData[0].status
                            )
                          ) {
                            isShow = false;
                          } else if (field.name === "ic_is_size_analysis") {
                            if (isViewOnly || GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) === "TPBPL") {
                              isShow = false;
                            }
                          }
                        } else if (moduleType === "sfm") {
                          if (
                            field.name == "sfm_remarks" &&
                            formData[0].sfm_status !== "rejected"
                          ) {
                            isShow = false;
                          }
                        } else if (moduleType === "jobinstruction") {
                          // if (
                          //   field.name == "ji_dispatch_address" &&
                          //   !(formData[0]?.ji_is_hardcopy?.includes("Print Hard Copy"))
                          // ) {
                          //   isShow = false;
                          // } else 
                          if (field.name === "ji_with_whom") {
                            if (
                              !formData[0].ji_type_of_sampling ||
                              ["Independently"].includes(
                                formData[0].ji_type_of_sampling
                              )
                            ) {
                              isShow = false;
                            }
                          } else if (field.name === "ji_analysis_with_whom") {
                            if (
                              !formData[0].ji_type_of_analysis ||
                              ["Independently"].includes(
                                formData[0].ji_type_of_analysis
                              )
                            ) {
                              isShow = false;
                            }
                          } else if (
                            field.name == "ji_remark" &&
                            formData[0].status !== "rejected"
                          ) {
                            isShow = false;
                          } else if (
                            field.name == "ji_cancel_description" &&
                            formData[0].status !== "cancel"
                          ) {
                            isShow = false;
                          }
                          else if (field.name === "ji_is_consortium_order") {
                            if (formData[0]?.fk_operationtypetid_code != "CS") {
                              isShow = false;
                            }
                          } else if (field.name === "fk_consortium_order" || field.name === "consortium_number") {
                            if (formData[0]?.ji_is_consortium_order === "No") {
                              isShow = false;
                            }
                          } else if (field.name === "ji_dual_port_seq") {
                            if (formData[0]?.ji_is_dual_port === "No") {
                              isShow = false;
                            }
                          } else if (field.name === "ji_first_ref_no") {
                            if (formData[0]?.ji_is_dual_port === "No") {
                              isShow = false;
                            } else if (formData[0]?.ji_dual_port_seq === "First") {
                              isShow = false;
                            }
                          }
                          else if (field.name === "ji_is_plot_no") {
                            if (['SS'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false;
                            }
                          }
                          else if (field.name === "ji_plot_no") {
                            if (formData[0]?.ji_is_plot_no === "No") {
                              isShow = false;
                            }
                          }
                          else if (field.name === "ji_month_name") {
                            if (formData[0]?.ji_is_monthly === "No") {
                              isShow = false;
                            }
                          }
                          else if (field.name === "ji_eta") {
                            if (['PL', 'RK', 'ST', 'TR', 'PV', 'CS', 'PR', 'CV', 'BO', 'CN', 'RC', 'AS', 'SS', 'PL', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false
                            }
                          }
                          else if (field.name === "ji_is_loading") {
                            if (['PV', 'ST', 'CS', 'PR', 'CV', 'BO', 'SS', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false
                            }
                          }
                          else if (['loading_unloading_country_name', 'fk_loading_unloading_country'].includes(field.name)) {
                            if (['PV', 'RK', 'ST', 'CS', 'PR', 'CV', 'BO', 'SS', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false
                            }
                          }
                          else if (['loading_unloading_port_name', 'fk_loading_unloading_port'].includes(field.name)) {
                            if (['PV', 'RK', 'ST', 'CS', 'PR', 'CV', 'BO', 'SS', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false
                            }
                          }
                          else if (field.name === "ji_loading_destination") {
                            if (!['RK'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false
                            }
                          }
                          else if (field.name === "ji_is_dual_port") {
                            if (['RK', 'ST', 'TR', 'CS', 'TL', 'PR', 'CV', 'BO', 'CN', 'RC', 'AS', 'SS', 'PL', 'CM', 'MI', 'PV'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false
                            }
                          }
                          else if (field.name === "ji_other_placework") {
                            let spPlaceCode = formData[0]?.ji_place_of_work_name ? formData[0]?.ji_place_of_work_name.split('-') : []
                            if (spPlaceCode.length != 2 || spPlaceCode[1].toLowerCase() !== "others") {
                              isShow = false;
                            }
                          }
                          else if (field.name === "fk_userbranchcaptainid") {
                            const scopeofworkdata = formData?.[1]?.["scope_of_work_data"] || [];
                            const existsLMS = scopeofworkdata.find((singleData) =>
                              [getVesselOperation('TML'), getVesselOperation('VL_TML_M')].includes(getActivityCode(singleData?.activity_master?.activity_code).toLowerCase())
                            );
                            if (!existsLMS) {
                              isShow = false;
                            }
                          }
                          else if (['fk_supplierid', 'ji_suplier_name', 'ji_is_supplier'].includes(field.name)) {
                            if (['CV', 'BO', 'PV', 'SS', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false
                            }
                          }
                          else if (['ji_type_of_sampling', 'ji_type_of_analysis', 'ji_analysis', 'ji_sampling_methods'].includes(field.name)) {
                            if (['CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false
                            }
                          }
                          else if (['ji_no_of_sample'].includes(field.name)) {
                            if (['PL'].includes(formData[0]?.fk_operationtypetid_code)) {
                              isShow = false
                            }
                          }
                          // else if (field.name === "ji_appointed_totalqty") {
                          //   if (['CV', 'PV', 'CN', 'RC', 'AS', 'PL', 'RK', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                          //     isShow = false
                          //   }
                          // }
                          // else if (field.name === "ji_totalqty") {
                          //   if (['CV', 'PV', 'CN', 'RC', 'AS', 'PL', 'RK', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                          //     isShow = false
                          //   }
                          // }
                        }
                        else if (moduleType === "operationCertificate") {
                          if (field.name == "cc_show_rounded_qty") {
                            if (OperationType !== getVesselOperation('DS')) {
                              isShow = false
                            }
                          }
                          else if (field.name == "cc_is_hide_basis") {
                            if (isUseForPhysical || !getLMSOperationActivity().includes(OperationType)) {
                              isShow = false
                            }
                          }
                          else if (field.name == "cc_is_qty_display") {
                            if (isUseForPhysical || !getLMSOperationActivity().includes(OperationType)) {
                              isShow = false
                            }
                          }
                          else if (field.name == "cc_remark") {
                            if (!['rejected']?.includes(formData[0]?.status)) {
                              isShow = false
                            }
                          }
                          else if (field.name == "cc_additional_remark") {
                            if (!formData?.[0]?.rpc_is_other_remark) {
                              isShow = false
                            }
                          }
                          else if (field.name == "cc_is_rake_details") {
                            if (!getRakeCollectionActivity(1).includes(OperationType)) {
                              // if (isUseForPhysical || !getRakeCollectionActivity(1).includes(OperationType)) {
                              isShow = false
                            }
                            // isShow = false
                          }
                          else if (field.name == "cc_supp_buyer") {
                            if (OperationType == getVesselOperation('bulk_crg') || isCustomMode) {
                              isShow = false
                            }
                          }
                          else if (field.name == "cc_fk_sub_commodity_id") {
                            // if (!(['RK', 'ST'].includes(formData[0]?.operation_type?.operation_type_code) || ['RK', 'ST'].includes(operationMode) || ['RK', 'ST'].includes(formData[0]?.operationmode?.ops_code))) {
                            //   isShow = false
                            // }
                          }
                          else if (field.name == "cc_fk_place_pf_work_id") {
                            // if (!(['RK', 'ST'].includes(formData[0]?.operation_type?.operation_type_code) || ['RK', 'ST'].includes(operationMode) || ['RK', 'ST'].includes(formData[0]?.operationmode?.ops_code))) {
                            //   isShow = false
                            // }
                          }
                          else if (field.name == "jrf_bottom") {
                            // if (isUseForPhysical || getVesselOperation('bulk_crg') === OperationType) {
                            if (getVesselOperation('bulk_crg') === OperationType) {
                              isShow = false
                            }
                          }
                          else if (field.name == "jrf_header") {
                            // if (isUseForPhysical) {
                            //   isShow = false
                            // }
                          }
                          else if (field.name === "cc_other_placework") {
                            let spPlaceCode = formData[0]?.cc_place_of_work_name ? formData[0]?.cc_place_of_work_name.split('-') : []
                            if (spPlaceCode.length != 2 || spPlaceCode[1].toLowerCase() !== "others") {
                              isShow = false;
                            }
                          }
                          else if (field.name === 'cc_is_other_format') {
                            if (isUseForPhysical || !getLMSOperationActivity().includes(OperationType)) {
                              isShow = false;
                            }
                          }
                          else if (field.name == "fk_cc_cert_format_id") {
                            field.isCustomPayload = false
                            if ([getPlantOperations("TR")].includes(OperationType)) {
                              field.isCustomPayload = true
                              field.customPayload = {
                                "name": "ops_code",
                                "value": "TR",
                                "defaultValue": "TR"
                              }
                            }
                            if (!formData?.[0]?.cc_is_other_format?.[0]) {
                              isShow = false
                            }
                          }
                          else if (['eic_bl_number', 'eic_weight_avg_moisture', 'eic_eia_code', 'dpl_source', 'dpl_name_colliery', 'dpl_analysis_completed_on', 'dpl_smpl_mark_date'].includes(field.name)) {
                            if (!formData?.[0]?.cc_is_other_format?.[0] || !['EIC', 'DPL'].includes(formData?.[0]?.fk_cc_cert_format_label)) {
                              isShow = false
                            }
                            else {
                              field.options = [];
                              if (['EIC'].includes(formData?.[0]?.fk_cc_cert_format_label)) {
                                isShow = ['eic_bl_number', 'eic_weight_avg_moisture', 'eic_eia_code'].includes(field.name)
                              }
                              else if (['DPL'].includes(formData?.[0]?.fk_cc_cert_format_label)) {
                                isShow = ['dpl_source', 'dpl_name_colliery', 'dpl_analysis_completed_on', 'dpl_smpl_mark_date'].includes(field.name)
                              }
                            }
                          }
                          else if (field.name == "cc_physical_report_sample_marks") {
                            if (!isUseForPhysical || formData[0]?.cc_id) {
                              isShow = false
                            }
                            else {
                              if (session?.analysisData) {
                                const defaultopt = [
                                  ...new Set(session?.analysisData.map(singleData => singleData.pa_sample_mark))
                                ]
                                field.options = defaultopt
                                field.defaultValue = defaultopt
                              }
                            }
                          }
                        }

                        else if (moduleType === "jobCosting") {
                          if (field.name === "jc_total_exp") {
                            field.defaultValue = 0;
                          } else if (field.name === "jc_profit_loss") {
                            field.defaultValue = 0;
                          } else if (field.name === "jc_profit_perc") {
                            field.defaultValue = 0;
                          }
                          else if (field.name === "im_jc_comment") {
                            if (!formData[0]?.fk_im_id?.im_is_jc_comment) {
                              isShow = false;
                            }
                          }
                        }
                        else if (moduleType === "auditBranchExpenses") {

                          if (field.name === "year") {
                            const currentYear = new Date().getFullYear();
                            const startYear = currentYear;
                            const endYear = startYear + 1;
                            field.defaultValue = `${startYear}-${endYear}`
                          }
                          else if (field.name === "month") {
                            const date = new Date();
                            field.defaultValue = date.toLocaleString("en-US", { month: "long" })
                          }

                        }
                        else if (moduleType === "auditOutstanding") {
                          if (field.name == "total_outstanding_amt") {
                            field.defaultValue = 0
                          }
                          else if (field.name === "year") {
                            const currentYear = new Date().getFullYear();
                            const startYear = currentYear;
                            const endYear = startYear + 1;
                            field.defaultValue = `${startYear}-${endYear}`
                          }
                          else if (field.name === "month") {
                            const date = new Date();
                            field.defaultValue = date.toLocaleString("en-US", { month: "long" })
                          }
                        }
                        else if (moduleType === "auditSalesRegister") {
                          if (field.name == "total_sales_amt") {
                            field.defaultValue = 0
                          }
                          else if (field.name == "credit_note_total") {
                            field.defaultValue = 0
                          }
                          else if (field.name == "final_sales") {
                            field.defaultValue = 0
                          }
                          else if (field.name === "year") {
                            const currentYear = new Date().getFullYear();
                            const startYear = currentYear;
                            const endYear = startYear + 1;
                            field.defaultValue = `${startYear}-${endYear}`
                          }
                          else if (field.name === "month") {
                            const date = new Date();
                            field.defaultValue = date.toLocaleString("en-US", { month: "long" })
                          }
                        }
                        else if (moduleType === "invoice") {
                          if (decryptDataForURL(params.get("isCourier")) || viewOnly) {
                            field.useForViewOnly = true
                            isViewOnly = true
                            if (field.isCourierData) {
                              isViewOnly = viewOnly || false
                              if (!formData[0]?.im_status || formData[0]?.im_status === "Saved") {
                                isShow = false
                              }
                              else if (!["Courier Details", "im_courier"].includes(field.label) || field.name === "im_courier") {
                                if (hideMap[formData[0]?.im_courier]?.includes(field.name)) {
                                  isShow = false;
                                } else {
                                  isShow = true;
                                }
                              }
                            }
                          }
                          else if (field.isCourierData) {
                            if (!formData[0]?.im_status || formData[0]?.im_status === "Saved") {
                              isShow = false
                            }
                          }
                          if (field.name == "fk_actual_work_branchid") {
                            if (formData[0]?.isactualbranchisexists) {
                              isShow = false;
                            }
                          }
                          else if (field.name == "actual_work_branch") {
                            if (!formData[0]?.isactualbranchisexists && !viewOnly) {
                              isShow = false;
                            }
                          }

                          // if (field.name == "fk_actual_work_branchid") {
                          //   if (formData[0]?.isSalesPersonsisexists) {
                          //     isShow = false;
                          //   }
                          // }
                          // else if (field.name == "actual_work") {
                          //   if (!formData[0]?.isSalesPersonsisexists) {
                          //     isShow = false;
                          //   }
                          // }
                        }
                        else if (moduleType === "purchase") {

                          if (field.name == "po_reject_remark") {
                            if (formData[0]?.po_status !== "Reject") {
                              isShow = false;
                            }
                          }
                          else if (
                            field.name == "fk_prev_po_details" && formData[0]?.po_no
                          ) {
                            isShow = false;
                          }
                        }
                        else if (moduleType === "purchaseReq") {

                          if (field.name == "req_remark") {
                            if (formData[0]?.req_status !== "Reject") {
                              isShow = false;
                            }
                          }
                        }

                        if (
                          OperationType === getVesselOperation("DS") &&
                          field.name === "jrf_header"
                        ) {
                          isShow = false;
                        }
                        if (
                          status == 'Edit' && moduleType === "operationCertificate" &&
                          field.name === "cert_number"
                        ) {
                          isViewOnly = true;
                        }
                        if (moduleType === "operationCertificate" && isCustomMode) {
                          if (['cc_is_hide_basis', 'cc_is_qty_display', 'jrf_header', 'jrf_bottom', 'cc_eia', 'cc_show_rounded_qty'].includes(field.name)) {
                            isShow = false;
                          }
                        }
                        else if (moduleType === "invoice") {

                          if (field.name == "fk_jrf_clientid") {

                            if (!formData[0]?.isClientisexists) {
                              isShow = false;
                            }
                          }
                          else if (["fk_client", "im_gst_invoice_number_client", "state_of_client"].includes(field.name)) {
                            if (formData[0]?.isClientisexists) {
                              isShow = false;
                            }
                          }
                          else if (field.name == "fk_actual_work_branchid") {
                            if (formData[0]?.isactualbranchisexists) {
                              isShow = false;
                            }
                          }
                          else if (field.name == "actual_work") {
                            if (!formData[0]?.isactualbranchisexists) {
                              isShow = false;
                            }
                          }
                          else if (field.name == "im_is_regular") {
                            if (formData[0]?.im_is_regular === "external") {
                              isShow = false;
                            }
                          }
                          else if (field.name == "im_remark") {
                            if (formData[0]?.im_status !== "cancelled") {
                              isShow = false;
                            }
                          }
                        }
                        else if (moduleType === "ShipmentForm") {

                          if (field.name === "loading_unloading_port_name" && !["Loading", "Unloading"].includes(formData[0]?.ji_is_loading)) {
                            isShow = false
                          }
                        }


                        return (
                          isShow && (
                            <div
                              key={"Form-Extra-Adjustments" + fieldIndex}
                              className={"col-md-" + field.width}
                            >

                              <RenderFields
                                field={getCustomCellValues(field)}
                                sectionIndex={sectionIndex}
                                fieldIndex={fieldIndex}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                ////For Group Assignment Only....
                                gaData={gaData}
                                setGaData={setGaData}
                                showModalGA={showModalGA}
                                setShowModalGA={setShowModalGA}
                                ////For Group Assignment Only....
                                ////For Master Data....
                                masterOptions={masterResponse}
                                ////For Master Data....
                                ////For View Status.....
                                viewOnly={isViewOnly}
                                actionClicked={actionClicked}
                                pdfUrl={pdfUrl}
                                setPdfUrl={setPdfUrl}
                                sharingPdfUrl={sharingPdfUrl}
                                IsPreviewUpload={IsPreviewUpload}
                                setSharingPdfUrl={setSharingPdfUrl}
                                setFormData={setFormData}
                                moduleType={moduleType}
                                isEditMode={moduleType == "invoice" ? true : EditRecordId && !editReordType ? true : false}
                              />
                              {isValideReferenceNo &&
                                field.name === "jrf_referenceno" ? (
                                <p className="text-danger errorMsg">
                                  {
                                    isValideReferenceNo
                                  }
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          )
                        );
                      })}
                      <PopupGA
                        showModalGA={showModalGA}
                        setShowModalGA={setShowModalGA}
                        staticData={section.fields}
                      />
                      {ViewDetailsButton(moduleType, sectionIndex, sectionIndex)}
                      {
                        ['stocks', 'purchaseItems'].includes(moduleType) && isCustomPopup && <CustomPopupModal isCustomPopup={isCustomPopup} setIsCustomPopup={setIsCustomPopup} handleConfirm={() => handleCommonCustomConfirmHandler({ formData, setFormData, setIsOverlayLoader, moduleType, setIsCustomPopup, fields: section.customField })} formData={formData} setFormData={setFormData} section={section.customField} />
                      }
                      <div className="submitBtn_container">
                        {moduleType == "invoice" && !viewOnly && !formData[0].im_id &&
                          (
                            <button
                              type="button"
                              onClick={(e) => {
                                handleInvoiceCreateOrUpdate(
                                  formData,
                                  formConfig,
                                  setIsOverlayLoader,
                                  setIsPopupOpen,
                                  jrfCreationType,
                                  navigate,
                                  setFormData,
                                  setTabOpen,
                                  "",
                                  masterResponse,
                                  handleSubmit,
                                  [],
                                  user
                                );
                              }}
                              className="saveBtn"
                            >
                              {formData[0].im_id ? "Update" : "Save"}

                            </button>
                          )}
                      </div>
                      {
                        // moduleSubType !== "vesselList" &&
                        <div className="submitBtn_container">
                          {pageType === "inward" &&
                            !formData[1]?.sampleInwardIdMain && (
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleInwardMainSubmit(
                                    e,
                                    formData,
                                    setSaveClicked,
                                    setTabOpen,
                                    setFormData,
                                    setIsOverlayLoader
                                  )
                                }
                                className="submitBtn"
                              >
                                Proceed
                              </button>
                            )}
                          {moduleType === "sampleverification" &&
                            !istavSaveClicked && (
                              <button
                                type="button"
                                onClick={() => handleSampleVerificationMainSubmit(formData, setIsOverlayLoader, getVerificationDetails)}
                                className="submitBtn"
                              >
                                {translate("common.saveBtn")}
                              </button>
                            )}
                          {moduleType === "sfm" && !viewOnly && !istavSaveClicked && (
                            <>
                              <Button
                                type="button"
                                className="saveBtn"
                                id="submit_btn1"
                                onClick={(e) =>
                                  navigate(
                                    `/testmemoList/testmemo?view=${encryptDataForURL(
                                      "view"
                                    )}&status=${encryptDataForURL(
                                      "testMemo"
                                    )}&testMemoId=${encryptDataForURL(formData[0]?.["fk_tmid"])}`
                                  )
                                }
                              >
                                View Test Memo
                              </Button>
                              <button
                                type="button"
                                onClick={(e) => handleSFMMainSubmit()}
                                className="submitBtn"
                              // disabled={saveClicked}
                              >
                                {translate("common.saveBtn")}
                              </button>

                            </>
                          )}
                          {/* formData[0]?.req_no ? 1 : "" */}
                          {
                            moduleType === "purchaseReq" && !viewOnly && !["Posted", "Sent for Approval"].includes(formData[0].req_status) && (
                              <>
                                {!formData[0]?.req_no &&
                                  <Button
                                    type="button"
                                    className="cancelBtn"
                                    onClick={() => navigate("/PurchRequistion")}
                                  >
                                    Back
                                  </Button>
                                }
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    handlePurchaseReqUpdateCreate(formData, handleSubmit, setIsOverlayLoader, navigate, 0, setFormData, setSubTableData, 0, "");

                                  }}
                                  className={`${formData[0]?.req_no ? " cancelBtn" : "submitBtn"}`}

                                >
                                  {formData[0]?.req_no ? "Update" : "Save"}
                                </button>
                              </>
                            )
                          }

                          {
                            moduleType === "purchase" && !viewOnly && (
                              <button
                                type="button"
                                onClick={(e) => handlePurchaseOrderCreateUpdate(formData, handleSubmit, setIsOverlayLoader, navigate, 1, setFormData, EditRecordId, setSubTableData, formData[0]?.req_no ? 1 : "")}
                                className={`${formData[0].po_no ? " saveBtn" : "submitBtn"}`}

                              >
                                {formData[0].po_no ? "Update" : "Save"}
                              </button>
                            )
                          }

                          {
                            moduleType === "tender" && sectionIndex === 3 && !viewOnly && (
                              <div className="tender-participant-div">
                                <button className="addParticipants" type="button" onClick={() => { addParticipantInTender(1) }}>+</button>
                                {" "}
                                {
                                  participantFields && <button className="addParticipants" type="button" onClick={() => { addParticipantInTender(0) }}>-</button> || null
                                }
                              </div>
                            )

                          }
                          {moduleType === "vesselJICertificate" &&
                            sectionIndex === 1 && (
                              <div className="operationCertificateBtns">
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
                              </div>
                            )}
                        </div>

                      }
                    </Row>
                  }

                  {viewDetail && (
                    <JIPopupModal
                      section={section}
                      sectionIndex={sectionIndex}
                      formData={formData}
                      handleFieldChange={handleFieldChange}
                      formErrors={formErrors}
                      setViewDetail={setViewDetail}
                      setIsOverlayLoader={setIsOverlayLoader}
                      isOverlayLoader={isOverlayLoader}
                    />
                  )}
                </CardBody>
              </Card>
            </div>
          )
      )}
      {renderModuleWiseButtons()}
      {/* {moduleType === "GroupAssignment" ? (
        <GroupAssignmentButtons
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          setInwardBtnchange={setInwardBtnchange}
          subTableData={subTableData}
          formData={formData}
          jrfId={jrfId}
          handleBackButtonFunction={handleBackButtonFunction}
          isDisplayNewAddOption={isDisplayNewAddOption}
        />
      ) : moduleType === "groupAssignmentPreview" ? (
        <GroupAssignmentPreviewButtons
          formData={formData}
          jrfId={jrfId}
          handleBackButtonFunction={handleBackButtonFunction}
        />
      ) : moduleType === "testmemomain" ? (
        <TestMemoButtons
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          setInwardBtnchange={setInwardBtnchange}
          viewOnly={viewOnly}
          role={user?.role}
          setIsRejectPopupOpen={setIsRejectPopupOpen}
          testMemoId={testMemoId}
          pageType={pageType}
          handleBackButtonFunction={handleBackButtonFunction}
          setIsOverlayLoader={setIsOverlayLoader}
        />
      ) : moduleType === "sampleverification" ? (
        istavSaveClicked && (
          <SampleVerificationButtons
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            handleSubmit={handleSubmit}
            saveClicked={saveClicked}
            tableData={subTableData}
            formData={formData}
            viewOnly={viewOnly}
            handleBackButtonFunction={handleBackButtonFunction}
            setSaveClicked={setSaveClicked}
          />
        )
      ) : moduleType === "allotment" ? (
        <AllotmentButtons
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          saveClicked={saveClicked}
          handleAllotValidate={handleAllotValidate}
          viewOnly={viewOnly}
          handleBackButtonFunction={handleBackButtonFunction}
          setIsOverlayLoader={setIsOverlayLoader}
        />
      ) : moduleType === "sampleinward" ? (
        <SampleInwardButtons
          action={action}
          tabOpen={tabOpen}
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          setInwardBtnchange={setInwardBtnchange}
          formData={formData}
          subTableData={subTableData}
          jrfId={jrfId}
          viewOnly={viewOnly}
          handleBackButtonFunction={handleBackButtonFunction}
        />
      ) : moduleType === "internalcertificate" ? (
        <InternalCertificateButtons
          action={action}
          tabOpen={tabOpen}
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          setInwardBtnchange={setInwardBtnchange}
          formData={formData}
          subTableData={subTableData}
          jrfId={jrfId}
          viewOnly={viewOnly}
          handleSubmit={handleSubmit}
          remarkText={remarkText}
          setSaveClicked={setSaveClicked}
          formConfig={formConfig}
          saveClicked={saveClicked}
          setIsRejectPopupOpen={setIsRejectPopupOpen}
          handleBackButtonFunction={handleBackButtonFunction}
          setIsOverlayLoader={setIsOverlayLoader}
          isValideValue={isValideValue}
        />
      ) : moduleType === "inwardChecklist" ? (
        <ViewCheckListButtons
          remarkText={remarkText}
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          setInwardBtnchange={setInwardBtnchange}
          formData={formData}
          setSaveClicked={setSaveClicked}
          formConfig={formConfig}
          saveClicked={saveClicked}
          setIsRejectPopupOpen={setIsRejectPopupOpen}
          viewOnly={viewOnly}
          handleBackButtonFunction={handleBackButtonFunction}
          setIsOverlayLoader={setIsOverlayLoader}
        />
      ) : moduleType === "sfm" ? (
        istavSaveClicked && (
          <SFMButtons
            setIsPopupOpen={setIsPopupOpen}
            setJRFCreationType={setJrfCreationType}
            handleSubmit={handleSubmit}
            saveClicked={saveClicked}
            formData={formData}
            viewOnly={viewOnly}
            testMemoSetData={testMemoSetData}
            handleBackButtonFunction={handleBackButtonFunction}
          />
        )
      ) : moduleType === "jobinstruction" ? (
        <JIButtons
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          handleSubmit={handleSubmit}
          viewOnly={viewOnly}
          handleBackButtonFunction={handleBackButtonFunction}
          action={action}
          tabOpen={tabOpen}
          setInwardBtnchange={setInwardBtnchange}
          formData={formData}
          subTableData={subTableData}
          EditRecordId={EditRecordId ? EditRecordId : formData[0]?.ji_id}
          editReordType={editReordType}
          navigate={navigate}
          setJrfCreationType={setJrfCreationType}
          formConfig={formConfig}
          setIsRejectPopupOpen={setIsRejectPopupOpen}
          setIsOverlayLoader={setIsOverlayLoader}
          useForComponent={useForComponent}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          testMemoSetData={testMemoSetData}
          isDisplayNewAddOption={isDisplayNewAddOption}
          isViewOnlyTable={isViewOnlyTable}
          operationStepNo={operationStepNo}
          OperationType={OperationType}
          OperationTypeID={OperationTypeID}
          parameterDataTableMain={parameterDataTableMain}
          isUseForManPower={formConfig?.sections[0]?.isUseForManPower}
          operationMode={operationMode}
          setSubTableData={setSubTableData}
          setFormData={setFormData}
          JRFTPIFormData={JRFTPIFormData}
          setMainJISaved={props.setMainJISaved}
          isMainJiSaved={props.isMainJiSaved}
          setTabOpen={setTabOpen}
          labDropDownOptions={labDropDownOptions}
          allSampleIds={props.allSampleIds}
          setIsCancelPopupOpen={setIsCancelPopupOpen}
          isRakeDetails={isRakeDetails}
        />
      ) : moduleType === "operationCertificate" ? (
        <>

          <OperationCertificateButtons
            status={status}
            moduleSubType={moduleSubType}
            RPCID={RPCID}
            encryptDataForURL={encryptDataForURL}
            EditRecordId={EditRecordId}
            JISID={JISID}
            previewCertificate={previewCertificate}
            generateCertificate={generateCertificate}
            isValideValue={isValideValue}
            handleShareFile={handleShareFile}
            EditGeneratedCertificate={EditGeneratedCertificate}
            OperationType={OperationType}
            resendShareFile={resendShareFile}
            operationMode={operationMode}
            isCustomMode={isCustomMode}
            setUploadPopup={setUploadPopup}
            setPopupType={setPopupType}
            formData={formData}
          />
        </>
      ) : moduleType === "commercialCertificatePreview" ? (
        <CommercialCertificateButtons
          useFor={useFor}
          status={status}
          ApproveCertificate={ApproveCertificate}
          handlePublish={handlePublish}
          sendForApproval={sendForApproval}
          IsPreviewUpload={IsPreviewUpload}
          setIsPreviewUpload={setIsPreviewUpload}
          dailyReportInDocument={dailyReportInDocument}
          setIsRejectPopupOpen={setIsRejectPopupOpen}
        />
      ) : ['invoicePreview', 'documentPreview'].includes(moduleType) ? (
        <InvoicePreviewButtons
          useFor={useFor}
          status={status}
          ApproveCertificate={ApproveCertificate}
          handlePublish={handlePublish}
          sendForApproval={sendForApproval}
          IsPreviewUpload={IsPreviewUpload}
          setIsPreviewUpload={setIsPreviewUpload}
          dailyReportInDocument={dailyReportInDocument}
          moduleType={moduleType}
        />
      ) : moduleType === "jrf" ? (
        <JRFButtons
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          handleSubmit={handleSubmit}
          viewOnly={viewOnly}
          handleBackButtonFunction={handleBackButtonFunction}
          formData={formData}
          setIsOverlayLoader={setIsOverlayLoader}
        />
      ) : moduleType === "consortiumorder" ? (
        <ConsortiumButton
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          handleSubmit={handleSubmit}
          viewOnly={viewOnly}
          handleBackButtonFunction={handleBackButtonFunction}
        />
      ) : moduleType === "auditBranchExpenses" ? (
        <div>Audit functionality removed</div>
      ) : moduleType === "auditSalesRegister" ? (
        <div>Sales register functionality removed</div>
      ) : moduleType === "auditOutstanding" ? (
        <div>Outstanding functionality removed</div>
      ) : moduleType === "jobCosting" ? (
        <JobCostingButton
          status={status}
          formData={formData}
          formConfig={formConfig}
          viewOnly={viewOnly}
          setFormData={setFormData}
          EditRecordId={EditRecordId}
          setIsOverlayLoader={setIsOverlayLoader}
        />
      ) : (moduleType === "invoice" && formData[0].im_id) ? (
        <InvoiceButton
          setIsPopupOpen={setIsPopupOpen}
          setJRFCreationType={setJrfCreationType}
          handleSubmit={handleSubmit}
          viewOnly={viewOnly}
          navigate={navigate}
          formData={formData}
          formConfig={formConfig}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          setTabOpen={setTabOpen}
          setIsRejectPopupOpen={setIsRejectPopupOpen}
          setIsCancelPopupOpen={setIsCancelPopupOpen}
          masterResponse={masterResponse}
          user={user}
          subTableData={subTableData}
        />
      ) : ["purchase", "PoPreview"].includes(moduleType) ? (
        <PurchaseButtons
          formData={formData}
          handleSubmit={handleSubmit}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          viewOnly={viewOnly}
          setPopupAddPurchaseReq={setPopupAddPurchaseReq}
          // editableIndex={editableIndex}
          // setEditableIndex={setEditableIndex}
          setTableData={setSubTableData}
          section={formConfig?.sections[0]}
          setIsRejectPopupOpen={setIsRejectPopupOpen}
          moduleType={moduleType}
        />
      ) : moduleType === "purchaseReq" ? (
        <PurchaseRequistionButtons
          formData={formData}
          handleSubmit={handleSubmit}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          viewOnly={viewOnly}
          setPopupAddPurchaseReq={setPopupAddPurchaseReq}
          // editableIndex={editableIndex}
          // setEditableIndex={setEditableIndex}
          setTableData={setSubTableData}
          moduleType={moduleType}
          section={formConfig?.sections[0]}
          setIsRejectPopupOpen={setIsRejectPopupOpen}
        />
      ) : moduleType === "calibration" ? (
        <CalibrationsButtons
          formData={formData}
          handleSubmit={handleSubmit}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          viewOnly={viewOnly}
        />
      ) : moduleType === "supplier" ? (
        <SupplierButtons
          formData={formData}
          handleSubmit={handleSubmit}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          viewOnly={viewOnly}
        />
      ) : moduleType === "tender" ? (
        <TenderButton
          formData={formData}
          handleSubmit={handleSubmit}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          viewOnly={viewOnly}
          participantFields={participantFields}
        />
      ) : moduleType === "stocks" ? (
        <ChemicalStocksButtons
          formData={formData}
          handleSubmit={handleSubmit}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          viewOnly={viewOnly}
        />
      ) : moduleType === "incentives" ? (
        <IncentiveButton
          formData={formData}
          handleSubmit={handleSubmit}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          viewOnly={viewOnly}
        />
      ) : moduleType === "feedback" ? (
        <FeedbackButton
          formData={formData}
          handleSubmit={handleSubmit}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          viewOnly={viewOnly}
        />
      ) : moduleType === "purchaseItems" ? (
        EditRecordId={EditRecordId}
        setIsOverlayLoader={setIsOverlayLoader}
      />) : (moduleType === "invoice" && formData[0].im_id) ? (<InvoiceButton
        setIsPopupOpen={setIsPopupOpen}
        setJRFCreationType={setJrfCreationType}
        handleSubmit={handleSubmit}
        viewOnly={viewOnly}
        navigate={navigate}
        formData={formData}
        formConfig={formConfig}
        setIsOverlayLoader={setIsOverlayLoader}
        setFormData={setFormData}
        setTabOpen={setTabOpen}
        setIsRejectPopupOpen={setIsRejectPopupOpen}
        setIsCancelPopupOpen={setIsCancelPopupOpen}
        masterResponse={masterResponse}
        user={user}
        subTableData={subTableData}
      />
      ) : ["purchase", "PoPreview"].includes(moduleType) ? (<PurchaseButtons
        formData={formData}
        handleSubmit={handleSubmit}
        setIsOverlayLoader={setIsOverlayLoader}
        setFormData={setFormData}
        viewOnly={viewOnly}
        setPopupAddPurchaseReq={setPopupAddPurchaseReq}
        // editableIndex={editableIndex}
        // setEditableIndex={setEditableIndex}
        setTableData={setSubTableData}
        section={formConfig?.sections[0]}
        setIsRejectPopupOpen={setIsRejectPopupOpen}
        moduleType={moduleType}
      />) : moduleType === "purchaseReq" ? (<PurchaseRequistionButtons
        formData={formData}
        handleSubmit={handleSubmit}
        setIsOverlayLoader={setIsOverlayLoader}
        setFormData={setFormData}
        viewOnly={viewOnly}
        setPopupAddPurchaseReq={setPopupAddPurchaseReq}
        // editableIndex={editableIndex}
        // setEditableIndex={setEditableIndex}
        setTableData={setSubTableData}
        moduleType={moduleType}
        section={formConfig?.sections[0]}
        setIsRejectPopupOpen={setIsRejectPopupOpen}
      />) : moduleType === "calibration" ? (<CalibrationsButtons
        formData={formData}
        handleSubmit={handleSubmit}
        setIsOverlayLoader={setIsOverlayLoader}
        setFormData={setFormData}
        viewOnly={viewOnly}
      />) : moduleType === "supplier" ? (<SupplierButtons
        formData={formData}
        handleSubmit={handleSubmit}
        setIsOverlayLoader={setIsOverlayLoader}
        setFormData={setFormData}
        viewOnly={viewOnly}
      />) : moduleType === "tender" ? (<TenderButton
        formData={formData}
        handleSubmit={handleSubmit}
        setIsOverlayLoader={setIsOverlayLoader}
        setFormData={setFormData}
        viewOnly={viewOnly}
        participantFields={participantFields}
      />) : moduleType === "stocks" ? (<ChemicalStocksButtons
        formData={formData}
        handleSubmit={handleSubmit}
        setIsOverlayLoader={setIsOverlayLoader}
        setFormData={setFormData}
        viewOnly={viewOnly}
      />) : moduleType === "incentives" ? (<IncentiveButton
        formData={formData}
        handleSubmit={handleSubmit}
        setIsOverlayLoader={setIsOverlayLoader}
        setFormData={setFormData}
        viewOnly={viewOnly}
      />) : moduleType === "feedback" ? (<FeedbackButton
        formData={formData}
        handleSubmit={handleSubmit}
        setIsOverlayLoader={setIsOverlayLoader}
        setFormData={setFormData}
        viewOnly={viewOnly}
      />) : moduleType === "purchaseItems" ? (
        <PurchaseItemButton
          formData={formData}
          handleSubmit={handleSubmit}
          setIsOverlayLoader={setIsOverlayLoader}
          setFormData={setFormData}
          viewOnly={viewOnly}
        />
      ) : null} */}
      {/* <button>Share</button> */}

      {isPopupOpen && openDeletePopup()}
      {isRejectPopupOpen && openRejectModal()}

      {formConfig.listView ? (
        <Card>
          <CardBody className={`list_body ${["dashboard"].includes(listModuleType) ? 'dashb-main-list-body' : ''}`}>
            <CardTitle tag="h5" className="list_title">
              <div className="list_breadcrumb">
                {formConfig?.breadcom?.map((title, i) => {
                  if (listModuleType === "invoice") {
                    if (i == 0) {
                      if (user?.role === "LR") {
                        title = {
                          ...title,
                          title: "LMS"
                        }
                      }
                      else {
                        title = {
                          ...title,
                          title: "Operation"
                        }
                      }
                    }
                  }
                  return <span key={"form-breadcom-main-" + i}>
                    {i === 0 ? null : (
                      <i
                        className="bi bi-chevron-right card-title-icon"
                        key={"form-breadcom-icon" + i}
                      ></i>
                    )}{" "}
                    {title.title}
                  </span>
                })}
              </div>

              {listModuleType !== "confirugationCertificate" && (
                <div className="jrf_container">
                  <div className="jrf_container_btns">
                    {
                      ["dashboard"].includes(listModuleType) &&
                      <>
                        <div
                          className={customFilterData?.[1]?.end_date ? "col-md-4" : "col-md-6"}
                        >
                          <RenderFields
                            field={{
                              "name": "from_date",
                              "secondName": "end_date",
                              "placeholder": "From date",
                              "type": "doubleText",
                              "label": "Date Range",
                              "firstType": "date",
                              "secondType": "date",
                              "fieldWidth": 100,
                              "firstnoDefaultValue": true,
                              "secondnoDefaultValue": true,
                              "firstNoRestrictionApply": true,
                            }}
                            sectionIndex={1}
                            fieldIndex={1}
                            formData={customFilterData}
                            handleFieldChange={(sectionIndex, fieldName, value) => {
                              setCustomFilterData((prevFormData) => {
                                return {
                                  ...prevFormData,
                                  [sectionIndex]: {
                                    ...prevFormData[sectionIndex],
                                    [fieldName]: value,
                                    ['isClearDate']: false
                                  },
                                };
                              });
                            }}
                          />
                        </div>
                        {
                          customFilterData?.[1]?.end_date && <button
                            type="button"
                            className="searchby_button clearBtnList"
                            onClick={() => {
                              setCustomFilterData((prevFormData) => {
                                return {
                                  ...prevFormData,
                                  [1]: {
                                    ...prevFormData[1],
                                    ['from_date']: '',
                                    ['end_date']: '',
                                    ['isClearDate']: true,
                                  },
                                };
                              });
                            }}
                          >
                            Clear
                          </button>
                        }
                      </>
                    }

                    {!["feedback"].includes(listModuleType) &&
                      <div className="formSearch">
                        <i className="bi bi-search"></i>
                        <input
                          type="search"
                          placeholder="Search"
                          value={searchTerm}
                          onChange={(e) => searchAPI(e.target.value)}
                        />
                      </div>}
                    <div className="jrf_container_btns_main">

                      {!(["dashboard", "feedback", "ClientDetails"].includes(listModuleType) || ['PaymentDetails'].includes(listSubModuleType)) &&
                        <button
                          type="button"
                          className="searchby_button"
                          onClick={() => setSearchby(!searchby)}
                        >
                          {/* <img src={SearchIcon}></img> */}
                          <i className="bi bi-search"></i>
                          Advanced Search
                        </button>
                      }

                      {isFilterBtnClicked && (
                        <>
                          <button
                            type="button"
                            className="searchby_button"
                            onClick={() => clearFilterData()}
                          >
                            Clear Filter
                          </button>
                        </>)}
                      {isShowExportButtonShow() && (
                        <button
                          type="button"
                          className="searchby_button"
                          onClick={() => getAllListingDataExports()}
                        >
                          {["jrf"].includes(listModuleType) ? "Export Submitted Samples" : "Export"}
                        </button>
                      )}

                      {["jrf"].includes(listModuleType) &&
                        isModuelePermission(
                          rolePermissions,
                          listModuleType,
                          "add"
                        ) ? ['BU'].includes(user?.role) ? null : (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                user?.role === "LR"
                                  ? "/jrfListing/external-jrf"
                                  : "/jrfListing/jrf"
                              )
                            }
                            className="create_button"
                          >
                            <i className="bi bi-plus-lg"></i>
                            {translate("common.createBtn")}
                          </button>
                        ) : null}
                      {(["invoice"].includes(listSubModuleType)) && ['LR', 'BU'].includes(user?.role) &&
                        (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                "/operation/invoice-listing/advance-invoice" + `?type=${encryptDataForURL("Advance")}`
                              )
                            }
                            className="create_button create_button_payment"
                          >
                            <i class="bi bi-currency-rupee"></i>
                            Create Invoice
                          </button>
                        )}
                      {["jobinstruction"].includes(listModuleType) &&
                        user?.role == "OPS_ADMIN" &&
                        isModuelePermission(
                          rolePermissions,
                          listModuleType,
                          "add"
                        ) ? (
                        <button
                          type="button"
                          onClick={() => {
                            // localStorage.setItem('isMainScopeWork','');
                            dispatch({
                              type: "MAIN_SCOPE_WORK",
                              isMainScopeWork: ""
                            });
                            navigate(
                              "/operation/jrfInstructionListing/job-instruction"
                            )
                          }
                          }
                          className="create_button"
                        >
                          <i className="bi bi-plus-lg"></i>
                          {translate("common.createBtn")}
                        </button>
                      ) : null}
                      {["consortiumorder"].includes(listModuleType) &&
                        isModuelePermission(
                          rolePermissions,
                          listModuleType,
                          "add"
                        ) ? (
                        <button
                          type="button"
                          onClick={() => {
                            navigate(
                              "/operation/consortiums-list/consortium"
                            )
                          }
                          }
                          className="create_button"
                        >
                          <i className="bi bi-plus-lg"></i>
                          {translate("common.createBtn")}
                        </button>
                      ) :

                        ["auditSalesRegister", "auditBranchExpenses", "auditOutstanding"].includes(listModuleType) ?
                          <button
                            type="button"
                            onClick={() => {
                              navigate(

                                listModuleType === "auditSalesRegister" ? "/audit/auditSalesRegisterForm"
                                  :
                                  listModuleType === "auditBranchExpenses" ? "/audit/auditBranchExpenseForm"
                                    :
                                    listModuleType === "auditOutstanding" ? "/audit/auditOutstandingForm"
                                      : null

                              )
                            }
                            }
                            className={listModuleType == "auditOutstanding" ? "create_button_outstanding" : "create_button"}
                          >
                            <i className="bi bi-plus-lg"></i>
                            {
                              listModuleType === "auditSalesRegister" ? "Register"
                                :
                                listModuleType === "auditBranchExpenses" ? "Expense"
                                  :
                                  listModuleType === "auditOutstanding" ? "Outstanding"
                                    : null
                            }
                          </button>
                          :
                          listModuleType === "purchaseReq" ?
                            getPurchaseManager(listModuleType, "add") &&

                            <button
                              type="button"
                              className="create_button"
                              onClick={
                                () => {
                                  navigate("/PurchRequistion/PurchaseRequistionForm")
                                }
                              }
                            >
                              +  Purchase Requistion
                            </button>
                            :

                            listModuleType === "calibration" ?
                              getPurchaseManager(listModuleType, "add") && <>

                                <button
                                  type="button"
                                  className="create_button"
                                  onClick={
                                    () => {
                                      navigate("/calibrationList/calibrationForm")
                                    }
                                  }
                                >
                                  + Calibration
                                </button>

                              </>
                              :
                              listModuleType === "supplier" ?

                                getPurchaseManager(listModuleType, "add") && <button
                                  type="button"
                                  className="create_button"
                                  onClick={
                                    () => {
                                      navigate("/supplierList/supplierForm")
                                    }
                                  }
                                >
                                  + Supplier
                                </button> :
                                listModuleType === "tender" ?

                                  <button
                                    type="button"
                                    className="create_button"
                                    onClick={
                                      () => {
                                        navigate("/tenderList/tenderForm")
                                      }
                                    }
                                  >
                                    +    Tender

                                  </button>

                                  :
                                  listModuleType === "stocks" ?

                                    getPurchaseManager(listModuleType, "add") && <button
                                      type="button"
                                      className="create_button"
                                      onClick={
                                        () => {
                                          navigate("/chemicalStocks/chemicalStocksForm")
                                        }
                                      }
                                    >
                                      +  Stocks
                                    </button>
                                    :
                                    // listModuleType === "incentives" ?
                                    //   <button
                                    //     type="button"
                                    //     className="create_button"
                                    //     onClick={
                                    //       () => {
                                    //         navigate("/incentivesList/incentivesForm")
                                    //       }
                                    //     }
                                    //   >
                                    //     +  Incentive
                                    //   </button>
                                    //   :
                                    listModuleType === "feedback" ?
                                      <button
                                        type="button"
                                        className="createfeedback_button"
                                        onClick={
                                          () => {
                                            navigate("/feedbackListList/feedbackListForm")
                                          }
                                        }
                                      >
                                        Add Feedback
                                      </button>
                                      : listModuleType === "purchaseItems" ?
                                        getPurchaseManager(listModuleType, "add") && <>

                                          <button
                                            type="button"
                                            className="create_button"
                                            onClick={
                                              () => {
                                                navigate("/itemlist/item")
                                              }
                                            }
                                          >
                                            + Create
                                          </button>

                                        </>
                                        :
                                        listModuleType === "category" ?
                                          getPurchaseManager(listModuleType, "add") && <>

                                            <button
                                              type="button"
                                              className="create_button"
                                              onClick={
                                                () => {
                                                  navigate("/categorylist/categoryForm")
                                                }
                                              }
                                            >
                                              + Create

                                            </button>
                                          </>
                                          :
                                          listModuleType === "purchase" ?
                                            getPurchaseManager(listModuleType, "add") && <>

                                              <button
                                                type="button"
                                                className="create_button"
                                                onClick={
                                                  () => {
                                                    getAllListingDataExports('', '', purchaseOrderInsuranceDownload, 'Insurance');
                                                  }
                                                }
                                              >
                                                Export Insurance

                                              </button>
                                              <button
                                                type="button"
                                                className="create_button"
                                                onClick={
                                                  () => {
                                                    getAllListingDataExports('', '', purchaseOrderVenRatingDownload, 'Vendor Rating');
                                                  }
                                                }
                                              >
                                                Export Vend. Rating

                                              </button>

                                            </>
                                            :
                                            listModuleType === "ShipmentList" ?
                                              <button
                                                type="button"
                                                className="createfeedback_button"
                                                onClick={
                                                  () => {
                                                    navigate("/shipment/shipmentForm")
                                                  }
                                                }
                                              >
                                                + Shipment
                                              </button>
                                              :
                                            listModuleType === "marketPlaceListing" ?
                                              <button
                                                type="button"
                                                className="createfeedback_button"
                                                onClick={
                                                  () => {
                                                    navigate("/market/marketForm/")
                                                  }
                                                }
                                              >
                                                + MarketPlace
                                              </button>
                                              :
                                              null
                      }
                    </div>

                    {searchby && (
                      <PopupSearch
                        setSearchby={setSearchby}
                        searchConfigJson={searchConfigJson}
                        filterIndex={filterIndex}
                        handleSearchFilter={handleSearchFilter}
                        searchFormData={searchFormData}
                        searchFormDataType={searchFormDataType}
                        setFilterIndex={setFilterIndex}
                        setSearchFormDataErros={setSearchFormDataErros}
                        searchFormDataErros={searchFormDataErros}
                        setSearchFormData={setSearchFormData}
                        getAllListingData={getAllListingData}
                        setisFilterBtnclicked={setIsFilterBtnClicked}
                        user={user}
                        moduleType={listModuleType}
                      />
                    )}

                  </div>
                </div>
              )}
            </CardTitle>
            {listSubModuleType === "tally" &&
              <RenderTallyListSection />
            }

            {listSubModuleType !== "tally" && (isModuelePermission(rolePermissions, listModuleType, "view") ||
              ["TPIMain", "auditBranchExpenses", "auditSalesRegister", "auditOutstanding", "jobCosting", "purchaseReq", "purchase", "supplier", "calibration", "tender", "dashboard", "stocks", "incentives", "feedback", 'purchaseItems', "category", 'ClientDetails', 'PaymentDetails', "ShipmentList","marketPlaceListing"].includes(listModuleType) || (["BH", "OPS_ADMIN", "SU", "CP"].includes(user?.role) && isModuelePermission(rolePermissions, 'commercialcertificate', "view"))) && (
                <RenderListSection
                  section={formConfig.listView}
                  sectionIndex={1}
                  actions={formConfig.listView.actions}
                  responseData={response}
                  getAllListingData={getAllListingData}
                  formConfig={formConfig}
                  setFormData={setFormData}
                  statusCounts={statusCounts}
                  setIsRejectPopupOpen={setIsRejectPopupOpen}
                  setJRFCreationType={setJrfCreationType}
                  setIsPopupOpen={setIsPopupOpen}
                  loadingTable={loadingTable}
                  setLoadingTable={setLoadingTable}
                  setIsOverlayLoader={setIsOverlayLoader}
                  kpiValue={kpiValue}
                  setKpiValue={setKpiValue}
                  searchFormData={searchFormData}
                  setSearchFormData={setSearchFormData}
                  handleSearchFilter={handleSearchFilter}
                  formData={formData}
                  OperationType={OperationType}
                  handleSubmit={handleSubmit}
                  setSubTableData={setSubTableData}
                  isFiltered={isFiltered}
                  setIsFiltered={setIsFiltered}
                  customFilterData={customFilterData}
                  setCustomFilterData={setCustomFilterData}
                  sizeofPage={sizeofPage}
                  setSizeOfPage={setSizeOfPage}
                  setIsCustomPopup={setIsCustomPopup}
                  isCustomPopup={isCustomPopup}
                  getAllListingDataExports={getAllListingDataExports}
                  setResponse={setResponse}
                />

              )}
          </CardBody>
        </Card>
      ) : null}
    </form>
  ) : (
    <>
      {(isOverlayLoader || isStatusCountCalled) && <OverlayLoading />}
      <Loading LoadingText={LoadingText} />
    </>
  );
};

Forms.propTypes = {
  formConfig: PropTypes.object,
  masterResponse: PropTypes.object,
  getSampleIdsMasterData: PropTypes.func,
  searchConfigJson: PropTypes.object,
  getAssignmentMasterData: PropTypes.func,
  setTestMemoId: PropTypes.func,
  testMemoId: PropTypes.string,
  testReportPrweview: PropTypes.any, // Adjust based on the actual type or shape
  isExternalJRF: PropTypes.bool,
  isRegularJRF: PropTypes.bool,
  totalSamples: PropTypes.number,
  setMasterResponse: PropTypes.func,
  useForComponent: PropTypes.string,
  isViewOnlyTable: PropTypes.string,
};

export default Forms;