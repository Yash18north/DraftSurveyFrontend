import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import PublicRoute from "./PublicRoute.js";
import CategoryList from "../views/Purchase/Category/CategoryList.js";
import CategoryForm from "../views/Purchase/Category/CategoryForm.js";

// import PageNotFound from "../views/PageNotFound.js";

// import TestReportList from "../views/lms/TestReportList.js";
// import ExternalJrf from "../views/lms/ExternalJrf.js";
// import ExternalJRFApprovalPage from "../layouts/externalApprovalPage.js";
// import JrfInstructionListing from "../views/operations/JrfInstructionListing.js";
// import JrfInstruction from "../views/operations/jrfInstruction.js";
// import JfInstructionAnalys from "../views/operations/JfInstructionAnalys.js";
// import JfInstructionNomination from "../views/operations/JfInstructionNomination.js";
// import vesselJIList from "../views/operations/vessel/vesselJIList.js";
// import truckList from "../views/operations/vessel/truckList.js";
// import rakeList from "../views/operations/vessel/rakeList.js";
// import stackList from "../views/operations/vessel/stackList.js";
// import vesselJIEdit from "../views/operations/vessel/vesselJIEdit.js";
// import vesselList from "../views/operations/vessel/vesselList.js";
// import VesselJIDetais from "../views/operations/vessel/vesselJIDetais.js";

// import TMLAnalysisOperations from "../views/operations/vessel/vesselOperations/TMLAnalysisOperations.js";
// import OperationCertificate from "../views/operations/vessel/OperationCertificate.js";
// import OtherTPIOperation from "../views/operations/vessel/otherTPIOperation.js";
// import Support from "../views/Support.js";
// import JIManPower from "../views/operations/JIManPower.js";
// import OtherTPIList from "../views/operations/OtherTPIList.js";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const Login = lazy(() => import("../layouts/login.js"));
const LoginOTP = lazy(() => import("../layouts/loginOTP.js"));
const ForgotPassword = lazy(() => import("../layouts/forgotPassword.js"));

/***** Pages ****/

const JrfListing = lazy(() => import("../views/lms/JrfListing.js"));

const Jrf = lazy(() => import("../views/lms/jrfReport.js"));
const ModuleHistory = lazy(() => import("../views/lms/moduleHistory.js"));
const TestReportPreview = lazy(() => import("../views/lms/TestReportPreview.js"));
const TestReportPreviewPDF = lazy(() => import("../views/lms/TestReportPreviewPDF.js"));
const InwardList = lazy(() => import("../views/lms/InwardList.js"));
const AllotmentList = lazy(() => import("../views/lms/AllotmentList.js"));
const VerificationList = lazy(() => import("../views/lms/VerificationList.js"));
const InwardForm = lazy(() => import("../views/lms/InwardForm.js"));
const InternalCertificate = lazy(() =>
  import("../views/lms/InternalCertificate.js")
);
const SampleVerification = lazy(() =>
  import("../views/lms/SampleVerification")
);
const InwardCheckListForm = lazy(() =>
  import("../views/lms/InwardCheckListForm.js")
);
const SampleAssignment = lazy(() => import("../views/lms/SampleAssignment.js"));

const GroupAssignmentPreview = lazy(() =>
  import("../views/lms/GroupAssignmentPreview.js")
);
const DocumentViewer = lazy(() =>
  import("../views/Document/DocView.js")
);
const DocumentFolderViewer = lazy(() =>
  import("../views/Document/DocFolderView.js")
);
const OperationDetails = lazy(() =>
  import("../views/operations/CommonOPS/ActivityOperations/OperationDetails.js")
);
const OperationAnalysisDetails = lazy(() =>
  import("../views/operations/CommonOPS/ActivityOperations/OperationAnalysisDetails.js")
);
// const TMLOperations = lazy(() =>
//   import("../views/operations/vessel/vesselOperations/TMLOperations.js")
// );
const ConfirugationCertificateList = lazy(() =>
  import("../views/operations/vessel/vesselOperations/OperationCertificateList.js")
);
const CommercialCertificateList = lazy(() =>
  import("../views/operations/vessel/vesselOperations/CommercialCertificateList.js")
);
const JICommercialCertificateList = lazy(() =>
  import("../views/operations/vessel/vesselOperations/JICommercialCertificateList.js")
);

const ShareFiles = lazy(() =>
  import("../views/operations/vessel/vesselOperations/ShareFiles.js")
);
const CommercialCertificatePreview = lazy(() =>
  import("../views/operations/vessel/vesselOperations/CommercialCertificatePreview.js")
);


const ConfirugationCertificate = lazy(() =>
  import("../views/operations/vessel/vesselOperations/OperationCertificate.js")
);


const TestMemoPDF = lazy(() => import("../views/lms/TestMemoPDF.js"));
const SFMPDF = lazy(() => import("../views/lms/SFMPDF.js"));
const TestMemo = lazy(() => import("../views/lms/TestMemo.js"));
const Sfm = lazy(() => import("../views/lms/SFM.js"));
const Allotment = lazy(() => import("../views/lms/Allotment.js"));

