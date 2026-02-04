import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import PublicRoute from "./PublicRoute.js";
import ShipmentList from "../views/Shipment/ShipmentList.js";
import ShipmentForm from "../views/Shipment/ShipmentForm.js";
import MarketList from "../views/MarketPlace/MarketList.jsx";
import MarketForm from "../views/MarketPlace/MarketForm.jsx"


/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const Login = lazy(() => import("../layouts/login.js"));
const LoginOTP = lazy(() => import("../layouts/loginOTP.js"));
const ForgotPassword = lazy(() => import("../layouts/forgotPassword.js"));

/***** Pages ****/

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



const ModuleDocument = lazy(() =>
  import("../views/Document/Document.js")
);
const PageNotFound = lazy(() => import("../views/PageNotFound.js"));
const FeedbackFormGlobal = lazy(() => import("../views/FeedbackFormGlobal.js"));
const ExternalJRFApprovalPage = lazy(() => import("../layouts/externalApprovalPage.js"));
const JrfInstructionListing = lazy(() => import("../views/operations/JrfInstructionListing.js"));
const JrfInstruction = lazy(() => import("../views/operations/jrfInstruction.js"));
const JfInstructionAnalys = lazy(() => import("../views/operations/JfInstructionAnalys.js"));
const JfInstructionNomination = lazy(() => import("../views/operations/JfInstructionNomination.js"));
// const vesselJIList = lazy(() => import("../views/operations/vessel/vesselJIList.js"));
const OperationJIList = lazy(() => import("../views/operations/CommonOPS/OperationJIList.js"));
const OperationActivityList = lazy(() => import("../views/operations/CommonOPS/OperationActivityList.js"));
const RakeJIList = lazy(() => import("../views/operations/rake/RakeJIList.js"));
const RakeList = lazy(() => import("../views/operations/rake/RakeList.js"));
const RakeOperations = lazy(() =>
  import("../views/operations/rake/RakeOperations/RakeOperations.js")
);
const StackOperations = lazy(() =>
  import("../views/operations/stack/StackOperations/StackOperations.js")
);
const RakeAnalysisOperations = lazy(() => import("../views/operations/rake/RakeOperations/RakeAnalysisOperations.js"));
const StackAnalysisOperations = lazy(() => import("../views/operations/stack/StackOperations/StackAnalysisOperations.js"));
const StackJIList = lazy(() => import("../views/operations/stack/StackJIList.js"));
const StackList = lazy(() => import("../views/operations/stack/StackList.js"));
const vesselJIEdit = lazy(() => import("../views/operations/vessel/vesselJIEdit.js"));
const vesselList = lazy(() => import("../views/operations/vessel/vesselList.js"));

const VesselJIDetais = lazy(() => import("../views/operations/vessel/vesselJIDetais.js"));
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

const DashboardListing = lazy(() => import("../views/operations/dashboard/DashboardListing.js"));
const StatisticsData = lazy(() => import("../views/Statistics/StatisticsData.js"));

const documentPreview = lazy(() => import("../views/operations/documentPreview.js"));

/**User List */

const UserList = lazy(() => import("../views/MasterData/Users/UserList.js"))
const UserForm = lazy(() => import("../views/MasterData/Users/UserForm.js"));
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
        path: "/operation/jrfInstructionListing/ds-analysis/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={OperationDetails} ops_code={"OT"} />,
        
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
        path: "/operation/draught-list",
        exact: true,
        // element: <ProtectedRoute component={PlantJIList} />,
        element: <ProtectedRoute component={OperationJIList} ops_code={"OT"} />,
      },
      {
        path: "/operation/draught-list-view/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={VesselJIDetaisView} />,
      },
      {
        path: "/operation/draught-list/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={OtherJIDetails} />,
      },
      {
        path: "/operation/draught-list/other-details-list/:EditRecordId",
        exact: true,
        // element: <ProtectedRoute component={PlantList} />,
        element: <ProtectedRoute component={OperationActivityList} ops_code="OT" />,
      },
      {
        path: "/operation/draught-list/other-details-list/:EditRecordId/:TMLType/:TMLID",
        exact: true,
        // element: <ProtectedRoute component={PlantAnalysisOperations} />,
        element: <ProtectedRoute component={OperationAnalysisDetails} ops_code="OT" />,
      },
      {
        path: "/operation/draught-list/other-details-list/:EditRecordId/:TMLType",
        exact: true,
        // element: <ProtectedRoute component={PlantOperations} />,
        element: <ProtectedRoute component={OperationDetails} ops_code={"OT"} />,
      },
      {
        path: "/operation/draught-list/other-details-list/confirugation-certificate-list/:EditRecordId/:TMLType",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificateList} />,
      },
      {
        path: "/operation/draught-list/other-details-list/confirugation-certificate/:EditRecordId/:JISID/:RPCID",
        exact: true,
        element: <ProtectedRoute component={ConfirugationCertificate} ops_code={'OT'} />,
      },
      //AdminDraught Survey
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
      

      // Shipment 

      {
        path: "/shipment",
        exact: true,
        element: <ProtectedRoute component={ShipmentList} />,
      },

      {
        path: "/shipment/shipmentForm",
        exact: true,
        element: <ProtectedRoute component={ShipmentForm} />,
      },

      {
        path: "/shipment/shipmentForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={ShipmentForm} />,
      },


      {
        path: "/market",
        exact: true,
        element: <ProtectedRoute component={MarketList} />,
      },

      {
        path: "/market/marketForm",
        exact: true,
        element: <ProtectedRoute component={MarketForm} />,
      },

      {
        path: "/market/marketForm/:EditRecordId",
        exact: true,
        element: <ProtectedRoute component={MarketForm} />,
      },


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
      { path: "/support", exact: true, element: <Support /> },
      { path: "/release-notes", exact: true, element: <ReleaseNotes /> },
      { path: "/statistics", exact: true, element: <StatisticsData /> },
      {
        path: "*",
        element: <PageNotFound />,
      },
      //Dashboard
      {
        path: "/operation/draught-list",
        exact: true,
        element: <ProtectedRoute component={DashboardListing} />,
      },

      //
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
