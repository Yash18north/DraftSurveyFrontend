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
const OtherJIDetails = lazy(() => import("../views/operations/other/OtherJIDetails.js"));

// Srushti 



// Feedback 
const IncentivesList = lazy(() => import("../views/Feedback/Incentive.js"));
const IncentivesForm = lazy(() => import("../views/Feedback/IncentivesForms.js"));

const FeedbackList = lazy(() => import("../views/Feedback/Feedback.js"));
const FeedbackForm = lazy(() => import("../views/Feedback/FeedbackForm.js"));

// ----------------------------------------------------------------


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