const TestMemoList = lazy(() => import("../views/lms/TestMemoList.js"));
const SfmList = lazy(() => import("../views/lms/SFMList.js"));
const JRFPdfDownLoad = lazy(() => import("../views/lms/JRFPdfDownLoad.js"));
const ModuleDocument = lazy(() =>
  import("../views/Document/Document.js")
);
const PageNotFound = lazy(() => import("../views/PageNotFound.js"));
const FeedbackFormGlobal = lazy(() => import("../views/FeedbackFormGlobal.js"));
const TestReportList = lazy(() => import("../views/lms/TestReportList.js"));
const ExternalJrf = lazy(() => import("../views/lms/ExternalJrf.js"));
const ExternalJRFApprovalPage = lazy(() => import("../layouts/externalApprovalPage.js"));
const JrfInstructionListing = lazy(() => import("../views/operations/JrfInstructionListing.js"));
const JrfInstruction = lazy(() => import("../views/operations/jrfInstruction.js"));
const JfInstructionAnalys = lazy(() => import("../views/operations/JfInstructionAnalys.js"));
const JfInstructionNomination = lazy(() => import("../views/operations/JfInstructionNomination.js"));
// const vesselJIList = lazy(() => import("../views/operations/vessel/vesselJIList.js"));
const OperationJIList = lazy(() => import("../views/operations/CommonOPS/OperationJIList.js"));
const OperationActivityList = lazy(() => import("../views/operations/CommonOPS/OperationActivityList.js"));
const TruckJiList = lazy(() => import("../views/operations/truck/TruckJiList.js"));
const RakeJIList = lazy(() => import("../views/operations/rake/RakeJIList.js"));
const RakeList = lazy(() => import("../views/operations/rake/RakeList.js"));
const RakeOperations = lazy(() =>
  import("../views/operations/rake/RakeOperations/RakeOperations.js")
);
const TruckOperations = lazy(() =>
  import("../views/operations/truck/TruckOperations/TruckOperations.js")
);
const StackOperations = lazy(() =>
  import("../views/operations/stack/StackOperations/StackOperations.js")
);
const TruckAnalysisOperations = lazy(() => import("../views/operations/truck/TruckOperations/TruckAnalysisOperations.js"));
const RakeAnalysisOperations = lazy(() => import("../views/operations/rake/RakeOperations/RakeAnalysisOperations.js"));
const StackAnalysisOperations = lazy(() => import("../views/operations/stack/StackOperations/StackAnalysisOperations.js"));
const StackJIList = lazy(() => import("../views/operations/stack/StackJIList.js"));
const StackList = lazy(() => import("../views/operations/stack/StackList.js"));
const vesselJIEdit = lazy(() => import("../views/operations/vessel/vesselJIEdit.js"));
const vesselList = lazy(() => import("../views/operations/vessel/vesselList.js"));
const TruckList = lazy(() => import("../views/operations/truck/truckList.js"));

const VesselJIDetais = lazy(() => import("../views/operations/vessel/vesselJIDetais.js"));
const TruckJIDetails = lazy(() => import("../views/operations/truck/TruckJIDetails.js"));
const VesselJIDetaisView = lazy(() => import("../views/operations/vessel/vesselJIDetaisView.js"));
const TMLAnalysisOperations = lazy(() => import("../views/operations/vessel/vesselOperations/TMLAnalysisOperations.js"));
const OperationCertificate = lazy(() => import("../views/operations/vessel/OperationCertificate.js"));
const OtherTPIOperation = lazy(() => import("../views/operations/vessel/otherTPIOperation.js"));
const Support = lazy(() => import("../views/Support.js"));
const ReleaseNotes = lazy(() => import("../views/ReleaseNotes.js"));
const JIManPower = lazy(() => import("../views/operations/JIManPower.js"));
const OtherTPIList = lazy(() => import("../views/operations/OtherTPIList.js"));
//Plant Functions
const PlantJIList = lazy(() => import("../views/operations/plant/PlantJIList.js"));
const PlantList = lazy(() => import("../views/operations/plant/PlantList.js"));
const PlantJIDetails = lazy(() => import("../views/operations/plant/PlantJIDetails.js"));
const OtherJIDetails = lazy(() => import("../views/operations/other/OtherJIDetails.js"));
const PlantOperations = lazy(() => import("../views/operations/plant/PlantOperations/PlantOperations.js"));
const PlantAnalysisOperations = lazy(() => import("../views/operations/plant/PlantOperations/PlantAnalysisOperations.js"));


const ConsortiumList = lazy(() => import("../views/operations/consortium/ConsortiumList.js"));
const ConsortiumAdd = lazy(() => import("../views/operations/consortium/ConsortiumAdd.js"));

// Srushti 


// Calibration
const CalibrationForm = lazy(() => import("../views/Purchase/Calibration/CalibrationForm.js"));
const CalibrationList = lazy(() => import("../views/Purchase/Calibration/CalibrationList.js"))
// Purchase
const PurchasingList = lazy(() => import("../views/Purchase/PurchaseListing/PurchasingList.js"));
const PurchasingForm = lazy(() => import("../views/Purchase/PurchaseListing/PurchasingForm.js"));
const PurchasingOrderPreview = lazy(() => import("../views/Purchase/PurchaseListing/PurchaseOrderPreview.js"));
const PurchaseorderDocumentList = lazy(() => import("../views/Purchase/PurchaseListing/PurchaseorderDocumentList.js"));

// Purchase Req
const PurchaseRequistionList = lazy(() => import("../views/Purchase/PurchaseRequsition/PurchaseRequistionList.js"));
const PurchaseRequistionForm = lazy(() => import("../views/Purchase/PurchaseRequsition/PurchaseRequsitionForm.js"));
const PurchasereqDocumentList = lazy(() => import("../views/Purchase/PurchaseRequsition/PurchaseReqDocumentList.js"));

// Suppliers
const SupplierList = lazy(() => import("../views/Purchase/SupplierList/SupplierList.js"));
const SupplierForm = lazy(() => import("../views/Purchase/SupplierList/SupplierForm.js"));

// Items
const ItemList = lazy(() => import("../views/Purchase/Items/ItemList.js"))
const ItemsForm = lazy(() => import("../views/Purchase/Items/ItemsForm.js"));
const ItemDocument = lazy(() => import("../views/Purchase/Items/ItemDocument.js"));
// Category 
const CategoriesList = lazy(() => import("../views/Purchase/Category/CategoryList.js"))
const CategoriesForm = lazy(() => import("../views/Purchase/Category/CategoryForm.js"));

// Tender 
const TenderList = lazy(() => import("../views/Tender/TenderList.js"));
const TenderForm = lazy(() => import("../views/Tender/TenderForm.js"));
const TenderDocumentList = lazy(() => import("../views/Tender/TenderDocumentList.js"));
// const PurchaseorderDocumentList = lazy(() => import("../views/Purchase/PurchaseListing/PurchaseorderDocumentList.js"));


// Chemical Stocks
const ChemicalStocksList = lazy(() => import("../views/ChemicalStocks/ChemicalList.js"));
const ChemicalStocksForm = lazy(() => import("../views/ChemicalStocks/ChemicalForm.js"));

// Feedback 
const IncentivesList = lazy(() => import("../views/Feedback/Incentive.js"));
const IncentivesForm = lazy(() => import("../views/Feedback/IncentivesForms.js"));

const FeedbackList = lazy(() => import("../views/Feedback/Feedback.js"));
const FeedbackForm = lazy(() => import("../views/Feedback/FeedbackForm.js"));

// ----------------------------------------------------------------

const InvoiceListing = lazy(() => import("../views/operations/invoice/InvoiceListing.js"));
const InvoiceList = lazy(() => import("../views/operations/invoice/InvoiceList.js"));
const CreateInvoice = lazy(() => import("../views/operations/invoice/CreateInvoice.js"));
const UpdateInvoice = lazy(() => import("../views/operations/invoice/UpdateInvoice.js"));
const AdvanceInvoice = lazy(() => import("../views/operations/invoice/AdvanceInvoice.js"));
const InvoicePreview = lazy(() => import("../views/operations/invoice/InvoicePreview.js"));
const TallyListing = lazy(() => import("../views/operations/invoice/TallyListing.js"));
const TallyForm = lazy(() => import("../views/lms/TallyForm.js"));

const DashboardListing = lazy(() => import("../views/operations/dashboard/DashboardListing.js"));
const LMSDashboard = lazy(() => import("../views/operations/dashboard/LMSDashboard.js"));
const StatisticsData = lazy(() => import("../views/Statistics/StatisticsData.js"));
const JRFDocumentList = lazy(() => import("../views/lms/JRF/JRFDocumentList.js"));

const documentPreview = lazy(() => import("../views/operations/documentPreview.js"));

/**User List */

const UserList = lazy(() => import("../views/MasterData/Users/UserList.js"))
const UserForm = lazy(() => import("../views/MasterData/Users/UserForm.js"));
/**User List end */

/**Collections List */

const PaymentDetailList = lazy(() => import("../views/Collections/PaymentDetails/PaymentDetailList.js"))
const ClientForm = lazy(() => import("../views/Collections/ClientDetails/ClientForm.js"))
const ClientList = lazy(() => import("../views/Collections/ClientDetails/ClientList.js"))
/**User List end */
/*****Routes******/
/*
if you want authenticate route then use private route
else u show use the public route

*/

const ThemeRoutes = [
  {
    path: "/",
    element: <PublicRoute component={Login} />,
  },
  {
    path: "/login",
    element: <PublicRoute component={Login} />,
  },
  {
    path: "/loginOTP",
    element: <PublicRoute component={LoginOTP} />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/documentViewer",
    element: <PublicRoute component={DocumentViewer} />,
  },
  {
    path: "/documentFolderViewer",
    element: <PublicRoute component={DocumentFolderViewer} />,
  },
  {
    path: "/external-jrf-approval/:JRFToken",
    element: <ExternalJRFApprovalPage />,
  },
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      {
        path: "/jrfListing",
        exact: true,
        element: <ProtectedRoute component={JrfListing} />,
      },

      {
        path: "/jrfListing/jrf",
        exact: true,
        element: <ProtectedRoute component={Jrf} />,
      },
      {
        path: "/jrfListing/external-jrf",
        exact: true,
        element: <ProtectedRoute component={ExternalJrf} />,
      },
      {
        path: "/jrfListing/operation-jrf",
        exact: true,
        element: <ProtectedRoute component={Jrf} isOperationJRF={true} />,
      },
      {
        path: "/jrfListing/inwardForm-checklist",
        exact: true,
        element: <InwardCheckListForm />,
      },
      {
        path: "/jrfListing/operation-inwardForm-checklist",
        exact: true,
        element: <InwardCheckListForm isOperationJRF={true} />
      },

      { path: "/inwardList", exact: true, element: <InwardList /> },
      { path: "/inwardList/inwardForm", exact: true, element: <InwardForm /> },
      {
        path: "/inwardList/groupAssignment",
        exact: true,
        element: <SampleAssignment />,
      },
      {
        path: "/inwardList/groupAssignmentPreview",
        exact: true,
        element: <GroupAssignmentPreview />,
      },
      { path: "/allotmentList", exact: true, element: <AllotmentList /> },
      { path: "/allotmentList/allotment", exact: true, element: <Allotment /> },
      { path: "/verificationList", exact: true, element: <VerificationList /> },
      {
        path: "/verificationList/sampleVerification",
        exact: true,
        element: <SampleVerification />,
      },
      { path: "/module-history", exact: true, element: <ModuleHistory /> },
      { path: "/module-document", exact: true, element: <ModuleDocument /> },


      { path: "/testmemoList/testMemo", exact: true, element: <TestMemo /> },

      { path: "/testmemoList", exact: true, element: <TestMemoList /> },
      { path: "/testmemoPDF", exact: true, element: <TestMemoPDF /> },
      { path: "/SFMPDF", exact: true, element: <SFMPDF /> },

      { path: "/SFMList/result", exact: true, element: <Sfm /> },
      { path: "/testmemoList/testmemoPDF", exact: true, element: <TestMemoPDF /> },
      { path: "/SFMList/SFMPDF", exact: true, element: <SFMPDF /> },
      { path: "/SfmList", exact: true, element: <SfmList /> },
      { path: "/testReport", exact: true, element: <TestReportList /> },
      { path: "/testReport/preview/:icID", exact: true, element: <TestReportPreview /> },
      { path: "/testReport/previewPDF/:icID", exact: true, element: <TestReportPreviewPDF /> },
      {
        path: "/testmemoList/test-results",
        exact: true,
        element: <InternalCertificate />,
      },
      {
        path: "/testReport/test-results",
        exact: true,
        element: <InternalCertificate />,
      },
      { path: "/jrfListing/jrf-pdf-preview/:JRFId", exact: true, element: <JRFPdfDownLoad /> },
      //Operation modules
      {
        path: "/operation/jrfInstructionListing",
        exact: true,
        element: <ProtectedRoute component={JrfInstructionListing} />,
      },
      {
        path: "/operation/jrfInstructionListing/job-instruction",
        exact: true,
        element: <ProtectedRoute component={JrfInstruction} />,
      },
      {
        path: "/operation/jrfInstructionListing/job-instruction/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={JrfInstruction} />,
      },
      {
        path: "/operation/jrfInstructionListing/job-instruction-analysis/:EditRecordId/:editReordType",
        exact: true,
        element: <ProtectedRoute component={JfInstructionAnalys} />,
      },
      {
        path: "/operation/jrfInstructionListing/job-instruction-nomination/:EditRecordId/:editReordType",
        exact: true,
        element: <ProtectedRoute component={JfInstructionNomination} />,
      },
      {
        path: "/operation/jrfInstructionListing/job-instruction/man-power/:EditRecordId/:activityID",
        exact: true,
        element: <ProtectedRoute component={JIManPower} />,
      },
      {
        path: "/operation/vessel-ji-list",
        exact: true,
        // element: <ProtectedRoute component={vesselJIList} />,
        element: <ProtectedRoute component={OperationJIList} ops_code={"VL"} />,
      },

      {
        path: "/operation/vessel-ji-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetais} />,
      },
      {
        path: "/operation/vessel-ji-list-view/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetaisView} />,
      },
      {
        path: "/operation/rake-list-view/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetaisView} />,
      },
      {
        path: "/operation/stack-list-view/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetaisView} />,
      },
      {
        path: "/operation/truck-list-view/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetaisView} />,
      },
      {
        path: "/operation/plant-list-view/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetaisView} />,
      },
      {
        path: "/operation/vessel-ji-edit",
        exact: true,
        element: <ProtectedRoute component={vesselJIEdit} />,
      },
      {
        path: "/operation/vessel-ji-list/vessel-list/:EditRecordId",
        exact: true,
        // element: <ProtectedRoute component={vesselList} />,
        element: <ProtectedRoute component={OperationActivityList} ops_code="VL" />,
      },
      {
        path: "/operation/vessel-ji-list/vessel-list/:EditRecordId/:TMLType",
        exact: true,
        // element: <ProtectedRoute component={TMLOperations} />,
        element: <ProtectedRoute component={OperationDetails} ops_code={'VL'} />,
      },
      {
        path: "/operation/vessel-ji-list/vessel-list/:EditRecordId/:TMLType/:TMLID",
        exact: true,
        // element: <ProtectedRoute component={TMLAnalysisOperations} />,
        element: <ProtectedRoute component={OperationAnalysisDetails} ops_code="VL" />,
      },
      {
        path: "/operation/vessel-ji-list/vessel-list/confirugation-certificate-list/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificateList} />,
      },
      {
        path: "/operation/commercial-certificate-list",
        exact: true,
        element: <ProtectedRoute component={CommercialCertificateList} />,
      },
      {
        path: "/operation/JI-commercial-certificate-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={JICommercialCertificateList} />,
      },
      {
        path: "/operation/ShareFiles",
        exact: true,
        element: <ProtectedRoute component={ShareFiles} />,
      },
      {
        path: "/operation/vessel-ji-list/vessel-list/commercial-certificate-preview/:EditRecordId/:EditSubRecordId",
        exact: true,
        element: <ProtectedRoute component={CommercialCertificatePreview} />,
      },
      {
        path: "/operation/commercial-certificate-list/commercial-certificate-preview/:EditRecordId/:EditSubRecordId",
        exact: true,
        element: <ProtectedRoute component={CommercialCertificatePreview} />,
      },
      {
        path: "/operation/vessel-ji-list/vessel-list/confirugation-certificate/:EditRecordId/:JISID/:RPCID",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificate} ops_code={'VL'} />,
      },
      {
        path: "/operation/operation-certificate/:EditRecordId/:EditSubRecordId",
        exact: true,
        element: <ProtectedRoute component={OperationCertificate} />,
      },
      {
        path: "/operation/other-tpi",
        exact: true,
        element: <ProtectedRoute component={OtherTPIList} />,
      },
      {
        path: "/operation/vessel-ji-list/other-tpi/:EditRecordId/:TMLType/:TMLID/:TPIID",
        exact: true,
        element: <ProtectedRoute component={OtherTPIOperation} />,
      },
      {
        path: "/operation/truck-list",
        exact: true,
        // element: <ProtectedRoute component={TruckJiList} />,
        element: <ProtectedRoute component={OperationJIList} ops_code={"TR"} />,
      },
      {
        path: "/operation/truck-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={TruckJIDetails} />,
      },
      {
        path: "/operation/truck-list/truck-details-list/:EditRecordId",
        exact: true,
        // element: <ProtectedRoute component={TruckList} />,
        element: <ProtectedRoute component={OperationActivityList} ops_code="TR" />,
      },
      {
        path: "/operation/truck-list/truck-details-list/:EditRecordId/:TMLType/:TMLID",
        exact: true,
        // element: <ProtectedRoute component={TruckAnalysisOperations} />,
        element: <ProtectedRoute component={OperationAnalysisDetails} ops_code="TR" />,
      },
      {
        path: "/operation/truck-list/truck-details-list/:EditRecordId/:TMLType",
        exact: true,
        // element: <ProtectedRoute component={TruckOperations} />,
        element: <ProtectedRoute component={OperationDetails} ops_code={'TR'} />,
      },
      {
        path: "/operation/truck-list/truck-details-list/confirugation-certificate-list/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificateList} />,
      },
      {
        path: "/operation/truck-list/truck-details-list/confirugation-certificate/:EditRecordId/:JISID/:RPCID",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificate} ops_code={'TR'} />,
      },
      {
        path: "/operation/rake-list",
        exact: true,
        // element: <ProtectedRoute component={RakeJIList} />,
        element: <ProtectedRoute component={OperationJIList} ops_code={"RK"} />,
      },
      {
        path: "/operation/rake-list/rake-details-list/:EditRecordId",
        exact: true,
        // element: <ProtectedRoute component={RakeList} />,
        element: <ProtectedRoute component={OperationActivityList} ops_code="RK" />,
      },
      {
        path: "/operation/rake-list/rake-details-list/confirugation-certificate-list/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificateList} />,
      },
      {
        path: "/operation/rake-list/rake-details-list/confirugation-certificate/:EditRecordId/:JISID/:RPCID",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificate} ops_code={'RK'} />,
      },
      {
        path: "/operation/stack-list",
        exact: true,
        // element: <ProtectedRoute component={StackJIList} />,
        element: <ProtectedRoute component={OperationJIList} ops_code={"ST"} />,
      },
      {
        path: "/operation/stack-list/stack-details-list/confirugation-certificate-list/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificateList} />,
      },

      {
        path: "/operation/rake-list/rake-details-list/:EditRecordId/:TMLType",
        exact: true,
        // element: <ProtectedRoute component={RakeOperations} />,
        element: <ProtectedRoute component={OperationDetails} ops_code={'RK'} />,
      },
      {
        path: "/operation/rake-list/rake-details-list/:EditRecordId/:TMLType/:TMLID",
        exact: true,
        // element: <ProtectedRoute component={RakeAnalysisOperations} />,
        element: <ProtectedRoute component={OperationAnalysisDetails} ops_code="RK" />,
      },
      {
        path: "/operation/stack-list/stack-details-list/:EditRecordId",
        exact: true,
        // element: <ProtectedRoute component={StackList} />,
        element: <ProtectedRoute component={OperationActivityList} ops_code="ST" />,
      },
      {
        path: "/operation/stack-list/stack-details-list/:EditRecordId/:TMLType",
        exact: true,
        // element: <ProtectedRoute component={StackOperations} />,
        element: <ProtectedRoute component={OperationDetails} ops_code={'ST'} />,
      },
      {
        path: "/operation/stack-list/stack-details-list/:EditRecordId/:TMLType/:TMLID",
        exact: true,
        // element: <ProtectedRoute component={StackAnalysisOperations} />,
        element: <ProtectedRoute component={OperationAnalysisDetails} ops_code="ST" />,
      },
      {
        path: "/operation/stack-list/stack-details-list/confirugation-certificate-list/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificateList} />,
      },
      {
        path: "/operation/stack-list/stack-details-list/confirugation-certificate/:EditRecordId/:JISID/:RPCID",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificate} ops_code={'ST'} />,
      },
      //Plant Routes
      {
        path: "/operation/plant-list",
        exact: true,
        // element: <ProtectedRoute component={PlantJIList} />,
        element: <ProtectedRoute component={OperationJIList} ops_code={"PL"} />,
      },
      {
        path: "/operation/plant-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={PlantJIDetails} />,
      },
      {
        path: "/operation/plant-list/plant-details-list/:EditRecordId",
        exact: true,
        // element: <ProtectedRoute component={PlantList} />,
        element: <ProtectedRoute component={OperationActivityList} ops_code="PL" />,
      },
      {
        path: "/operation/plant-list/plant-details-list/:EditRecordId/:TMLType/:TMLID",
        exact: true,
        // element: <ProtectedRoute component={PlantAnalysisOperations} />,
        element: <ProtectedRoute component={OperationAnalysisDetails} ops_code="PL" />,
      },
      {
        path: "/operation/plant-list/plant-details-list/:EditRecordId/:TMLType",
        exact: true,
        // element: <ProtectedRoute component={PlantOperations} />,
        element: <ProtectedRoute component={OperationDetails} ops_code={"PL"} />,
      },
      {
        path: "/operation/plant-list/plant-details-list/confirugation-certificate-list/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificateList} />,
      },
      {
        path: "/operation/plant-list/plant-details-list/confirugation-certificate/:EditRecordId/:JISID/:RPCID",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificate} ops_code={'PL'} />,
      },
      //Other OPS
      {
        path: "/operation/other-list",
        exact: true,
        // element: <ProtectedRoute component={PlantJIList} />,
        element: <ProtectedRoute component={OperationJIList} ops_code={"OT"} />,
      },
      {
        path: "/operation/other-list-view/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetaisView} />,
      },
      {
        path: "/operation/other-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={OtherJIDetails} />,
      },
      {
        path: "/operation/other-list/other-details-list/:EditRecordId",
        exact: true,
        // element: <ProtectedRoute component={PlantList} />,
        element: <ProtectedRoute component={OperationActivityList} ops_code="OT" />,
      },
      {
        path: "/operation/other-list/other-details-list/:EditRecordId/:TMLType/:TMLID",
        exact: true,
        // element: <ProtectedRoute component={PlantAnalysisOperations} />,
        element: <ProtectedRoute component={OperationAnalysisDetails} ops_code="OT" />,
      },
      {
        path: "/operation/other-list/other-details-list/:EditRecordId/:TMLType",
        exact: true,
        // element: <ProtectedRoute component={PlantOperations} />,
        element: <ProtectedRoute component={OperationDetails} ops_code={"OT"} />,
      },
      {
        path: "/operation/other-list/other-details-list/confirugation-certificate-list/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificateList} />,
      },
      {
        path: "/operation/other-list/other-details-list/confirugation-certificate/:EditRecordId/:JISID/:RPCID",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificate} ops_code={'OT'} />,
      },
      //Admin job instruction
      {
        path: "/operation/jrfInstructionListing-view/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetaisView} />,
      },
      {
        path: "/operation/jrfInstructionListing/ji-details-list-view/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetaisView} />,
      },
      {
        path: "/operation/jrfInstructionListing/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={OtherJIDetails} />,
      },
      {
        path: "/operation/jrfInstructionListing/ji-details-list/:EditRecordId",
        exact: true,
        // element: <ProtectedRoute component={PlantList} />,
        element: <ProtectedRoute component={OperationActivityList} ops_code="OT" />,
      },
      {
        path: "/operation/jrfInstructionListing/ji-details-list/:EditRecordId/:TMLType/:TMLID",
        exact: true,
        // element: <ProtectedRoute component={PlantAnalysisOperations} />,
        element: <ProtectedRoute component={OperationAnalysisDetails} ops_code="OT" />,
      },
      {
        path: "/operation/jrfInstructionListing/ji-details-list/:EditRecordId/:TMLType",
        exact: true,
        // element: <ProtectedRoute component={PlantOperations} />,
        element: <ProtectedRoute component={OperationDetails} ops_code={"OT"} />,
      },
      {
        path: "/operation/jrfInstructionListing/ji-details-list/confirugation-certificate-list/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificateList} />,
      },
      {
        path: "/operation/jrfInstructionListing/ji-details-list/confirugation-certificate/:EditRecordId/:JISID/:RPCID",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificate} ops_code={'OT'} />,
      },
      //
      {
        path: "/operation/consortiums-list",
        exact: true,
        element: <ProtectedRoute component={ConsortiumList} />,
      },
      {
        path: "/operation/consortiums-list/consortium",
        exact: true,
        element: <ProtectedRoute component={ConsortiumAdd} />,
      },
      {
        path: "/operation/consortiums-list/consortium/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={ConsortiumAdd} />,
      },

      // Srushti


      // Purchase 
      {
        path: "/PurchRequistion",
        exact: true,
        element: <ProtectedRoute component={PurchaseRequistionList} />,
      },
      {
        path: "/PurchRequistion/PurchaseRequistionForm",
        exact: true,
        element: <ProtectedRoute component={PurchaseRequistionForm} />
      },
      {
        path: "/PurchRequistion/PurchaseRequistionForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={PurchaseRequistionForm} />
      },
      {
        path: "/PurchRequistion/purchreqDocumentlist/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={PurchasereqDocumentList} />
      },
       {
        path: "/PurchRequistion/purchreqDocumentlist/document/ShareFiles",
        exact: true,
        element: <ProtectedRoute component={ShareFiles} />,
      },
      {
        path: "/purchase",
        exact: true,
        element: <ProtectedRoute component={PurchasingList} />
      },
      {
        path: "/purchase/purchaseForm",
        exact: true,
        element: <ProtectedRoute component={PurchasingForm} />
      },
      {
        path: "/purchase/purchaseForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={PurchasingForm} />
      },

      {
        path: "/purchase/purchaseForm/:EditRecordId/purchaseOrderPreview/:poId",
        exact: true,
        element: <ProtectedRoute component={PurchasingOrderPreview} />
      },

      {
        path: "/supplierList",
        exact: true,
        element: <ProtectedRoute component={SupplierList} />
      },
      {
        path: "/supplierList/supplierForm",
        exact: true,
        element: <ProtectedRoute component={SupplierForm} />
      },
      {
        path: "/supplierList/supplierForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={SupplierForm} />
      },
      {
        path: "/calibrationList",
        exact: true,
        element: <ProtectedRoute component={CalibrationList} />
      },
      {
        path: "/calibrationList/calibrationForm",
        exact: true,
        element: <ProtectedRoute component={CalibrationForm} />
      },
      {
        path: "/calibrationList/calibrationForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={CalibrationForm} />
      },
      {
        path: "/tenderList",
        exact: true,
        element: <ProtectedRoute component={TenderList} />,
      },
      {
        path: "/tenderList/tenderForm",
        exact: true,
        element: <ProtectedRoute component={TenderForm} />,
      },
      {
        path: "/tenderList/tenderForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={TenderForm} />,
      },      
      {
        path: "/itemlist",
        exact: true,
        element: <ProtectedRoute component={ItemList} />
      },
      {
        path: "/itemlist/item",
        exact: true,
        element: <ProtectedRoute component={ItemsForm} />
      },
      {
        path: "/itemlist/item/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={ItemsForm} />
      },
      {
        path: "/itemlist/item-document-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={ItemDocument} />,
      },
      {
        path: "/itemlist/item-document-list/document/ShareFiles",
        exact: true,
        element: <ProtectedRoute component={ShareFiles} />,
      },
      // Category
      {
        path: "/categoriesList",
        exact: true,
        element: <ProtectedRoute component={CategoriesList} />
      },
      {
        path: "/categorylist/categoryForm",
        exact: true,
        element: <ProtectedRoute component={CategoriesForm} />
      },
      {
        path: "/categorylist/categoryForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={CategoriesForm} />
      },

      // Chemical Stocks

      {
        path: "/chemicalStocks",
        exact: true,
        element: <ProtectedRoute component={ChemicalStocksList} />,
      },
      {
        path: "/chemicalStocks/chemicalStocksForm",
        exact: true,
        element: <ProtectedRoute component={ChemicalStocksForm} />,
      },
      {
        path: "/chemicalStocks/chemicalStocksForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={ChemicalStocksForm} />,
      },

      // Feedback 

      {
        path: "/feedbackList",
        exact: true,
        element: <ProtectedRoute component={FeedbackList} />,
      },
      // {
      //   path: "/feedbackListList/feedbackListForm",
      //   exact: true,
      //   element: <ProtectedRoute component={FeedbackForm} />,
      // },
      {
        path: "/feedbackListList/feedbackListForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={FeedbackForm} />,
      },

      {
        path: "/incentivesList",
        exact: true,
        element: <ProtectedRoute component={IncentivesList} />,
      },
      {
        path: "/incentivesList/incentivesForm",
        exact: true,
        element: <ProtectedRoute component={IncentivesForm} />,
      },
      {
        path: "/incentivesList/incentivesForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={IncentivesForm} />,
      },
      // ----------------------------------------------------------------
      //Invoice
      {
        path: "/operation/invoice-listing",
        exact: true,
        element: <ProtectedRoute component={InvoiceListing} />,

      },
      {
        path: "/operation/invoice-list",
        exact: true,
        element: <ProtectedRoute component={InvoiceList} />,
      },
      {
        path: "/operation/invoice-listing/create-invoice",
        exact: true,
        element: <ProtectedRoute component={CreateInvoice} />,
      },
      {
        path: "/operation/invoice-listing/create-invoice/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={UpdateInvoice} />,
      },
      {
        path: "/operation/invoice-listing/create-debit/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={UpdateInvoice} />,
      },
      {
        path: "/operation/invoice-listing/advance-invoice",
        exact: true,
        element: <ProtectedRoute component={AdvanceInvoice} />,
      },
      {
        path: "/operation/invoice-listing/invoice-preview/:EditRecordId/:s3URL/:invoiceNumber",
        exact: true,
        element: <ProtectedRoute component={InvoicePreview} />,
      },
            {
        path: "/operation/tally-list",
        exact: true,
        element: <ProtectedRoute component={TallyListing} />,
      },
      { path: "/operation/tallyForm/:EditRecordId", exact: true, element: <TallyForm /> },
      { path: "/support", exact: true, element: <Support /> },
      { path: "/release-notes", exact: true, element: <ReleaseNotes /> },
      { path: "/statistics", exact: true, element: <StatisticsData /> },
      {
        path: "*",
        element: <PageNotFound />,
      },
      //Dashboard
      {
        path: "/dashboard-listing",
        exact: true,
        element: <ProtectedRoute component={DashboardListing} />,
      },
      {
        path: "/lms-dashboard-listing",
        exact: true,
        element: <ProtectedRoute component={LMSDashboard}/>,
      },

      //
      {
        path: "/tenderList/tender-document-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={TenderDocumentList} />,
      },
      {
        path: "/tenderList/tender-document-list/document/ShareFiles",
        exact: true,
        element: <ProtectedRoute component={ShareFiles} />,
      },
      {
        path: "/purchaseorderList/purchaseorder-document-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={PurchaseorderDocumentList} />,
      },
      {
        path: "/purchaseorderList/purchaseorder-document-list/document/ShareFiles",
        exact: true,
        element: <ProtectedRoute component={ShareFiles} />,
      },
      {
        path: "/jrfListing/jrf-document-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={JRFDocumentList} />,
      },
      {
        path: "/jrfListing/jrf-document-list/document/ShareFiles",
        exact: true,
        element: <ProtectedRoute component={ShareFiles} />,
      },
      {
        path: "/document-listing/document-preview/:EditRecordId/:s3URL/:invoiceNumber",
        exact: true,
        element: <ProtectedRoute component={documentPreview} />,
      },
      /**User Routes */
      {
        path: "/users/list",
        exact: true,
        element: <ProtectedRoute component={UserList} />
      },
      {
        path: "/users/user-form",
        exact: true,
        element: <ProtectedRoute component={UserForm} />
      },
      {
        path: "/users/user-form/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={UserForm} />
      },
      /**End */

      /**Collection Routes */
      {
        path: "/collection-dashboard",
        exact: true,
        element: <ProtectedRoute component={InvoiceListing} />,

      },
      {
        path: "/collections/payment-list",
        exact: true,
        element: <ProtectedRoute component={PaymentDetailList} />
      },
      {
        path: "/collections/client-list",
        exact: true,
        element: <ProtectedRoute component={ClientList} />
      },
      {
        path: "/collections/client-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={ClientForm} />
      }
      /**End */
    ],
  },
  {
    path: "/feedbackListList/feedbackListForm",
    element: <FeedbackForm />,
  },
  {
    path: "/feedback-form",
    element: <FeedbackFormGlobal />,
  },
  {
    path: "/500",
    element: <PageNotFound />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
];

export default ThemeRoutes;
